export class Build {
    buildUUID: string;
    name: string;
    ext: string;
    platform: string;
    path: string;
    uploadedDate: string


    constructor(build_uuid: string, uid: string, build_name: string, ext: string, platform: string, path: string, uploadedDate: string) {
        this.buildUUID = build_uuid
        this.name = build_name
        this.ext = ext
        this.platform = platform
        this.path = path
        this.uploadedDate = uploadedDate
    }
}

export class GetBuildsApiResponse {
    message: string
    builds: Build[]

    constructor(message: string, builds: Build[]) {
        this.message = message
        this.builds = builds
    }
}