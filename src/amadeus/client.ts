import util from "node:util";
import { LogLevel, Logger, Network, Params } from "../../@types/amadeus";
import Validator from "./client/validator";

/**
 * A convenient wrapper around the API, allowing for generic, authenticated and
 * unauthenticated API calls without having to manage the serialization,
 * desrialization, and authentication.
 *
 * Generally you do not need to use this object directly. Instead it is used
 * indirectly by the various namespaced methods for every API call.
 *
 * For example, the following are the semantically the same.
 *
 * ```js
 * amadeus.client.get('/v1/reference-data/urls/checkin-links', params);
 * amadeus.amadeus.reference_data.urls.checkin_links.get(params);
 * ```
 *
 * @param {Object} options a list of options. See {@link Amadeus} .
 * @property {string} clientId the API key used to authenticate the API
 * @property {string} clientSecret the API secret used to authenticate
 *  the API
 * @property {Object} logger the `console`-compatible logger used to debug calls
 * @property {string} logLevel the log level for the client, available options
 *  are `debug`, `warn`, and `silent`. Defaults to 'silent'
 * @property {string} host the hostname of the server API calls are made to
 * @property {number} port the port the server API calls are made to
 * @property {boolean} ssl wether an SSL request is made to the server
 * @property {string} customAppId the custom App ID to be passed in the User
 *  Agent to the server
 * @property {string} customAppVersion the custom App Version number to be
 *  passed in the User Agent to the server
 * @property {Object} http the Node/HTTP(S)-compatible client used to make
 *  requests
 * @property {number} version The version of this API client
 */
class Client implements Params {
  clientId!: string;
  clientSecret!: string;
  customAppId?: string | null;
  customAppVersion?: string | null;
  host!: string;
  hostname!: "production" | "test";
  http!: Network;
  logLevel!: LogLevel;
  logger!: Logger;
  port!: number;
  ssl!: boolean;

  constructor(options: Params) {
    new Validator().validateAndInitialize(this, options);
  }

  /**
   * Logs the request, when in debug mode
   *
   * @param  {Request} request the request object to log
   * @public
   */
  // change request later
  public log(request: Request) {
    /* istanbul ignore next */
    if (this.debug()) {
      this.logger.log(util.inspect(request, false, null));
    }
  }

  /**
   * Determines if this client is in debug mode
   *
   * @return {boolean}
   */
  public debug(): boolean {
    return this.logLevel == "debug";
  }

  /**
   * Determines if this client is in warn or debug mode
   *
   * @return {boolean}
   */
  public warn(): boolean {
    return this.logLevel == "warn" || this.debug();
  }
}

export default Client;
