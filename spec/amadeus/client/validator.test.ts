import { describe, expect, it, vi } from "vitest";
import Validator from "../../../src/amadeus/client/validator";

const validator = new Validator();

describe("Validator", () => {
  it("should exports the functions", () => {
    expect(validator).not.toBe(null);
  });

  describe(".initRequired", () => {
    it("should return the expected values", () => {
      let options = {
        test1: "1",
      };
      process.env.AMADEUS_TEST2 = "2";
      // @ts-ignore
      expect(validator.initRequired("test1", options)).toBe("1");
      // @ts-ignore
      expect(validator.initRequired("test2", options)).toBe("2");
      process.env.AMADEUS_TEST2 = undefined;
    });

    it("should throw error if key not found", () => {
      expect(() => {
        // @ts-ignore
        validator.initRequired("test3", {});
      }).toThrowError();
    });
  });

  describe(".initOptional", () => {
    it("should return the expected values", () => {
      let options = {
        test1: "1",
      };
      process.env.AMADEUS_TEST2 = "2";
      process.env.AMADEUS_TEST_SNAKE_CASE = "5";
      // @ts-ignore
      expect(validator.initOptional("test1", options)).toBe("1");
      // @ts-ignore
      expect(validator.initOptional("test2", options)).toBe("2");
      // @ts-ignore
      expect(validator.initOptional("test3", options)).toBe(null);
      // @ts-ignore
      expect(validator.initOptional("test4", options, "4")).toBe("4");
      // @ts-ignore
      expect(validator.initOptional("testSnakeCase", options)).toBe("5");
      process.env.AMADEUS_TEST2 = undefined;
      process.env.AMADEUS_TEST_SNAKE_CASE = undefined;
    });
  });

  describe(".warnOnUnrecognizedOptions", () => {
    it("should return null if all keys are recognised", () => {
      const options = { clientId: "123" };
      const recognizedOptions: string[] = ["clientId"];
      const client = {
        logger: { log: vi.fn() },
        warn: () => {
          return true;
        },
      };
      expect(
        // @ts-ignore
        validator.warnOnUnrecognizedOptions(options, client, recognizedOptions)
      ).toBe(null);
      expect(client.logger.log).not.toHaveBeenCalled();
    });

    it("should log a warning if the key was not recognized", () => {
      let options = { clientId: "123" };
      let recognizedOptions: string[] = [];
      let client = {
        logger: { log: vi.fn() },
        warn: () => {
          return true;
        },
      };
      expect(
        // @ts-ignore
        validator.warnOnUnrecognizedOptions(options, client, recognizedOptions)
      ).toBe(null);
      expect(client.logger.log).toHaveBeenCalledWith(
        "Unrecognized option: clientId"
      );
    });
  });
});
