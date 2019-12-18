import { Reducer, Case, Module, Injectable, RootActionReducerMapToken, Injector } from '@nger/core';
import { StoreModule, Store as RxStore, createAction, props, State } from '@nger/rx.store';
import { Actions, ofType, createEffect, EffectsModule } from '@nger/rx.effects';
import { switchMap } from 'rxjs/operators'
import { platformCore, getReducer } from '@nger/platform.core';
import { EMPTY } from 'rxjs';
interface DemoAction {
    title: string;
}
const updateUser = createAction<string, DemoAction>(`DemoActions.Demo`, props())
const updateSuccessUser = createAction<string, DemoAction>(`DemoActions.Demo`, props())
const updateFailUser = createAction<string, DemoAction>(`DemoActions.Demo`, props())

export const DemoActions = {
    Demo: `DemoActions.Demo`
}

@Injectable()
export class DemoStore {
    tilte: string = ``;
}
@Reducer({
    name: `demo`,
    store: DemoStore
})
export class DemoReducer {
    @Case(updateSuccessUser)
    getUser(state: DemoStore, action: DemoAction) {
        state.tilte = action.title;
        return state;
    }
    @Case(updateFailUser)
    updateFailUser(state: DemoStore, action: DemoAction) {
        return State;
    }
}

@Injectable()
export class DemoEffects {
    login$ = createEffect(() =>
        this.actions$.pipe(
            ofType(updateUser),
            switchMap(action => {
                return EMPTY;
            })
        )
    );
    constructor(
        private actions$: Actions
    ) { }
}

@Injectable()
export class DemoService {
    constructor(private store: RxStore<{ demo: DemoStore }>) {
        this.store.subscribe(res => {
            console.log({ res })
        })
    }
    add() {
        this.store.dispatch(updateUser({ title: 'updateUser' }))
    }
}
@Module({
    imports: [
        StoreModule.forRoot(RootActionReducerMapToken),
        EffectsModule.forRoot([
            DemoEffects
        ])
    ],
    providers: [
        DemoService,
        DemoStore,
        {
            provide: RootActionReducerMapToken,
            useFactory: (injector: Injector) => {
                const reducer = getReducer(DemoReducer, injector);
                return reducer;
            },
            deps: [Injector]
        }
    ]
})
export class DemoModule { }
platformCore([]).bootstrapModule(DemoModule).then(res => {
    const demoService = res.injector.get(DemoService)
    demoService.add();
    debugger;
})
