import { ChangeEvent, DragEvent, FC, useEffect, useRef, useState } from "react";
import { Button, Icon, InputGroup, Popup, Text, Title } from "../../../../../components";
import { ButtonVariant, DropdownFnParams, InputGroupVariant, InputType, ProcessNode, TextVariant, TitleVariant } from "../../../../../types";

interface UploadContainerProps {
    onHandleAddNodeFileData: (node: ProcessNode) => void;
}

const UploadContainer: FC<UploadContainerProps> = ({ onHandleAddNodeFileData }) => {
    const [collectedNodes, setCollectedNodes] = useState<ProcessNode[]>([])
    const [isNodesAdded, setIsNodesAdded] = useState<boolean>(false);
    const [selectedNode, setSelectedNode] = useState<ProcessNode | null>(null);
    const fileRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        setCollectedNodes([])
        setIsNodesAdded(false);
        setSelectedNode(null);
    }, []);

    useEffect(() => {
        if (collectedNodes.length > 1)
            onHandleClosePopup({ nxtState: true });
        setSelectedNode(null);
    }, [collectedNodes])

    const onHandleFileInput = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0)
            onHandleFile(e.target.files[0]);
    }

    const onHandleDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        onHandleFile(file);
    }

    const onHandleFile = (file: File) => {
        try {
            if (!file)
                throw { message: "error uploading file" }
            if (file.type != "application/json")
                throw { message: "only JSON files are accepted." }
            const reader = new FileReader();
            reader.onload = (e: ProgressEvent<FileReader>) => {
                if (e.target && typeof e.target.result === "string") {
                    const parsedData = JSON.parse(e.target.result);
                    if ("nodes" in parsedData) {
                        setCollectedNodes(parsedData["nodes"])
                    } else throw { message: "nodes not found in json file." }
                }
            }
            reader.readAsText(file);
        } catch (e) {
            console.log(e)
        }
    }

    const onHandleClosePopup = ({ nxtState }: { nxtState?: boolean } = {}) => {
        if (nxtState == undefined) setIsNodesAdded(prevState => !prevState);
        else setIsNodesAdded(nxtState);
    }

    const onAddNodeData = () => {
        if (selectedNode)
            onHandleAddNodeFileData(selectedNode)
        onHandleClosePopup({ nxtState: false })
    }

    const onHandleSelectNode = (nodeTarget: DropdownFnParams<ProcessNode>) => {
        const node = nodeTarget.target.value;
        setSelectedNode(node)
    }

    const onHandleFileBrowse = () => fileRef.current?.click();

    return <div className="upload-container" onDrop={onHandleDrop}>
        {isNodesAdded && <Popup title="Select Node" onClosePopup={onHandleClosePopup}>
            <div className="header__popupBody">
                <InputGroup
                    title="Node Name"
                    type={InputType.Dropdown}
                    contents={collectedNodes}
                    location="name"
                    variant={InputGroupVariant.Primary}
                    onHandleDropdown={onHandleSelectNode}
                    className="header__popupInput"
                    filter={false}
                />
                <div className="header__popupAction">
                    <Button content="Cancel" variant={ButtonVariant.DeleteSmall} onButtonClick={onHandleClosePopup} />
                    <Button content="Add" disabled={selectedNode == null} variant={ButtonVariant.PrimarySmall} onButtonClick={onAddNodeData} />
                </div>
            </div>
        </Popup>}
        <Icon name="Upload" />
        <Title className="u-margin-top-10" variant={TitleVariant.InterBlack141}>DRAG FILE HERE</Title>
        <span className="upload-container__textwidth">
            <Text variant={TextVariant.InterItalic101}>Drag and drop node metadata file here or browser your computer</Text>
        </span>
        <Button className="u-margin-top-5" variant={ButtonVariant.UploadFile} content="BROWSE FILE" onButtonClick={onHandleFileBrowse} />
        <input type="file" accept="application/json" ref={fileRef} className="u-display-none" onChange={onHandleFileInput}/>
    </div>
}

export default UploadContainer;