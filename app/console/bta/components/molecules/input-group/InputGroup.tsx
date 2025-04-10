import { Editor } from "@monaco-editor/react";
import { InputType, TextVariant, TitleVariant } from "../../../types";
import { InputGroupProps, InputGroupVariant, InputVariant } from "../../../types";
import { Dropdown, Input, Text, Title } from "../../atoms";

const InputGroup = <T,>({
    type = InputType.Input,
    title,
    variant = InputGroupVariant.Primary,
    contents = [],
    value,
    filter = true,
    mandatory = false,
    className,
    location,
    language,
    error,
    onHandleInput,
    onHandleDropdown,
    ...rest
}: InputGroupProps<T>) => {
    return (
        <div className={`form__inputGroup ${className ? className + '--inputGroup' : ''} ${error ? 'form__inputGroup--errorWrapper' : ''}`}>
            {!!title.length && <div className="form__inputGroupTitleWrapper">
                <Title variant={TitleVariant.InterSemiBold121}>{title}</Title>
                {mandatory && <span>*</span>}
            </div>}
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
            {type == InputType.Editor &&
                <div className="form__inputEditorWrapper">
                    <Editor
                        height="100px"
                        language={language}
                        theme="light"
                        value={typeof value == "string" ? value : ""}
                        onChange={(value) => {
                            if (value && onHandleDropdown) {
                                onHandleDropdown({ target: { value: value as T } })
                            }
                        }}
                    />
                </div>
            }
            {error && <Text className={`${title.length > 0 ? 'form__inputGroup--errorExtended' : 'form__inputGroup--error'}`} variant={TextVariant.InterBold81}>{error}</Text>}
        </div>
    );
};

export default InputGroup;