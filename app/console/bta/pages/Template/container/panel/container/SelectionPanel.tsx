import { FC } from "react";
import { ButtonVariant, SelectionProps } from "../../../../../types";
import { Button } from "../../../../../components";

const SelectionPanel: FC<SelectionProps> = ({ selections, currentSelection, onHandleSelection, params }) => {
    return <div className="template__selectionWrapper">
        {selections.map((
            selection, index) => {
            if (selection.fn) {
                const fnResult = selection.fn(params?.reduce((acc, obj) => ({ ...acc, ...obj }), {}));
                if (fnResult) return <Button
                    variant={selection.name == currentSelection ? ButtonVariant.Selected : ButtonVariant.Selection}
                    key={index}
                    content={selection.name}
                    onButtonClick={onHandleSelection?.bind(this, selection.name)}
                />
                else return null;
            }
            return <Button
                variant={selection.name == currentSelection ? ButtonVariant.Selected : ButtonVariant.Selection}
                key={index}
                content={selection.name}
                onButtonClick={onHandleSelection?.bind(this, selection.name)}
            />
        }
        )}
    </div>
}

export default SelectionPanel;