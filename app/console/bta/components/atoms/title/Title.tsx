import { FC } from "react";
import { TitleProps } from "../../../types";

const Title: FC<TitleProps> = ({ variant, children, style, className, onTitleClick }) => {
    return (
        <div
            className={`title title--${variant} ${className}`}
            style={{ ...style }}
            onClick={onTitleClick}
        >
            {children}
        </div>
    );
};

export default Title;