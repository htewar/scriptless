import { Dispatch } from "redux"
import { CustomNodeData } from "../drag-contents";
import { Edge, Node } from "reactflow";
import { DropdownFnParams, KeyValueProps, KVCallback, MapperType } from "../components";
import { AxiosResponse, HttpStatusCode } from "axios";
import { ChangeEvent } from "react";

export type DraftProps = {
    dispatch: Dispatch;
    nodes: Node<CustomNodeData>[];
    edges: Edge[];
}

export type PanelProps = {
    isNodeSelected: string | null;
    connections: Edge[];
    preEdge: { source: string, target: string } | null;
    dispatch: Dispatch;
}

export type NodeMetadataProps = {
    nodes: Node<CustomNodeData>[];
    selectedNode: Node<CustomNodeData> | null;
    onAddNodeName: (e: ChangeEvent<HTMLInputElement>) => void;
    onAddMetadata: (key: string, e: ChangeEvent<HTMLInputElement>) => void;
    onAddQueryParam: (param: KeyValueProps, cb?: KVCallback) => void;
    onAddHeaderParam: (param: KeyValueProps, cb?: KVCallback) => void;
    onAddURLEncodedParam: (param: KeyValueProps, cb?: KVCallback) => void;
    onDeleteQueryParam: (index: number) => void;
    onDeleteHeaderParam: (index: number) => void;
    onDeleteURLEncodedParam: (index: number) => void;
    onHandlePredecessorEdge: (node: DropdownFnParams<Node<CustomNodeData>>) => void;
    onClearQueryParams?: () => void;
    onClearHeaderParams?: () => void;
    onSetQueryParams?: (params: KeyValueProps[]) => void;
    onSetHeaderParams?: (headers: KeyValueProps[]) => void;
    onUpdateNodeFromCurl?: (data: { url: string; method: string; queryParams: KeyValueProps[]; headers: KeyValueProps[] }) => void;
}

export type NodeParams = {
    name: string;
    metadata: MetadataState;
}

export type MetadataState = {
    method?: HTTPMethod,
    bodyType: BODYTYPE,
    body?: string | KeyValueProps[],
    url: string,
    params: KeyValueProps[],
    headers: KeyValueProps[],
    response?: AxiosResponse,
}

export enum BODYTYPE {
    NONE = "None",
    BODYJSON = "Body Raw JSON",
    XFORMURLENCODED = "x-www-form-urlencoded",
}

export enum HTTPMethod {
    GET = "GET",
    PUT = "PUT",
    PATCH = "PATCH",
    POST = "POST",
    DELETE = "DELETE",
}

export type ComparisonType = {
    Equal: "==",
    NotEqual: "!=",
    GreaterThan: ">",
    GreaterThanOrEqualTo: ">=",
    LessThan: "<",
    LessThanOrEqualTo: "<=",
}

export type AssertionParams = {
    preRequestAssertion: PreRequestAssertionProps[];
    postResponseAssertion: PostResponseAssertionProps[];
}

export type MappingKey = "typeConversion" | "codeConversion" | "";

export type ParameterPlacementKey = "Body" | "Query" | "Response" | "Route" | "Header" | "";

export type AssertionCondition = "Not Nil" | "Not Empty" | "Greater Than" | "Greater Than OR Equal To" | "Equal To" | "Less Than" | "Less Than OR Equal To" | "";

export type AssertionType = "Status Assertion" | "Response Assertion" | "Headers Assertion" | "";

export type Mapping = {
    key: MappingKey;
    value: string;
}

export type MappingError = {
    key: string;
    value: string;
}

export type PreRequestAssertionProps = {
    type: MapperType;
    currentKey: string;
    paramPosition: ParameterPlacementKey;
    prevActionKey: string;
    prevParamPosition: ParameterPlacementKey;
    prevNodeName?: Node<CustomNodeData>;
    mapping: Mapping;
    updateIndex?: number | null;
    isSelected?: boolean;
    isDataMapping: boolean;
    onAssertionClick?: () => void;
}

export type PreRequestAssertionError = {
    currentKey?: string;
    paramPosition?: string;
    prevActionKey?: string;
    prevParamPosition?: string;
    prevNodeName?: string;
    mapping?: MappingError;
}

export type PostResponseAssertionProps = {
    type: AssertionType;
    key: string;
    condition: AssertionCondition;
    value?: any;
}

export type HttpStatus = {
    code: HttpStatusCode;
    message: string;
}