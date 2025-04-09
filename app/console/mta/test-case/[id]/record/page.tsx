"use client"

import Metadata from "@/app/lib/ui/components/ComponentMetaData";
import {useCallback, useEffect, useState} from "react";
import {TestCase, TestCaseApiResponse} from "@/app/lib/models/TestCasesApiResponse";
import {useParams, useRouter} from "next/navigation";
import {apiClient} from "@/app/lib/api/apiClient";
import Cookies from "js-cookie";
import FullScreenSyncLoader from "@/app/lib/ui/components/FullScreenSyncLoader";
import {RefreshCw, Video} from "lucide-react";
import {Button} from "@/components/ui/button";
import {Separator} from "@/components/ui/separator";
import {Menu, RecordingTestCaseApiResponse} from "@/app/lib/models/RecordingTestCaseApiResponse";
import Image from "next/image";
import {ElementItemView} from "@/app/lib/ui/components/ScreenElementItemView";
import {RoutePaths} from "@/app/lib/utils/routes";

export default function RecordTestCase() {
    const router = useRouter()
    const {id} = useParams();
    const [uid, setUid] = useState<string>('')
    const [testCase, setTestCase] = useState<TestCase | null>(null)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [testCaseElement, setTestCaseElement] = useState<RecordingTestCaseApiResponse | null>(null)
    const [screenShotUrl, setScreenShotUrl] = useState<string | null>(null)
    const [initialLoad, setInitialLoad] = useState<boolean>(true)
    const [key, setKey] = useState(1);
    const refreshImage = () => setKey((prev) => prev + 1);

    const fetchTestCase = useCallback(async (uid: string, id: string) => {
        return await apiClient.getTestCase(uid, id)
    }, [])

    const startRecording = useCallback(async (action?: {
        action_type: string;
        param_value: string;
        class: string;
        name: string;
        label: string;
        enabled: boolean;
        visible: boolean;
        xpath: string
    }) => {
        setIsLoading(true)
        // refreshImage()
        try {
            const response = await apiClient.recording(uid, testCase?.testCaseUUID as string, action)
            console.log("Recording Response :: ", response)
            if (response != null) {
                return response as RecordingTestCaseApiResponse
            }
        } catch (error) {
            console.error("Error during recording: ", error)
        }
    }, [testCase?.testCaseUUID, uid])

    useEffect(() => {
        if (testCase == null) {
            const uid = Cookies.get('uid') as string;
            if (!uid) {
                router.replace("/")
            }
            setUid(uid)
            setIsLoading(true)
            // refreshImage()
            fetchTestCase(uid, id as string).then((response: TestCaseApiResponse) => {
                setIsLoading(false)
                if (!response.isError) {
                    setTestCase(response.data || null)
                }
            })
        }
    }, [testCase, fetchTestCase, id, router]);

    useEffect(() => {
        if (testCase != null && testCaseElement == null) {
            startRecording().then((recordingApiResponse: RecordingTestCaseApiResponse | undefined) => {
                if (recordingApiResponse instanceof RecordingTestCaseApiResponse) {
                    setTestCaseElement(recordingApiResponse)
                    setScreenShotUrl(`${recordingApiResponse.screenshotUrl}?cache-bust=${key}`)
                    setInitialLoad(false)
                    setIsLoading(false)
                    console.log("RecordingTestCaseApiResponse:: ", recordingApiResponse)
                } else {
                    console.log("testCaseElement(Assigned) :: Something wrong", recordingApiResponse)
                }
            })
        }
    }, [testCase, testCaseElement, startRecording]);

    function previewTestCase() {
    }

    async function onRefreshClick() {
        const actionBody = {
            "action_type": "refresh",
            "param_value": "",
            "class": "",
            "name": "",
            "title": "",
            "resource-id": "",
            "label": "",
            "enabled": false,
            "visible": false,
            "xpath": ""
        }
        setTestCaseElement(null)
        setScreenShotUrl(null)
        const response = await startRecording(actionBody)
        if (response) {
            setTestCaseElement(response)
            setIsLoading(false)
            setScreenShotUrl(`${response.screenshotUrl}?cache-bust=${key}`)
        }
    }

    async function saveTestCase() {
        const actionBody = {
            action_type: "exit",
            param_value: "",
            class: "",
            name: "",
            label: "",
            enabled: false,
            visible: false,
            xpath: ""
        }
        startRecording(actionBody)
        router.replace(RoutePaths.TestCases(`mta`))
    }

    const recordStep = async (menu: Menu, action: string, input: string | null) => {
        const actionBody = {
            "action_type": action,
            "param_value": input || "",
            "class": menu.type || menu.classType,
            "name": menu.name,
            "text": menu.title,
            "resource-id": menu.resourceId,
            "content-desc": menu.contentDesc,
            "label": menu.label,
            "enabled": menu.enabled,
            "visible": menu.visible,
            "xpath": menu.xpath
        }
        refreshImage()
        setTestCaseElement(null)
        setScreenShotUrl(null)
        const response = await startRecording(actionBody)
        if (response) {
            setTestCaseElement(response)
            setIsLoading(false)
            setScreenShotUrl(`${response.screenshotUrl}?cache-bust=${key}`)
        }
    }
    return (
        <>
            <Metadata seoTitle="Record Test Case | Scriptless" seoDescription="Record test case."/>
            <div className="w-full h-full">
                {isLoading && initialLoad && <FullScreenSyncLoader/>}
                {(testCase) &&
                    <RecordingTestCaseScreen
                        uniqekey={key}
                        testCase={testCase}
                        screenshotUrl={screenShotUrl}
                        menu={testCaseElement?.menu || []}
                        onPreviewTestCaseClick={previewTestCase}
                        onRefreshClick={onRefreshClick}
                        isRecordingLoading={isLoading}
                        onSaveTestCaseClick={saveTestCase}
                        onOptionSelect={(menu: Menu, action: string, input: string | null) => {
                            let inputAction: string
                            if (action === "Click")
                                inputAction = "click"
                            else if (action === "Scroll Up")
                                inputAction = "scroll_up"
                            else if (action === "Scroll Bottom")
                                inputAction = "scroll_bottom"
                            else
                                inputAction = action
                            console.log("Menu Selected :: ", menu, action)
                            recordStep(menu, inputAction, input).then(() => {
                            })
                        }}
                    />
                }
            </div>
        </>
    )
}

