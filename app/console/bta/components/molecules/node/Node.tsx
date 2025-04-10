import { FC } from "react";
import { Icon, Title } from "../../atoms";
import { DraggableItem, NodeProps, TitleVariant } from "../../../types";
import { useDrag } from "react-dnd";

const Node: FC<NodeProps> = ({ id, nodeName, iconName }) => {
    const [{ opacity }, dragRef] = useDrag<DraggableItem, void, { opacity: number }>(() => ({
        type: "block",
        item: { "itemId": id },
        collect: (monitor) => ({
            opacity: monitor.isDragging() ? 0.5 : 1
        })
    }), [])
    return <div className="node" ref={dragRef} style={{ opacity }}>
        <Icon name={iconName} />
        <Title variant={TitleVariant.InterBold141}>{nodeName}</Title>
    </div>
}

export default Node;