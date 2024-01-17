import EventEmitter from "node:events";
import Client from "../client";
import Response from "./response";

// The number of seconds before the token expires, when
// we will already try to refresh it
const TOKEN_BUFFER = 10;

/**
 * A helper library to create and maintain the OAuth2 AccessTokens between
 * requests. Keeps track of the expiry time and automatically tries to fetch
 * a new token if needed.
 *
 * @property {string} accessToken the cached current access token (bearer)
 * @property {number} expiresAt the aproximate time this token expires at
 * @protected
 */
class AccessToken {
  accessToken!: string;
  expiresAt!: number;
  constructor(client: Client) {}

  /**
   * Fetches or returns a cached bearer token. Used by the Client to get a
   * token before making an API call.
   *
   * @param  {Client} client the Amadeus Client to make an API call with
   * @return {Promise.<Response,ResponseError>} a Promise
   * @protected
   */
  public bearerToken(client: Client) {
    const emitter = new EventEmitter();
    const promise = this.promise<string>(emitter);
    this.emitOrLoadAccessToken(client, emitter);
    return promise;
  }

  /**
   * Builds a Bluebird promise to be returned to the API user
   *
   * @param  {type} emitter the EventEmitter used to notify the Promise of
   * @return {Promise} a promise
   * @public
   */
  public promise<T>(emitter: EventEmitter) {
    return new Promise<T>((resolve, reject) => {
      emitter.on("resolve", resolve);
      emitter.on("reject", reject);
    });
  }

  /**
   * Checks if the token needs a refresh, if not emits the cached token,
   * otherwise tries to load a new access token
   *
   * @param  {Client} client the Amadeus Client to make an API call with
   * @param  {type} emitter the EventEmitter used to emit the token
   * @public
   */
  public emitOrLoadAccessToken(client: Client, emitter: EventEmitter) {
    if (this.needsRefresh()) {
      this.loadAccessToken(client, emitter);
    } else {
      emitter.emit("resolve", this.accessToken);
    }
  }

  /**
   * Checks if the token needs a refresh or first load
   *
   * @return {boolean} wether the token needs a refresh
   * @public
   */
  public needsRefresh() {
    return !this.accessToken || this.expiresAt - TOKEN_BUFFER < Date.now();
  }

  /**
   * Loads the access token using the client, emits the token when it's loaded
   *
   * @param  {Client} client the Amadeus Client to make an API call with
   * @param  {EventEmitter} emitter the EventEmitter used to emit the token
   * @public
   */
  public async loadAccessToken(client: Client, emitter: EventEmitter) {
    try {
      const response = await client.unauthenticatedRequest<Response>(
        "POST",
        "/v1/security/oauth2/token",
        {
          grant_type: "client_credentials",
          client_id: client.clientId,
          client_secret: client.clientSecret,
        }
      );

      this.storeAccessToken(response);
      this.emitOrLoadAccessToken(client, emitter);
    } catch (error) {
      emitter.emit("reject", error);
    }
  }

  /**
   * Stores a loaded access token, calculating the expiry date
   *
   * @param  {Response} response the response object received from the client
   * @private
   */
  private storeAccessToken(response: Response) {
    this.accessToken = response.result["access_token"];
    this.expiresAt = Date.now() + response.result["expires_in"] * 1000;
  }
}

export default AccessToken;
