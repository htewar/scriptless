import { UtilsAction, UtilsState } from "../../types";
import { ADD_MESSAGE, CLEAR_DISPLAYED_MESSAGES, REMOVE_MESSAGE, SET_DRAFT_LOADER, TERMINAL_DISPLAY_MESSAGE, TOGGLE_TERMINAL_DISPLAY } from "../actions/utils.action";

const utilsReducerDefaultState: UtilsState = {
    loaderState: false,
    isTerminalDisplayed: false,
    draftLoader: false,
    terminalDisplayMessages: [],
    messages: []
};



const utilsReducer = (
    state: UtilsState = utilsReducerDefaultState,
    { type, isInvert, message, count, loader, info }: UtilsAction
) => {
    switch (type) {
        case TOGGLE_TERMINAL_DISPLAY:
            if (isInvert != undefined) {
                return { ...state, isTerminalDisplayed: isInvert }
            }
            return { ...state, isTerminalDisplayed: !state.isTerminalDisplayed }
        case TERMINAL_DISPLAY_MESSAGE:
            if (state.terminalDisplayMessages?.length > 0)
                return { ...state, terminalDisplayMessages: [...state.terminalDisplayMessages, message] }
            return { ...state, terminalDisplayMessages: [message] }
        case CLEAR_DISPLAYED_MESSAGES:
            return { ...state, terminalDisplayMessages: state.terminalDisplayMessages.slice(count) }
        case SET_DRAFT_LOADER:
            if (typeof loader == "boolean")
                return { ...state, draftLoader: loader }
            return { ...state, draftLoader: !state.draftLoader }
        case ADD_MESSAGE:
            return { ...state, messages: [...state.messages, info] };
        case REMOVE_MESSAGE:
            let messages = state.messages.slice();
            messages.splice(0, 1);
            return { ...state, messages };
        default:
            return state;
    }
};

export default utilsReducer;