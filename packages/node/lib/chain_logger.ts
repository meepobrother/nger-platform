import { CacheStore, Cid, Injector, REQUEST_ID } from "@nger/core";


export class ChainLogger {
    request_id: string;
    constructor(public injector: Injector) { }
    create() {
        const cache = this.injector.get(CacheStore);
        this.request_id = this.injector.get<string>(REQUEST_ID)
        const logger = cache.get<ChainLogger>(this.request_id);
    }
}
