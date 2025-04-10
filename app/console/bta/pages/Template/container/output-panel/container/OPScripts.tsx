import { FC } from "react";
import { connect } from "react-redux";
import { Button } from "../../../../../components";
import { ButtonVariant, RootState } from "../../../../../types";
import { AnyAction, Dispatch } from "redux";
import { processScriptsToJSON } from "../../../../../redux/actions/nodes.action";
import { ThunkDispatch } from "redux-thunk";

interface OPScriptsProps {
    processScripts: () => void;
}

const OPScripts: FC<OPScriptsProps> = ({ processScripts }) => {
    const onHandleDownloadScripts = () => {
        processScripts();
    };

    return (
        <div className="template__opScripts">
            <span>
                <Button variant={ButtonVariant.Selected} content="Download Executable Script" onClick={onHandleDownloadScripts} />
            </span>
        </div>
    );
};

// Map dispatch to props
const mapDispatchToProps = (dispatch: ThunkDispatch<RootState, unknown, AnyAction>) => ({
    processScripts: () => dispatch(processScriptsToJSON()),
});

export default connect(null, mapDispatchToProps)(OPScripts);