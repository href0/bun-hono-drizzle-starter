import z from "zod";

export const creatorSchema = z.object({
    id: z.number().openapi({ example : 1 }),
    name: z.string().openapi({ example : "john doe" }),
  }).nullish()