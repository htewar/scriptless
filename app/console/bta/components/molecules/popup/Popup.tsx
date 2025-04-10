import {Children, cloneElement, FC, isValidElement, MouseEvent, ReactElement, useRef } from "react";
import { PopupProps, TitleVariant } from "../../../types";
import { Icon, Title } from "../../atoms";

const Popup:FC<PopupProps> = ({
  children,
  transition = { horizontal: null, vertical: null },
  onClosePopup,
  title,
  className,
}) => {
  const onContainerPropagation = (e: MouseEvent<HTMLDivElement>) => e.stopPropagation();

  const ref = useRef<HTMLDivElement | null>(null);

  const onHandleClose = () => {
    if (ref && ref.current){
        ref.current.className += ` popup__wrapper--${transition.horizontal}-close`;
        setTimeout(() => {
          onClosePopup();
        }, 200);
    }
  };

  const child = Children.map(children, (child) =>
    isValidElement(child)
      ? cloneElement(child as ReactElement<{ onHandleClose: () => void }>, { onHandleClose })
      : child
  );
  
  

  return (
    <div className="popup" onClick={onHandleClose}>
      <div
        ref={ref}
        className={`popup__wrapper ${className} popup__wrapper--${transition.horizontal} popup__wrapper--${transition.vertical}`}
        onClick={onContainerPropagation}
      >
        {title && (
          <div className={`popup__title ${className}--title`}>
            <div className="popup__title--content">
              <Title variant={TitleVariant.InterBold141}>{title}</Title>
            </div>
          </div>
        )}
        <div className="popup__close" onClick={onHandleClose}>
          <Icon name="Close" />
        </div>
        <div className="popup__container">{child}</div>
      </div>
    </div>
  );
};

export default Popup;