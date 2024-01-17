import qs from "qs";
import {
  ListHTTPOverride,
  RequestParams,
} from "../../../@types/amadeus/client/request";
import { Verb } from "../../../@types/amadeus/client";
import { Hostname, LogLevel, Logger, Network } from "../../../@types/amadeus";

/**
 * A Request object containing all the compiled information about this request.
 *
 * @property {string} host the host used for this API call
 * @property {number} port the port for this API call. Standard set to 443.
 * @property {boolean} ssl wether this API call uses SSL
 * @property {string} scheme the scheme inferred from the SSL state
 * @property {Verb} verb the HTTP method, for example `GET` or `POST`
 * @property {string} path the full path of the API endpoint
 * @property {Object} params the parameters to pass in the query or body
 * @property {string} queryPath the path and query string used for the API call
 * @property {string} bearerToken the authentication token
 * @property {string} clientVersion the version of the Amadeus library
 * @property {string} languageVersion the version of Node used
 * @property {string} appId the custom ID of the application using this library
 * @property {string} appVersion the custom version of the application
 *  using this library
 * @property {Record<string, string>} headers the request headers
 *
 * @param {Object} options
 */
class Request implements RequestParams {
  appId?: string | null | undefined;
  appVersion?: string | null | undefined;
  bearerToken: string | null;
  clientVersion: string;
  headers: Record<string, string>;
  host: string;
  languageVersion: string;
  params: any;
  path: string;
  port: number;
  queryPath: string;
  scheme: string;
  ssl: boolean;
  verb: Verb;
  ListHTTPOverride: typeof ListHTTPOverride;

  constructor(
    options: Omit<RequestParams, "headers" | "scheme" | "queryPath">
  ) {
    this.host = options.host;
    this.port = options.port;
    this.ssl = options.ssl;
    this.scheme = this.ssl ? "https" : "http";
    this.verb = options.verb;
    this.path = options.path;
    this.params = options.params;
    this.queryPath = this.fullQueryPath();
    this.bearerToken = options.bearerToken;
    this.clientVersion = options.clientVersion;
    this.languageVersion = options.languageVersion;
    this.appId = options.appId;
    this.appVersion = options.appVersion;
    this.headers = {
      "User-Agent": this.userAgent(),
      Accept: "application/json, application/vnd.amadeus+json",
    };
    this.ListHTTPOverride = [
      "/v2/shopping/flight-offers",
      "/v1/shopping/seatmaps",
      "/v1/shopping/availability/flight-availabilities",
      "/v2/shopping/flight-offers/prediction",
      "/v1/shopping/flight-offers/pricing",
      "/v1/shopping/flight-offers/upselling",
    ];
    this.addAuthorizationHeader();
    this.addContentTypeHeader();
    this.addHTTPOverrideHeader();
  }

  // PROTECTED

  /**
   * Compiles the options for the HTTP request.
   *
   * Used by Client.execute when executing this request against the server.
   *
   * @return {Object} an associative array of options to be passed into the
   *  Client.execute function
   * @public
   */
  public options() {
    return {
      host: this.host,
      port: this.port,
      protocol: `${this.scheme}:`,
      path: this.queryPath,
      method: this.verb,
      headers: this.headers,
    };
  }

  /**
   * Creats the body for the API cal, serializing the params if the verb is POST.
   *
   * @return {string} the serialized params
   * @private
   */
  private body() {
    if (this.verb !== "POST") return "";
    else if (!this.bearerToken) return qs.stringify(this.params);
    return this.params;
  }

  // PRIVATE

  /**
   * Build up the custom User Agent
   *
   * @return {string} a user agent in the format "library/version language/version app/version"
   * @private
   */
  private userAgent() {
    const userAgent = `amadeus-node/${this.clientVersion} node/${this.languageVersion}`;
    if (!this.appId) return userAgent;
    return `${userAgent} ${this.appId}/${this.appVersion}`;
  }

  /**
   * Build the full query path, combining the path with the query params if the
   * verb is 'GET'. For example: '/foo/bar?baz=qux'
   *
   * @return {string} the path and params combined into one string.
   * @private
   */

  private fullQueryPath() {
    if (this.verb === "POST") return this.path;
    return `${this.path}?${qs.stringify(this.params)}`;
  }

  /**
   * Adds an Authorization header if the BearerToken is present
   *
   * @private
   */
  private addAuthorizationHeader() {
    if (!this.bearerToken) return;
    this.headers["Authorization"] = `Bearer ${this.bearerToken}`;
  }

  /**
   * Adds an Content-Type header if the HTTP method equals POST
   *
   * @private
   */
  private addContentTypeHeader() {
    if (this.verb === "POST" && !this.bearerToken) {
      this.headers["Content-Type"] = "application/x-www-form-urlencoded";
    } else {
      this.headers["Content-Type"] = "application/vnd.amadeus+json";
    }
    return;
  }

  /**
   * Adds HTTPOverride method if it is required
   *
   *  @private
   */
  private addHTTPOverrideHeader() {
    if (
      this.verb === "POST" &&
      this.ListHTTPOverride.includes(
        this.path as (typeof this.ListHTTPOverride)[number]
      )
    ) {
      this.headers["X-HTTP-Method-Override"] = "GET";
    }
    return;
  }
}

export default Request;
