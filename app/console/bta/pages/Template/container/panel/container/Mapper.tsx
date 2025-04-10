import { Dispatch } from "redux";
import { CustomNodeData, PreRequestAssertionProps, RootState, DropdownFnParams, PreRequestAssertionError, ButtonVariant, InputType, InputGroupVariant, TitleVariant, Mappers } from "../../../../../types";
import { Edge, Node } from "reactflow";
import { ChangeEvent, FC, Fragment, useCallback, useEffect, useMemo, useState } from "react";
import { connect } from "react-redux";
import { DATA } from "../data";
import { getPreAssertionNodes, URLHasPath } from "../../../../../services";
import { AssertionCard, Button, Dropdown, InputGroup, SelectiveInput, Title } from "../../../../../components";
import { Editor } from "@monaco-editor/react";

interface MapperProps {
    dispatch: Dispatch,
    preEdge: { source: string, target: string } | null;
    selectedNode: Node<CustomNodeData> | null;
    currentNode: string | null,
    nodes: Node<CustomNodeData>[],
    edges: Edge[],
    reqParams: PreRequestAssertionProps[],
    mappers: { [nodeName: string]: Mappers[] },
    insertMapper: (mapper: PreRequestAssertionProps) => void;
    editMapper: (mapper: PreRequestAssertionProps, index: number) => void;
    deleteMapper: (deleteIndex: number) => void;
}

