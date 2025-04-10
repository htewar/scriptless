import { ChangeEvent, FC, Fragment } from "react"
import { InputGroup } from "../../../../../components"
import { DropdownFnParams, HttpStatus, InputGroupVariant, InputType } from "../../../../../types"
import { DATA } from "../data"

interface StatusAssertionProps {
    status: HttpStatus
    onHandleStatus: (key: string, event: ChangeEvent<HTMLInputElement> | DropdownFnParams<HttpStatus>) => void;
}

const StatusAssertion:FC<StatusAssertionProps>= ({ status, onHandleStatus }) => {
    return <Fragment>
        <InputGroup
            title="Status Code"
            variant={InputGroupVariant.Primary}
            type={InputType.Dropdown}
            contents={[...DATA.HTTP_STATUSES]}
            location="message"
            filter={true}
            value={status}
            onHandleDropdown={onHandleStatus.bind(this, 'value')}
        />
    </Fragment>
}

export default StatusAssertion