import EventEmitter from "events";
import https from "node:https";
import Client from "../../src/amadeus/client";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { Params } from "../../@types/amadeus";

let client: Client;
const credentials = {
  clientId: "123",
  clientSecret: "234",
};

const verb = "GET";
const path = "/foo/bar";
const params = { baz: "qux" };

describe("Client", () => {
  it("should exports an Client object", () => {
    expect(Client).toBeDefined();
  });

  describe(".instance", () => {
    beforeEach(() => {
      client = new Client(credentials);
    });

    it("should export an Client object", () => {
      expect(client).toBeInstanceOf(Client);
    });

    it("should throw an error without required credentials", () => {
      expect(() => {
        // @ts-ignore
        new Client();
      }).toThrow();
    });

    it("should initialize all default values", () => {
      expect(client.clientId).toBe("123");
      expect(client.clientSecret).toBe("234");
      expect(client.logger).toBe(console);
      expect(client.host).toBe("test.api.amadeus.com");
      expect(client.customAppId).toBe(null);
      expect(client.customAppVersion).toBe(null);
      expect(client.http).toBe(https);
      expect(client.logLevel).toBe("silent");
    });

    it("should allow for setting a custom logger", () => {
      const logger = vi.fn();
      const options = { clientId: "123", clientSecret: "234", logger: logger };
      // @ts-ignore
      const client = new Client(options);
      expect(client.logger).toBe(logger);
    });

    it("should allow for setting debug mode", () => {
      const options: Params = {
        clientId: "123",
        clientSecret: "234",
        logLevel: "debug",
      };
      const client = new Client(options);
      expect(client.logLevel).toBe("debug");
    });

    it("should allow for setting a different host", () => {
      const options: Params = {
        clientId: "123",
        clientSecret: "234",
        hostname: "test",
      };
      const client = new Client(options);
      expect(client.host).toBe("test.api.amadeus.com");
    });

    it("should allow for setting a custom App ID and Version", () => {
      const options = {
        clientId: "123",
        clientSecret: "234",
        customAppId: "cli",
        customAppVersion: "1.0.0",
      };
      const client = new Client(options);
      expect(client.customAppId).toBe("cli");
      expect(client.customAppVersion).toBe("1.0.0");
    });

    it("should allow for setting a custom http client", () => {
      const http = vi.fn();
      const options = { clientId: "123", clientSecret: "234", http: http };
      // @ts-ignore
      const client = new Client(options);
      expect(client.http).toBe(http);
    });

    describe(".debug", () => {
      it("should be true if the log level is debug", () => {
        client.logLevel = "debug";
        expect(client.debug()).toBeTruthy();
      });

      it("should be false if the log level is not debug", () => {
        client.logLevel = "warn";
        expect(client.debug()).toBeFalsy();
      });
    });

    describe(".warn", () => {
      it("should be true if the log level is debug", () => {
        client.logLevel = "debug";
        expect(client.warn()).toBeTruthy();
      });

      it("should be true if the log level is warn", () => {
        client.logLevel = "warn";
        expect(client.warn()).toBeTruthy();
      });

      it("should be false if the log level is not debug or warn", () => {
        client.logLevel = "silent";
        expect(client.warn()).toBeFalsy();
      });
    });
  });
});
