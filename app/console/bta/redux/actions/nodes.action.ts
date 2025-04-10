import { Edge, Node, NodeChange } from "reactflow";
import { AddCurrentNodeAction, BODYTYPE, CustomNodeData, HttpStatus, KeyValueProps, Mappers, NodeStatus, PostResponseAssertionProps, PreRequestAssertionProps, ProcessNode, RootState } from "../../types";
import { AnyAction, Dispatch } from "redux";
import { ThunkAction } from "redux-thunk";
import { assertionComparison, buildExecutionTree, executeUserScript, filterEdges, getBodyKeyValue, getNodeFromID, getQueryKeyValue, getResponseKeyValue, trimExecutionTree } from "../../services";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { displayTerminalMessage, toggleTerminalDisplay } from "./utils.action";
import { downloadJSON, getFormData } from "../../services/execution";

export const ADD_CURRENT_NODE = "ADD_CURRENT_NODE";
export const REMOVE_CURRENT_NODE = "REMOVE_CURRENT_NODE";
export const ADD_NODE = "ADD_NODE";
export const REMOVE_NODE = "REMOVE_NODE";
export const REPLACE_NODES = "REPLACE_NODES";
export const SAVE_NODE_METADATA = "SAVE_NODE_METADATA";
export const ADD_EDGE = "ADD_EDGE"
export const REMOVE_EDGES = "REMOVE_EDGES";
export const ADD_NODE_START_POINT = "ADD_NODE_START_POINT";
export const REMOVE_START_NODE_PONT = "REMOVE_START_NODE_POINT";
export const SET_NODE_STATUS = "SET_NODE_STATUS";
export const ADD_REQUEST_PARAMS = "ADD_REQUEST_PARAMS";
export const REMOVE_REQUEST_PARAMS = "REMOVE_REQUEST_PARAMS";
export const UPDATE_REQUEST_PARAMS = "UPDATE_REQUEST_PARAMS";
export const ADD_API_RESPONSE = "ADD_API_RESPONSE";
export const REMOVE_API_RESPONSE = "REMOVE_API_RESPONSE";
export const ADD_RESPONSE_PARAMS = "ADD_RESPONSE_PARAMS";
export const UPDATE_RESPONSE_PARAMS = "UPDATE_RESPONSE_PARAMS";
export const REMOVE_RESPONSE_PARAMS = "REMOVE_RESPONSE_PARAMS";
export const ADD_COMPLETION_RATE = "ADD_COMPLETION_RATE";
export const CLEAR_COMPLETION_RATE = "CLEAR_COMPLETION_RATE";
export const CLEAR_COMPLETION_RATE_LISTS = "CLEAR_COMPLETION_RATE_LISTS";
export const REMOVE_INITIATING_NODES = "REMOVE_INITIATING_NODES";
export const ADD_MAPPERS = "ADD_MAPPERS";
export const REMOVE_MAPPER = "REMOVE_MAPPER";
export const ADD_PREDECESSOR_EDGE = "ADD_PREDECESSOR_EDGE";
export const REMOVE_PREDECESSOR_EDGE = "REMOVE_PREDECESSOR_EDGE";

export const addCurrentNode = ({ id }: AddCurrentNodeAction) => ({
    id,
    type: ADD_CURRENT_NODE
})

export const removeCurrentNode = () => ({
    type: REMOVE_CURRENT_NODE
})

export const AddNode = (node: Node<CustomNodeData>) => ({
    type: ADD_NODE,
    node,
})

export const RemoveNode = (id: number) => ({
    type: REMOVE_NODE,
    id
})

export const ReplaceNodes = (changes: NodeChange[]) => ({
    type: REPLACE_NODES,
    changes,
})

export const OnSaveNodeMetadata = (id: number, metadata: CustomNodeData) => ({
    type: SAVE_NODE_METADATA,
    id,
    metadata,
})

export const AddEdge = (edge: Edge) => ({
    type: ADD_EDGE,
    edge
})

