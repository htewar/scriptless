import { DndProvider } from "react-dnd";
import { Draft, OutputPanel, Panel } from "./container";
import { HTML5Backend } from "react-dnd-html5-backend";
import { ReactFlowProvider } from "reactflow";
import { FC, useEffect } from "react";
import { BarberPole, Icon } from "../../components";
import { connect } from "react-redux";
import { RootState } from "../../types";
import { Dispatch } from "redux";
import { setDraftLoader, toggleTerminalDisplay } from "../../redux/actions/utils.action";

interface TemplateProps {
    showOPPanel: boolean,
    loader: boolean,
    dispatch: Dispatch,
}

const Template: FC<TemplateProps> = ({ showOPPanel, loader, dispatch }) => {
    useEffect(() => {
        dispatch(setDraftLoader({ loader: false }))
        dispatch(toggleTerminalDisplay({ isInvert: false }))
    }, [])

    const onToggleShowPanel = () => dispatch(toggleTerminalDisplay())
    return <section className="section-template">
        <DndProvider backend={HTML5Backend}>
            <Panel />
            <div className="template__draft">
                {/* This will show loader in barberpole style when a component is dragged to the draft page */}
                <BarberPole isActive={loader} />
                <ReactFlowProvider>
                    <Draft />
                </ReactFlowProvider>
            </div>
        </DndProvider>
        <span className="template__panelStatus" onClick={onToggleShowPanel}><Icon name="Code" /></span>
        <OutputPanel isShown={showOPPanel} onHandleHeaderClose={onToggleShowPanel} />
    </section>
}

const mapStateToProps = ({ utils }: RootState) => ({
    showOPPanel: utils.isTerminalDisplayed,
    loader: utils.draftLoader,
})

export default connect(mapStateToProps)(Template);