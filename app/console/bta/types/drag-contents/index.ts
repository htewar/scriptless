import { CSSProperties } from "react";
import { AssertionParams, MetadataState } from "../pages";

export type DraggableItem = {
    itemId: string;
}

export enum NodeStatus {
    INITIATING = "INITIATING",
    IDLE = "IDLE",
    PROCESSING = "PROCESSING",
    SUCCESS = "SUCCESS",
    ERROR = "ERROR",
}

export type CustomNodeData = {
    identifier: string;
    label: string;
    icon: string;
    iconProperties?: CSSProperties;
    completion?: number;
    status: NodeStatus;
    metadata?: MetadataState;
    assertion?: AssertionParams;
}