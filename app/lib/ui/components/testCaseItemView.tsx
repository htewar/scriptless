import Image from 'next/image';
import { Play, Pencil } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { TestCase} from "@/app/lib/models/TestCasesApiResponse";

interface TestCaseItemViewProps {
    testCase: TestCase,
    userId: string,
}

export default function TestCaseItemView(
    itemProps: TestCaseItemViewProps
) {
    const { slug } = useParams();
    const testCase = itemProps.testCase
    return (
        <div className="px-6 w-full">
            <div className='flex items-center space-x-6 justify-between border rounded-lg px-4 border-black/30 py-2'>
                <div className='flex items-center space-x-4'>
                    <div>
                        {testCase.platform === 'android' ? (
                            <Image src="/android-logo.svg" alt="Android" width={18} height={18} />
                        ) : (
                            <Image src="/apple-logo.svg" alt="iOS" width={16} height={16} />
                        )}
                    </div>
                    <div className='text-2xl'>{testCase.testCaseName}</div>
                </div>
                <div className='flex items-center space-x-6'>
                    <p className='text-sm rounded-full border border-black/50 px-4'>{testCase.appName}</p>
                    <Link href="">
                        <Play fill='#000000' className='w-[24] h-[24]' />
                    </Link>
                    <Link href={`/console/${slug}/test-case/${itemProps.testCase.testCaseUUID}/record`}>
                        <Pencil fill='#000000' color='#FFFFFF' className='w-[28] h-[28]' />
                    </Link>
                </div>
            </div>
        </div>
    );
}
