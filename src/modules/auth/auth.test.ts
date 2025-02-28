import { afterAll, beforeAll, describe, expect, it } from "bun:test";
import { AuthTestUtil } from "../../utils/tests/auth-test.util";
import { userService } from "../user/user.service";
import { BadRequestError, ConflictError } from "../../utils/errors/http.error";
import { ERROR_MESSAGES } from "../../utils/constants/error.constant";
import { authService } from "./auth.service";

const mockSignUp = AuthTestUtil.getMockSignUp()

describe("AuthService", () => {
  beforeAll(async () => {
    await userService.removeByEmail(AuthTestUtil.getMockSignUp().email)
  });

  afterAll(async ()=>{
    await AuthTestUtil.remove()
  })

  describe('Sign Up', () => {
    it('Should can sign up', async () => {
      const result = await AuthTestUtil.signUp()
      expect(result.name).toEqual(mockSignUp.name)
    })
    it('Should error user test already exists', async () => {
       expect(AuthTestUtil.signUp()).rejects.toThrow(ConflictError);
    })
  })

  describe('Sign In', () => {
    it(`Should error ${ERROR_MESSAGES.INVALID_EMAIL_OR_PASSWORD}`, async () => {
      await authService.signIn('email', 'password').catch(err => {
        expect(err.errors).toEqual(ERROR_MESSAGES.INVALID_EMAIL_OR_PASSWORD)
      })
    })
    it('Should can sign in and get accessToken', async () => {
      const result = await AuthTestUtil.signIn()
      expect(result.accessToken).toBeDefined()
    })
  })
})