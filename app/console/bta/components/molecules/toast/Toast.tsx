import { useEffect, Fragment, FC } from "react";
import { connect } from "react-redux";
import { Icon, Text } from "../../atoms";
import { RootState, TextVariant, Message } from "../../../types";
import { Dispatch } from "redux";
import { removeMessage } from "../../../redux/actions/utils.action";

interface ToastProps {
    dispatch: Dispatch,
    messages: Message[]
}

const Toast: FC<ToastProps> = ({ messages, dispatch }) => {
    useEffect(() => {
        if (messages.length) {
            setTimeout(() => {
                dispatch(removeMessage());
            }, 2000);
        }
    }, [messages]);

    const getIcon = (type: string | null) => {
        switch (type) {
            case "success":
                return "Tick";
            case "error":
                return "Error";
            case "alert":
                return "Alert";
            case "info":
                return "Info";
            default:
                return "Tick";
        }
    };

    return (
        <Fragment>
            {!!messages.length && (
                <div className="message">
                    {messages.map((info, idx) => (
                        <div
                            className={`message__container message__${info.type}`}
                            key={idx}
                        >
                            <div className="message__contents">
                                <div>
                                    <Icon
                                        className={`message__icon--${getIcon(info.type)}`}
                                        name={getIcon(info.type)}
                                    />
                                </div>
                                <Text variant={TextVariant.InterMedium141}>{info.content}</Text>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </Fragment>
    );
};

const mapStateToProps = ({utils}: RootState) => ({
    messages: utils.messages,
});

export default connect(mapStateToProps)(Toast);