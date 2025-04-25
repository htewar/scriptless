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
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";

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
    const [isInputDialogOpen, setIsInputDialogOpen] = useState(false);
    const [isAssertDialogOpen, setIsAssertDialogOpen] = useState(false);
    const [isScrollDialogOpen, setIsScrollDialogOpen] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [assertType, setAssertType] = useState<string>('');
    const [comparisonType, setComparisonType] = useState<string>('');
    const [assertInputValue, setAssertInputValue] = useState('');
    const elementRef = useRef<HTMLDivElement>(null);

    const handleInputSelect = () => {
        setIsInputDialogOpen(true);
    };

    const handleAssertSelect = () => {
        setIsAssertDialogOpen(true);
    };

    const handleScrollSelect = () => {
        setIsScrollDialogOpen(true);
    };

    const handleInputContinue = () => {
        onOptionSelect(menu, "input", inputValue);
        setIsInputDialogOpen(false);
        setInputValue('');
    };

    const handleAssertContinue = () => {
        let action = '';
        switch (assertType) {
            case 'Is Visible':
                action = 'assert_visible';
                break;
            case 'Value':
                action = `assert_value_${comparisonType}`;
                break;
            case 'RegEx':
                action = `assert_regex_${comparisonType}`;
                break;
        }
        onOptionSelect(menu, action, assertInputValue);
        setIsAssertDialogOpen(false);
        setAssertType('');
        setComparisonType('');
        setAssertInputValue('');
    };

    const handleScrollContinue = (direction: string) => {
        onOptionSelect(menu, `scroll_${direction}`, null);
        setIsScrollDialogOpen(false);
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
                            {`${menu.label ? menu.label : menu.title ? menu.title : menu.text ? menu.text : menu.contentDesc ? menu.contentDesc : menu.resourceId ? menu.resourceId : menu.classType ? menu.classType : menu.name ? menu.name : menu.type}`}
                        </p>
                    </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    {
                        menu.actions.map((action, index) => {
                            return <DropdownMenuItem key={index}
                                                     onSelect={() => {
                                                         if (action === 'Enter Text') {
                                                             handleInputSelect();
                                                         } else if (action === 'Assert') {
                                                             handleAssertSelect();
                                                         } else if (action === 'Scroll') {
                                                             handleScrollSelect();
                                                         } else {
                                                             onOptionSelect(menu, action, null);
                                                         }
                                                     }}>{
                                action === 'clickable' ? 'Click' : action
                            }</DropdownMenuItem>
                        })
                    }
                </DropdownMenuContent>
            </DropdownMenu>

            {/* Input Dialog */}
            <Dialog open={isInputDialogOpen} onOpenChange={setIsInputDialogOpen}>
                <DialogContent className="max-w-md bg-gray-200">
                    <DialogHeader>
                        <DialogTitle>Enter Text</DialogTitle>
                    </DialogHeader>
                    <Input value={inputValue} onChange={(e) => setInputValue(e.target.value)}/>
                    <DialogFooter>
                        <Button onClick={handleInputContinue}>Continue</Button>
                        <Button variant="secondary" onClick={() => setIsInputDialogOpen(false)}>Cancel</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Assert Dialog */}
            <Dialog open={isAssertDialogOpen} onOpenChange={setIsAssertDialogOpen}>
                <DialogContent className="max-w-md bg-gray-200">
                    <DialogHeader>
                        <DialogTitle>Select Assertion Type</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <Select onValueChange={setAssertType} value={assertType}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select assertion type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Is Visible">Is Visible</SelectItem>
                                <SelectItem value="Value">Value</SelectItem>
                                <SelectItem value="RegEx">RegEx</SelectItem>
                            </SelectContent>
                        </Select>

                        {assertType === 'Value' && (
                            <div className="space-y-2">
                                <Select onValueChange={setComparisonType} value={comparisonType}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select comparison type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="less_than">Less Than</SelectItem>
                                        <SelectItem value="greater_than">Greater Than</SelectItem>
                                        <SelectItem value="equal_to">Equal To</SelectItem>
                                        <SelectItem value="not_equal_to">Not Equal To</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Input 
                                    value={assertInputValue} 
                                    onChange={(e) => setAssertInputValue(e.target.value)}
                                    placeholder="Enter value to compare"
                                />
                            </div>
                        )}

                        {assertType === 'RegEx' && (
                            <div className="space-y-2">
                                <Select onValueChange={setComparisonType} value={comparisonType}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select comparison type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="equal_to">Equal To</SelectItem>
                                        <SelectItem value="not_equal_to">Not Equal To</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Input 
                                    value={assertInputValue} 
                                    onChange={(e) => setAssertInputValue(e.target.value)}
                                    placeholder="Enter regex pattern"
                                />
                            </div>
                        )}
                    </div>
                    <DialogFooter>
                        <Button 
                            onClick={handleAssertContinue}
                            disabled={!assertType || (assertType !== 'Is Visible' && (!comparisonType || !assertInputValue))}
                        >
                            Continue
                        </Button>
                        <Button variant="secondary" onClick={() => setIsAssertDialogOpen(false)}>Cancel</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Scroll Dialog */}
            <Dialog open={isScrollDialogOpen} onOpenChange={setIsScrollDialogOpen}>
                <DialogContent className="max-w-md bg-gray-200">
                    <DialogHeader>
                        <DialogTitle>Select Scroll Direction</DialogTitle>
                    </DialogHeader>
                    <div className="grid grid-cols-2 gap-4">
                        <Button onClick={() => handleScrollContinue('up')}>Scroll Up</Button>
                        <Button onClick={() => handleScrollContinue('down')}>Scroll Down</Button>
                        <Button onClick={() => handleScrollContinue('left')}>Scroll Left</Button>
                        <Button onClick={() => handleScrollContinue('right')}>Scroll Right</Button>
                    </div>
                    <DialogFooter>
                        <Button variant="secondary" onClick={() => setIsScrollDialogOpen(false)}>Cancel</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}
