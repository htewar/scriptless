'use client'

import { SearchInput } from "@/components/ui/search";
import { useEffect, useState } from "react";
import { ClipLoader } from "react-spinners";
import TestCaseItemView from "../components/testCaseItemView";
import { TestCase } from "../../models/TestCase";
import { apiClient } from '../../../lib/api/apiClient';

export default function TestCasesListScreen() {
    const [isLoading, setLoading] = useState(false);
    const [testCases, setTestCases] = useState<TestCase[]>([])

    useEffect(() => {
        setLoading(true)
        apiClient.getTestCases()
            .then((data) => {
                setTestCases(data)
                setLoading(false)
            })
    }, [])

    return (
        <div className="w-full h-full flex flex-col items-center">
            <div className="max-w-4xl w-full h-full p-10">
                <SearchInput placeholder="Search TestCase" />
                <div className="flex flex-col gap-4 h-full pt-8 items-center">
                    {(isLoading) && <ClipLoader />}
                    {(!isLoading && testCases.length > 0) &&
                        testCases.map(testCase =>
                            <TestCaseItemView
                                platform={testCase.platform}
                                testCaseName={testCase.name}
                                key={testCase.id}
                            />
                        )
                    }
                </div>
            </div>
        </div>
    );
}