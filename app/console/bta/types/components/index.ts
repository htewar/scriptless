import React, { ChangeEvent, ChangeEventHandler, CSSProperties, ReactNode } from "react"
import { Edge, Node } from "reactflow";
import { CustomNodeData } from "../drag-contents";
import { AnyAction } from "redux";
import { RootState } from "../redux";
import { ThunkDispatch } from "redux-thunk";
import { PreRequestAssertionError, PreRequestAssertionProps } from "../pages";

export enum TitleVariant {
    Primary = "primary",
    Secondary = "secondary",
    Tertiary = "tertiary",
    PSBold18 = "psb-18",
    InterBold141 = "ib-14-1",
    InterSemiBold121 = "isb-12-1",
    InterSemiBold122 = "isb-12-2",
    InterSemiBold141 = "isb-14-1",
    InterSemiBold91 = "isb-9-1",
    InterSemiBold92 = "isb-9-2",
    InterBlack71 = "ibl-7-1",
    InterBlack141 = "ibl-14-1",
}

export enum ButtonVariant {
    Primary = "primary",
    Selection = "selection",
    Selected = "selected",
    Success = "success",
    Delete = "delete",
    UploadFile = "upload-file",
    PrimarySmall = "primarysmall",
    DeleteSmall = "deletesmall",
    Update = "update",
}

export enum ImageType {
    JPEG = "jpeg",
    PNG = "png",
    BINARY = "binary",
}

export enum TextVariant {
    InterRegular101 = "ir-10-1",
    InterRegular141 = "ir-14-1",
    InterRegular181 = "ir-18-1",
    InterRegular182 = "ir-18-2",
    InterBold101 = "ib-10-1",
    InterItalic101 = "ii-10-1",
    InterMedium141 = "im-14-1",
    InterBold81 = "ib-8-1",
    PublicSansLight141 = "psl-14-1",
    PublicSansLight142 = "psl-14-2",
}

export enum InputVariant {
    Primary = "primary",
}

export enum InputGroupVariant {
    Primary = "primary",
}

export type TitleProps = {
    variant?: TitleVariant;
    children: ReactNode;
    style?: CSSProperties;
    className?: string;
    onTitleClick?: () => void;
}

export enum InputType {
    Input = "input",
    Dropdown = "dropdown",
    Editor = "editor",
}

export type TextProps = {
    variant: TextVariant;
    children: ReactNode;
    style?: CSSProperties;
    className?: string;
}

export type IconProps = {
    name: String;
    onIconClick?: () => void;
    [key: string]: any;
}

export type ButtonProps = {
    variant?: ButtonVariant;
    content: ReactNode;
    onButtonClick?: () => void;
    className?: string;
    icon?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>

export type ImageProps = {
    name: string;
    className?: string;
    onIconClick?: () => void;
    type?: ImageType;
}

export type NodeProps = {
    id: string;
    nodeName: string;
    iconName: string;
}

export type SelectionProps = {
    selections: {name: string, fn: ((...args: any[]) => any) | null;}[];
    params?: Record<string, any>[];
    currentSelection?: string;
    onHandleSelection?: (selection: string) => void;
}

export type InputProps = {
    onHandleText?: ChangeEventHandler<HTMLInputElement>;
    variant: InputVariant;
    content?: ReactNode;
    placeholder?: string;
    className?: string;
    refCallback?: (ref: HTMLInputElement | null) => void;
} & React.InputHTMLAttributes<HTMLInputElement>

export type InputGroupProps<T> = {
    type?: InputType;
    title: string;
    variant: InputGroupVariant;
    contents?: T[];
    value?: T;
    filter?: boolean;
    className?: string;
    location?: string;
    language?: InputGroupLanguage;
    error?: string;
    mandatory?: boolean;
    onHandleInput?: ChangeEventHandler<HTMLInputElement>;
    onHandleDropdown?: (value: DropdownFnParams<T>) => void;
} & React.InputHTMLAttributes<HTMLInputElement>

export enum InputGroupLanguage {
    JAVASCRIPT = "javascript",
    JSON = "json",
}

export type SelectiveInputProps<T> = {
    type?: InputType;
    title: string;
    variant: InputGroupVariant;
    contents?: T[];
    value?: T;
    filter?: boolean;
    className?: string;
    location?: string;
    isActive: boolean;
    onHandleInput?: ChangeEventHandler<HTMLInputElement>;
    onHandleDropdown?: (value: DropdownFnParams<T>) => void;
    onToggleSwitch?: () => void;
} & React.InputHTMLAttributes<HTMLInputElement>

export type SwitchProps = {
    isActive: boolean;
    onToggleSwitch?: () => void;
}

export type KVListProps = {
    isEnabled: boolean;
    title: string;
    lists: KeyValueProps[];
    onToggleEnablement?: () => void;
    onAddParameter?: (params: KeyValueProps, cb?: KVCallback) => void;
    onDeleteParameter?: (index: number) => void;
}

export type KVCallback = (isSuccess: boolean) => void;

export type KeyValueProps = {
    name: string;
    value: string;
}

export type ListProps = {
    isEnabled: boolean;
    list: KeyValueProps;
    onHandleBoxClick?: () => void;
}

export type DropdownProps<T> = {
    contents: T[];
    value?: T;
    placeholder?: string;
    onHandleDropdownValue?: (val: DropdownFnParams<T>) => void;
    className?: string;
    filter?: boolean;
    location?: string;
    disabled?: boolean;
}

export type DropdownFnParams<T> = {
    target: Target<T>
}

type Target<T> = {
    value: T
}

export type PopupProps = {
    children: ReactNode
    transition?: TransistionProps;
    onClosePopup: () => void;
    title: string;
    className?: string;
}

type TransistionProps = {
    horizontal: string | null;
    vertical: string | null;
}

export type HeaderProps = {
    dispatch: ThunkDispatch<RootState, unknown, AnyAction>,
    nodes: Node<CustomNodeData>[]
}

export type SwitchKeys = "isDataMapping";

export interface PreReqAssertionProps {
    reqParams: PreRequestAssertionProps[];
    currentParams: PreRequestAssertionProps;
    currentNode: string | null;
    isUpdate: boolean;
    updateIndex: number | null;
    nodes: Node<CustomNodeData>[];
    edges: Edge[];
    error?: PreRequestAssertionError;
    onHandleParams: (key: string, event: ChangeEvent<HTMLInputElement> | DropdownFnParams<string> | DropdownFnParams<boolean> | DropdownFnParams<Node<CustomNodeData>>) => void;
    onAddPreReqParams?: () => void;
    onHandlePreRequestEdit: (id: number) => void;
    onEditAssertion: () => void;
    onDeleteAssertion: () => void;
}

export type MapperType = "Global" | "Manual"