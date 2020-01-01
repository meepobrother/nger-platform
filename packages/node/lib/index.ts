import {
  createPlatformFactory,
  corePlatform,
  Config
} from "@nger/core";
import { EnvConfig } from "./config";
export const platformNode = createPlatformFactory(corePlatform, "node", [
  {
    provide: Config,
    useClass: EnvConfig
  }
]);
