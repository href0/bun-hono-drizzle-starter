import { z } from "zod"
import { errorResponseSchema } from "../schemas/common.schema"

export type ErrorResponse = z.infer<typeof errorResponseSchema>