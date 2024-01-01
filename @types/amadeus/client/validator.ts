import { Network } from "../../amadeus";

export const HOSTS = {
  test: "test.api.amadeus.com",
  production: "api.amadeus.com",
} as const;

export const RECOGNIZED_OPTIONS = [
  "clientId",
  "clientSecret",
  "logger",
  "logLevel",
  "hostname",
  "host",
  "customAppId",
  "customAppVersion",
  "http",
  "ssl",
  "port",
] as const;

export type RecognizedOptionsArray = typeof RECOGNIZED_OPTIONS;
export type RecognizedOptionsItem = (typeof RECOGNIZED_OPTIONS)[number];
type Hosts = typeof HOSTS.test | typeof HOSTS.production;

export type Fallback =
  | "silent"
  | "test"
  | Hosts
  | number
  | boolean
  | Console
  | Network
  | null;
