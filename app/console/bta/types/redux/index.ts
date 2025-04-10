import { Edge, Node, NodeChange } from "reactflow";
import { CustomNodeData, NodeStatus } from "../drag-contents";
import { store } from "../../redux/store/configureStore";
import { AssertionParams, BODYTYPE, HTTPMethod, PostResponseAssertionProps, PreRequestAssertionProps } from "../pages";
import { AxiosResponse } from "axios";
import { HeaderProps, KeyValueProps } from "../components";

export type Message = {
    content: string,
    type: "info" | "error" | "success",
}

export interface Mappers {
    name: string;
    value: string | number | boolean | null | {};
}

export interface UtilsState {
    loaderState: boolean,
    isTerminalDisplayed: boolean,
    draftLoader: boolean,
    terminalDisplayMessages: string[],
    messages: Message[],
}

export type UtilsAction = {
    type: string;
    isInvert?: boolean;
    loader?: boolean;
    message: string;
    count: number;
    info: Message;
}

export interface NodeState {
    current: string | null;
    predecessorEdge: { source: string, target: string } | null
    startNode: string;
    nodes: Node<CustomNodeData>[];
    edges: Edge[];
    mappers: { [nodeName: string]: Mappers[] };
}

export type NodesAction = {
    source: string;
    target: string;
    type: string;
    id?: string;
    ids: string[];
    node: Node<CustomNodeData>;
    edge: Edge;
    changes: NodeChange[];
    metadata: CustomNodeData;
    rate?: number;
    status?: NodeStatus;
    params?: PreRequestAssertionProps | PostResponseAssertionProps;
    paramPosition?: number;
    response?: AxiosResponse;
    mappers: Mappers[];
}

export type AddCurrentNodeAction = {
    id: string;
}

export type RootState = {
    nodes: NodeState,
    utils: UtilsState,
}

export interface ProcessNode {
    type?: string;
    name?: string;
    url?: string;
    method?: HTTPMethod;
    headers?: KeyValueProps[];
    queryParams?: KeyValueProps[];
    payloadType?: BODYTYPE;
    payload?: string | Record<string, any> | KeyValueProps[];
    assertions?: AssertionParams;
    metadata?: {
        position: {
            x: number;
            y: number;
        };
    }

}

export type AppDispatch = typeof store.dispatch;