import * as React from "react"

import { cn } from "@/lib/utils"
import { Search } from "lucide-react"

const SearchInput = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
    ({ className, type, ...props }, ref) => {
        return (
            <div className="flex items-center gap-1 border border-black rounded-full w-full px-4">
                <Search className="w-5 h-5 text-muted-foreground" />
                <input
                    type={type}
                    className={cn(
                        "flex h-9 w-full bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none  disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
                        className
                    )}
                    ref={ref}
                    {...props}
                />
            </div>
        )
    }
)
SearchInput.displayName = "SearchInput"

export { SearchInput }
