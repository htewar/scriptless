'use client'

import SideNavBar from "@/app/lib/ui/components/navBar";
import { useParams } from "next/navigation";


export default function RootLayout({ children, }: Readonly<{ children: React.ReactNode; }>) {
    const { slug } = useParams();
    return (
        <html lang="en">
            <body>
                <div className="h-screen flex">
                    <SideNavBar platform={(slug as string)} />
                    <div className="flex-1">
                        {children}
                    </div>
                </div>
            </body>
        </html>
    );
}
