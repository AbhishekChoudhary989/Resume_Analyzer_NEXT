"use client";

import React, { useEffect } from "react";
import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import { usePuterStore } from "@/app/lib/store";

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const { init } = usePuterStore();

    // Initialize store on mount
    useEffect(() => {
        init();
    }, [init]);

    // Check if we are on the CodeQuest page
    const isCodeQuest = pathname?.startsWith("/codequest");

    return (
        <>
            {/* Show Global Navbar only if NOT on CodeQuest */}
            {!isCodeQuest && <Navbar />}

            {/* Add padding-top to prevent content overlap, only when Navbar is visible */}
            <div className={!isCodeQuest ? "pt-[73px]" : ""}>
                {children}
            </div>
        </>
    );
}