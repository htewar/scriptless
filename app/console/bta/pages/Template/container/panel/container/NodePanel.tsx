import { ChangeEvent, FC, useEffect, useState } from "react";
import { v4 as uuid } from 'uuid';

import { Button, Popup, Text } from "../../../../../components";
import { BODYTYPE, ButtonVariant, CustomNodeData, DropdownFnParams, HTTPMethod, KeyValueProps, KVCallback, Mappers, Message, MetadataState, NodeStatus, PostResponseAssertionProps, PreRequestAssertionProps, RootState, TextVariant } from "../../../../../types";
import NodeMetadata from "./NodeMetadata";
import Assertion from "./Assertion";
import Mapper from "./Mapper";
import { SELECTIONS } from "../../../data";
import { isStartNode } from "../../../../../services";
import { Edge, MarkerType, Node } from "reactflow";
import { AnyAction } from "redux";
import { connect } from "react-redux";
import { AddEdge, AddMappers, AddPredecessorEdge, OnSaveNodeMetadata, removeCurrentNode, RemoveEdges, RemoveNode, RemovePredecessorEdge, StartNodeExecution } from "../../../../../redux/actions/nodes.action";
import { setDraftLoader } from "../../../../../redux/actions/utils.action";
import { ThunkDispatch } from "redux-thunk";

interface NodePanelProps {
    isCurrentSelection: (selection: string) => boolean;
    currentNodeID: string | null;
    dispatch: ThunkDispatch<RootState, unknown, AnyAction>;
    connections: Edge[];
    nodes: Node<CustomNodeData>[],
    preEdge: { source: string, target: string } | null,
    messages: Message[]
}

