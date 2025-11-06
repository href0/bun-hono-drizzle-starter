import { ClientErrorStatusCode, ServerErrorStatusCode } from "hono/utils/http-status";

export type HttpStatusCode = ClientErrorStatusCode | ServerErrorStatusCode;
