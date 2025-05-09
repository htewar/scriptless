"use client"

import {useParams, useRouter} from "next/navigation";
import {useEffect, useState, useCallback} from "react";
import Cookies from "js-cookie";
import {apiClient} from "@/app/lib/api/apiClient";
import {CreateTestCaseApiResponse, TestCase} from "@/app/lib/models/TestCasesApiResponse";
import Metadata from "@/app/lib/ui/components/ComponentMetaData";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import FileUploadButton from "@/app/lib/ui/components/FileUploadButton";
import {Button} from "@/components/ui/button";
import {BeatLoader} from "react-spinners";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {RoutePaths} from "@/app/lib/utils/routes";

const formSchema = z.object({
    application: z.string(),
    methodName: z.string(),
    platform: z.string(),
})

export default function EditPage() {
    const router = useRouter()
    const {id} = useParams();
    const [isLoading, setIsLoading] = useState(false);
    const [uid, setUid] = useState("");
    const [methodName, setMethodName] = useState<string>("")
    const [errorMessage, setErrorMessage] = useState<string | null>(null)
    const [configFile, setConfigFile] = useState<FileList | null>(null)
    const [isDataFetched, setIsDataFetched] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            application: "",
            methodName: "",
            platform: "",
        },
    })

    const fetchTestCase = useCallback(async (userId: string, id: string) => {
        const response = await apiClient.getTestCase(userId, id);
        const testCase = response.data as TestCase;
        form.setValue("platform", testCase.platform);
        form.setValue("application", testCase.appName);
        form.setValue("methodName", testCase.testCaseName);
        setMethodName(testCase.testCaseName);
        setIsLoading(false);
    }, [form]);

    useEffect(() => {
        if (isDataFetched) return;
        setIsLoading(true);
        const userId = Cookies.get("uid") as string;
        if (!userId) router.replace("/");
        setUid(userId)
        const response = fetchTestCase(userId, (id as string))
        setIsDataFetched(true)
        console.log(response)
    }, [fetchTestCase, id, isDataFetched, router]);

    const isValidData = () => {
        if (methodName.length == 0) {
            setErrorMessage("Please enter Method name.")
            return false
        }
        return true
    }

    const updateTestCase = () => {
        if (isValidData()) {
            setIsLoading(true);
            setErrorMessage(null);
            const formData = new FormData();
            formData.append('uid', uid);
            formData.append('id', (id as string));
            formData.append('test_case_name', methodName);
            if (configFile) {
                formData.append('config', configFile[0]);
            }
            apiClient.updateTestCase(formData)
                .then((response: CreateTestCaseApiResponse) => {
                    setIsLoading(false);
                    if (response.isError) {
                        setErrorMessage(response.errorMessage || "Failed to add new test method.");
                    } else {
                        const url = RoutePaths.TestCases(`mobile`);
                        router.replace(url)
                    }
                })
        }
    }

    return (
        <>
            <Metadata seoTitle="Edit Test Case | Scriptless" seoDescription="Edit New Test Case"/>
            <div className="h-full w-full flex items-center justify-center">
                <div className="border border-primary py-4 w-[500] px-20 rounded-lg">
                    <h1 className="text-2xl font-bold text-center">Edit New Test Case</h1>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(() => {
                        })}>
                            <div className="mt-6"/>
                            <FormField
                                control={form.control}
                                name="application"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Application</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Application"
                                                disabled={true}
                                                type="string" {...field}
                                            />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                            <div className="mt-4"/>
                            <FormField
                                control={form.control}
                                name="platform"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Platform</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Platform"
                                                disabled={true}
                                                type="string" {...field}
                                            />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                            <div className="mt-4"/>
                            <FormField
                                control={form.control}
                                name="methodName"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Test Method Name</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Method name"
                                                disabled={isLoading}
                                                type="string" {...field}
                                                onChangeCapture={targetValue => {
                                                    setMethodName(targetValue.currentTarget.value)
                                                    setErrorMessage(null)
                                                }}
                                            />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                        </form>
                    </Form>
                    <div className="mt-4"/>
                    <FileUploadButton
                        label="Config file"
                        accept="application/json"
                        onFileChange={(file: FileList | null) => {
                            setConfigFile(file)
                            setErrorMessage(null)
                        }}
                        disabled={isLoading}
                    />
                    <div className="mt-6"/>
                    <div className="flex items-center gap-2">
                        <Button className=""
                                onClick={updateTestCase}
                                disabled={isLoading}
                        >
                            {(isLoading ? <BeatLoader color="#FFFFFF"/> : "Save")}
                        </Button>
                        {errorMessage && <p className="text-red-500 text-sm font-bold">{errorMessage}</p>}
                    </div>
                </div>
            </div>
        </>
    )
}