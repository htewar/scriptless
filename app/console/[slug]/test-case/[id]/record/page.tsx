"use client"

import Metadata from "@/app/lib/ui/components/ComponentMetaData";
import {useCallback, useEffect, useState} from "react";
import {TestCase, TestCaseApiResponse} from "@/app/lib/models/TestCasesApiResponse";
import {useParams, useRouter} from "next/navigation";
import {apiClient} from "@/app/lib/api/apiClient";
import Cookies from "js-cookie";
import FullScreenSyncLoader from "@/app/lib/ui/components/FullScreenSyncLoader";
import {Video} from "lucide-react";
import {Button} from "@/components/ui/button";
import {Separator} from "@/components/ui/separator";
import {Menu, RecordingTestCaseApiResponse} from "@/app/lib/models/RecordingTestCaseApiResponse";
import Image from "next/image";
import {ElementItemView} from "@/app/lib/ui/components/ScreenElementItemView";

export default function RecordTestCase() {
    const router = useRouter()
    const {id} = useParams();
    const [uid, setUid] = useState<string>('')
    const [testCase, setTestCase] = useState<TestCase | null>(null)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [testCaseElement, setTestCaseElement] = useState<RecordingTestCaseApiResponse | null>(null)

    const fetchTestCase = useCallback(async (uid: string, id: string) => {
        return await apiClient.getTestCase(uid, id)
    }, [])

    const startRecording = useCallback(async () => {
        setIsLoading(true)
        const response = await apiClient.recording(uid, testCase?.testCaseUUID as string)
        if (response != null) {
            setIsLoading(false)
            setTestCaseElement(response)
        } else {
            await startRecording()
        }
    }, [testCase?.testCaseUUID, uid])

    useEffect(() => {
        if (testCase != null && testCaseElement == null) {
            startRecording().then(() => {
            })
        }
        if (testCase == null) {
            const uid = Cookies.get('uid') as string;
            if (!uid) {
                router.replace("/")
            }
            setUid(uid)
            setIsLoading(true)
            fetchTestCase(uid, id as string).then((response: TestCaseApiResponse) => {
                if (!response.isError) {
                    setTestCase(response.data || null)
                    setIsLoading(false)
                }
            })
        }
    }, [testCase, fetchTestCase, id, router, startRecording, testCaseElement]);

    function previewTestCase() {

    }

    function saveTestCase() {

    }


    return (
        <>
            <Metadata seoTitle="Record Test Case | Scriptless" seoDescription="Record test case."/>
            <div className="w-full h-full">
                {isLoading && <FullScreenSyncLoader/>}
                {(testCase && !isLoading) &&
                    <RecordingTestCaseScreen
                        testCase={testCase}
                        screenshotUrl={testCaseElement?.screenshotUrl || null}
                        menu={testCaseElement?.menu || null}
                        onPreviewTestCaseClick={previewTestCase}
                        onSaveTestCaseClick={saveTestCase}
                    />
                }
            </div>
        </>
    )
}

interface RecordingTestCaseScreenProp {
    testCase: TestCase,
    screenshotUrl: string | null,
    menu: Menu | null,
    onPreviewTestCaseClick: () => void,
    onSaveTestCaseClick: () => void
}

function RecordingTestCaseScreen(
    {testCase, screenshotUrl, menu, onPreviewTestCaseClick, onSaveTestCaseClick}: RecordingTestCaseScreenProp
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
            <div className="flex-1 flex">
                <div className="flex-1">
                    {menu?.elements && menu?.elements.length === 0 &&
                        <div className="flex items-center justify-center h-full">
                            No elements found.
                        </div>
                    }
                    {(menu?.elements && menu?.elements.length > 0) &&
                        <div className="h-full w-full overflow-y-auto pt-8 flex flex-col items-start gap-2">
                            <h2 className="font-medium text-xl mb-4">Select Element:</h2>
                            {
                                menu?.elements.map((element, index) => {
                                    return ElementItemView({
                                        key: index,
                                        element: element
                                    })
                                })
                            }
                        </div>
                    }
                </div>
                <div className="flex-1 flex items-center justify-center">
                    {screenshotUrl &&
                        <Image src={screenshotUrl} alt={testCase.testCaseName} width={360} height={780}
                               priority={true}/>
                    }
                </div>
            </div>
        </div>
    )
}