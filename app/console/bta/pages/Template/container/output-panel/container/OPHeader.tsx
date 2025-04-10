import { FC } from "react";
import { Icon, Title } from "../../../../../components";
import { TitleVariant } from "../../../../../types";

interface OPHeaderProps {
    currentSelection: "Terminal" | "Scripts";
    onHeaderClick: (value: "Terminal" | "Scripts") => void;
    onHandleHeaderClose: () => void;
}

const OPHeader: FC<OPHeaderProps> = ({ currentSelection, onHeaderClick, onHandleHeaderClose }) => {
    return <div className="template__opHeader">
        <div className="u-display-flex">
            <div className={`template__opHeaderDisplay ${currentSelection == "Terminal" ? "template__opHeaderDisplay--selected" : ""}`} onClick={onHeaderClick.bind(this, "Terminal")}>
                <Title variant={TitleVariant.InterBold141}>Terminal</Title>
            </div>
            <div className={`template__opHeaderDisplay ${currentSelection == "Scripts" ? "template__opHeaderDisplay--selected" : ""}`} onClick={onHeaderClick.bind(this, "Scripts")}>
                <Title variant={TitleVariant.InterBold141}>Scripts</Title>
            </div>
        </div>
        <div className="template__opHeaderAction" onClick={onHandleHeaderClose}><Icon name="Close" /></div>
    </div>
}

export default OPHeader;