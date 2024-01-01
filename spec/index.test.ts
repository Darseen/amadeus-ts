import { beforeEach, describe, expect, it } from "vitest";
import Amadeus from "../src";
import { Params } from "../@types/amadeus";
import Client from "../src/amadeus/client";

let amadeus: Amadeus;
const credentials: Params = {
  clientId: "123",
  clientSecret: "234",
};

describe("Amadeus", () => {
  it("should export an Amadeus object", () => {
    expect(Amadeus).not.toBe(null);
  });

  describe(".instance", () => {
    beforeEach(() => {
      amadeus = new Amadeus(credentials);
    });

    it("should initialize an Amadeus instance", () => {
      expect(amadeus).toBeInstanceOf(Amadeus);
    });

    it("should throw an error", () => {
      expect(() => {
        // @ts-ignore
        new Amadeus();
      }).toThrowError();
    });

    it("should have a client property", () => {
      expect(amadeus.client).toBeInstanceOf(Client);
    });

    // to be continued...
  });
});