export const RemoveEdges = (id: number) => ({
    type: REMOVE_EDGES,
    id,
})

export const AddNodeStartPoint = (id: string) => ({
    type: ADD_NODE_START_POINT,
    id,
})

export const RemoveStartNodePoint = () => ({
    type: REMOVE_START_NODE_PONT
})

export const SetNodeStatus = (id: string, status: NodeStatus) => ({
    type: SET_NODE_STATUS,
    id,
    status,
})

export const AddPreRequestParams = (id: string, params: PreRequestAssertionProps) => {
    return {
        type: ADD_REQUEST_PARAMS,
        id,
        params,
    }
}

export const UpdatePreRequestParams = (params: PreRequestAssertionProps, paramPosition: number) => ({
    type: UPDATE_REQUEST_PARAMS,
    params,
    paramPosition,
})

export const RemovePreRequestParams = (paramPosition: number) => ({
    type: REMOVE_REQUEST_PARAMS,
    paramPosition,
})

export const AddPostResponseParams = (params: PostResponseAssertionProps, id: string) => ({
    type: ADD_RESPONSE_PARAMS,
    params,
    id,
})

export const UpdatePostResponseParams = (params: PostResponseAssertionProps, paramPosition: number) => ({
    type: UPDATE_RESPONSE_PARAMS,
    params,
    paramPosition,
})

export const RemovePostResponseParams = (paramPosition: number) => ({
    type: REMOVE_RESPONSE_PARAMS,
    paramPosition,
})

export const AddCompletionRate = (rate: number, nodeId: string) => ({
    type: ADD_COMPLETION_RATE,
    id: nodeId,
    rate,
})

export const ClearCompletionRate = (nodeID: string) => ({
    type: CLEAR_COMPLETION_RATE,
    id: nodeID,
})

export const ClearCompletionRateList = (ids: string[]) => ({
    type: CLEAR_COMPLETION_RATE_LISTS,
    ids,
})

export const SaveNodeAPIHandler = (): ThunkAction<void, RootState, unknown, AnyAction> => async (dispatch: Dispatch, getState: () => RootState) => {
    try {

    } catch (e) {
        console.log(e)
    }
}

export const AddPredecessorEdge = (source: string, target: string) => ({
    type: ADD_PREDECESSOR_EDGE,
    source,
    target,
})

export const RemovePredecessorEdge = () => ({
    type: REMOVE_PREDECESSOR_EDGE,
})

