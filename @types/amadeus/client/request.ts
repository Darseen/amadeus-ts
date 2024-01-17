import { Verb } from "../client";

export type RequestParams = {
  host: string;
  port: number;
  ssl: boolean;
  scheme: string;
  verb: Verb;
  path: string;
  params: any;
  queryPath: string;
  bearerToken: string | null;
  clientVersion: string;
  languageVersion: string;
  appId?: string | null;
  appVersion?: string | null;
  headers: Record<string, string>;
};

export const ListHTTPOverride = [
  "/v2/shopping/flight-offers",
  "/v1/shopping/seatmaps",
  "/v1/shopping/availability/flight-availabilities",
  "/v2/shopping/flight-offers/prediction",
  "/v1/shopping/flight-offers/pricing",
  "/v1/shopping/flight-offers/upselling",
] as const;

export type HTTPOverride = (typeof ListHTTPOverride)[number];
