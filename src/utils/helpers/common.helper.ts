import { CookieOptions } from "hono/utils/cookie";
import { NodeEnv } from "../interfaces/env.interface";

export async function hashPassword(password: string): Promise<string> {
  const hash = await Bun.password.hash(password);
  return hash;
}

export const cookieOptions = (): CookieOptions => {
  const isProduction = Bun.env.NODE_ENV === NodeEnv.PROD
  return {
    httpOnly: isProduction,
    secure: isProduction,
    sameSite: !isProduction ? 'Lax' : 'None',
    path: '/api/auth',
    // domain: !isProduction ? 'localhost' : Bun.env.DOMAIN,
    maxAge: 30 * 24 * 60 * 60, // 30 days, note : must be same with REFRESH_TOKEN_EXPIRED,
  }
}