interface RecordingTestCaseScreenProp {
    uniqekey: number,
    testCase: TestCase,
    screenshotUrl: string | null,
    menu: Menu[] | [],
    onPreviewTestCaseClick: () => void,
    onRefreshClick: () => void,
    isRecordingLoading: boolean,
    onSaveTestCaseClick: () => void,
    onOptionSelect: (menu: Menu, action: string, input: string | null) => void
}

function RecordingTestCaseScreen(
    {
        uniqekey,
        testCase,
        screenshotUrl,
        menu,
        onPreviewTestCaseClick,
        onRefreshClick,
        isRecordingLoading,
        onSaveTestCaseClick,
        onOptionSelect
    }: RecordingTestCaseScreenProp
) {
    return (
        <div className={"w-full h-full max-w-4xl mx-auto pt-4 flex flex-col"}>
            <div className={"flex items-center justify-between mb-2"}>
                <div className={"flex items-center gap-2"}>
                    <h1 className="text-foreground text-2xl font-bold">{testCase.testCaseName}</h1>
                    <div
                        className={"flex items-center gap-1 text-sm text-[#c03030] rounded border border-[#c03030] px-1 py-.5"}>
                        <Video size={20} color="#c03030"/>
                        Recording...
                    </div>
                </div>
                <div className="flex gap-2 items-center">
                    <Button variant="outline" onClick={onPreviewTestCaseClick}>
                        Preview
                    </Button>
                    <Button onClick={onSaveTestCaseClick}>
                        Save
                    </Button>
                </div>
            </div>
            <Separator/>
            <div className="flex-1 flex overflow-y-auto">
                {
                    isRecordingLoading ? <FullScreenSyncLoader/> : <>
                        <div className="flex-1">
                            {/*{menu.length === 0 &&*/}
                            {/*    <div className="flex items-center justify-center h-full">*/}
                            {/*        No elements found.*/}
                            {/*    </div>*/}
                            {/*}*/}
                            <div className="h-full w-full pt-8 flex flex-col items-start gap-2">
                                <div className="flex gap-3 items-start justify-center mb-4">
                                    <h2 className="font-medium text-xl">Select Element:</h2>
                                    <Button className="-mt-1" onClick={() => onRefreshClick()}>
                                        <RefreshCw/>
                                        Refresh
                                    </Button>
                                </div>
                                {(menu.length > 0) &&
                                    <div
                                        className="w-full h-full overflow-y-auto no-scrollbar flex flex-col items-start gap-2">
                                        {
                                            menu.map((element, index) => {
                                                return (
                                                    <ElementItemView
                                                        key={index}
                                                        index={index}
                                                        menu={element}
                                                        onOptionSelect={(menu: Menu, action: string, input: string | null) => {
                                                            onOptionSelect(menu, action, input);
                                                        }}
                                                    />
                                                );
                                            })
                                        }
                                    </div>
                                }
                            </div>
                        </div>
                        <div className=" flex-1 h-full w-full flex items-center justify-center">
                            {screenshotUrl &&
                                <Image src={screenshotUrl}
                                       key={uniqekey}
                                       alt={testCase.testCaseName}
                                       width={360}
                                       height={780}
                                       unoptimized
                                       className="border-8 border-gray-700 rounded-[24] shadow-md"
                                />
                            }
                        </div>
                    </>
                }
            </div>
        </div>
    )
}


