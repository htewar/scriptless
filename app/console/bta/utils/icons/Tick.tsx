import { CSSProperties, FC } from "react";

interface IconProps {
    className?: string;
    style?: CSSProperties
}

const Tick:FC<IconProps> = ({ className, style }) => {
  return (
    <svg
      version="1.1"
      x="0px"
      y="0px"
      viewBox="0 0 100 125"
      className={className}
      style={style}
    enableBackground="new 0 0 100 100"
    >
      <path d="M50,6.6C26,6.6,6.6,26,6.6,50S26,93.4,50,93.4S93.4,74,93.4,50S74,6.6,50,6.6z M71,41L45.3,66.6c-0.8,0.8-1.8,1.2-2.8,1.2  s-2.1-0.4-2.8-1.2L27,54c-1.6-1.6-1.6-4.1,0-5.7c1.6-1.6,4.1-1.6,5.7,0l9.8,9.8l22.8-22.8c1.6-1.6,4.1-1.6,5.7,0  C72.5,36.9,72.5,39.5,71,41z" />
    </svg>
  );
};

export default Tick;