const NodePanel: FC<NodePanelProps> = ({ dispatch, isCurrentSelection, currentNodeID, connections, nodes, preEdge }) => {
    const [selectedNode, setSelectedNode] = useState<Node<CustomNodeData> | null>(null);
    const [isGlobaMapper, setIsGlobalMapper] = useState<Boolean>(false);
    const [flattenedData, setFlattenedData] = useState<{ field: string, value: string | number | boolean | null | {} }[]>([]);
    const [assertionData, setAssertionData] = useState<Record<number, string>>({});
    const [assertionError, setAssertionError] = useState<Record<number, string>>({});

    useEffect(() => {
        setIsGlobalMapper(false);
        dispatch(RemovePredecessorEdge());
    }, [])

    useEffect(() => {
        if (currentNodeID) {
            const selectedNodePosition = nodes.findIndex(node => node.id == currentNodeID.toString());
            if (selectedNodePosition > -1) {
                const parsedNode = JSON.parse(JSON.stringify(nodes[selectedNodePosition])) as Node<CustomNodeData>
                parsedNode.data.metadata ??= {
                    method: HTTPMethod.GET,
                    bodyType: BODYTYPE.NONE,
                    body: "",
                    url: "",
                    params: [],
                    headers: [],
                };
                parsedNode.data.metadata.bodyType ??= BODYTYPE.NONE;
                setSelectedNode(parsedNode)
            }
        }
    }, [currentNodeID])

    const onDeleteNode = () => {
        if (currentNodeID) {
            dispatch(RemoveNode(+currentNodeID))
            dispatch(removeCurrentNode())
            dispatch(RemoveEdges(+currentNodeID))
            dispatch(setDraftLoader({ loader: false }))
        }
    }

    const onToggleGlobalMapper = (toState?: boolean) => {
        if (typeof toState == 'boolean') {
            if (!toState) setFlattenedData([]);
            setIsGlobalMapper(toState);
        }
        else setIsGlobalMapper(prevState => {
            if (!prevState) setFlattenedData([])
            return !prevState;
        });
    }

    const onHandlePredecessorEdge = (node: DropdownFnParams<Node<CustomNodeData>>) => {
        const source = node.target.value.id;
        if (selectedNode?.id) dispatch(AddPredecessorEdge(source, selectedNode?.id))
    }

    const flattenObject = (obj: any, prefix = ""): Record<string, any> => {
        let result: Record<string, any> = {};
        Object.entries(obj).forEach(([key, value]) => {
            const newKey = prefix ? `${prefix}_${key}` : key;
            if (typeof value === "object" && value !== null) {
                if (Array.isArray(value)) {
                    // Handle arrays
                    value.forEach((item, index) => {
                        result[`${newKey}${index + 1}`] = item;
                    });
                } else if (Object.keys(value).length === 0) {
                    // Handle empty objects
                    result[newKey] = value;
                } else {
                    // Recursively process non-empty objects
                    Object.assign(result, flattenObject(value, newKey));
                }
            } else if (typeof value !== "function") {
                // Directly assign non-function values
                result[newKey] = value;
            }
        });
        return result;
    }

    const addEdge = () => {
        const edge = {
            ...preEdge,
            sourceHandle: null,
            targetHandle: null,
            type: "customEdge",
            id: uuid(),
            markerEnd: {
                type: MarkerType.ArrowClosed,
                width: 15,
                height: 15,
                color: "#a0ceff",
            },
        }
        dispatch(AddEdge(edge as Edge))
    }

    const onSaveNode = async ({ isExecute = true } = {}) => {
        if (selectedNode && currentNodeID) {
            try {
                addEdge();
                const selectedNodeCopy: Node<CustomNodeData> = JSON.parse(JSON.stringify(selectedNode))
                selectedNodeCopy.data.status = NodeStatus.IDLE;
                dispatch(OnSaveNodeMetadata(+currentNodeID, selectedNodeCopy.data))
                if (isExecute) {
                    const resp = await dispatch(StartNodeExecution({ type: "NPROC", procId: currentNodeID }))
                    const fResult = flattenObject(resp);
                    const resultantData = Object.keys(fResult).map(v => ({ field: v, value: fResult[v] }));
                    setFlattenedData(resultantData);
                    dispatch(AddMappers(selectedNodeCopy.data.label, resultantData.map(d => ({ name: d.field, value: d.value }))))
                } else dispatch(removeCurrentNode())
            } catch (e) {
                console.log(e);
            } finally {
                dispatch(setDraftLoader({ loader: false }));
                setIsGlobalMapper(false);
            }
        }
    }

    const onAddNodeName = (e: ChangeEvent<HTMLInputElement>) => {
        setSelectedNode(prevState => {
            if (!prevState) return null;
            return {
                ...prevState,
                data: {
                    ...prevState.data,
                    label: e.target.value,
                }
            }
        })
    }

    const onAddMetadata = (key: string, e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSelectedNode(prevState => {
            if (!prevState) return null;
            const updatedMetadata = {
                ...prevState.data.metadata ?? {},
                [key]: value,
            };
            if (key === "bodyType" && value === BODYTYPE.XFORMURLENCODED) {
                updatedMetadata.body = []; 
            } else if (key === "bodyType") {
                updatedMetadata.body = ""; 
            }
            return {
                ...prevState,
                data: {
                    ...prevState.data,
                    metadata: updatedMetadata
                }
            } as Node<CustomNodeData>;
        });
    };

    const onAddQueryParam = (param: KeyValueProps, cb?: KVCallback) => {
        setSelectedNode(prevState => {
            if (!prevState) return null;
            return {
                ...prevState,
                data: {
                    ...prevState.data,
                    metadata: {
                        ...prevState.data.metadata ?? {},
                        params: [
                            ...(prevState.data.metadata?.params ?? []),
                            param
                        ]
                    }
                }
            } as Node<CustomNodeData>;
        })
        if (cb) cb(true);
    }

    const onAddHeaderParam = (param: KeyValueProps, cb?: KVCallback) => {
        setSelectedNode(prevState => {
            if (!prevState) return null;
            return {
                ...prevState,
                data: {
                    ...prevState.data,
                    metadata: {
                        ...prevState.data.metadata ?? {},
                        headers: [
                            ...(prevState.data.metadata?.headers ?? []),
                            param
                        ]
                    }
                }
            } as Node<CustomNodeData>;
        })
        if (cb) cb(true);
    }

    const onAddURLEncodedParam = (param: KeyValueProps, cb?: KVCallback) => {
        setSelectedNode(prevState => {
            if (!prevState) return null;
            return {
                ...prevState,
                data: {
                    ...prevState.data,
                    metadata: {
                        ...prevState.data.metadata ?? {},
                        body: [
                            ...(prevState.data.metadata?.body ?? []),
                            param
                        ]
                    }
                }
            } as Node<CustomNodeData>;
        })
        if (cb) cb(true);
    }

    const onDeleteURLEncodedParam = (index: number) => {
        setSelectedNode(prevState => {
            if (!prevState) return null;
            const metadata = prevState.data.metadata ?? {} as MetadataState;
            const body = metadata.body ?? [];
            return {
                ...prevState,
                data: {
                    ...prevState.data,
                    metadata: {
                        ...prevState.data.metadata ?? {},
                        body: [
                            ...body.slice(0, index),
                            ...body.slice(index + 1)
                        ]
                    }
                }
            } as Node<CustomNodeData>;
        })
    }

    const onDeleteQueryParam = (index: number) => {
        setSelectedNode(prevState => {
            if (!prevState) return null;
            const metadata = prevState.data.metadata ?? {} as MetadataState;
            const params = metadata.params ?? [];
            return {
                ...prevState,
                data: {
                    ...prevState.data,
                    metadata: {
                        ...prevState.data.metadata ?? {},
                        params: [
                            ...params.slice(0, index),
                            ...params.slice(index + 1)
                        ]
                    }
                }
            } as Node<CustomNodeData>;
        })
    }

    const onDeleteHeaderParam = (index: number) => {
        setSelectedNode(prevState => {
            if (!prevState) return null;
            const metadata = prevState.data.metadata ?? {} as MetadataState;
            const headers = metadata.headers;
            return {
                ...prevState,
                data: {
                    ...prevState.data,
                    metadata: {
                        ...prevState.data.metadata ?? {},
                        headers: [
                            ...headers.slice(0, index),
                            ...headers.slice(index + 1)
                        ]
                    }
                }
            } as Node<CustomNodeData>;
        })
    }

    // Handler to update node state atomically from parsed cURL data
    const handleUpdateNodeFromCurl = (data: { url: string; method: string; queryParams: KeyValueProps[]; headers: KeyValueProps[] }) => {
        setSelectedNode(prevState => {
            if (!prevState) return null;

            // Validate the incoming method
            const validMethods = Object.values(HTTPMethod); // Get valid methods from enum
            const validatedMethod = validMethods.includes(data.method as HTTPMethod) 
                ? data.method as HTTPMethod 
                : HTTPMethod.GET; // Default to GET if invalid

            const newMetadata: Partial<MetadataState> = {
                url: data.url,
                method: validatedMethod, // Use the validated method
                params: data.queryParams,
                headers: data.headers,
            };

            // Reset body based on method
            if (validatedMethod === HTTPMethod.GET) {
                newMetadata.bodyType = BODYTYPE.NONE;
                newMetadata.body = "";
            } else {
                // Default to NONE, could be enhanced later if cURL parsing includes body
                newMetadata.bodyType = BODYTYPE.NONE;
                newMetadata.body = "";
            }

            return {
                ...prevState,
                data: {
                    ...prevState.data, // Preserve label, status, assertion, etc.
                    metadata: {
                        ...prevState.data.metadata ?? {},
                        ...newMetadata // Overwrite relevant metadata fields
                    }
                }
            } as Node<CustomNodeData>;
        });

        // Optionally, trigger UI updates handled locally in NodeMetadata (like enabling sections)
        // This might require passing back info or letting NodeMetadata derive from selectedNode prop
    };

    // This function will insert a new mapper to the component state management
    const insertMapper = (mapper: PreRequestAssertionProps) => {
        const currentNode = JSON.parse(JSON.stringify(selectedNode)) as Node<CustomNodeData>
        if (!currentNode.data.assertion) {
            currentNode.data.assertion = {
                preRequestAssertion: [],
                postResponseAssertion: [],
            };
        }
        if (!currentNode.data.assertion.preRequestAssertion) {
            currentNode.data.assertion.preRequestAssertion = [];
        }
        currentNode.data.assertion.preRequestAssertion.push(mapper);
        setSelectedNode(currentNode)
    }

    // This function will insert a new assertion to the component state management.
    const insertAssertion = (assertion: PostResponseAssertionProps) => {
        const currentNode = JSON.parse(JSON.stringify(selectedNode)) as Node<CustomNodeData>
        if (!currentNode.data.assertion)
            currentNode.data.assertion = {
                preRequestAssertion: [],
                postResponseAssertion: [],
            };
        if (!currentNode.data.assertion.postResponseAssertion)
            currentNode.data.assertion.postResponseAssertion = [];
        currentNode.data.assertion.postResponseAssertion.push(assertion);
        setSelectedNode(currentNode)
    }

    const editMapper = (mapper: PreRequestAssertionProps, index: number) => {
        const currentNode = JSON.parse(JSON.stringify(selectedNode)) as Node<CustomNodeData>
        if (!!currentNode.data.assertion?.preRequestAssertion && currentNode.data.assertion.preRequestAssertion.length >= 1)
            currentNode.data.assertion.preRequestAssertion[index] = mapper
        setSelectedNode(currentNode)
    }

    const editAssertion = (assertion: PostResponseAssertionProps, index: number) => {
        const currentNode = JSON.parse(JSON.stringify(selectedNode)) as Node<CustomNodeData>
        if (!!currentNode.data.assertion?.postResponseAssertion && currentNode.data.assertion.postResponseAssertion.length >= 1)
            currentNode.data.assertion.postResponseAssertion[index] = assertion
        setSelectedNode(currentNode)
    }

    const deleteMapper = (deleteIndex: number) => {
        const currentNode = JSON.parse(JSON.stringify(selectedNode)) as Node<CustomNodeData>
        if (currentNode.data.assertion?.preRequestAssertion && currentNode.data.assertion.preRequestAssertion.length > 1)
            currentNode.data.assertion.preRequestAssertion = currentNode.data.assertion.preRequestAssertion.filter((_, index) => index != deleteIndex)
        setSelectedNode(currentNode)
    }

    const deleteAssertion = (deleteIndex: number) => {
        const currentNode = JSON.parse(JSON.stringify(selectedNode)) as Node<CustomNodeData>
        if (currentNode.data.assertion?.postResponseAssertion && currentNode.data.assertion.postResponseAssertion.length > 1)
            currentNode.data.assertion.postResponseAssertion = currentNode.data.assertion.postResponseAssertion.filter((_, index) => index != deleteIndex)
        setSelectedNode(currentNode)
    }

    const onHandleAssertion = (index: number) => {
        const currentAssertion = JSON.parse(JSON.stringify(assertionData));
        if (currentAssertion[index] == undefined)
            currentAssertion[index] = ""
        else delete currentAssertion[index]
        setAssertionData(currentAssertion);
    }

    const onHandleMapperText = (index: number, e: ChangeEvent<HTMLInputElement>) => {
        const currentAssertion = JSON.parse(JSON.stringify(assertionData));
        const currentError = JSON.parse(JSON.stringify(assertionError))
        if (currentAssertion[index] != undefined) {
            if (currentError[index] != undefined) delete currentError[index];
            currentAssertion[index] = e.target.value;
            setAssertionData(currentAssertion);
            setAssertionError(currentError);
        }
    }

    const onHandleGASubmit = () => {
        const aError: Record<number, string> = {};
        Object.keys(assertionData).forEach((assertionKey) => {
            if (assertionData[+assertionKey] === "") {
                aError[+assertionKey] = "Field cannot be empty"
            }
        })
        if (Object.keys(aError).length != 0)
            setAssertionError(aError);
        else {
            const addMapperParam: Mappers[] = []
            Object.keys(assertionData).forEach(assertionKey => {
                const obj: { name: string; value: string | number | boolean | null | Record<string, any> } = {
                    name: assertionData[+assertionKey],
                    value: flattenedData[+assertionKey]?.value || null, // Ensure safe access
                };
                addMapperParam.push(obj)
            })
            console.log(addMapperParam)
            // dispatch(AddMappers(addMapperParam))
            setIsGlobalMapper(false);
        }
    }

    return <div>
        {isGlobaMapper && <Popup onClosePopup={onToggleGlobalMapper.bind(this, false)} title="Add to assertions?" className="template__gvPopup">
            <div>
                <Text variant={TextVariant.InterRegular101}>Adding to glboal assertions will execute the node once. Any unique fields will also need to be changed while executing the tests.</Text>
                <div className="template__gvPopupContentAction">
                    <Button variant={ButtonVariant.Selected} content="Discard" onButtonClick={() => onSaveNode({ isExecute: false })} className="u-width-100" />
                    <Button variant={ButtonVariant.Primary} content="Add" onButtonClick={onSaveNode} className="u-width-100" />
                </div>
            </div>
        </Popup>}
        {/* Node Details insertion UI */}
        {isCurrentSelection(SELECTIONS.PARAMETERS) && <NodeMetadata
            nodes={nodes}
            onAddMetadata={onAddMetadata}
            onAddNodeName={onAddNodeName}
            onAddQueryParam={onAddQueryParam}
            onAddHeaderParam={onAddHeaderParam}
            onAddURLEncodedParam={onAddURLEncodedParam}
            onDeleteHeaderParam={onDeleteHeaderParam}
            onDeleteQueryParam={onDeleteQueryParam}
            onHandlePredecessorEdge={onHandlePredecessorEdge}
            onDeleteURLEncodedParam={onDeleteURLEncodedParam}
            selectedNode={selectedNode}
            onUpdateNodeFromCurl={handleUpdateNodeFromCurl}
        />}
        {isCurrentSelection(SELECTIONS.ASSERTIONS) &&
            <Assertion
                respParams={selectedNode?.data.assertion?.postResponseAssertion || []}
                selectedNode={selectedNode}
                currentNode={currentNodeID}
                insertAssertion={insertAssertion}
                editAssertion={editAssertion}
                deleteAssertion={deleteAssertion}
            />}
        {(!!preEdge || !isStartNode(connections, currentNodeID)) &&
            isCurrentSelection(SELECTIONS.MODIFIERS) &&
            <Mapper
                preEdge={preEdge}
                reqParams={selectedNode?.data.assertion?.preRequestAssertion || []}
                selectedNode={selectedNode}
                currentNode={currentNodeID}
                insertMapper={insertMapper}
                editMapper={editMapper}
                deleteMapper={deleteMapper}
            />}
        <div className="template__paramActions">
            <Button variant={ButtonVariant.Success} content="Save Node" onButtonClick={() => setIsGlobalMapper(true)} />
            {/* <Button variant={ButtonVariant.Success} content="Save Node Without Executing" onButtonClick={onSaveNode.bind(this, { isExecute: false })} /> */}
            <Button variant={ButtonVariant.Delete} content="Delete Node" onButtonClick={onDeleteNode} />
        </div>
    </div>
}

const mapStateToProps = ({ nodes, utils }: RootState) => ({
    connections: nodes.edges,
    nodes: nodes.nodes,
    preEdge: nodes.predecessorEdge,
    messages: utils.messages
})

export default connect(mapStateToProps)(NodePanel);