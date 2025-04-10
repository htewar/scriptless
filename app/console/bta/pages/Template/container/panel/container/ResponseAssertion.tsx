import { ChangeEvent, FC, Fragment } from "react";
import { InputGroup } from "../../../../../components";
import { DropdownFnParams, InputGroupVariant, InputType, PostResponseAssertionProps } from "../../../../../types";

interface ResponseAssertionProps {
    assertion: PostResponseAssertionProps;
    onHandleAssertion: (key: string, event: ChangeEvent<HTMLInputElement> | DropdownFnParams<string>) => void;
}

const ResponseAssertion: FC<ResponseAssertionProps> = ({ assertion, onHandleAssertion }) => {
    return <Fragment>
        <InputGroup
            title=""
            variant={InputGroupVariant.Primary}
            value={assertion.key}
            placeholder="Key"
            onHandleInput={onHandleAssertion.bind(this, 'key')}
            error={""}
        />
        {assertion.key && <InputGroup
            title="Condition"
            variant={InputGroupVariant.Primary}
            type={InputType.Dropdown}
            contents={["Not Nil", "Not Empty", "Greater Than", "Greater Than OR Equal To", "Equal To", "Less Than", "Less Than OR Equal To"]}
            onHandleDropdown={onHandleAssertion.bind(this, 'condition')}
            filter={false}
            value={assertion.condition}
        />}
        {assertion.condition != "Not Empty" && assertion.condition != "Not Nil" && !!assertion.condition && <InputGroup
            title="Value"
            variant={InputGroupVariant.Primary}
            value={assertion.value}
            placeholder="Comparison value"
            onHandleInput={onHandleAssertion.bind(this, 'value')}
            error={""}
        />}
    </Fragment>
}

export default ResponseAssertion;