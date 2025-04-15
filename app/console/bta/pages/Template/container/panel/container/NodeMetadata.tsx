import { ChangeEvent, FC, Fragment, useState } from "react";
import { InputGroup, KVLists } from "../../../../../components";
import {
    InputGroupVariant,
    InputType,
    NodeMetadataProps,
    InputGroupLanguage,
    DropdownFnParams,
    NodeStatus,
    ProcessNode,
    BODYTYPE,
} from "../../../../../types";
import UploadContainer from "./UploadContainer";

const NodeMetadata: FC<NodeMetadataProps> = ({
    nodes,
    selectedNode,
    onAddNodeName,
    onAddMetadata,
    onAddQueryParam,
    onAddHeaderParam,
    onAddURLEncodedParam,
    onDeleteHeaderParam,
    onDeleteQueryParam,
    onDeleteURLEncodedParam,
    onHandlePredecessorEdge
}) => {
    const [isURLEncodedEnabled, setIsURLEncodedEnabled] = useState<boolean>(false);
    const [isQueryEnabled, setIsQueryEnabled] = useState<boolean>(false);
    const [isHeaderEnabled, setIsHeaderEnabled] = useState<boolean>(false);

    const onToggleQuery = () => setIsQueryEnabled(prevState => !prevState);
    const onToggleHeader = () => setIsHeaderEnabled(prevState => !prevState);
    const onToggleURLEncoded = () => setIsURLEncodedEnabled(prevState => !prevState);

    const onAddNodeFileData = (node: ProcessNode) => {
        const { name, url, method, payload, payloadType, headers, queryParams } = node;
        onAddNodeName({ target: { value: name || "" } } as ChangeEvent<HTMLInputElement>)
        onAddMetadata("url", { target: { value: url || "" } } as ChangeEvent<HTMLInputElement>)
        onAddMetadata("method", { target: { value: method } } as ChangeEvent<HTMLInputElement>)
        onAddMetadata("bodyType", { target: { value: payloadType || BODYTYPE.NONE } } as ChangeEvent<HTMLInputElement>)
        onAddMetadata("body", { target: { value: payload } } as ChangeEvent<HTMLInputElement>)
        headers?.forEach(header => onAddHeaderParam(header));
        queryParams?.forEach(param => onAddQueryParam(param));
    }

    return <div className="template__nodemetadata">
        <div className="template__params">
            {selectedNode?.data.status == NodeStatus.INITIATING && <UploadContainer onHandleAddNodeFileData={onAddNodeFileData} />}
            <a href="https://www.google.com">google</a>
            <div className="u-margin-top-10">
                <InputGroup
                    title="Node Name"
                    placeholder=""
                    mandatory={true}
                    variant={InputGroupVariant.Primary}
                    value={selectedNode?.data.label || ""}
                    onHandleInput={onAddNodeName}
                />
                {nodes.length > 1 && selectedNode?.data.status == NodeStatus.INITIATING && <InputGroup
                    title="Predecessor Connection"
                    type={InputType.Dropdown}
                    contents={nodes.filter(node => node.id != selectedNode?.id) || []}
                    location="data.label"
                    variant={InputGroupVariant.Primary}
                    // value={nodes.find(node => node.id == edge?.source)}
                    onHandleDropdown={onHandlePredecessorEdge}
                    className="header__popupInput"
                    filter={false}
                />}
                <InputGroup
                    title="URL"
                    mandatory={true}
                    placeholder="https://"
                    variant={InputGroupVariant.Primary}
                    value={selectedNode?.data.metadata?.url || ""}
                    onHandleInput={(params: ChangeEvent<HTMLInputElement>) => onAddMetadata('url', params)}
                />
                <InputGroup
                    title="HTTP Method"
                    type={InputType.Dropdown}
                    placeholder=""
                    mandatory={true}
                    variant={InputGroupVariant.Primary}
                    contents={['DELETE', 'GET', 'PATCH', 'POST', 'PUT']}
                    filter={false}
                    value={selectedNode?.data.metadata?.method || ""}
                    onHandleDropdown={(params: DropdownFnParams<string>) => onAddMetadata('method', params as ChangeEvent<HTMLInputElement>)}
                />
                {selectedNode?.data.metadata?.method != "GET" &&
                    <Fragment>
                        <InputGroup
                            title="Request Type"
                            type={InputType.Dropdown}
                            placeholder=""
                            mandatory={true}
                            variant={InputGroupVariant.Primary}
                            contents={['None', 'Body Raw JSON', 'x-www-form-urlencoded']}
                            filter={false}
                            value={selectedNode?.data.metadata?.bodyType || ""}
                            onHandleDropdown={(params: DropdownFnParams<string>) => onAddMetadata('bodyType', params as ChangeEvent<HTMLInputElement>)}
                        />
                        {selectedNode?.data.metadata?.bodyType == BODYTYPE.BODYJSON && <InputGroup
                            title="Body"
                            type={InputType.Editor}
                            variant={InputGroupVariant.Primary}
                            language={InputGroupLanguage.JSON}
                            value={selectedNode?.data.metadata?.body || ""}
                            onHandleDropdown={(params: DropdownFnParams<string>) => onAddMetadata("body", params as ChangeEvent<HTMLInputElement>)}
                        />}
                        {selectedNode?.data.metadata?.bodyType == BODYTYPE.XFORMURLENCODED && <KVLists
                            title="URL Encoded Parameters"
                            lists={selectedNode?.data.metadata?.body || []}
                            isEnabled={isURLEncodedEnabled}
                            onToggleEnablement={onToggleURLEncoded}
                            onAddParameter={onAddURLEncodedParam}
                            onDeleteParameter={onDeleteURLEncodedParam}
                        />}
                    </Fragment>}
                <KVLists
                    title="Query Parameters"
                    lists={selectedNode?.data.metadata?.params || []}
                    isEnabled={isQueryEnabled}
                    onToggleEnablement={onToggleQuery}
                    onAddParameter={onAddQueryParam}
                    onDeleteParameter={onDeleteQueryParam}
                />
                <KVLists
                    title="Header Parameters"
                    lists={selectedNode?.data.metadata?.headers || []}
                    isEnabled={isHeaderEnabled}
                    onToggleEnablement={onToggleHeader}
                    onAddParameter={onAddHeaderParam}
                    onDeleteParameter={onDeleteHeaderParam}
                />
            </div>
        </div>
    </div>
}

export default NodeMetadata;