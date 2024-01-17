import http from "node:http";
import https from "node:https";

export type Logger = {
  log(message?: any, ...optionalParams: any[]): void;
  error(message?: any, ...optionalParams: any[]): void;
  debug(message?: any, ...optionalParams: any[]): void;
};
export type LogLevel = "debug" | "warn" | "silent";
export type Network = typeof http | typeof https;
export type Hostname = "production" | "test";

export type Params = {
  clientId: string; // the API key used to authenticate the API
  clientSecret: string; // the API secret used to authenticate
  logger?: Logger; // a `console`-compatible logger that accepts `log`, `error` and `debug` calls.
  logLevel?: LogLevel; // the log level for the client, available options are `debug`, `warn`, and `silent` (warn)
  hostname?: Hostname; // the name of the server API calls are made to (`production` or `test`) (production)
  host?: string; // the full domain or IP for a server to make the API clal to. Only use this if you don't want to use the provided servers
  ssl?: boolean; // wether to use SSL for this API call (true)
  port?: number; // the port to make the API call to (443)
  customAppId?: string | null; // a custom App ID to be passed in the User Agent to the server (null).
  customAppVersion?: string | null; // a custom App Version number to be passed in the User Agent to the server (null).
  http?: Network; // an optional Node/HTTP(S)-compatible client that accepts a 'request()' call with an array of options.
};
