"use client"

import { useState, useEffect } from "react";
import { SearchInput } from "@/components/ui/search";
import { ClipLoader } from "react-spinners";

export default function History() {
    const [isLoading, setLoading] = useState(false);


    useEffect(() => {
        setLoading(true)
    }, [])

    return (
        <div className="w-full h-full flex flex-col items-center">
            <div className="max-w-4xl w-full h-full p-10">
                <SearchInput placeholder="Search TestCase" />
                <div className="flex flex-col gap-4 h-full pt-8 items-center">
                    {(isLoading) && <ClipLoader />}
                    {/*{(!isLoading && testCases.length > 0) &&*/}
                    {/*    testCases.map(testCase =>*/}
                    {/*        <HistoryTestCaseItemView*/}
                    {/*            platform={testCase.platform}*/}
                    {/*            testCaseName={testCase.name}*/}
                    {/*            key={testCase.id}*/}
                    {/*        />*/}
                    {/*    )*/}
                    {/*}*/}
                </div>
            </div>
        </div>
    );
}