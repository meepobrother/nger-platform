import { Controller, Injector, Param, Get, Query, Cid, Module, OnModuleInit, Injectable, Session, Ip, Inject, REQUEST_ID, CanLoad, APP_ID } from '@nger/core';
import { expressPlatform } from '../lib';
@Injectable()
export class DemoCanLoad implements CanLoad {
    canLoad() {
        return true;
    }
}
@Injectable()
export class Demo {
    index: number = new Date().getTime();
    constructor(private injector: Injector) { }
    test() {
        const cid = this.injector.get(REQUEST_ID)
        return { cid, index: this.index };
    }
}

@Controller({
    path: '/',
    useGuards: [DemoCanLoad],
    providers: [Demo]
})
export class DemoControler {
    index: number = new Date().getTime();
    constructor(private injector: Injector) { }

    @Get(`/`)
    onIndex(@Session() session: object, @Ip() ip: string, @Cid() cid: Buffer) {
        const views = Reflect.get(session, 'views') || 0;
        Reflect.set(session, 'views', views + 1);
        const requestId = this.injector.get(Demo).test();
        return { views, ip, cid, requestId, index: this.index };
    }

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
        DemoCanLoad
    ],
    controllers: [DemoControler]
})
export class AppModule implements OnModuleInit {
    constructor(private injector: Injector) { }
    ngOnModuleInit() { }
}

expressPlatform([]).bootstrapModule(AppModule).then(res => {
    const app = res.injector.get<any>(APP_ID)
    app.listen(9000, () => {
        console.log(`expressPlatform`)
    });
})
