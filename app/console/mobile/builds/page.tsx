"use client"

import {apiClient} from "@/app/lib/api/apiClient";
import Metadata from "@/app/lib/ui/components/ComponentMetaData";
import {Button} from "@/components/ui/button";
import {Separator} from "@/components/ui/separator";
import {useRef, useEffect, useState} from "react";
import Cookies from "js-cookie";
import {useRouter} from "next/navigation";
import {Build} from "@/app/lib/models/GetBuildsApiResponse";
import {BarLoader} from "react-spinners";
import BuildItemView from "@/app/lib/ui/components/BuildItemView";


export default function BuildsPage() {
    const fileUploadRef = useRef<HTMLInputElement | null>(null)
    const [builds, setBuilds] = useState<Build[]>([])
    const [uid, setUid] = useState<string>('')
    const router = useRouter()
    const [isLoading, setLoading] = useState(false)
    const [deleteConfirmationBuild, setDeleteConfirmationBuild] = useState<Build | null>(null)

    const uploadFileToServer = (file: FileList | null) => {
        if (file) {
            setLoading(true)
            const formData = new FormData();
            formData.append('build', file[0]);
            formData.append('uid', uid);
            apiClient.uploadBuild(formData)
                .then(() => {
                    fetchUserBuilds(uid).then(() => {
                    })
                })
                .catch((error) => {
                    console.log(error)
                })
        }
    }

    useEffect(() => {
        const userId = Cookies.get('uid') as string;
        const authToken = Cookies.get('authToken');
        if (!authToken) {
            router.push("/");
        } else {
            const uid = Cookies.get('uid') as string;
            setUid(uid);
            fetchUserBuilds(userId).then(() => {
            })
        }
    }, [router])

    async function fetchUserBuilds(userId: string) {
        setLoading(true)
        const buildsResponse = await apiClient.getBuilds(userId)
        setLoading(false)
        setBuilds(buildsResponse.builds)
        setBuilds(
            buildsResponse.builds.sort((a, b) =>
                new Date(b.uploadedDate).getTime() - new Date(a.uploadedDate).getTime()
            )
        )
    }

    async function deleteBuild(build: Build) {
        setDeleteConfirmationBuild(null)
        setLoading(true)
        await apiClient.deleteBuild(uid, `${build.name}${build.ext}`)
        await fetchUserBuilds(uid)
    }

    return (
        <>
            <Metadata seoTitle="Builds | ScriptLess" seoDescription=""/>
            <div className="h-full w-full overflow-y-auto no-scrollbar">
                <div className="max-w-4xl h-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col">
                    <div className="flex justify-between items-center mb-2">
                        <h1 className="text-foreground text-4xl font-bold">Builds</h1>
                        <input
                            type="file"
                            accept=".apk,.aab,.ipa,.app,.zip"
                            ref={fileUploadRef}
                            className="hidden"
                            onChange={(e) => {
                                const files = e.target.files;
                                uploadFileToServer(files)
                            }}
                        />
                        <Button onClick={() => {
                            fileUploadRef.current?.click();
                        }}>
                            Upload New Build
                        </Button>
                    </div>
                    <Separator/>
                    {(isLoading) && (
                        <div className="w-full">
                            <BarLoader width="100%"/>
                        </div>
                    )}
                    <div className="flex-1">
                        {builds.map((build) => (
                            <BuildItemView
                                key={build.buildUUID}
                                build={build}
                                onBuildDeleteClick={(build: Build) => {
                                    setDeleteConfirmationBuild(build)
                                }}
                            />
                        ))}
                        {(builds.length === 0 && !isLoading) &&
                            <div className="w-full h-full flex items-center justify-center">No Builds uploaded
                                yet.</div>
                        }
                    </div>
                </div>
                {deleteConfirmationBuild && <div>
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <div className="bg-white p-4 rounded-lg">
                            <h3 className="text-foreground text-lg font-bold">Are you sure you want to delete this
                                build?</h3>
                            <div className="flex justify-end gap-4 mt-4">
                                <Button onClick={() => {
                                    setDeleteConfirmationBuild(null)
                                }}>Cancel</Button>
                                <Button variant="destructive" onClick={() => {
                                    deleteBuild(deleteConfirmationBuild).then(() => {
                                    })
                                }}>Delete</Button>
                            </div>
                        </div>
                    </div>
                </div>}
            </div>
        </>
    );
}