export const StartNodeExecution = ({ type, procId }: { type?: "TEXEC" | "NPROC", procId?: string } = {}): ThunkAction<void, RootState, unknown, AnyAction> => async (dispatch: Dispatch, getState: () => RootState) => {
    try {
        // display output terminal to show api responses
        if (type == "TEXEC") dispatch(toggleTerminalDisplay({ isInvert: true }))
        const { nodes: nodesState } = getState();
        const { nodes, edges, startNode } = nodesState;
        const filteredEdges = filterEdges(nodes, edges);
        const executionTree = buildExecutionTree(filteredEdges, "1");
        const filteredTree = trimExecutionTree(executionTree, startNode)
        let updatedExecTree = startNode ? filteredTree : executionTree;
        // clear all compleation rate progress in the filtered tree
        dispatch(ClearCompletionRateList(filteredTree))
        // create a break point called outerloop to terminate execution in case of assertion failure
        outerLoop: for (const id of updatedExecTree) {
            const currentNode = nodes.find(node => node.id == id)
            dispatch(RemoveAPIResponse(id))
            if (type == "TEXEC") dispatch(SetNodeStatus(id, NodeStatus.PROCESSING))
            if (currentNode) {
                if (type == "TEXEC") {
                    dispatch(displayTerminalMessage({ message: "_________________________________________________________" }))
                    dispatch(displayTerminalMessage({ message: `processing node ${currentNode.data.label}` }))
                }
                const n = getState().nodes.nodes.find(n => n.id == id);
                const preAssertions = n?.data.assertion?.preRequestAssertion;
                let preAssertionQueryString = "";
                let preAssertionBody = new Map<string, any>();
                let headers: Record<string, string> = {};
                if (preAssertions && !!preAssertions.length) {
                    for (const preAssertion of preAssertions) {
                        let keyValue;
                        if (preAssertion.type == "Global") {
                            const mappers = getState().nodes.mappers[preAssertion.prevParamPosition];
                            keyValue = mappers.find(mapper => mapper.name == preAssertion.prevActionKey)?.value;
                        }
                        else {
                            const prevNodeID = preAssertion.prevNodeName?.id;
                            if (prevNodeID) {
                                const getNode = getNodeFromID(getState().nodes.nodes, prevNodeID)
                                if (getNode) {
                                    let keyExist = false;
                                    // Get required prenode value based on the param position key
                                    if (preAssertion.prevParamPosition == "Response") {
                                        const nodeResponse = getNode.data.metadata?.response;
                                        if (nodeResponse) {
                                            [keyExist, keyValue] = getResponseKeyValue(nodeResponse, preAssertion.prevActionKey)
                                            console.log(keyExist, keyValue)
                                        }
                                    } else if (preAssertion.prevParamPosition == "Body" && getNode.data.metadata?.bodyType == BODYTYPE.BODYJSON) {
                                        const nodeBody = getNode.data.metadata?.body;
                                        if (nodeBody) [keyExist, keyValue] = getBodyKeyValue(nodeBody as string, preAssertion.prevActionKey)
                                    } else if (preAssertion.prevParamPosition == "Query") {
                                        const nodeQuery = getNode.data.metadata?.params;
                                        if (nodeQuery) [keyExist, keyValue] = getQueryKeyValue(nodeQuery, preAssertion.prevActionKey)
                                    }
                                    // Display error if the prenode key does not exist at the provided location
                                    if (!keyExist) {
                                        if (type == "TEXEC") {
                                            dispatch(displayTerminalMessage({
                                                message: `ERRROR: PREASSERTION FAILURE: key ${preAssertion.prevActionKey} does not exist on node ${getNode.data.label} at ${preAssertion.prevParamPosition}`
                                            }))
                                            dispatch(SetNodeStatus(id, NodeStatus.ERROR))
                                        }
                                        break outerLoop;
                                    } else {
                                        if (type == "TEXEC") dispatch(AddCompletionRate(25 / (2 + preAssertions.length), id))
                                    }
                                }
                            }
                        }
                        // Attach the prenode value at the specified location
                        if (preAssertion.paramPosition == "Query") {
                            preAssertionQueryString += `${preAssertion.currentKey}=${keyValue}`
                            dispatch(AddCompletionRate(25 / (2 + preAssertions.length), id))
                        } else if (preAssertion.paramPosition == "Body") {
                            preAssertionBody.set(preAssertion.currentKey, keyValue);
                            dispatch(AddCompletionRate(25 / (2 + preAssertions.length), id))
                        } else if (preAssertion.paramPosition == "Route") {
                            if (currentNode.data.metadata) {
                                currentNode.data.metadata.url = currentNode.data.metadata.url.replace(new RegExp(`{${preAssertion.currentKey}}`, 'g'), keyValue)
                                dispatch(AddCompletionRate(25 / (2 + preAssertions.length), id))
                            }
                        } else if (preAssertion.paramPosition == "Header") {
                            headers[preAssertion.currentKey] = preAssertion?.isDataMapping ? executeUserScript(preAssertion.mapping.value, preAssertion.currentKey, keyValue) : keyValue
                        }
                    }
                    if (type == "TEXEC") dispatch(displayTerminalMessage({ message: `PREASSERTION SUCCESS for ${currentNode.data.label}` }))
                }
                if (currentNode.data.metadata?.headers)
                    currentNode.data.metadata?.headers.forEach(header => {
                        headers[header.name] = header.value;
                    })
                if (type == "TEXEC") {
                    dispatch(displayTerminalMessage({ message: `setting headers ${JSON.stringify(headers)}` }))
                    dispatch(AddCompletionRate(25 + ((25 / 4) * 1), id))
                }
                let queryParameters: Record<string, string | number | boolean | undefined> = {};
                let queryString: string = "";
                if (currentNode.data.metadata?.params) {
                    currentNode.data.metadata?.params.forEach(param => {
                        queryParameters[param.name] = param.value;
                    })
                    queryString = new URLSearchParams(
                        Object.entries(queryParameters)
                            .filter(([_, value]) => value !== undefined)
                            .map(([key, value]) => [key, String(value)])
                    ).toString();
                }
                if (type == "TEXEC") {
                    dispatch(displayTerminalMessage({ message: `setting query string: ${JSON.stringify(queryString)}` }))
                    dispatch(AddCompletionRate(25 + ((25 / 4) * 2), id))
                }
                const queryParams = [queryString, preAssertionQueryString].filter(Boolean).join("&");
                const url = queryParams ? `${currentNode.data.metadata?.url}?${queryParams}` : currentNode.data.metadata?.url;
                if (type == "TEXEC") {
                    dispatch(displayTerminalMessage({ message: `URL: ${url}` }))
                    dispatch(AddCompletionRate(25 + ((25 / 4) * 3), id))
                    dispatch(displayTerminalMessage({ message: `METHOD: ${currentNode.data.metadata?.method}` }))
                }

                let requestBody: string | undefined;
                const metadata = currentNode.data.metadata;
                if (metadata?.bodyType === BODYTYPE.BODYJSON) {
                    requestBody = JSON.stringify(JSON.parse(metadata.body as string ?? "{}"));
                } else if (metadata?.bodyType === BODYTYPE.XFORMURLENCODED) {
                    const parsedKV: KeyValueProps[] = metadata.body as KeyValueProps[]
                    const formParams = getFormData(parsedKV)
                    requestBody = formParams.toString();
                }
                const requestConfig: AxiosRequestConfig = {
                    method: "POST",
                    url: "http://localhost:3001/api/proxy",
                    data: {
                        body: requestBody,
                        headers: {
                            'Content-Type': metadata?.bodyType === BODYTYPE.XFORMURLENCODED
                                ? 'application/x-www-form-urlencoded'
                                : 'application/json',
                            ...headers,
                        },
                        url,
                        method: currentNode.data.metadata?.method,
                    }
                }
                if (type == "TEXEC") dispatch(AddCompletionRate(25 + ((25 / 4) * 4), id))
                const result = await axios(requestConfig);
                dispatch(AddAPIResponse(result, id))
                if (type == "TEXEC") {
                    dispatch(displayTerminalMessage({ message: "Response: " }))
                    dispatch(displayTerminalMessage({ message: JSON.stringify(result, null, 1) }))
                    dispatch(AddCompletionRate(75, id))
                } else if (type == "NPROC" && procId == id) {
                    return result;
                }
                if (type == "TEXEC") {
                    const postAssertions = currentNode?.data.assertion?.postResponseAssertion;
                    if (postAssertions && postAssertions.length) {
                        for (const postAssertion of postAssertions) {
                            let keyExist = false;
                            let keyValue;
                            if (postAssertion.type == "Status Assertion") {
                                const assertionStatus = postAssertion.value as HttpStatus
                                if (result.status != assertionStatus.code) {
                                    const value = postAssertion.value as HttpStatus
                                    dispatch(displayTerminalMessage({
                                        message: `ERRROR: POSTASSERTION FAILURE: Status Value ${value.code} does not match with result value ${result.status}`
                                    }))
                                    dispatch(SetNodeStatus(id, NodeStatus.ERROR))
                                    break outerLoop;
                                }
                                dispatch(AddCompletionRate(50 + 25 / postAssertions.length, id))
                            }
                            else if (postAssertion.type == "Headers Assertion" || postAssertion.type == "Response Assertion") {
                                [keyExist, keyValue] = getResponseKeyValue(result, postAssertion.key, postAssertion.type);
                                //check if postassertion key exist in the response
                                if (!keyExist) {
                                    dispatch(displayTerminalMessage({
                                        message: `ERRROR: POSTASSERTION FAILURE: key ${postAssertion.key} does not exist on ${currentNode.data.label}`
                                    }))
                                    dispatch(SetNodeStatus(id, NodeStatus.ERROR))
                                    break outerLoop;
                                }
                                // check if the value of the key is comparable with the provided value based on the condition 
                                const isComparable = assertionComparison(postAssertion.type == "Response Assertion" ? postAssertion.condition : "Equal To", keyValue, postAssertion.value)
                                if (!isComparable) {
                                    dispatch(displayTerminalMessage({
                                        message: `ERRROR: POSTASSERTION FAILURE: ${keyValue} ${postAssertion.condition} ${postAssertion.value} failed!`
                                    }))
                                    dispatch(SetNodeStatus(id, NodeStatus.ERROR))
                                    break outerLoop;
                                }
                                dispatch(AddCompletionRate(50 + 25 / postAssertions.length, id))
                            }
                        }
                        dispatch(displayTerminalMessage({ message: `POSTASSERTION SUCCESS for ${currentNode.data.label}` }))
                    }
                    dispatch(SetNodeStatus(id, NodeStatus.SUCCESS))
                    dispatch(AddCompletionRate(100, id))
                }
            }
        }
    } catch (e) {
        console.log(e);
    }
}

