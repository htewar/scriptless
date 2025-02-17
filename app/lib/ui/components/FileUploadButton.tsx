"use client"

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { CloudUpload } from "lucide-react";
import { useRef, useState } from "react";
import { set } from "zod";

interface FileUploadButtonProps {
    label: string,
    accept: string;
    onFileChange: (file: FileList | null) => void;
    disabled: boolean | false;
}

export default function FileUploadButton({
    label,
    accept,
    onFileChange,
    disabled
}: FileUploadButtonProps) {
    const fileUploadRef = useRef<HTMLInputElement | null>(null)
    const [selectedFileName, setSelectedFileName] = useState<string | null>(null)
    return (
        <>
            <Label className="text">{label}</Label>
            <input
                type="file"
                accept={accept}
                ref={fileUploadRef}
                className="hidden"
                onChange={(e) => {
                    const files = e.target.files;
                    const file = e.target.files?.[0];
                    if (file) {
                        setSelectedFileName(file.name);
                    }
                    onFileChange(files);
                }}
            />
            <Button
                className="w-full mt-2 bg-white text-black hover:bg-white"
                onClick={() => {
                    fileUploadRef.current?.click();
                }}
                disabled={disabled}
            >
                {selectedFileName ? selectedFileName : <CloudUpload />}
                {selectedFileName ? "" : "Upload File"}
            </Button>
        </>
    );
}