import { Plus, List, History } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { RoutePaths } from '../../utils/routes';
import { Strings } from '../../utils/strings';
import { Separator } from '@/components/ui/separator';

const SideBarOptions = (platform: string) => [
    {
        name: "Add Test Case",
        icon: <Plus />,
        route: RoutePaths.NewTestCase(platform)
    },
    {
        name: "TestCases",
        icon: <List />,
        route: RoutePaths.TestCases(platform)
    },
    {
        name: "History",
        icon: <History />,
        route: RoutePaths.History(platform)
    },
];

interface SideNavBarProps {
    platform: string
}

export default function SideNavBar(
    { platform }: SideNavBarProps
) {
    const route = useRouter()
    return (
        <div className="w-[180] bg-[#D0DCE0] flex flex-col items-center">
            <h1 className='py-4 text-2xl font-bold'>{Strings.AppName}</h1>
            <Separator className="mt-1 bg-black/10" />
            <div className='flex flex-col gap-4 mt-8'>
                {
                    SideBarOptions(platform).map(
                        (option, index) => (
                            <Button
                                key={index}
                                className='flex gap-2 items-center justify-start border border-black hover:bg-black/50 hover:text-white hover:border-transparent'
                                variant="outline"
                                onClick={() => route.push(option.route)}
                            >
                                {option.icon}
                                {option.name}
                            </Button>
                        )
                    )
                }
            </div>
        </div>
    );
}