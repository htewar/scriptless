import { ChangeEvent, FC, Fragment, useCallback, useEffect, useMemo, useState } from "react";
import { AssertionParams, AssertionType, ButtonVariant, CustomNodeData, DropdownFnParams, HttpStatus, InputGroupVariant, InputType, PostResponseAssertionProps, TitleVariant } from "../../../../../types";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { Node } from "reactflow";
import { AddPostResponseParams, RemovePostResponseParams, UpdatePostResponseParams } from "../../../../../redux/actions/nodes.action";
import { DATA } from "../data";
import { AssertionCard, Button, InputGroup, Title } from "../../../../../components";
import ResponseAssertion from "./ResponseAssertion";
import StatusAssertion from "./StatusAssertion";
import HeaderAssertion from "./HeaderAssertion";

interface AssertionProps {
    dispatch: Dispatch;
    selectedNode: Node<CustomNodeData> | null;
    currentNode: string | null;
    respParams: PostResponseAssertionProps[];
    insertAssertion: (mapper: PostResponseAssertionProps) => void;
    editAssertion: (mapper: PostResponseAssertionProps, index: number) => void;
    deleteAssertion: (deleteIndex: number) => void;
}

const Assertion: FC<AssertionProps> = ({ dispatch, respParams, selectedNode, currentNode, insertAssertion, editAssertion, deleteAssertion }) => {
    const [assertions, setAssertions] = useState<AssertionParams>({
        preRequestAssertion: [],
        postResponseAssertion: [],
    });
    const [assertion, setAssertion] = useState<PostResponseAssertionProps>({ ...DATA.POST_RESPONSE_ASSERTION_DEFAULT_DATA })
    const [isUpdate, setIsUpdate] = useState<boolean>(false);
    const [isUpdateSelected, setIsUpdateSelected] = useState<number | null>();

    // useEffect(() => {
    //     const currentAssertion = selectedNode?.data.assertion
    //     if (currentAssertion) setAssertions(prevState => ({
    //         ...prevState,
    //         postResponseAssertion: currentAssertion.postResponseAssertion,
    //     }))
    // }, [selectedNode, currentNode])

    const onInsertAssertion = () => {
        if (currentNode) {
            // dispatch(AddPostResponseParams(params, currentNode))
            insertAssertion(assertion);
            setAssertion(({ ...DATA.POST_RESPONSE_ASSERTION_DEFAULT_DATA }))
        }
    }

    const onHandleAssertion = (key: string, event: ChangeEvent<HTMLInputElement> | DropdownFnParams<string | HttpStatus>) => {
        setAssertion(prevState => ({
            ...prevState,
            [key]: event.target.value,
            ...(key == "key" && event.target.value == "" ? { condition: "" } : {})
        }))
    }

    const onHandlePostRespAssertionEdit = (index: number) => {
        const selectedAssertion = respParams[index]
        setAssertion(selectedAssertion)
        setIsUpdate(true);
        setIsUpdateSelected(index);
    }

    const onEditAssertion = () => {
        if (isUpdateSelected != null) {
            // dispatch(UpdatePostResponseParams(assertion, isUpdateSelected))
            editAssertion(assertion, isUpdateSelected)
            setIsUpdate(false);
            setIsUpdateSelected(null);
            setAssertion({ ...DATA.POST_RESPONSE_ASSERTION_DEFAULT_DATA })
        }
    }

    const onDeleteAssertion = () => {
        if (isUpdateSelected != null) {
            // dispatch(RemovePostResponseParams(isUpdateSelected))
            deleteAssertion(isUpdateSelected)
            setIsUpdate(false);
            setIsUpdateSelected(null)
            setAssertion({ ...DATA.POST_RESPONSE_ASSERTION_DEFAULT_DATA })
        }
    }

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

    return <div className="template__assertions">
        <div className="u-margin-top-10 template__assertion">
            <Title variant={TitleVariant.InterBold141}>Post Response Assertion</Title>
            <div className="template__assertionCards">
                {respParams.map((params, index) => <AssertionCard
                    key={index}
                    onAssertionClick={onHandlePostRespAssertionEdit.bind(this, index)}
                    isSelected={isUpdateSelected?.toString() == index.toString()}
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
            {assertion.type == "Headers Assertion" && <HeaderAssertion headerKey={assertion.key} value={assertion.value} onHandleHeader={onHandleAssertion} />}
        </div>
        <div className="template__paramAction">
            {!isUpdate ? <Button
                className="u-margin-top-10 u-width-100"
                variant={ButtonVariant.Primary}
                content="Insert Assertion"
                disabled={!isAddAssertionPermissible()}
                onButtonClick={onInsertAssertion}
            /> :
                <Fragment>
                    <Button variant={ButtonVariant.Update} content="Update Assertion" onButtonClick={onEditAssertion} />
                    <Button variant={ButtonVariant.Delete} content="Delete Assertion" onButtonClick={onDeleteAssertion} />
                </Fragment>}
        </div>
    </div>
}

export default connect()(Assertion);