import { FC } from "react";
import { SwitchProps } from "../../../types";

const Switch: FC<SwitchProps> = ({ isActive, onToggleSwitch }) => {
    return <div className={`switch ${isActive ? '': 'switch--inactive'}`} onClick={onToggleSwitch}>
        <div className={`switch__slider ${isActive ? 'switch__slider--right' : 'switch__slider--left'}`}></div>
    </div>
}

export default Switch;