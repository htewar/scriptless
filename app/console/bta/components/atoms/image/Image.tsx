import { FC } from "react";
import { ImageProps, ImageType } from "../../../types";

const Image:FC<ImageProps> = ({ name, className, onIconClick, type = ImageType.PNG }) => (
  <img
    onClick={onIconClick}
    className={className}
    src={`${type == "binary" ? name : "/bta/utils/images/" + name + "." + type}`}
  />
);

export default Image;