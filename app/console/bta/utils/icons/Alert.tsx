import React, { CSSProperties, FC } from "react";

interface IconProps {
    className?: string;
    style?: CSSProperties
}

const Alert:FC<IconProps> = ({ className, style }) => (
  <svg
    version="1.1"
    style={{
      shapeRendering: "geometricPrecision",
      textRendering: "geometricPrecision",
      imageRendering: "auto",
      ...style,
    }}
    className={className}
    viewBox="0 0 846.66 1058.325"
    x="0px"
    y="0px"
    fillRule="evenodd"
    clipRule="evenodd"
  >
    <g>
      <path
        className="fil0"
        style={{ fill: "black" }}
        d="M717.05 690.58c19.54,0 26.66,-24.39 17.03,-40.87l-279.56 -478.54c-11.75,-20.12 -50.64,-20.12 -62.39,0l-279.56 478.54c-9.63,16.48 -2.51,40.87 17.04,40.87l587.44 0zm-261.66 -374.68l0 197.7 -64.12 0 0 -197.7 64.12 0zm0 237.77l0 60.78 -64.12 0 0 -60.78 64.12 0z"
      />
    </g>
  </svg>
);

export default Alert;