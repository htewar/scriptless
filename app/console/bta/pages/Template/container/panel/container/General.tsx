import { FC, Fragment, useState } from "react";
import { Button, KVLists } from "../../../../../components";
import { ButtonVariant } from "../../../../../types";

const General: FC = () => {
    const [generalSettings, setGeneralSettings] = useState({})
    return <Fragment>
        <div className="template__assertion">
            <KVLists
                title="Authentication"
                lists={[]}
                isEnabled={false}
                onToggleEnablement={() => { }}
                onAddParameter={() => { }}
                onDeleteParameter={() => { }}
            />
            <KVLists
                title="Headers"
                lists={[]}
                isEnabled={false}
                onToggleEnablement={() => { }}
                onAddParameter={() => { }}
                onDeleteParameter={() => { }}
            />
            <KVLists
                title="Environment Variables"
                lists={[]}
                isEnabled={false}
                onToggleEnablement={() => { }}
                onAddParameter={() => { }}
                onDeleteParameter={() => { }}
            />
        </div>
        <div className="template__paramActions">
            <Button
                className="u-margin-top-10 u-width-100"
                variant={ButtonVariant.Primary}
                content="Save Settings"
                disabled={true}
                onButtonClick={() => { }}
            />
        </div>
    </Fragment>
}

export default General;