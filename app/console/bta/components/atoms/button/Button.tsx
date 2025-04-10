import { FC } from "react";
import {Icon} from "../icon";
import { ButtonProps, ButtonVariant } from "../../../types";

const Button: FC<ButtonProps> = ({
  variant = ButtonVariant.Primary,
  content = "Default",
  onButtonClick,
  className,
  icon = "Plus",
  ...rest
}) => {
  return (
    <button
      className={`btn btn--${variant} ${className}`}
      onClick={onButtonClick}
      {...rest}
    >
      {[2, 3, 4].includes(+variant) && (
        <span className="btn__icon">
          <Icon name={icon} />
        </span>
      )}
      {content && <span>{content}</span>}
      {[6].includes(+variant) && (
        <span className="btn__icon">
          <Icon name={icon} />
        </span>
      )}
    </button>
  );
};

export default Button;