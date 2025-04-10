import { FC, useEffect, useState } from "react";
import OPHeader from "./container/OPHeader";
import OPTerminal from "./container/OPTerminal";
import OPScripts from "./container/OPScripts";

interface OutputPanelProps {
    isShown: boolean;
    onHandleHeaderClose: () => void;
}

type OPSelection = "Terminal" | "Scripts"

const OutputPanel: FC<OutputPanelProps> = ({ isShown, onHandleHeaderClose }) => {
    const [currentSelection, setCurrentSelection] = useState<OPSelection>("Terminal")

    const onHeaderClick = (header: OPSelection) => {
        setCurrentSelection(header)
    }
    
    return <div className={`template__outputPanel ${isShown ? "template__outputPanel--shown" : "template__outputPanel--hidden"}`}>
        <OPHeader currentSelection={currentSelection} onHandleHeaderClose={onHandleHeaderClose} onHeaderClick={onHeaderClick} />
        {currentSelection == "Terminal" && <OPTerminal />}
        {currentSelection == "Scripts" && <OPScripts />}
    </div>
}

export default OutputPanel;