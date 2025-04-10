import { FC } from "react";
import { TextProps } from "../../../types";

const Text: FC<TextProps> = ({ variant, children, style, className }) => {
    return (
      <div className={`text text--${variant} ${className}`} style={{ ...style }}>
        {children}
      </div>
    );
  };
  
  export default Text;