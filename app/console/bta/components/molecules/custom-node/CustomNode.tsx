import { FC } from "react"
import { CustomNodeData, RootState, TextVariant, TitleVariant } from "../../../types";
import { Icon, StatusIndicator, Text, Title } from "../../atoms";
import { Handle, HandleType, Position } from "reactflow";
import { DATA } from "../../../pages/Template/data";
import { connect } from "react-redux";

interface CustomNodeProps {
    data: CustomNodeData;
    current: string | null;
    id: string | null;
}

const CustomNode: FC<CustomNodeProps> = ({ data, current, id }) => {
    const { identifier, icon, label, completion, status } = data;
    const node = DATA.nodes.find(node => node.id == identifier)
    const handles = node?.handles;
    const iconProps = node?.iconProperties;
    const addedClass: string = `template__handle--${status}`;
    return <div className="customNode">
        {!!handles && !!handles.length && handles.map((handle, index) => <div key={index}>
            <Handle
                className={`template__handle template__handle--${handle.position} ${addedClass.toLowerCase()}`}
                type={handle.type as HandleType}
                position={handle.position as Position}
            />
        </div>
        )}
        <div className={`customNode__contents ${id == current? "customNode__contents--current" : ""}`}>
            <div className="customNode__header">
                {icon && <div><Icon name={icon} {...iconProps} /></div>}
                <Text variant={TextVariant.InterBold101}>{label}</Text>
            </div>
            <div className="customNode__body">
                <div className="customNode__body--details">
                    <Text variant={TextVariant.InterBold101}>Details</Text>
                    <Icon name="RightUpperArrow" />
                </div>
                <StatusIndicator progress={completion} />
                <div className="customNode__body--status">
                    <Text variant={TextVariant.InterBold101}>{`${completion || 0}% Done`}</Text>
                    <div className={`customNode__statusDetails customNode__statusDetails--${status.toLowerCase()}`}>
                        <Title variant={TitleVariant.InterBlack71}>{status}</Title>
                    </div>
                </div>
            </div>
        </div>
    </div>
}

const mapStateToProps = ({ nodes }: RootState) => ({
    current: nodes.current
})

export default connect(mapStateToProps)(CustomNode);