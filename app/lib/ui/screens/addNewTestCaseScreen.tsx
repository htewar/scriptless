'use client'

import Metadata from "../components/ComponentMetaData";
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
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { BeatLoader } from "react-spinners"
import { Input } from "@/components/ui/input"
import { useState } from "react";
import FileUploadButton from "../components/FileUploadButton";
import { useParams, useRouter } from 'next/navigation'
import { RoutePaths } from "../../utils/routes";
import { v4 } from "uuid";

const formSchema = z.object({
    application: z.string(),
    methodName: z.string(),
    platform: z.string(),
})

export default function AddNewTestCaseScreen() {

    const router = useRouter()
    const { slug } = useParams();

    const [methodName, setMethodName] = useState<string>("")
    const [platform, setPlatform] = useState<string>("")
    const [application, setApplication] = useState<string>("")
    const [configFile, setConfigFile] = useState<FileList | null>(null)
    const [apkFile, setAPKFile] = useState<FileList | null>(null)
    const [errorMessage, setErrorMessage] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            application: "",
            methodName: "",
            platform: "",
        },
    })

    const isValidData = () => {
        // if (application.length == 0) {
        //     setErrorMessage("Please select Application.")
        //     return false
        // }
        // if (methodName.length == 0) {
        //     setErrorMessage("Please enter Method name.")
        //     return false
        // }
        // if (platform.length == 0) {
        //     setErrorMessage("Please select platform.")
        //     return false
        // }
        // if (configFile == null) {
        //     setErrorMessage("Please upload Config file")
        //     return false
        // }
        // if (apkFile == null) {
        //     setErrorMessage("Please upload APK file")
        //     return false
        // }
        return true
    }

    const addNewTestMethod = () => {
        if (isValidData()) {
            setIsLoading(true);
            setTimeout(() => {
                setIsLoading(false);
                const url = RoutePaths.Recording(`${slug as string}`, `${v4()}`);
                router.replace(url)
            }, 2000);
        }
    }

    const setPlatformData = (platform: string) => {
        setPlatform(platform)
        setErrorMessage(null)
    }

    const setApplicationData = (application: string) => {
        setApplication(application)
        setErrorMessage(null)
    }

    return (
        <>
            <Metadata seoTitle="Create Test Case | Script less" seoDescription="Create New Test Case" />
            <div className="h-full w-full flex items-center justify-center">
                <div className="border border-primary py-4 w-[500] px-20 rounded-lg">
                    <h1 className="text-2xl font-bold text-center">Create New Test Case</h1>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit((values) => { })}>
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
                                                <SelectItem value="carbon">Carbon</SelectItem>
                                                <SelectItem value="helix">Helix</SelectItem>
                                                <SelectItem value="eats">Eats</SelectItem>
                                            </SelectContent>
                                        </Select>
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
                            <div className="mt-4" />
                            <FormField
                                control={form.control}
                                name="platform"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Platform</FormLabel>
                                        <Select
                                            disabled={isLoading}
                                            onValueChange={(event) =>
                                                setPlatformData(event)
                                            }
                                            defaultValue={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select platform" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="android">Android</SelectItem>
                                                <SelectItem value="ios">iOS</SelectItem>
                                            </SelectContent>
                                        </Select>
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
                    <div className="mt-4" />
                    <FileUploadButton
                        label="APK File"
                        accept=".apk,.aab"
                        onFileChange={(file: FileList | null) => {
                            setAPKFile(file)
                            setErrorMessage(null)
                        }}
                        disabled={isLoading}
                    />
                    <div className="mt-6" />
                    <div className="flex items-center gap-2">
                        <Button className="bg-white text-black hover:bg-transparent hover:border hover:text-white"
                            onClick={addNewTestMethod}
                            disabled={isLoading}
                        >
                            {(isLoading ? <BeatLoader color="#000000" /> : "Save")}
                        </Button>
                        {errorMessage && <p className="text-red-500 text-sm font-bold">{errorMessage}</p>}
                    </div>
                </div>
            </div >
        </>
    );
}