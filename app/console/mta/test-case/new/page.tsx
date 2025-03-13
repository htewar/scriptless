'use client'

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {z} from "zod"
import {zodResolver} from "@hookform/resolvers/zod"
import {useForm} from "react-hook-form"
import {Button} from "@/components/ui/button"
import {BeatLoader} from "react-spinners"
import {Input} from "@/components/ui/input"
import {useState, useEffect} from "react";
import {useRouter} from 'next/navigation'
import Cookies from "js-cookie";
import Metadata from "@/app/lib/ui/components/ComponentMetaData"
import {apiClient} from "@/app/lib/api/apiClient";
import {Build} from "@/app/lib/models/GetBuildsApiResponse";
import {CreateTestCaseApiResponse} from "@/app/lib/models/TestCasesApiResponse";
import {RoutePaths} from "@/app/lib/utils/routes";
import FileUploadButton from "@/app/lib/ui/components/FileUploadButton";
import Image from "next/image";

const formSchema = z.object({
    application: z.string(),
    methodName: z.string(),
    platform: z.string(),
})

export default function AddNewTestCaseScreen() {

    const router = useRouter()

    const [methodName, setMethodName] = useState<string>("")
    const [platform, setPlatform] = useState<string>("")
    const [application, setApplication] = useState<string>("")
    const [configFile, setConfigFile] = useState<FileList | null>(null)
    const [errorMessage, setErrorMessage] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [uid, setUid] = useState<string>("")
    const [builds, setBuilds] = useState<Build[]>([])

    useEffect(() => {
        const userId = Cookies.get('uid') as string;
        const authToken = Cookies.get('authToken');
        if (!authToken) {
            router.replace("/");
        } else {
            const uid = Cookies.get('uid') as string;
            setUid(uid);
            fetchUserBuilds(userId).then(() => {
            })
        }
    }, [router])

    async function fetchUserBuilds(userId: string) {
        setIsLoading(true)
        const buildsResponse = await apiClient.getBuilds(userId)
        setIsLoading(false)
        setBuilds(buildsResponse.builds)
        setBuilds(
            buildsResponse.builds.sort((a, b) =>
                new Date(b.uploadedDate).getTime() - new Date(a.uploadedDate).getTime()
            )
        )
    }

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            application: "",
            methodName: "",
            platform: "",
        },
    })

    const isValidData = () => {
        if (application.length == 0) {
            setErrorMessage("Please select Application.")
            return false
        }
        if (methodName.length == 0) {
            setErrorMessage("Please enter Method name.")
            return false
        }
        if (configFile == null) {
            setErrorMessage("Please upload Config file")
            return false
        }
        return true
    }

    const addNewTestMethod = () => {
        if (isValidData()) {
            setIsLoading(true);
            setErrorMessage(null);
            const formData = new FormData();
            formData.append('uid', uid);
            formData.append('app_name', application);
            formData.append('platform', platform);
            formData.append('test_case_name', methodName);
            if (configFile) {
                formData.append('config', configFile[0]);
            }
            apiClient.addNewTestMethod(formData)
                .then((response: CreateTestCaseApiResponse) => {
                    setIsLoading(false);
                    if (response.isError) {
                        setErrorMessage(response.errorMessage || "Failed to add new test method.");
                    } else {
                        if (response.testCase == null) {
                            setErrorMessage("Failed to add new test method.");
                            return;
                        }
                        const url = RoutePaths.Recording(`mta`, `${response.testCase.testCaseUUID}`);
                        router.replace(url)
                    }
                })
                .catch((error) => {
                    console.log(error)
                })
        }
    }

    const setApplicationData = (application: string) => {
        setApplication(application.split(".")[0])
        setErrorMessage(null)
        if (application.includes(".aab") || application.includes(".apk")) {
            setPlatform("Android");
            form.setValue("platform", "Android");
        } else if (application.includes(".ipa") || application.includes(".app")) {
            setPlatform("iOS");
            form.setValue("platform", "iOS");
        } else {
            setPlatform("");
            form.setValue("platform", "");
        }
    }

    return (
        <>
            <Metadata seoTitle="Create Test Case | Script less" seoDescription="Create New Test Case" />
            <div className="h-full w-full flex items-center justify-center">
                <div className="border border-primary py-4 w-[500] px-20 rounded-lg">
                    <h1 className="text-2xl font-bold text-center">Create New Test Case</h1>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(() => { })}>
                            <div className="mt-6" />
                            <FormField
                                control={form.control}
                                name="application"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Application</FormLabel>
                                        <Select
                                            disabled={isLoading}
                                            onValueChange={(event) =>
                                                setApplicationData(event)
                                            }
                                            defaultValue={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select Application" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {builds.map((build) => (
                                                    <SelectItem key={build.buildUUID}
                                                                value={`${build.name}${build.ext}`}>
                                                        {(build.platform === "android") ? (
                                                            <Image src="/android-logo.svg" alt="Android"
                                                                   className="w-4 h-4 inline-block mr-1" width={20}
                                                                   height={20}/>
                                                        ) : (
                                                            <Image src="/apple-logo.svg" alt="iOS"
                                                                   className="w-3 h-3.5 inline-block mr-2" width={20}
                                                                   height={20}/>
                                                        )}
                                                        {build.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="mt-4" />
                            <FormField
                                control={form.control}
                                name="platform"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Platform</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Platform"
                                                disabled={true}
                                                type="string" {...field}
                                                value={platform}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="mt-4" />
                            <FormField
                                control={form.control}
                                name="methodName"
                                render={({ field }) => (
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
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </form>
                    </Form>
                    <div className="mt-4" />
                    <FileUploadButton
                        label="Config file"
                        accept="application/json"
                        onFileChange={(file: FileList | null) => {
                            setConfigFile(file)
                            setErrorMessage(null)
                        }}
                        disabled={isLoading}
                    />
                    <div className="mt-6" />
                    <div className="flex items-center gap-2">
                        <Button className=""
                                onClick={addNewTestMethod}
                                disabled={isLoading}
                        >
                            {(isLoading ? <BeatLoader color="#FFFFFF"/> : "Save")}
                        </Button>
                        {errorMessage && <p className="text-red-500 text-sm font-bold">{errorMessage}</p>}
                    </div>
                </div>
            </div >
        </>
    );
}