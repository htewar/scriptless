'use client'

import SideNavBar from "@/app/lib/ui/components/navBar";


export default function RootLayout({ children, }: Readonly<{ children: React.ReactNode; }>) {
    return (
        <div className="h-screen flex">
            <SideNavBar platform={`mta`}/>
            <div className="flex-1">
                {children}
            </div>
        </div>
    );
}
