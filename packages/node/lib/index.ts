import {
  createPlatformFactory,
  corePlatform,
  Config,
  Injector
} from "@nger/core";
import { EnvConfig } from "./config";
export const platformNode = createPlatformFactory(corePlatform, "node", [
  {
    provide: Config,
    useFactory: (injector: Injector) => new EnvConfig(injector),
    deps: [Injector]
  }
]);
