import { Platform } from "./Platform";

export class TestCase {
    id: number;
    platform: Platform;
    name: string;

    constructor(id: number, platform: Platform, name: string) {
        this.id = id;
        this.platform = platform;
        this.name = name;
    }
}