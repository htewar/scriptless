"use client"

import Image from 'next/image';
import { Platform } from '../../models/Platform';
import Link from 'next/link';
import { useParams } from 'next/navigation';

interface HistoryTestCaseItemViewProps {
    platform: Platform,
    testCaseName: string,
}

export default function HistoryTestCaseItemView(
    itemProps: HistoryTestCaseItemViewProps
) {
    const { slug } = useParams();
    return (
        <div className="px-6 w-full">
            <div className='flex w-full items-center justify-between border rounded-lg px-4 border-black/30 py-2'>
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
                    <p className='text-sm rounded-full border border-black/50 px-4'>Carbon</p>
                    <p className='font-bold text-[#24BA80]'>Passed</p>
                </div>
            </div>
        </div>
    );
}
