export class Build {
    id: number
    name: string
    type: string
    ext: string
    uploadedDate: string

    constructor(id: number, name: string, type: string, ext: string, uploadedDate: string) {
        this.id = id
        this.name = name
        this.type = type
        this.ext = ext
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