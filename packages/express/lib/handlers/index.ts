import { StaticProvider } from "@nger/di";
import { bodyHandlerProvider } from './parameter/body'
import { paramHandlerProvider } from './parameter/param'
import { queryHandlerProvider } from './parameter/query'
import { headersHandlerProvider } from './parameter/headers';
import { getHandlerProvider } from './httpMethod/get'
import { postHandlerProvider } from './httpMethod/post'
import { allHandlerProvider } from './httpMethod/all'
import { deleteHandlerProvider } from './httpMethod/delete'
import { headHandlerProvider } from './httpMethod/head'
import { optionsHandlerProvider } from './httpMethod/options'
import { patchHandlerProvider } from './httpMethod/patch'
import { controllerProvider } from "./controller";

export const decoratorProviders: StaticProvider[] = [
    paramHandlerProvider,
    bodyHandlerProvider,
    queryHandlerProvider,
    headersHandlerProvider,
    getHandlerProvider,
    postHandlerProvider,
    allHandlerProvider,
    deleteHandlerProvider,
    headHandlerProvider,
    optionsHandlerProvider,
    patchHandlerProvider,
    controllerProvider
];