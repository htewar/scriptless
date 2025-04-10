import { FC, useEffect, useState } from "react";
import { connect } from "react-redux";

import { RootState, PanelProps } from "../../../../types";
import { DeleteInitiatingNodes } from "../../../../redux/actions/nodes.action";
import { Node as NodeComponent } from "../../../../components";
import { DATA, SELECTIONS } from "../../data";
import SelectionPanel from "./container/SelectionPanel";
import General from "./container/General";
import NodePanel from "./container/NodePanel";

const Panel: FC<PanelProps> = ({ dispatch, isNodeSelected, connections, preEdge }) => {
    const rows = [...Array(Math.ceil(DATA.nodes.length / 2))]
    const nodeRows = rows.map((_, index) => DATA.nodes.slice(index * 2, index * 2 + 2))
    const [currentSelection, setCurrentSelection] = useState<string>(DATA.SELECTION_LISTS[0].name)

    useEffect(() => {
        dispatch(DeleteInitiatingNodes())
    }, [])

    useEffect(() => {
        if (isNodeSelected)
            setCurrentSelection(DATA.NODEPROP_LISTS[0].name)
        else setCurrentSelection(DATA.SELECTION_LISTS[0].name)
    }, [isNodeSelected])

    const onHandleSelect = (selectedSelection: string) => {
        setCurrentSelection(selectedSelection)
    }

    const NodeLists = nodeRows.map((row, index) => (
        <div className="row" key={index}>
            {row.map((node, idx) => (
                <div className="col-1-of-2" key={`${index}-${idx}`}>
                    <NodeComponent id={node.id} iconName={node.icon} nodeName={node.node} />
                </div>
            ))}
        </div>
    ))

    const isCurrentSelection = (selection?: string): boolean => {
        if (selection)
            return currentSelection === selection;
        return [SELECTIONS.PARAMETERS, SELECTIONS.ASSERTIONS, SELECTIONS.MODIFIERS].includes(currentSelection);
    }

    return <div className="template__panel">
        <SelectionPanel
            selections={isNodeSelected ? DATA.NODEPROP_LISTS : DATA.SELECTION_LISTS}
            currentSelection={currentSelection}
            onHandleSelection={onHandleSelect}
            params={[
                { connections },
                { id: isNodeSelected },
                { preEdge }
            ]}
        />
        {isCurrentSelection(SELECTIONS.COMPONENTS) && <div className="template__nodeLists">{NodeLists}</div>}
        {isCurrentSelection(SELECTIONS.SETTINGS) && <General />}
        {isCurrentSelection() && <NodePanel currentNodeID={isNodeSelected} isCurrentSelection={isCurrentSelection} />}
    </div>
}

const mapStateToProps = ({ nodes }: RootState) => ({
    isNodeSelected: nodes.current,
    connections: nodes.edges,
    preEdge: nodes.predecessorEdge,
})

export default connect(mapStateToProps)(Panel);