export const processScriptsToJSON = (): ThunkAction<void, RootState, unknown, AnyAction> => async (dispatch: Dispatch, getState: () => RootState) => {
    try {
        const nodes = getState().nodes.nodes;
        const jsonObj: { nodes: ProcessNode[] } = { nodes: [] };
        nodes.forEach(node => {
            const nodeData: ProcessNode = {};
            const metadata = node.data.metadata;
            nodeData["type"] = node.data.icon;
            nodeData["name"] = node.data.label;
            nodeData["url"] = metadata?.url ?? "";
            nodeData["method"] = metadata?.method;
            nodeData["headers"] = metadata?.headers;
            nodeData["queryParams"] = metadata?.params;
            nodeData["payload"] = metadata?.body?.toString();
            nodeData["payloadType"] = metadata?.bodyType || BODYTYPE.NONE
            nodeData["assertions"] = node.data.assertion;
            nodeData["metadata"] = {
                position: {
                    x: node.position.x,
                    y: node.position.y,
                }
            }
            if (metadata?.bodyType === BODYTYPE.BODYJSON) {
                try {
                    nodeData.payload = JSON.parse(metadata.body as string ?? "{}");
                } catch (e) {
                    nodeData.payload = "{}";
                }
            } else if (metadata?.bodyType === BODYTYPE.XFORMURLENCODED) {
                try {
                    nodeData.payload = metadata.body as KeyValueProps[]; // store as array of { key, value }
                } catch (e) {
                    nodeData.payload = [];
                }
            } else {
                nodeData.payload = "";
            }
            jsonObj.nodes.push(nodeData);

        })
        downloadJSON(jsonObj, "testjson.json")
    } catch (e) {
        console.log(e);
    }
}

export const AddAPIResponse = (response: AxiosResponse, nodeID: string) => ({
    type: ADD_API_RESPONSE,
    response,
    id: nodeID,

})

export const RemoveAPIResponse = (nodeID: string) => ({
    type: REMOVE_API_RESPONSE,
    id: nodeID
})

export const DeleteInitiatingNodes = () => ({ type: REMOVE_INITIATING_NODES })

export const AddMappers = (source: string, mappers: Mappers[]) => ({
    type: ADD_MAPPERS,
    mappers,
    source,
})

export const RemoveMapper = (id: string) => ({
    type: REMOVE_MAPPER,
    id,
})