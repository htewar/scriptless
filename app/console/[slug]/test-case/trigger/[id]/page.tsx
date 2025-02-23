"use client"

import Metadata from "@/app/lib/ui/components/ComponentMetaData"
import { zodResolver } from "@hookform/resolvers/zod"
import { Input } from "@/components/ui/input"
import { z } from "zod"
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
import { Button } from "@/components/ui/button"
import FileUploadButton from "@/app/lib/ui/components/FileUploadButton"
import { useForm } from "react-hook-form"
import { useParams, useRouter } from "next/navigation"
import { RoutePaths } from "@/app/lib/utils/routes"

const formSchema = z.object({
    application: z.string(),
    targetOs: z.string(),
    targetDevice: z.string(),
    deviceLab: z.string(),
})

export default function TriggerNewTestCase() {
    const router = useRouter()
    const { slug } = useParams();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            application: "",
            targetOs: "",
            targetDevice: "",
            deviceLab: "",
        },
    })
    return (
        <>
            <Metadata seoTitle="Trigger Test Case | Script less" seoDescription="Trigger Test Case" />
            <div className="h-full w-full flex items-center justify-center">
                <div className="border border-primary py-4 w-[500] px-20 rounded-lg">
                    <h1 className="text-2xl font-bold text-center">Trigger Test Case</h1>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit((_) => { })}>
                            <div className="mt-6" />
                            <FormField
                                control={form.control}
                                name="application"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Test Method Name</FormLabel>
                                        <FormControl>
                                            <Input
                                                disabled={true}
                                                placeholder="Application"
                                                type="string" {...field}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <div className="mt-4" />
                            <FormField
                                control={form.control}
                                name="targetOs"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Target OS</FormLabel>
                                        <Select
                                            defaultValue={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Target OS" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="13">Android 13</SelectItem>
                                                <SelectItem value="14">Android 14</SelectItem>
                                                <SelectItem value="15">Android 15</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="mt-4" />
                            <FormField
                                control={form.control}
                                name="targetDevice"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Target Device</FormLabel>
                                        <Select
                                            defaultValue={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Target Device" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="1">Pixel</SelectItem>
                                                <SelectItem value="2">Nexus</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="mt-4" />
                            <FormField
                                control={form.control}
                                name="deviceLab"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Device Lab</FormLabel>
                                        <Select
                                            defaultValue={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Device Lab" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="1">Device Lab 1</SelectItem>
                                                <SelectItem value="2">Device Lab 2</SelectItem>
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
                        disabled={false}
                        label="Config file"
                        accept="application/json"
                        onFileChange={(file: FileList | null) => { }}
                    />
                    <div className="mt-4" />
                    <FileUploadButton
                        disabled={false}
                        label="APK File"
                        accept=".apk,.aab"
                        onFileChange={(file: FileList | null) => { }}
                    />
                    <div className="mt-12" />
                    <div className="flex items-center gap-2">
                        <Button
                            className="w-full rounded-full bg-black text-white hover:bg-transparent hover:border hover:text-black"
                            onClick={() => {
                                router.replace(RoutePaths.TestCases(`${slug}`))
                            }}
                        >
                            Save
                            {/* {(isLoading ? <BeatLoader color="#000000" /> : "Save")} */}
                        </Button>
                        {/* {errorMessage && <p className="text-red-500 text-sm font-bold">{errorMessage}</p>} */}
                    </div>
                </div>
            </div>
        </>
    )
}