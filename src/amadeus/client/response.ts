import { IncomingHttpHeaders, IncomingMessage } from "http";
import Request from "./request";

const JSON_CONTENT_TYPES = ["application/json", "application/vnd.amadeus+json"];

/**
 * The response object returned for every API call.
 *
 * @param {Object} http_response the response object returned from the Node/HTTP
 *  request
 * @param {Request} request the request object used to make this API call
 *
 * @property {number} statusCode the HTTP status code for the response, if any
 * @property {string} body the raw body received from the API
 * @property {Object} result the parsed JSON received from the API
 * @property {Object} data the data attribute taken from the result
 * @property {boolean} parsed wether the raw body has been parsed into JSON
 * @property {Request} request the request object used to make this API call
 *
 */
class Response {
  headers: IncomingHttpHeaders;
  statusCode: number | undefined;
  body: string;
  result: any;
  data: any;
  parsed: boolean;
  request: Request;

  constructor(http_response: IncomingMessage, request: Request) {
    this.headers = http_response.headers || {};
    this.statusCode = http_response.statusCode;
    this.request = request;
    this.body = "";
    this.result = null;
    this.data = null;
    this.parsed = false;
  }

  /**
   * Add a chunk received from the API to the body
   *
   * @param  {string} chunk a chunk of data
   * @public
   */
  public addChunk(chunk: string | Buffer) {
    this.body += chunk.toString();
  }

  /**
   * Tries to parse the raw data
   * @public
   */
  public parse() {
    try {
      if (this.statusCode === 204) return;

      if (this.isJson()) {
        this.result = JSON.parse(this.body);
        this.data = this.result.data;
        this.parsed = true;
      } else {
        this.parsed = false;
      }
    } catch (SyntaxError) {
      this.parsed = false;
    }
  }

  /**
   * Wether this API call can be considered a success. Used to wrap the response
   * into a ResponseError
   *
   * @return {boolean}
   * @public
   */
  public success() {
    if (this.statusCode == 204) {
      return true;
    }
    if (this.parsed && this.statusCode && this.statusCode < 300) {
      return true;
    }
  }

  /**
   * Tests if the content is seemingly JSON
   *
   * @return {boolean}
   * @private
   */
  private isJson() {
    return JSON_CONTENT_TYPES.indexOf(this.headers["content-type"]!) !== -1;
  }
}

export default Response;
