'use client'

import { Button } from '@/components/ui/button';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { SyncLoader } from 'react-spinners';
import Image from 'next/image'
import { Separator } from '@/components/ui/separator';
import { useRouter } from 'next/navigation';
import { Route } from 'lucide-react';
import { RoutePaths } from '@/app/lib/utils/routes';

export default function Recording() {
    const router = useRouter();
    const { slug, id } = useParams();
    const [isLoading, setIsLoading] = useState<Boolean>(true)

    useEffect(() => {
        if (id) {
            console.log(`Fetching data for test case id: ${id}`);
        }
    }, [id]);

    useEffect(() => {
        if (isLoading) {
            setTimeout(() => {
                setIsLoading(false)
            }, 2000);
        }
    }, [isLoading]);

    if (!id) {
        return <FullScreenLoader />;
    }

    return (
        <>
            <div className="w-full h-full items-center">
                {(isLoading) ?
                    <FullScreenLoader /> :
                    <div className="max-w-4xl mx-auto h-full flex flex-col">
                        <h1 className='text-3xl font-bold mx-auto mt-4'>Record Test Case</h1>
                        <Separator className="mt-1 bg-white/10" />
                        <div className="flex justify-between items-center pt-8">
                            <div className='flex gap-2 items-end'>
                                <p className="text-xl">Test Method: </p>
                                <h1 className='text-2xl font-bold'>Driver Go Online</h1>
                            </div>
                            <div>
                                <Button
                                    onClick={() => {
                                        router.replace(RoutePaths.TestCases(`${slug}`))
                                    }}
                                >Save</Button>
                            </div>
                        </div>
                        <div className='flex-1 flex justify-between items-center'>
                            <div></div>
                            <Image
                                src="/temp-start-screen.png"
                                width={320}
                                height={480}
                                alt=""
                            />
                        </div>
                    </div>}
            </div>
        </>
    );
}

function FullScreenLoader() {
    return <div className='flex justify-center items-center h-full'>
        <SyncLoader
            margin={4}
            size={15}
            speedMultiplier={1}
        />
    </div>
}