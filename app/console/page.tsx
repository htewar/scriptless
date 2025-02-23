"use client"

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { Strings } from "../lib/utils/strings";
import { RoutePaths } from "../lib/utils/routes";
import Image from "next/image";

const ConsolePlatforms = [
    {
        name: "Mobile Test Automation",
        icon: "/mobile.svg",
        iconSize: "w-14 h-14",
        slug: "mobile",
    },
    {
        name: "Backend Test Automation",
        icon: "/backend.svg",
        iconSize: "w-12 h-12",
        slug: "backend",
    },
    {
        name: "Web Test Automation",
        icon: "/web.svg",
        iconSize: "w-12 h-12",
        slug: "web",
    },

]

export default function Home() {
    const router = useRouter()
    return (
        <div className="h-screen w-screen">
            <div className="max-w-4xl mx-auto pt-16">
                <p className="text-4xl font-bold">Welcome to {Strings.AppName}</p>
                <p className="text-2xl mt-4">Get started by automating Test cases.</p>
                <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                    {ConsolePlatforms.map(platform => (
                        <div key={platform.slug} className="bg-white rounded-lg p-4 border border-black">
                            <div className="flex">
                                <p className="text-3xl font-medium">{platform.name}</p>
                                <Image src={platform.icon} alt={platform.name} className={platform.iconSize} />
                            </div>
                            <Button
                                variant="outline"
                                className="rounded-full mt-4"
                                onClick={() => {
                                    router.push(`/console/${platform.slug}`)
                                    router.push(RoutePaths.TestCases(platform.slug))
                                }}
                            >
                                Get Started <ArrowRight />
                            </Button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}