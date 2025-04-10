import { ButtonVariant, InputVariant, KeyValueProps, TitleVariant } from "../../../types";
import { Button, Input, Switch, Title } from "../../atoms";
import { KVListProps } from "../../../types";
import { FC, useCallback, useState } from "react";
import KVBox from "./KVBox";

const KVLists: FC<KVListProps> = ({ isEnabled, title, lists, onToggleEnablement, onAddParameter, onDeleteParameter }) => {
    const [input, setInput] = useState<KeyValueProps>({
        name: "",
        value: "",
    })

    const onHandleKV = (key: string, event: React.ChangeEvent<HTMLInputElement>) => {
        setInput(prevState => ({
            ...prevState,
            [key]: event.target.value
        }))
    }

    const hasKVPair = useCallback((): boolean => {
        return !!(input.name.length && input.value.length) && isEnabled
    }, [input.name, input.value])

    const onHandleAddParameter = () => {
        if (onAddParameter) {
            onAddParameter(input, (isSuccess) => {
                if (isSuccess) setInput({ name: "", value: "" })
            })
        }
    }

    return <div className="kvlists">
        <div className="kvlists__header">
            <Title variant={TitleVariant.InterSemiBold121}>{title}</Title>
            <Switch isActive={isEnabled} onToggleSwitch={onToggleEnablement} />
        </div>
        {!!lists.length && <div className="kvlists__lists">
            {lists?.map(
                (list, index) =>
                    <KVBox
                        key={index}
                        list={list}
                        isEnabled={isEnabled}
                        onHandleBoxClick={onDeleteParameter?.bind(this, index)}
                    />
            )}
        </div>}
        <div className="kvlists__input">
            <Input variant={InputVariant.Primary} value={input.name} disabled={!isEnabled} onHandleText={event => onHandleKV('name', event)} placeholder="key_name" />
            <Input variant={InputVariant.Primary} value={input.value} disabled={!isEnabled} onHandleText={event => onHandleKV('value', event)} placeholder="value_name" />
        </div>
        <Button
            variant={ButtonVariant.Primary}
            disabled={!hasKVPair()}
            content="Add Parameter"
            className="kvlists__button"
            onButtonClick={onHandleAddParameter}
        />
    </div>
}

export default KVLists;