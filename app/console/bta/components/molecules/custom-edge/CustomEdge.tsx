import { FC, Fragment } from "react";
import { BaseEdge, EdgeProps, getSmoothStepPath } from "reactflow";
import { NodeStatus, RootState } from "../../../types";
import { useSelector } from "react-redux";

const CustomEdge: FC<EdgeProps> = (edgeProps) => {
    const nodes = useSelector((state: RootState) => state.nodes.nodes);
    const sourceNode = nodes.find(node => node.id == edgeProps.source);
    const targetNode = nodes.find(node => node.id == edgeProps.target);
    let stroke: string = "#a0ceff";
    if (sourceNode?.data.status == NodeStatus.SUCCESS && targetNode?.data.status == NodeStatus.PROCESSING)
        stroke = "#dba127";
    else if (sourceNode?.data.status == NodeStatus.SUCCESS && targetNode?.data.status == NodeStatus.SUCCESS)
        stroke = "#27AE60";
    const [d] = getSmoothStepPath({ ...edgeProps })
    return <Fragment>
        <BaseEdge style={{
            stroke,
            strokeWidth: 4,
        }} 
        markerEnd={edgeProps.markerEnd}
        path={d} 
        />
    </Fragment>
}

export default CustomEdge;