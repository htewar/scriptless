import { FC, useEffect, useState } from "react";
import { Button, Icon, Image, Title } from "../../atoms";
import { ButtonVariant, CustomNodeData, HeaderProps, InputGroupVariant, InputType, NodeStatus, RootState, TitleVariant } from "../../../types";
import { InputGroup, Popup } from "../../molecules";
import { connect } from "react-redux";
import { AddNodeStartPoint, StartNodeExecution } from "../../../redux/actions/nodes.action";
import { Node } from "reactflow";
import { DropdownFnParams } from "../../../types/components";

const Header: FC<HeaderProps> = ({ dispatch, nodes }) => {
    const [isPlayEnabled, setIsPlayEnabled] = useState<boolean>(false);
    const [startNode, setStartNode] = useState<Node<CustomNodeData> | null>(null);

    useEffect(() => {
        setIsPlayEnabled(false);
        setStartNode(null);
    }, [])

    const onHandleSetStartNode = (e: DropdownFnParams<Node<CustomNodeData>>) => setStartNode(e.target.value);

    const onHandleSave = () => { }

    const onHandleCancelExecute = () => {
        setStartNode(null);
        onHandleExecute(false)
    }

    const onHandleExecute = (status?: boolean) => {
        if (typeof status == "boolean") setIsPlayEnabled(status)
        else setIsPlayEnabled(prevState => !prevState)
    }

    const executeNode = (id: string) => {
        dispatch(AddNodeStartPoint(id));
        dispatch(StartNodeExecution({ type: "TEXEC" }));
    }

    const onHandleNodeStart = () => {
        if (startNode) executeNode(startNode.id)
        onHandleExecute(false);
    }

    const onPressExecuteButton = () => {
        if (nodes.length == 1) executeNode(nodes[0].id)
        else onHandleExecute(true)
    }

    return <div className="header">
        {isPlayEnabled && <Popup onClosePopup={onHandleExecute} title="Execution Start Point" className="header__popupWrapper">
            <div className="header__popupBody">
                <InputGroup
                    title="Start Node"
                    type={InputType.Dropdown}
                    contents={nodes || []}
                    location="data.label"
                    variant={InputGroupVariant.Primary}
                    onHandleDropdown={onHandleSetStartNode}
                    className="header__popupInput"
                    filter={false}
                />
                <div className="header__popupAction">
                    <Button content="Cancel" variant={ButtonVariant.DeleteSmall} onButtonClick={onHandleCancelExecute} />
                    <Button content="Execute" variant={ButtonVariant.PrimarySmall} onButtonClick={onHandleNodeStart} />
                </div>
            </div>
        </Popup>}
        <div>
            <div className="header__titleWrapper">
                <Icon name="Logo" />
                <Title variant={TitleVariant.PSBold18}>Scriptless Automation</Title>
            </div>
        </div>
        <div className="header__rightWrapper">
            <div className="u-cursor-pointer">
                {!!nodes.length && <Icon onIconClick={onPressExecuteButton} name="Play" />}
            </div>
            <div>
                <Button content="Save" onButtonClick={onHandleSave} />
            </div>
            <div className="header__userFrame">
                <Image className="header__user" name="anonymous_user" />
            </div>
        </div>
    </div>
}

const mapStateToProps = ({ nodes }: RootState) => ({
    nodes: nodes.nodes.filter(node => node.data.identifier == "1" && node.data.status !== NodeStatus.INITIATING)
})

export default connect(mapStateToProps)(Header);