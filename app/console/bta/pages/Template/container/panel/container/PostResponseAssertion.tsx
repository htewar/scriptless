import { ChangeEvent, FC, Fragment, useCallback, useMemo } from "react";
import { AssertionCard, Button, InputGroup, Title } from "../../../../../components";
import { AssertionType, ButtonVariant, DropdownFnParams, HttpStatus, InputGroupVariant, InputType, PostResponseAssertionProps, TitleVariant } from "../../../../../types";
import ResponseAssertion from "./ResponseAssertion";
import StatusAssertion from "./StatusAssertion";
import HeaderAssertion from "./HeaderAssertion";

interface AssertionProps {
    respParams: PostResponseAssertionProps[];
    assertion: PostResponseAssertionProps;
    isUpdate: boolean;
    updateIndex: number | null;
    onInsertAssertion: (param: PostResponseAssertionProps) => void;
    onHandleAssertion: (key: string, event: ChangeEvent<HTMLInputElement> | DropdownFnParams<string | HttpStatus>) => void;
    onHandlePostRespAssertionEdit: (id: number) => void;
    onEditAssertion: () => void;
    onDeleteAssertion: () => void;
}

const PostResponseAssertion: FC<AssertionProps> = ({ onInsertAssertion, onHandleAssertion, onHandlePostRespAssertionEdit, onDeleteAssertion, onEditAssertion, respParams = [], assertion, isUpdate, updateIndex }) => {
    const isAddAssertionPermissible = useCallback((): boolean => {
        const isKey = !!assertion.key;
        const isValue = !!assertion.value;
        if (assertion.type == "Response Assertion") {
            if (isKey && (assertion.condition == "Not Empty" || assertion.condition == "Not Nil"))
                return true;
            else if (isKey && (assertion.condition != "Not Empty" && assertion.condition != "Not Nil" && !!assertion.condition) && isValue)
                return true;
        } else if (assertion.type == "Status Assertion") {
            if (isValue) return true;
        } else if (assertion.type == "Headers Assertion") {
            if (isKey && isValue)
                return true;
        }
        return false;
    }, [assertion])

    const isHttpStatus = (obj: any): obj is HttpStatus => {
        return (
            typeof obj === "object" &&
            obj !== null &&
            "code" in obj &&
            "message" in obj &&
            typeof obj.code == "number" &&
            typeof obj.message === "string"
        );
    };

    const assertionList = useMemo((): AssertionType[] => {
        const isStatusProvided = respParams?.find(param => param.type == "Status Assertion");
        if (isStatusProvided)
            return ["Headers Assertion", "Response Assertion"]
        return ["Headers Assertion", "Response Assertion", "Status Assertion"]
    }, [respParams])

    return <Fragment>
        <div className="u-margin-top-10 template__assertion">
            <Title variant={TitleVariant.InterBold141}>Post Response Assertion</Title>
            <div className="template__assertionCards">
                {respParams.map((params, index) => <AssertionCard
                    key={index}
                    onAssertionClick={onHandlePostRespAssertionEdit.bind(this, index)}
                    isSelected={updateIndex?.toString() == index.toString()}
                    mapper={params.key}
                    mappingValue={isHttpStatus(params.value) ? params.value.message : params.value}
                    keyMapper={params.condition}
                    type={params.type}
                />)}
            </div>
            <InputGroup
                title="Assertion type"
                type={InputType.Dropdown}
                variant={InputGroupVariant.Primary}
                contents={assertionList}
                filter={false}
                value={assertion.type}
                onHandleDropdown={onHandleAssertion.bind(this, "type")}
            />
            {/* Provides conditional assertion rendering */}
            {assertion.type == "Response Assertion" && <ResponseAssertion assertion={assertion} onHandleAssertion={onHandleAssertion} />}
            {assertion.type == "Status Assertion" && <StatusAssertion status={assertion.value} onHandleStatus={onHandleAssertion} />}
            {assertion.type == "Headers Assertion" && <HeaderAssertion headerKey={assertion.key} value={assertion.value} onHandleHeader={onHandleAssertion}/>}
        </div>
        <div className="template__paramActions">
            {!isUpdate ? <Button
                className="u-margin-top-10 u-width-100"
                variant={ButtonVariant.Primary}
                content="Insert Assertion"
                disabled={!isAddAssertionPermissible()}
                onButtonClick={onInsertAssertion.bind(this, assertion)}
            /> :
                <Fragment>
                    <Button variant={ButtonVariant.Update} content="Update Assertion" onButtonClick={onEditAssertion} />
                    <Button variant={ButtonVariant.Delete} content="Delete Assertion" onButtonClick={onDeleteAssertion} />
                </Fragment>}

        </div>
    </Fragment>
}

export default PostResponseAssertion;