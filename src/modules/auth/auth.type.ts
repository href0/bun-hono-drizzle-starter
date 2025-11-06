import { z } from "zod";
import { responseSignInAuthSchema, signInAuthSchema, signUpAuthSchema } from "./auth.schema";

export type SignUpDTO = z.infer<typeof signUpAuthSchema>
export type SignInDTO = z.infer<typeof signInAuthSchema>
export type ResponseSignIn = z.infer<typeof responseSignInAuthSchema>