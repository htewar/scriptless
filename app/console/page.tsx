"use client"

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Strings } from "../lib/utils/strings";
import { RoutePaths } from "../lib/utils/routes";
import Image from "next/image";
import Link from "next/link";

const ConsolePlatforms = [
    {
        name: "Mobile Test Automation",
        icon: "/mobile.svg",
        iconSize: "w-14 h-14",
        slug: "mta",
    },
    {
        name: "Backend Test Automation",
        icon: "/backend.svg",
        iconSize: "w-12 h-12",
        slug: "bta",
    },
    {
        name: "Web Test Automation",
        icon: "/web.svg",
        iconSize: "w-12 h-12",
        slug: "wta",
    },
];

export default function Home() {
    return (
        <>
            <div className="h-screen w-screen">
                <div className="max-w-4xl mx-auto pt-16">
                    <p className="text-4xl font-bold">Welcome to {Strings.AppName}</p>
                    <p className="text-2xl mt-4">Get started by automating Test cases.</p>
                    <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                        {ConsolePlatforms.map((platform) => (
                            <div key={platform.slug} className="bg-white rounded-lg p-4 border border-black">
                                <div className="flex">
                                    <p className="text-3xl font-medium">{platform.name}</p>
                                    <Image src={platform.icon} alt={platform.name} width={56} height={56} className={platform.iconSize} />
                                </div>
                                <Link href={RoutePaths.TestCases(platform.slug)} passHref>
                                    <Button variant="outline" className="rounded-full mt-4">
                                        Get Started <ArrowRight />
                                    </Button>
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}