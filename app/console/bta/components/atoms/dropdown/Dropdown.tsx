import { ChangeEvent, useEffect, useRef, useState } from "react";
import { DropdownProps, InputVariant, TextVariant } from "../../../types";
import { Text } from "../text";
import { Input } from "../input";
import useOutsideClick from "./UseOutsideClick";
import { Icon } from "../icon";

const Dropdown = <T,>({
    contents,
    value,
    placeholder = "Select",
    onHandleDropdownValue,
    className,
    filter = true,
    location,
    disabled = false,
}: DropdownProps<T>) => {
    useEffect(() => {
        setUpdatedContents(contents);
    }, [contents]);

    const [val, setVal] = useState<T>();
    const [active, setActive] = useState<boolean>(false);
    const [updatedContents, setUpdatedContents] = useState<T[]>(contents);

    useEffect(() => {
        if (value) setVal(value);
        else setVal("" as T);
    }, [value]);

    const menuRef = useRef<HTMLDivElement>(null);
    useOutsideClick(menuRef, () => setActive(false));


    const onHandleListToggle = () => setActive((prevState) => !prevState);

    const onHandleValueSelect = (val: T) => {
        setActive(false);
        setVal(val as T);
        if (onHandleDropdownValue) onHandleDropdownValue({ target: { value: val } });
    };

    const getObj = (obj: T, key: string) => key.split('.').reduce((acc: any, curr: string) => acc && acc[curr], obj)

    const containsValue = (obj: T, value: string): boolean => {
        if (typeof obj === "string") return obj.includes(value)
        if (typeof obj === "object" && obj !== null)
            return Object.values(obj).some(val => containsValue(val, value));
        return false;
    };

    const onSetContentFilter = (e: ChangeEvent<HTMLInputElement>) => {
        const text = e.target.value;
        let newContents = contents;
        if (location) {
            newContents = newContents.filter(newContent => {
                const value = getObj(newContent, location);
                return typeof value === "string" && value.includes(text);
            })
        } else if (Array.isArray(newContents) && typeof newContents[0] === "string") {
            newContents = newContents.filter((newContent) =>
                typeof newContent === "string" && newContent.toLowerCase().includes(text.toLowerCase())
            );
        } else return;
        setUpdatedContents(newContents);
    };
    return (
        <div className={`form__dropdown-1 ${className}`} ref={menuRef}>
            {disabled ?
                <Input variant={InputVariant.Primary} disabled={true} /> :
                <div className="form__dropdown-1--value" onClick={onHandleListToggle}>
                    <span>
                        <Text variant={!!val ? TextVariant.PublicSansLight142 : TextVariant.PublicSansLight141}>
                            {location
                                ? getObj(val as T, location) || placeholder
                                : val || placeholder
                            }
                        </Text>
                    </span>
                    <span>
                        <Icon name="ArrowDown" />
                    </span>
                </div>}
            {active && (
                <div className="form__dropdown-1--list">
                    {filter && (
                        <Input
                            variant={InputVariant.Primary}
                            onHandleText={onSetContentFilter}
                            placeholder="Filter"
                            className="form__dropdown-1--input"
                            autoFocus
                        />
                    )}
                    <ul>
                        {!!contents.length &&
                            updatedContents.map((content, index) => {
                                if (!!location) {
                                    return <li
                                        onClick={onHandleValueSelect.bind(this, content)}
                                        key={index}
                                    >
                                        <Text variant={TextVariant.InterRegular141}>{getObj(content, location)}</Text>
                                    </li>
                                } else if (typeof content == "string") {
                                    return <li
                                        onClick={onHandleValueSelect.bind(this, content)}
                                        key={index}
                                    >
                                        <Text variant={TextVariant.InterRegular141}>{content as string}</Text>
                                    </li>
                                }
                            })}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default Dropdown;