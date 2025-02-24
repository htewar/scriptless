"use client"

import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { BeatLoader } from "react-spinners"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import Image from "next/image"
import Metadata from "./ComponentMetaData"

const formSchema = z.object({
    username: z.string(),
    password: z.string()
})

interface LoginFormProps {
    onSubmitForm: (values: z.infer<typeof formSchema>) => void;
    onFormDataUpdate: () => void;
    isLoading: boolean;
    errorMessage: string | null;
}

export default function LoginForm({ onSubmitForm, isLoading, errorMessage, onFormDataUpdate }: LoginFormProps) {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: "",
            password: "",
        },
    })
    return (
        <>
            <Metadata seoTitle="SignIn | Script less" seoDescription="Login to your account" />
            <div>
                <div>
                    <div className="absolute z-10 left-0 top-0 h-screen w-screen">
                        <Image src="/login-background.png" layout="fill" objectFit="cover" alt="" />
                    </div>
                    <div className="absolute z-20 h-screen w-screen flex items-center justify-center -mt-10">
                        <div className="w-[400] bg-black/50 backdrop-blur-sm rounded-lg p-6 border border-white">
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmitForm)} className="text-white">
                                    <FormField
                                        control={form.control}
                                        name="username"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Username</FormLabel>
                                                <FormControl>
                                                    <Input disabled={isLoading} type="string" {...field} onChangeCapture={() => onFormDataUpdate()} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <div className="mt-4">
                                        <FormField
                                            control={form.control}
                                            name="password"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Password</FormLabel>
                                                    <FormControl>
                                                        <Input disabled={isLoading} type="password" {...field} onChangeCapture={() => onFormDataUpdate()} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    <div className="w-full flex items-start mt-8 gap-2">
                                        <Button type="submit" className="bg-white text-black hover:bg-transparent hover:border hover:text-white" disabled={isLoading}>
                                            {(isLoading ? <BeatLoader color="#000000" /> : "Sign In")}
                                        </Button>
                                        {errorMessage && <p className="text-red-500 text-sm font-bold mt-2">{errorMessage}</p>}
                                    </div>
                                </form>
                            </Form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}