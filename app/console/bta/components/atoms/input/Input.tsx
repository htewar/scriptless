import { FC } from "react";
import { InputProps } from "../../../types";

const Input:FC<InputProps> = ({
  onHandleText,
  variant,
  content = "Upload Document",
  placeholder = "Enter Text",
  className,
  refCallback,
  ...rest
}) => {
  return (
    <input
      placeholder={placeholder}
      onChange={onHandleText}
      className={`form__input-${variant} ${className}`}
      ref={refCallback}
      {...rest}
    />
  );
};

export default Input;