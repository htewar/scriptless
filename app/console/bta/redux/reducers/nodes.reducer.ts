import { applyNodeChanges, Edge } from "reactflow";
import { NodesAction, NodeState, NodeStatus } from "../../types"
import { ADD_API_RESPONSE, ADD_COMPLETION_RATE, ADD_CURRENT_NODE, ADD_EDGE, ADD_MAPPERS, ADD_NODE, ADD_NODE_START_POINT, ADD_PREDECESSOR_EDGE, ADD_REQUEST_PARAMS, ADD_RESPONSE_PARAMS, CLEAR_COMPLETION_RATE, CLEAR_COMPLETION_RATE_LISTS, REMOVE_API_RESPONSE, REMOVE_CURRENT_NODE, REMOVE_EDGES, REMOVE_INITIATING_NODES, REMOVE_MAPPER, REMOVE_NODE, REMOVE_PREDECESSOR_EDGE, REMOVE_REQUEST_PARAMS, REMOVE_RESPONSE_PARAMS, REMOVE_START_NODE_PONT, REPLACE_NODES, SAVE_NODE_METADATA, SET_NODE_STATUS, UPDATE_REQUEST_PARAMS, UPDATE_RESPONSE_PARAMS } from "../actions/nodes.action";

const nodesReducerDefaultState: NodeState = {
    current: null,
    startNode: "",
    predecessorEdge: null,
    mappers: {},
    nodes: [],
    edges: [],
}

