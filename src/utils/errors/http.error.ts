import { ERROR_MESSAGES } from '../constants/error.constant';
import { AppError } from './base.error';

export class NotFoundError extends AppError {
  constructor(errors: unknown) {
    super(404, ERROR_MESSAGES.NOT_FOUND, errors);
  }
}

export class BadRequestError extends AppError {
  constructor(errors: unknown) {
    super(400, ERROR_MESSAGES.BAD_REQUEST, errors);
  }
}

export class ConflictError extends AppError {
  constructor(errors: unknown) {
    super(409, ERROR_MESSAGES.CONFLICT, errors);
  }
}

export class ValidationError extends AppError {
  constructor(errors: unknown) {
    super(422, ERROR_MESSAGES.VALIDATION_ERROR, errors);
  }
}

export class DatabaseError extends AppError {
  constructor(errors: unknown) {
    super(500, 'Database Error', errors);
  }
}
export class UnauthorizedError extends AppError {
  constructor(errors: unknown) {
    super(401, ERROR_MESSAGES.UNAUTHORIZED, errors);
  }
}