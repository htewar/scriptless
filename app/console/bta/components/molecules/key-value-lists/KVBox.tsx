import { FC } from "react";
import { ListProps, TitleVariant } from "../../../types";
import { Title } from "../../atoms";

const KVBox: FC<ListProps> = ({ isEnabled, list, onHandleBoxClick }) => {
    return <Title
        className={`kvlists__box ${isEnabled ? 'kvlists__box--enabled' : 'kvlists__box--disabled'}`}
        variant={isEnabled ? TitleVariant.InterSemiBold91 : TitleVariant.InterSemiBold92}
        onTitleClick={onHandleBoxClick}
    >
        {list.name}={list.value}
    </Title>
}

export default KVBox;