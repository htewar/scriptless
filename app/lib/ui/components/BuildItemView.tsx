import {Button} from "@/components/ui/button";
import {Build} from "../../models/GetBuildsApiResponse";
import {Trash2} from "lucide-react";
import Image from "next/image";

interface BuildItemViewProps {
    build: Build,
    onBuildDeleteClick: (build: Build) => void
}

export default function BuildItemView({build, onBuildDeleteClick}: BuildItemViewProps) {
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
        const year = String(date.getFullYear()).slice(-2);
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${day}-${month}-${year} ${hours}:${minutes}`;
    };

    return (
        <div key={build.buildUUID}
             className="mt-2 w-full py-2 px-4 rounded-lg border border-gray-200 flex items-center justify-between">
            <div className="flex gap-4">
                {(build.platform === "android") ? (
                    <Image src="/android-logo.svg" alt="Android" width={24} height={24}/>
                ) : (
                    <Image src="/apple-logo.svg" alt="iOS" className="mr-1" width={20} height={20}/>
                )}
                {build.name}
            </div>
            <div className="flex gap-4 items-center">
                <p className="text-muted-foreground text-sm"
                   suppressHydrationWarning={true}>{formatDate(build.uploadedDate)}</p>
                <Button variant="destructive" size="icon" onClick={() => {
                    onBuildDeleteClick(build)
                }}>
                    <Trash2/>
                </Button>
            </div>
        </div>
    );
}