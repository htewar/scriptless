import Image from 'next/image';
import { Play, Pencil } from 'lucide-react';
import { Platform } from '../../models/Platform';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { RoutePaths } from '../../utils/routes';

interface TestCaseItemViewProps {
    platform: Platform,
    testCaseName: string,
}

export default function TestCaseItemView(
    itemProps: TestCaseItemViewProps
) {
    const { slug } = useParams();
    return (
        <div className="px-6 w-full">
            <div className='flex items-center space-x-6 justify-between border rounded-lg px-4 border-black/30 py-2'>
                <div className='flex items-center space-x-4'>
                    <div>
                        {itemProps.platform === Platform.Android ? (
                            <Image src="/android-logo.svg" alt="Android" width={18} height={18} />
                        ) : (
                            <Image src="/apple-logo.svg" alt="iOS" width={16} height={16} />
                        )}
                    </div>
                    <div className='text-2xl'>{itemProps.testCaseName}</div>
                </div>
                <div className='flex items-center space-x-6'>
                    <Link href={`${RoutePaths.Trigger(slug as string, '1')}`}>
                        <Play fill='#000000' className='w-[24] h-[24]' />
                    </Link>
                    <Link href="">
                        <Pencil fill='#000000' color='#FFFFFF' className='w-[28] h-[28]' />
                    </Link>
                </div>
            </div>
        </div>
    );
}
