import { ChangeEvent, FC, Fragment } from "react";
import { InputGroup } from "../../../../../components";
import { InputGroupVariant } from "../../../../../types";

interface HeaderAssertionProps {
    headerKey: string;
    value: string;
    onHandleHeader: (key: string, event: ChangeEvent<HTMLInputElement>) => void;
}

const HeaderAssertion:FC<HeaderAssertionProps> = ({ headerKey, value, onHandleHeader }) => {
    return <Fragment>
        <InputGroup
            title="Header Pair"
            variant={InputGroupVariant.Primary}
            placeholder="key_name"
            value={headerKey}
            onHandleInput={onHandleHeader.bind(this, 'key')}
        />
        <InputGroup
            title=""
            variant={InputGroupVariant.Primary}
            placeholder="value_name"
            value={value}
            onHandleInput={onHandleHeader.bind(this, 'value')}
        />
    </Fragment>
}

export default HeaderAssertion;