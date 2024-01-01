import http from "node:http";
import https from "node:https";
import { LogLevel, Network, Params } from "../../../@types/amadeus";
import {
  Fallback,
  HOSTS,
  RECOGNIZED_OPTIONS,
  RecognizedOptionsArray,
  RecognizedOptionsItem,
} from "../../../@types/amadeus/client/validator";
import Client from "../client";

class Validator {
  /**
   * Initialise the client's default value, ensuring the required values are
   * present
   *
   * @param  {Client} client the client object to set the defaults for
   * @param  {Object} options the associative array of options passed to the
   *  client on initialization
   */
  public validateAndInitialize(client: Client, options: Params) {
    this.initializeClientCredentials(client, options);
    this.initializeLogger(client, options);
    this.initializeHost(client, options);
    this.initializeCustomApp(client, options);
    this.initializeHttp(client, options);

    this.warnOnUnrecognizedOptions(options, client, RECOGNIZED_OPTIONS);
  }

  private initializeClientCredentials(client: Client, options: Params) {
    client.clientId = this.initRequired("clientId", options) as string;
    client.clientSecret = this.initRequired("clientSecret", options) as string;
  }

  private initializeLogger(client: Client, options: Params) {
    client.logLevel = this.initOptional(
      "logLevel",
      options,
      "silent"
    ) as LogLevel;
    client.logger = this.initOptional("logger", options, console) as Console;
  }

  private initializeHost(client: Client, options: Params) {
    let hostname = this.initOptional(
      "hostname",
      options,
      "test"
    ) as keyof typeof HOSTS;
    client.host = this.initOptional("host", options, HOSTS[hostname]) as string;
    client.port = this.initOptional("port", options, 443) as number;
    client.ssl = this.initOptional("ssl", options, true) as boolean;
  }

  private initializeCustomApp(client: Client, options: Params) {
    client.customAppId = this.initOptional("customAppId", options) as
      | string
      | null;

    client.customAppVersion = this.initOptional("customAppVersion", options) as
      | string
      | null;
  }

  initializeHttp(client: Client, options: Params) {
    let network = client.ssl ? https : http;
    client.http = this.initOptional("http", options, network) as Network;
  }

  private initRequired(key: "clientId" | "clientSecret", options: Params) {
    const result = this.initOptional(key, options);
    if (!result) throw new ArgumentError(`Missing required argument: ${key}`);
    return result;
  }

  private initOptional(
    key: RecognizedOptionsItem,
    options: Params,
    fallback: Fallback = null
  ) {
    const envKey = `AMADEUS_${key
      .replace(/[A-Z]/g, (c) => `_${c.toLowerCase()}`)
      .toUpperCase()}`;
    const value = options[key] || process.env[envKey] || fallback;
    return value;
  }

  private warnOnUnrecognizedOptions(
    options: Params,
    client: Client,
    recognizedOptions: RecognizedOptionsArray
  ) {
    Object.keys(options).forEach((key) => {
      if (
        recognizedOptions.indexOf(key as RecognizedOptionsItem) === -1 &&
        client.warn()
      ) {
        client.logger.log(`Unrecognized option: ${key}`);
      }
    });
    return null;
  }
}

class ArgumentError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ArgumentError";
  }
}

export default Validator;
