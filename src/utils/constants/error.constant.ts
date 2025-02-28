export const ERROR_MESSAGES = {
  // 4XX Client Errors
  BAD_REQUEST: 'Bad Request', // 400
  UNAUTHORIZED: 'Unauthorized', // 401
  FORBIDDEN: 'Forbidden', // 403
  NOT_FOUND: 'Resource not found', // 404
  METHOD_NOT_ALLOWED: 'Method not allowed', // 405
  NOT_ACCEPTABLE: 'Not Acceptable', // 406
  CONFLICT: 'Resource already exists', // 409
  GONE: 'Resource no longer available', // 410
  LENGTH_REQUIRED: 'Content length required', // 411
  PRECONDITION_FAILED: 'Precondition failed', // 412
  PAYLOAD_TOO_LARGE: 'Payload too large', // 413
  URI_TOO_LONG: 'URI too long', // 414
  UNSUPPORTED_MEDIA_TYPE: 'Unsupported media type', // 415
  RANGE_NOT_SATISFIABLE: 'Range not satisfiable', // 416
  EXPECTATION_FAILED: 'Expectation failed', // 417
  MISDIRECTED_REQUEST: 'Misdirected request', // 421
  UNPROCESSABLE_ENTITY: 'Validation failed', // 422
  LOCKED: 'Resource locked', // 423
  FAILED_DEPENDENCY: 'Failed dependency', // 424
  TOO_EARLY: 'Too early', // 425
  UPGRADE_REQUIRED: 'Upgrade required', // 426
  PRECONDITION_REQUIRED: 'Precondition required', // 428
  TOO_MANY_REQUESTS: 'Too many requests', // 429
  REQUEST_HEADER_FIELDS_TOO_LARGE: 'Header fields too large', // 431
  UNAVAILABLE_FOR_LEGAL_REASONS: 'Unavailable for legal reasons', // 451
 
  // 5XX Server Errors
  INTERNAL_SERVER_ERROR: 'Internal server error', // 500
  NOT_IMPLEMENTED: 'Not implemented', // 501
  BAD_GATEWAY: 'Bad gateway', // 502
  SERVICE_UNAVAILABLE: 'Service unavailable', // 503
  GATEWAY_TIMEOUT: 'Gateway timeout', // 504
  HTTP_VERSION_NOT_SUPPORTED: 'HTTP version not supported', // 505
  VARIANT_ALSO_NEGOTIATES: 'Variant also negotiates', // 506
  INSUFFICIENT_STORAGE: 'Insufficient storage', // 507
  LOOP_DETECTED: 'Loop detected', // 508
  NOT_EXTENDED: 'Not extended', // 510
  NETWORK_AUTHENTICATION_REQUIRED: 'Network authentication required', // 511
 
  // Custom Application Errors
  VALIDATION_ERROR: 'Validation failed',
  DATABASE_ERROR: 'Database operation failed',
  DUPLICATE_ENTITY: 'Resource already exists',
  INVALID_CREDENTIALS: 'Invalid credentials',
  TOKEN_EXPIRED: 'Token has expired',
  TOKEN_INVALID: 'Invalid token',
  TOKEN_REQUIRED: 'Token is required',
  PERMISSION_DENIED: 'Permission denied',
  ACCOUNT_DISABLED: 'Account is disabled',
  ACCOUNT_LOCKED: 'Account is locked',
  EMAIL_ALREADY_EXISTS: 'Email already exists',
  USERNAME_ALREADY_EXISTS: 'Username already exists',
  INVALID_EMAIL_OR_PASSWORD: 'Invalid email or password!',
  PASSWORD_MISMATCH: 'Passwords do not match',
  INVALID_RESET_TOKEN: 'Invalid password reset token',
  FILE_TOO_LARGE: 'File size exceeds limit',
  INVALID_FILE_TYPE: 'Invalid file type',
  UPLOAD_FAILED: 'File upload failed',
  RATE_LIMIT_EXCEEDED: 'Rate limit exceeded',
  MAINTENANCE_MODE: 'System is under maintenance',
  FEATURE_DISABLED: 'This feature is currently disabled',
  INVALID_INPUT: 'Invalid input provided',
  MISSING_REQUIRED_FIELD: 'Required field is missing',
  INVALID_FORMAT: 'Invalid format',
  SESSION_EXPIRED: 'Session has expired',
  CONCURRENT_MODIFICATION: 'Resource was modified by another request'
 };