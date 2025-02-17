"use client"

import { Sidebar } from "lucide-react";
import { useParams } from "next/navigation";
import TestCasesListScreen from "@/app/lib/ui/screens/testCasesListScreen";

export default function () {
    const { slug } = useParams();

    return (
        <TestCasesListScreen />
    );
}