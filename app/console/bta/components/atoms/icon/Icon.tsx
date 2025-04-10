import { FC, useEffect, useState } from "react";
import { IconProps } from "../../../types";

const Icon: FC<IconProps> = ({ name, onIconClick, ...rest }) => {
    const [IconComponent, setIconComponent] = useState<FC|null>(null);

    useEffect(() => {
        const loadIcon = async () => {
            const module = await import(`../../../utils/icons/${name}.tsx`)
            setIconComponent(() => module.default)
        }
        loadIcon();
    }, [name])
    if (!IconComponent) return;
    return (
        <div
            style={{ position: "relative", display: "flex" }}
            onClick={onIconClick}
        >
            <IconComponent {...rest} />
        </div>
    );
};

export default Icon;