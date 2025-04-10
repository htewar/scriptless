import { FC, useEffect, useRef, useState } from "react";
import { connect } from "react-redux";
import { RootState } from "../../../../../types";
import { Dispatch } from "redux";
import { clearDisplayedTerminalMessages } from "../../../../../redux/actions/utils.action";

interface OPTerminalProps {
    messages: string[];
    dispatch: Dispatch;
}

const OPTerminal: FC<OPTerminalProps> = ({ messages, dispatch }) => {
    const terminalRef = useRef<HTMLDivElement | null>(null);
    const terminalInstance = useRef<any>(null);
    const [commandBuffer, setCommandBuffer] = useState<string>("");

    useEffect(() => {
        const initTerminal = async () => {
            const { Terminal } = await import("xterm");
            if (terminalRef.current) {
                terminalInstance.current = new Terminal({
                    cursorBlink: true,
                    rows: 13,
                    theme: {
                        background: "#F3F5F5",
                        foreground: "#000",
                        cursor: "black",
                    },
                });

                terminalInstance.current.open(terminalRef.current);
                terminalInstance.current.write("Welcome to scriptless automation. Type $help to know more \r\n");
                terminalInstance.current.write("> ");
                terminalInstance.current.onData((data: string) => onHandleProcessInput(data));
            }
        };

        initTerminal();

        return () => {
            terminalInstance.current?.dispose();
        };
    }, []);

    useEffect(() => {
        if (messages?.length > 0) {
            messages.forEach((message) => {
                const formattedMessage = formatJsonForXterm(message);
                terminalInstance.current?.write(`${formattedMessage}\r\n`);
                terminalInstance.current?.write("> ");
            });
            dispatch(clearDisplayedTerminalMessages({ count: messages.length }));
        }
    }, [messages, dispatch]);

    const formatJsonForXterm = (jsonString: string) => {
        try {
            const parsed = JSON.parse(jsonString);
            return JSON.stringify(parsed, null, 2)
                .replace(/\n/g, "\r\n")
                .replace(/ {2}/g, "  ");
        } catch (e) {
            return jsonString;
        }
    };

    const onHandleProcessInput = (input: string) => {
        if (input === "\r") {
            setCommandBuffer("");
            terminalInstance.current?.write("\r\n");
            terminalInstance.current?.write("> ");
        } else if (input === "\u007F") {
            setCommandBuffer((prevState) => prevState.slice(0, -1));
            terminalInstance.current?.write("\b \b");
        } else {
            setCommandBuffer((prevState) => prevState + input);
            terminalInstance.current?.write(input);
        }
    };

    return <div ref={terminalRef} style={{ height: "238px", width: "100%", overflow: "hidden" }} />;
};

const mapStateToProps = ({ utils }: RootState) => ({
    messages: utils.terminalDisplayMessages,
});

export default connect(mapStateToProps)(OPTerminal);