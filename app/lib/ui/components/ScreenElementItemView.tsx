import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {Menu} from "@/app/lib/models/RecordingTestCaseApiResponse";
import {useState, useRef, useEffect} from 'react';
import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";

interface ElementItemViewProp {
    index: number
    menu: Menu,
    isHighlighted: boolean,
    onOptionSelect: (menu: Menu, action: string, input: string | null) => void
    onHover: (index: number) => void
}

export function ElementItemView(
    {index, menu, isHighlighted, onOptionSelect, onHover}: ElementItemViewProp
) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const elementRef = useRef<HTMLDivElement>(null);

    const handleInputSelect = () => {
        setIsDialogOpen(true);
    };

    const handleContinue = () => {
        onOptionSelect(menu, "input", inputValue);
        setIsDialogOpen(false);
        setInputValue('');
    };

    useEffect(() => {
        if (isHighlighted && elementRef.current) {
            elementRef.current.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest'
            });
        }
    }, [isHighlighted]);

    return (
        <>
            <DropdownMenu key={index}>
                <DropdownMenuTrigger>
                    <div 
                        ref={elementRef}
                        className={`px-2 py-1 rounded border w-[320px] transition-colors ${
                            isHighlighted 
                                ? 'border-blue-700 bg-blue-500/20' 
                                : 'border-accent-foreground'
                        }`}
                        onMouseEnter={() => onHover(index)}
                        onMouseLeave={() => onHover(-1)}
                    >
                        <p className="w-full break-words">
                            {`${menu.label ? menu.label : menu.title ? menu.title : menu.contentDesc ? menu.contentDesc : menu.resourceId ? menu.resourceId : menu.classType ? menu.classType : menu.name ? menu.name : menu.type}`}
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
