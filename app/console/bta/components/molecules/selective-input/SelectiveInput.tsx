import { InputGroupProps, InputGroupVariant, InputType, InputVariant, SelectiveInputProps, TitleVariant } from "../../../types";
import { Dropdown, Input, Switch, Title } from "../../atoms";


const SelectiveInput = <T,>({
    type = InputType.Input,
    title,
    variant = InputGroupVariant.Primary,
    contents = [],
    value,
    filter = true,
    className,
    location,
    isActive,
    onToggleSwitch,
    onHandleInput,
    onHandleDropdown,
    ...rest
}: SelectiveInputProps<T>) => {
    return (
        <div className={`form__inputGroup ${className? className+'--inputGroup': ''}`}>
            <div className="selectiveInput__titleSwitch">
                <Title variant={TitleVariant.InterSemiBold121}>{title}</Title>
                <Switch isActive={isActive} onToggleSwitch={onToggleSwitch} />
            </div>
            {type == InputType.Input && 
                <Input
                    variant={InputVariant.Primary} 
                    value={value} 
                    onHandleText={onHandleInput} 
                    {...rest} 
                />}
            {type == InputType.Dropdown && 
                <Dropdown
                    contents={contents} 
                    value={value} 
                    onHandleDropdownValue={onHandleDropdown}  
                    filter={filter}
                    className={className}
                    location={location}
                    {...rest} 
                />}
        </div>
    );
}

export default SelectiveInput;