const nodesReducer = (
    state: NodeState = nodesReducerDefaultState,
    { type, id, ids, node, edge, changes, metadata, status, params, paramPosition, response, rate, mappers, source, target }: NodesAction) => {
    switch (type) {
        case ADD_CURRENT_NODE:
            return { ...state, current: id }
        case REMOVE_CURRENT_NODE:
            return { ...state, current: null }
        case ADD_NODE:
            return { ...state, nodes: [...state.nodes, node] }
        case REMOVE_NODE:
            const position = state.nodes.findIndex((n) => n.id == id?.toString())
            return { ...state, nodes: [...state.nodes.slice(0, position), ...state.nodes.slice(position + 1)] }
        case SAVE_NODE_METADATA:
            const pos = state.nodes.findIndex((n) => n.id == id?.toString());
            const currentNodes = state.nodes;
            if (metadata.metadata)
                currentNodes[pos].data = { ...metadata }
            return { ...state, nodes: currentNodes }
        case REPLACE_NODES:
            return { ...state, nodes: applyNodeChanges(changes, state.nodes) }
        case ADD_EDGE:
            return { ...state, edges: [...state.edges, edge] }
        case REMOVE_EDGES:
            const idString = id?.toString();
            const edgesCopy: Edge[] = JSON.parse(JSON.stringify(state.edges));
            const edgesFilter = edgesCopy.filter(edge => edge.source != idString && edge.target != idString) || [];
            return { ...state, edges: edgesFilter }
        case ADD_NODE_START_POINT:
            return { ...state, startNode: id }
        case REMOVE_START_NODE_PONT:
            return { ...state, startNode: "" }
        case SET_NODE_STATUS:
            var nodePosition = state.nodes.findIndex((n) => n.id == id?.toString());
            var existingNodes = state.nodes;
            if (status)
                existingNodes[nodePosition].data = { ...existingNodes[nodePosition].data, status: status }
            return { ...state, nodes: existingNodes }
        case ADD_REQUEST_PARAMS:
            var nodePosition = state.nodes.findIndex((n) => n.id == id?.toString());
            if (nodePosition == -1) return state;
            const updatedNodes = state.nodes.map((node, index) => {
                if (index === nodePosition) {
                    return {
                        ...node,
                        data: {
                            ...node.data,
                            assertion: {
                                ...node.data.assertion,
                                preRequestAssertion: [
                                    ...(node.data.assertion?.preRequestAssertion || []),
                                    params
                                ]
                            }
                        }
                    };
                }
                return node;
            });
            return { ...state, nodes: updatedNodes }
        case REMOVE_REQUEST_PARAMS:
            return {
                ...state,
                nodes: state.nodes.map(node =>
                    node.id === state.current
                        ? {
                            ...node,
                            data: {
                                ...node.data,
                                assertion: {
                                    ...node.data.assertion,
                                    preRequestAssertion: node.data.assertion?.preRequestAssertion
                                        ? node.data.assertion.preRequestAssertion.filter((_, index) => index !== paramPosition)
                                        : []
                                }
                            }
                        }
                        : node
                )
            };
        case UPDATE_REQUEST_PARAMS:
            return {
                ...state,
                nodes: state.nodes.map(node => node.id === state.current ? {
                    ...node,
                    data: {
                        ...node.data,
                        assertion: {
                            ...node.data.assertion,
                            preRequestAssertion: node.data.assertion?.preRequestAssertion.map((assertion, index) => {
                                if (index == paramPosition)
                                    return params;
                                return assertion;
                            })
                        }
                    }
                } : node)
            }
        case ADD_API_RESPONSE:
            var nodePosition = state.nodes.findIndex((n) => n.id == id);
            if (nodePosition == -1) return state;
            const updatedNode = state.nodes.map((node, index) => {
                if (index === nodePosition) {
                    return {
                        ...node,
                        data: {
                            ...node.data,
                            metadata: {
                                ...node.data.metadata,
                                response,
                            }
                        }
                    };
                }
                return node;
            });
            return { ...state, nodes: [...updatedNode] }
        case REMOVE_API_RESPONSE:
            var nodePosition = state.nodes.findIndex((n) => n.id == id);
            if (nodePosition == -1) return state;
            const removedAPIResponseNode = state.nodes.map((node, index) => {
                if (index == nodePosition) {
                    return {
                        ...node,
                        data: {
                            ...node.data,
                            metadata: {
                                ...node.data.metadata,
                                response: undefined,
                            }
                        }
                    };
                }
                return node;
            })
            return { ...state, nodes: removedAPIResponseNode }
        case ADD_RESPONSE_PARAMS:
            var nodePosition = state.nodes.findIndex((n) => n.id == id?.toString());
            if (nodePosition == -1) return state;
            const updatedResponseParamNodes = state.nodes.map((node, index) => {
                if (index === nodePosition) {
                    return {
                        ...node,
                        data: {
                            ...node.data,
                            assertion: {
                                ...node.data.assertion,
                                postResponseAssertion: [
                                    ...(node.data.assertion?.postResponseAssertion || []),
                                    params
                                ]
                            }
                        }
                    };
                }
                return node;
            });
            return { ...state, nodes: updatedResponseParamNodes }
        case REMOVE_RESPONSE_PARAMS:
            return {
                ...state,
                nodes: state.nodes.map(node =>
                    node.id === state.current
                        ? {
                            ...node,
                            data: {
                                ...node.data,
                                assertion: {
                                    ...node.data.assertion,
                                    postResponseAssertion: node.data.assertion?.postResponseAssertion
                                        ? node.data.assertion.postResponseAssertion.filter((_, index) => index !== paramPosition)
                                        : []
                                }
                            }
                        }
                        : node
                )
            };
        case UPDATE_RESPONSE_PARAMS:
            return {
                ...state,
                nodes: state.nodes.map(node => node.id === state.current ? {
                    ...node,
                    data: {
                        ...node.data,
                        assertion: {
                            ...node.data.assertion,
                            postResponseAssertion: node.data.assertion?.postResponseAssertion.map((assertion, index) => {
                                if (index == paramPosition)
                                    return params;
                                return assertion;
                            })
                        }
                    }
                } : node)
            }
        case ADD_COMPLETION_RATE:
            return {
                ...state,
                nodes: state.nodes.map(node => node.id === id ? {
                    ...node,
                    data: {
                        ...node.data,
                        completion: rate,
                    }
                } : node)
            }
        case CLEAR_COMPLETION_RATE:
            return {
                ...state,
                nodes: state.nodes.map(node => node.id === id ? {
                    ...node,
                    data: {
                        ...node.data,
                        completion: 0,
                    }
                } : node)
            }
        case CLEAR_COMPLETION_RATE_LISTS:
            return {
                ...state,
                nodes: state.nodes.map(node => {
                    const idFound = ids?.findIndex(id => id == node.id)
                    if (idFound > -1)
                        node.data.completion = 0;
                    return node;
                })
            }
        case REMOVE_INITIATING_NODES:
            return {
                ...state,
                nodes: state.nodes.filter(node => node.data.status != NodeStatus.INITIATING)
            }
        case ADD_MAPPERS:
            return {
                ...state,
                mappers: {
                    ...state.mappers,
                    [source]: mappers,
                },
            };
        case REMOVE_MAPPER:
            const currentMapper = JSON.parse(JSON.stringify(state.mappers));
            delete currentMapper[source]
            return {
                ...state,
                mappers: { ...currentMapper }
            }
        case ADD_PREDECESSOR_EDGE:
            return {
                ...state,
                predecessorEdge: { source, target }
            }
        case REMOVE_PREDECESSOR_EDGE:
            return {
                ...state,
                predecessorEdge: null,
            }
        default:
            return state;
    }
}

export default nodesReducer;