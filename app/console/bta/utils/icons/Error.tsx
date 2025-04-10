import React, { CSSProperties, FC } from "react";

interface IconProps {
    className?: string;
    style?: CSSProperties
}

const Error:FC<IconProps> = ({ className, style }) => (
  <svg
    height="100px"
    width="100px"
    fill="#000000"
    version="1.1"
    x="0px"
    y="0px"
    viewBox="0 0 100 100"
    className={className}
    style={style}
    enableBackground="new 0 0 100 100"
  >
    <path
      fill="#000000"
      d="M70.712,0H29.289L0,29.289V70.71L29.289,100H70.71L100,70.711V29.289L70.712,0z M86.151,70.801
	L70.796,86.156L50,65.357L29.205,86.156L13.848,70.801L34.646,50L13.848,29.199l15.356-15.354L50,34.644l20.796-20.798
	l15.355,15.354L65.353,50L86.151,70.801z"
    ></path>
  </svg>
);

export default Error;