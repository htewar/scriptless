import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {Menu} from "@/app/lib/models/RecordingTestCaseApiResponse";
import {useState} from 'react';
import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";

interface ElementItemViewProp {
    index: number
    menu: Menu,
    onOptionSelect: (menu: Menu, action: string, input: string | null) => void
}

export function ElementItemView(
    {index, menu, onOptionSelect}: ElementItemViewProp
) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [inputValue, setInputValue] = useState('');

    const handleInputSelect = () => {
        setIsDialogOpen(true);
        // onOptionSelect(menu, action, inputValue);
    };

    const handleContinue = () => {
        onOptionSelect(menu, "input", inputValue);
        setIsDialogOpen(false);
        setInputValue('');
    };

    return (
        <>
            <DropdownMenu key={index}>
                <DropdownMenuTrigger>
                    <div className="px-2 py-1 rounded border border-accent-foreground w-[320px]">
                        <p className="w-full break-words">
                            {`${menu.label ? menu.label : menu.title ? menu.title : menu.resourceId ? menu.resourceId : menu.classType ? menu.classType : menu.name ? menu.name : menu.type}`}
                        </p>
                    </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    {
                        menu.actions.map((action, index) => {
                            return <DropdownMenuItem key={index}
                                                     onSelect={() => action === 'Enter Text' ? handleInputSelect() : onOptionSelect(menu, action, null)}>{
                                action === 'clickable' ? 'Click' : action
                            }</DropdownMenuItem>
                        })
                    }
                </DropdownMenuContent>
            </DropdownMenu>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-md bg-gray-200">
                    <DialogHeader>
                        <DialogTitle>Enter Text</DialogTitle>
                    </DialogHeader>
                    <Input value={inputValue} onChange={(e) => setInputValue(e.target.value)}/>
                    <DialogFooter>
                        <Button onClick={handleContinue}>Continue</Button>
                        <Button variant="secondary" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}
