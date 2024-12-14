import { z } from "zod";
import { responseSignInAuthSchema, signInAuthSchema, signUpAuthSchema } from "./auth.schema";

export type SignUpAuthSchema = z.infer<typeof signUpAuthSchema>
export type SignInAuthSchema = z.infer<typeof signInAuthSchema>
export type ResponseSignInAuthSchema = z.infer<typeof responseSignInAuthSchema>