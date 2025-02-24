"use client"

import {useRouter} from "next/navigation";
import {useCallback, useEffect, useState} from "react";
import {TestCase} from "@/app/lib/models/TestCasesApiResponse";
import {useInView} from "react-intersection-observer";
import Cookies from "js-cookie";
import {debounce} from "@/app/lib/utils/utils";
import {apiClient} from "@/app/lib/api/apiClient";
import {SearchInput} from "@/components/ui/search";
import {ClipLoader} from "react-spinners";
import TestCaseItemView from "@/app/lib/ui/components/testCaseItemView";

export default function TestCases() {
    const router = useRouter()
    const [isLoading, setLoading] = useState(false);
    const [testCases, setTestCases] = useState<TestCase[]>([])
    const [currentPageOffset, setCurrentPageOffset] = useState(0)
    const [searchQuery, setSearchQuery] = useState("")
    const [isLastPage, setIsLastPage] = useState(false)
    const [userId, setUid] = useState("")
    const {ref, inView} = useInView({
        threshold: 0,
    });

    useEffect(() => {
        const authToken = Cookies.get('authToken');
        if (!authToken) {
            router.push("/");
        } else {
            const uid = Cookies.get('uid') as string;
            setUid(uid);
            debouncedSearch(searchQuery, uid);
        }
    }, [router, searchQuery])

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const debouncedSearch = useCallback(
        debounce((query: string, uid: string) => {
            if (isLoading) return;
            setLoading(true);
            setCurrentPageOffset(0);
            setTestCases([])
            fetchTestCases(uid, query, 0).then(() => {
            })
        }, 500),
        [isLoading]
    );

    const fetchTestCases = async (uid: string, query: string, offset: number) => {
        const response = await apiClient.getTestCases(uid, query, offset)
        setLoading(false)
        if (!response.isError) {
            setTestCases((prev: TestCase[]) => [
                ...(prev?.length > 0 ? prev : []),
                ...response.testCases
            ])
            setIsLastPage(response.testCases.length < 20);
            setCurrentPageOffset(prevOffset => prevOffset + 20);
        }
    }

    useEffect(() => {
        if (inView && !isLoading && !isLastPage) {
            setLoading(true)
            fetchTestCases(userId, searchQuery || "", currentPageOffset).then(() => {
            })
        }
    }, [inView, isLoading, isLastPage, searchQuery, currentPageOffset, userId])

    return (
        <div className="flex h-screen flex-col items-center overflow-y-auto no-scrollbar">
            <div className="max-w-4xl w-full h-full p-10">
                <SearchInput
                    placeholder="Search TestCase"
                    onChange={
                        (value) => {
                            setSearchQuery(value.target.value)
                        }
                    }
                />
                <div className="flex flex-col gap-4 h-full pt-4 mt-4 items-center overflow-y-auto no-scrollbar">
                    {(isLoading && currentPageOffset == 0) && <ClipLoader/>}
                    {(testCases.length > 0) &&
                        testCases.map((testCase, index) =>
                            <TestCaseItemView
                                key={index}
                                testCase={testCase}
                                userId={userId}
                            />
                        )
                    }
                    {(testCases.length > 0 && !isLastPage) &&
                        <div className="mb-5" ref={ref}>
                            <p className="text-foreground my-auto mx-auto">Loading...</p>
                        </div>
                    }

                </div>
            </div>
        </div>
    );
}