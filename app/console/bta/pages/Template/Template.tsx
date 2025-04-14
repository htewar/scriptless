import { DndProvider } from "react-dnd";
import { Draft, OutputPanel, Panel } from "./container";
import { HTML5Backend } from "react-dnd-html5-backend";
import { ReactFlowProvider } from "reactflow";
import { FC, useEffect, useState } from "react";
import { BarberPole, Icon } from "../../components";
import { connect } from "react-redux";
import { RootState } from "../../types";
import { Dispatch } from "redux";
import { setDraftLoader, toggleTerminalDisplay } from "../../redux/actions/utils.action";
import Chat from "../../components/organisms/chat/Chat";

interface TemplateProps {
    showOPPanel: boolean,
    loader: boolean,
    dispatch: Dispatch,
}

const Template: FC<TemplateProps> = ({ showOPPanel, loader, dispatch }) => {
    const [isChatPanelOpen, setIsChatPanelOpen] = useState(false);

    useEffect(() => {
        dispatch(setDraftLoader({ loader: false }))
        dispatch(toggleTerminalDisplay({ isInvert: false }))
    }, [])

    const onToggleShowPanel = () => dispatch(toggleTerminalDisplay())
    const onToggleChatPanel = () => setIsChatPanelOpen(!isChatPanelOpen)

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
        
        {/* Chat Panel Toggle Button */}
        <button 
            onClick={onToggleChatPanel}
            className="fixed top-40 right-6 p-2 text-white rounded-lg shadow-lg
            bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 
            hover:from-blue-600 hover:via-purple-600 hover:to-pink-600
            transition-all duration-300 hover:shadow-[0_0_20px_rgba(168,85,247,0.5)] 
            hover:scale-105 tracking-wide"
        >
            AI Agent
        </button>

        {/* Chat Panel */}
        <div className={`fixed right-0 top-0 h-full w-[400px] bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-40 ${isChatPanelOpen ? 'translate-x-0' : 'translate-x-full'}`}>
            <div className="h-full flex flex-col">
                <div className="p-4 border-b flex justify-between items-center">
                    <h2 className="text-lg font-semibold">AI Agent</h2>
                    <div className="flex items-center gap-2">
                        <button 
                            onClick={onToggleChatPanel} 
                            className="p-1 bg-gray-900 rounded transition-transform duration-300"
                        >
                            <Icon name="Close" />
                        </button>
                    </div>
                </div>
                <div className="flex-1 overflow-hidden">
                    <Chat />
                </div>
            </div>
        </div>
    </section>
}

const mapStateToProps = ({ utils }: RootState) => ({
    showOPPanel: utils.isTerminalDisplayed,
    loader: utils.draftLoader,
})

export default connect(mapStateToProps)(Template);