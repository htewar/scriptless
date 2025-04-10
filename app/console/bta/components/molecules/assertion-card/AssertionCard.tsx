import { FC } from "react";
import { AssertionType, TextVariant, TitleVariant } from "../../../types";
import { Text, Title } from "../../atoms";

interface AssertionCardProps {
    type?: AssertionType;
    mapper: string;
    keyMapper: string;
    mappingValue?: string;
    onAssertionClick: () => void;
    isSelected: boolean;
}

const AssertionCard: FC<AssertionCardProps> = ({ type, mapper, keyMapper, mappingValue, onAssertionClick, isSelected }) => {
    return <div className={`template__assertionCard ${isSelected ? "template__assertionCard--selected" : ""}`} onClick={onAssertionClick}>
        <Title className="template__assertionCardHeader" variant={TitleVariant.InterSemiBold122}>{type?.split(" ").filter(val => val != "Assertion").join(" ")}</Title>
        <Text className="template__assertionCardBody" variant={TextVariant.InterRegular101}>{mapper}:{keyMapper}:{mappingValue}</Text>
    </div>
}

export default AssertionCard;