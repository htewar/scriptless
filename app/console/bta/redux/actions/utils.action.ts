import { Message } from "../../types";

export const TOGGLE_TERMINAL_DISPLAY = "TOGGLE_TERMINAL_DISPLAY";
export const TERMINAL_DISPLAY_MESSAGE = "TERMINAL_DISPLAY_MESSAGE";
export const CLEAR_DISPLAYED_MESSAGES = "CLEAR_DISPLAYED_MESSAGES";
export const SET_DRAFT_LOADER = "SET_DRAFT_LOADER";
export const ADD_MESSAGE = "ADD_MESSAGE";
export const REMOVE_MESSAGE = "REMOVE_MESSAGE";

export const toggleTerminalDisplay = ({ isInvert }: ToggleTerminalDisplay = {}) => ({
    type: TOGGLE_TERMINAL_DISPLAY,
    isInvert
})

interface ToggleTerminalDisplay {
    isInvert?: boolean;
}

export const displayTerminalMessage = ({ message = "" }: { message: string }) => ({
    type: TERMINAL_DISPLAY_MESSAGE,
    message,
})

export const clearDisplayedTerminalMessages = ({ count = 0 }: { count: number }) => ({
    type: CLEAR_DISPLAYED_MESSAGES,
    count,
})

export const setDraftLoader = ({ loader = false } = {}) => ({
    type: SET_DRAFT_LOADER,
    loader,
})

export const addMessage = (message: Message) => ({
    type: ADD_MESSAGE,
    info: message,
  });
  
  export const removeMessage = () => ({
    type: REMOVE_MESSAGE,
  });