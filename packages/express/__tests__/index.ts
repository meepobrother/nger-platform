import { Controller, Injector, Param, Get, Query, Module, OnModuleInit, CanActivate, Injectable } from '@nger/core';
import { expressPlatform } from '../lib';
@Injectable({
    providedIn: 'root'
})
export class CanActiveIndex implements CanActivate {
    canActivate() {
        return true;
    }
}
@Controller({
    path: '/',
    useGuards: [CanActiveIndex]
})
export class DemoControler {
    constructor(private injector: Injector) { }

    @Get(`/`)
    onIndex() { }

    @Get(`/param/:id`)
    onParam(@Param({ property: 'id' }) id: number, @Param() param: object) {
        return { id, param }
    }

    @Get(`/query/:id`)
    onQuery(@Query({ property: 'id' }) id: number, @Query() query: object) {
        return { id, query }
    }
}

@Module({
    providers: [
        CanActiveIndex
    ],
    controllers: [DemoControler]
})
export class AppModule implements OnModuleInit {
    constructor(private injector: Injector) { }
    ngOnModuleInit() { }
}

expressPlatform().bootstrapModule(AppModule).then(res => res.onInit()).then(ref => {
    // debugger;
})
