import {TestCaseElement} from "@/app/lib/models/TestCaseElement";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"


interface ElementItemViewProp {
    key: number
    element: TestCaseElement
}

export function ElementItemView(
    {key, element}: ElementItemViewProp
) {
    return (
        <DropdownMenu key={key}>
            <DropdownMenuTrigger
                className="px-2 py-1 rounded border border-accent-foreground">{element.elementTitle}</DropdownMenuTrigger>
            <DropdownMenuContent>
                {
                    element.elementActions.map((action, index) => {
                        return <DropdownMenuItem key={index}>{action}</DropdownMenuItem>
                    })
                }
            </DropdownMenuContent>
        </DropdownMenu>
    )
}