const Mapper: FC<MapperProps> = ({ preEdge, nodes, selectedNode, currentNode, edges, reqParams, mappers, insertMapper, editMapper, deleteMapper }) => {
    const [preRequestAssertion, setPreRequestAssertion] = useState<PreRequestAssertionProps>({ ...DATA.PRE_REQUEST_ASSERTION_DEFAULT_DATA })
    const [error, setError] = useState<PreRequestAssertionError>({ ...DATA.PRE_REQUEST_ASSERTION_DEFAULT_ERROR });
    const [isUpdate, setIsUpdate] = useState<boolean>(false);
    const [isUpdateSelected, setIsUpdateSelected] = useState<number | null>();

    useEffect(() => {
        setIsUpdate(false);
        setIsUpdateSelected(null);
    }, [])


    const onHandlePreReqAssertionEdit = (index: number) => {
        const selectedAssertion = reqParams[index]
        setPreRequestAssertion(selectedAssertion)
        setIsUpdate(true);
        setIsUpdateSelected(index);
    }

    const onHandlePreRequestParams = (key: string, event: ChangeEvent<HTMLInputElement> | DropdownFnParams<string> | DropdownFnParams<boolean> | DropdownFnParams<Node<CustomNodeData>>) => {
        setPreRequestAssertion(prevState => ({
            ...prevState,
            ...(key == "key" || key == "value"
                ? {
                    mapping: {
                        ...prevState.mapping,
                        [key]: event.target.value as any
                    }
                }
                : { [key]: event.target.value }
            )
        }))
    }

    const onHandleValidation = (): PreRequestAssertionError => {
        const validationError: PreRequestAssertionError = {}
        const url = selectedNode?.data.metadata?.url;
        if (preRequestAssertion.paramPosition == "Route") {
            if (!url?.length)
                validationError.currentKey = DATA.PRE_REQUEST_ASSERTION_ERROR.URL_NOT_FOUND;
            else if (!URLHasPath(url, preRequestAssertion.currentKey))
                validationError.currentKey = DATA.PRE_REQUEST_ASSERTION_ERROR.INVALID_URL;
        }
        return validationError;
    }

    const AddRequestParams = () => {
        if (currentNode) {
            // handle necessary mapper validations and proceed
            // only if the inserted fields are valid
            const validationError = onHandleValidation();
            if (!Object.values(validationError).length) {
                insertMapper(preRequestAssertion)
                setPreRequestAssertion({ ...DATA.PRE_REQUEST_ASSERTION_DEFAULT_DATA })
            } else setError({ ...validationError })

        }
    }

    const onEditAssertion = () => {
        if (isUpdateSelected != null) {
            editMapper(preRequestAssertion, isUpdateSelected)
            setIsUpdate(false);
            setIsUpdateSelected(null);
            setPreRequestAssertion({ ...DATA.PRE_REQUEST_ASSERTION_DEFAULT_DATA })
        }
    }

    const onDeleteAssertion = () => {
        if (isUpdateSelected != null) {
            deleteMapper(isUpdateSelected)
            setIsUpdate(false);
            setIsUpdateSelected(null)
            setPreRequestAssertion({ ...DATA.PRE_REQUEST_ASSERTION_DEFAULT_DATA })
        }
    }

    const isInsertReqParamAction = (): boolean => {
        const { type, currentKey, paramPosition, prevActionKey, prevParamPosition, prevNodeName } = preRequestAssertion;
        if (type == "Manual" && !!currentKey.length && !!paramPosition.length && !!prevActionKey.length && !!prevParamPosition.length && !!prevNodeName)
            return false
        else if (type == "Global" && !!currentKey.length && !!paramPosition.length && !!prevActionKey.length)
            return false;
        return true
    }

    const getPreActionNodes = useMemo(() => {
        if (currentNode)
            return getPreAssertionNodes(edges, currentNode, preEdge)
        return [];
    }, [edges, currentNode, preEdge])

    const getNodes = useCallback(() => {
        const preNodes = getPreActionNodes;
        const updatedNodes: Node<CustomNodeData>[] = [];
        for (const preNode of preNodes) {
            const node = nodes.find(n => n.id == preNode);
            if (node) updatedNodes.push(node);
        }
        return updatedNodes;
    }, [edges, nodes, currentNode])

    const updateIndex = useMemo(() => {
        return typeof isUpdateSelected == "number" ? isUpdateSelected : null
    }, [isUpdateSelected])

    const getValue = useMemo(() => {
        if (preRequestAssertion.prevParamPosition && mappers[preRequestAssertion.prevParamPosition]) {
            const mapperField = mappers[preRequestAssertion.prevParamPosition]?.find(
                mapper => mapper.name === preRequestAssertion.prevActionKey
            );
            return mapperField ?? { name: "", value: "" };
        }
        return { name: "", value: "" };
    }, [preRequestAssertion.prevActionKey, preRequestAssertion.prevParamPosition, mappers]);

    return <div className="template__assertions">
        <div className="template__assertion">
            <Title variant={TitleVariant.InterBold141}>Pre-Request Assertion</Title>
            <div className="template__assertionCards">
                {reqParams.map((params, index) => {
                    return <AssertionCard
                        onAssertionClick={onHandlePreReqAssertionEdit.bind(this, index)}
                        isSelected={updateIndex?.toString() == index.toString()}
                        key={index}
                        mapper={params.currentKey}
                        keyMapper={params.prevActionKey}
                        mappingValue={params.mapping.key}
                    />
                })}
            </div>
            <div>
                <InputGroup
                    title="Select Mapper Type"
                    variant={InputGroupVariant.Primary}
                    type={InputType.Dropdown}
                    contents={["Global", "Manual"]}
                    onHandleDropdown={onHandlePreRequestParams?.bind(this, "type")}
                    filter={false}
                    value={preRequestAssertion.type}
                />
                {preRequestAssertion.type == "Manual" ? <div>
                    <InputGroup
                        title=""
                        variant={InputGroupVariant.Primary}
                        value={preRequestAssertion.currentKey}
                        placeholder="Key"
                        onHandleInput={onHandlePreRequestParams?.bind(this, "currentKey")}
                        error={error?.currentKey}
                    />
                    {!!preRequestAssertion.currentKey.length &&
                        <Fragment>
                            <InputGroup
                                title="Parameter Position"
                                variant={InputGroupVariant.Primary}
                                type={InputType.Dropdown}
                                contents={["Body", "Query", "Route", "Header"]}
                                onHandleDropdown={onHandlePreRequestParams?.bind(this, "paramPosition")}
                                filter={false}
                                value={preRequestAssertion.paramPosition}
                            />
                        </Fragment>
                    }
                    <InputGroup title="Previous Action Key"
                        variant={InputGroupVariant.Primary}
                        placeholder="data.obj1.obj2.key"
                        onHandleInput={onHandlePreRequestParams?.bind(this, "prevActionKey")}
                        value={preRequestAssertion.prevActionKey}
                    />
                    {!!preRequestAssertion.prevActionKey.length &&
                        <Fragment>
                            <InputGroup
                                title="Previous Action Parameter Position"
                                variant={InputGroupVariant.Primary}
                                type={InputType.Dropdown}
                                contents={["Response", "Body", "Query"]}
                                filter={false}
                                value={preRequestAssertion.prevParamPosition}
                                onHandleDropdown={onHandlePreRequestParams?.bind(this, "prevParamPosition")}
                            />
                            <InputGroup
                                title="Node Name"
                                variant={InputGroupVariant.Primary}
                                type={InputType.Dropdown}
                                contents={getNodes() || []}
                                value={preRequestAssertion.prevNodeName}
                                location="data.label"
                                placeholder="Select Node Name"
                                filter={getNodes().length > 1}
                                onHandleDropdown={onHandlePreRequestParams?.bind(this, "prevNodeName")}
                            />
                        </Fragment>
                    }
                    <SelectiveInput
                        type={InputType.Dropdown}
                        title="Data Mapping"
                        disabled={!preRequestAssertion.isDataMapping}
                        isActive={preRequestAssertion.isDataMapping}
                        contents={["Type Conversion", "Code Conversion"]}
                        key="value"
                        value={preRequestAssertion.mapping.key}
                        variant={InputGroupVariant.Primary}
                        placeholder="Mapping Type"
                        onToggleSwitch={() => onHandlePreRequestParams("isDataMapping", { target: { value: !preRequestAssertion.isDataMapping } } as DropdownFnParams<boolean>)}
                        onHandleDropdown={onHandlePreRequestParams?.bind(this, "key")}
                        filter={false}
                    />
                    <div className="u-margin-top-5">
                        {preRequestAssertion.mapping.key.toString() == "Code Conversion" && preRequestAssertion.isDataMapping ?
                            <Editor
                                height="100px"
                                language="javascript"
                                theme="light"
                                onChange={(val?: string) => onHandlePreRequestParams("value", { target: { value: val } } as ChangeEvent<HTMLInputElement>)}
                                value={preRequestAssertion.mapping.value}
                            /> :
                            <Dropdown
                                contents={["To String", "To Number", "To Boolean"]}
                                value={preRequestAssertion.mapping.value}
                                disabled={!preRequestAssertion.isDataMapping}
                                placeholder="Value"
                                onHandleDropdownValue={onHandlePreRequestParams?.bind(this, "value")}
                                filter={false}
                            />
                        }
                    </div>
                </div> : <div>
                    <InputGroup
                        title="Global Mapper Node name"
                        variant={InputGroupVariant.Primary}
                        type={InputType.Dropdown}
                        contents={Object.keys(mappers)}
                        filter={false}
                        onHandleDropdown={val => onHandlePreRequestParams("prevParamPosition", { target: { value: val.target.value } })}
                        value={preRequestAssertion.prevParamPosition ? preRequestAssertion.prevParamPosition : ""}
                    />
                    {!!preRequestAssertion.prevParamPosition && (
                        <Fragment>
                            <InputGroup
                                title="Global Mapper Field"
                                variant={InputGroupVariant.Primary}
                                type={InputType.Dropdown}
                                contents={mappers[preRequestAssertion.prevParamPosition]}
                                location="name"
                                filter={false}
                                onHandleDropdown={val => onHandlePreRequestParams("prevActionKey", { target: { value: val.target.value.name } })}
                                value={getValue}
                            />
                            <InputGroup
                                title="Global Mapper Value"
                                variant={InputGroupVariant.Primary}
                                disabled={true}
                                value={JSON.stringify(getValue?.value)}
                            />
                            <InputGroup
                                title=""
                                variant={InputGroupVariant.Primary}
                                value={preRequestAssertion.currentKey}
                                placeholder="Key"
                                onHandleInput={onHandlePreRequestParams?.bind(this, "currentKey")}
                            />
                        </Fragment>
                    )}
                    {!!preRequestAssertion.prevActionKey.length &&
                        <Fragment>
                            <InputGroup
                                title="Parameter Position"
                                variant={InputGroupVariant.Primary}
                                type={InputType.Dropdown}
                                contents={["Body", "Query", "Route", "Header"]}
                                onHandleDropdown={onHandlePreRequestParams?.bind(this, "paramPosition")}
                                filter={false}
                                value={preRequestAssertion.paramPosition}
                            />
                        </Fragment>
                    }
                </div>}
            </div>
        </div>
        <div className="template__paramAction">
            {!isUpdate ? <Button
                className="u-margin-top-10 u-width-100"
                variant={ButtonVariant.Primary}
                content="Insert Pre Request Assertion"
                disabled={isInsertReqParamAction()}
                onButtonClick={AddRequestParams}
            /> :
                <Fragment>
                    <Button variant={ButtonVariant.Update} content="Update Assertion" onButtonClick={onEditAssertion} />
                    <Button variant={ButtonVariant.Delete} content="Delete Assertion" onButtonClick={onDeleteAssertion} />
                </Fragment>
            }
        </div>
    </div>
}

const mapStateToProps = ({ nodes }: RootState) => ({ nodes: nodes.nodes, edges: nodes.edges, mappers: nodes.mappers })

export default connect(mapStateToProps)(Mapper);