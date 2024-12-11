import { AppError } from './base.error';

export class NotFoundError extends AppError {
  constructor(errors: unknown) {
    super(404, 'Not Found', errors);
  }
}

export class BadRequestError extends AppError {
  constructor(errors: unknown) {
    super(400, 'Bad Request', errors);
  }
}

export class ValidationError extends AppError {
  constructor(errors: unknown) {
    super(422, 'Validation Error', errors);
  }
}

export class DatabaseError extends AppError {
  constructor(errors: unknown) {
    super(500, 'Database Error', errors);
  }
}