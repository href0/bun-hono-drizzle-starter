import { z } from "zod"
import { metaSchema, metaSchemaWithPagination } from "./pagination.schema"
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
extendZodWithOpenApi(z);
export const successResponseSchema = <T extends z.ZodType>(dataSchema: T | null = null, message: string = 'success', metaSchemaType: z.ZodType = metaSchema) => {
  return z.object({
    message: z.string().openapi({ example: message }),
    data: dataSchema ?? z.null(),
    meta: metaSchemaType,
  })
}

export const successResponseWithPaginationSchema = <T extends z.ZodType>(dataSchema: T) => {
  return successResponseSchema(dataSchema, 'success', metaSchemaWithPagination)
}

export const errorResponseSchema = z.object({
  message : z.string(),
  errors : z.any().optional(),
  meta : metaSchema,
  stack : z.string().optional()
})



// Basis: semua issue punya code + (optional) message + path
const issueBase = z.object({
  code: z.string(),
  message: z.string().optional(),
  path: z.array(z.union([z.string(), z.number()])).optional(),
});

// invalid_type
const issueInvalidType = issueBase.extend({
  code: z.literal("invalid_type"),
  expected: z.string(),
  received: z.string(),
}).openapi({
  example: {
    code: "invalid_type",
    expected: "number",
    received: "string",
    message: "Expected number, received string",
    path: ["age"],
  },
});

// invalid_literal
const issueInvalidLiteral = issueBase.extend({
  code: z.literal("invalid_literal"),
  expected: z.unknown(),
}).openapi({
  example: {
    code: "invalid_literal",
    expected: "ACTIVE",
    message: "Invalid literal value",
    path: ["status"],
  },
});

// unrecognized_keys
const issueUnrecognizedKeys = issueBase.extend({
  code: z.literal("unrecognized_keys"),
  keys: z.array(z.string()),
}).openapi({
  example: {
    code: "unrecognized_keys",
    keys: ["unexpectedField"],
    message: "Unrecognized key(s) in object: 'unexpectedField'",
    path: [],
  },
});

// invalid_union (tidak expose unionErrors karena berat/rumit untuk Swagger)
const issueInvalidUnion = issueBase.extend({
  code: z.literal("invalid_union"),
}).openapi({
  example: {
    code: "invalid_union",
    message: "Invalid input",
    path: ["payload"],
  },
});

// invalid_union_discriminator
const issueInvalidUnionDiscriminator = issueBase.extend({
  code: z.literal("invalid_union_discriminator"),
  options: z.array(z.string()),
}).openapi({
  example: {
    code: "invalid_union_discriminator",
    options: ["email", "phone"],
    message: "Invalid discriminator value",
    path: ["type"],
  },
});

// invalid_enum_value
const issueInvalidEnumValue = issueBase.extend({
  code: z.literal("invalid_enum_value"),
  options: z.array(z.unknown()),
  received: z.unknown().optional(),
}).openapi({
  example: {
    code: "invalid_enum_value",
    options: ["admin", "user", "guest"],
    received: "root",
    message: "Invalid enum value. Expected 'admin' | 'user' | 'guest'",
    path: ["role"],
  },
});

// invalid_arguments (z.function args)
const issueInvalidArguments = issueBase.extend({
  code: z.literal("invalid_arguments"),
}).openapi({
  example: {
    code: "invalid_arguments",
    message: "Invalid function arguments",
    path: [],
  },
});

// invalid_return_type (z.function return)
const issueInvalidReturnType = issueBase.extend({
  code: z.literal("invalid_return_type"),
}).openapi({
  example: {
    code: "invalid_return_type",
    message: "Invalid function return type",
    path: [],
  },
});

// invalid_date
const issueInvalidDate = issueBase.extend({
  code: z.literal("invalid_date"),
}).openapi({
  example: {
    code: "invalid_date",
    message: "Invalid date",
    path: ["birthdate"],
  },
});

// invalid_string
const issueInvalidString = issueBase.extend({
  code: z.literal("invalid_string"),
  validation: z.enum([
    "email",
    "url",
    "uuid",
    "cuid",
    "cuid2",
    "ulid",
    "regex",
    "datetime",
    "ip",
    "emoji",
    "base64",
  ]).optional(),
}).openapi({
  example: {
    code: "invalid_string",
    validation: "email",
    message: "Invalid email",
    path: ["email"],
  },
});

// too_small
const issueTooSmall = issueBase.extend({
  code: z.literal("too_small"),
  minimum: z.number(),
  inclusive: z.boolean(),
  exact: z.boolean().optional(),
  type: z.enum(["string", "number", "array", "set", "date"]),
}).openapi({
  example: {
    code: "too_small",
    minimum: 6,
    inclusive: true,
    type: "string",
    message: "String must contain at least 6 character(s)",
    path: ["password"],
  },
});

// too_big
const issueTooBig = issueBase.extend({
  code: z.literal("too_big"),
  maximum: z.number(),
  inclusive: z.boolean(),
  exact: z.boolean().optional(),
  type: z.enum(["string", "number", "array", "set", "date"]),
}).openapi({
  example: {
    code: "too_big",
    maximum: 100,
    inclusive: true,
    type: "string",
    message: "String must contain at most 100 character(s)",
    path: ["username"],
  },
});

// invalid_intersection_types
const issueInvalidIntersectionTypes = issueBase.extend({
  code: z.literal("invalid_intersection_types"),
}).openapi({
  example: {
    code: "invalid_intersection_types",
    message: "Intersection types are not compatible",
    path: ["profile"],
  },
});

// not_multiple_of
const issueNotMultipleOf = issueBase.extend({
  code: z.literal("not_multiple_of"),
  multipleOf: z.number(),
}).openapi({
  example: {
    code: "not_multiple_of",
    multipleOf: 5,
    message: "Number must be a multiple of 5",
    path: ["quantity"],
  },
});

// custom (refine / superRefine)
const issueCustom = issueBase.extend({
  code: z.literal("custom"),
}).openapi({
  example: {
    code: "custom",
    message: "Password and confirmation do not match",
    path: ["confirmPassword"],
  },
});

// UNION seluruh kemungkinan issue Zod
export const zodIssueSchema = z.union([
  issueInvalidType,
  issueInvalidLiteral,
  issueUnrecognizedKeys,
  issueInvalidUnion,
  issueInvalidUnionDiscriminator,
  issueInvalidEnumValue,
  issueInvalidArguments,
  issueInvalidReturnType,
  issueInvalidDate,
  issueInvalidString,
  issueTooSmall,
  issueTooBig,
  issueInvalidIntersectionTypes,
  issueNotMultipleOf,
  issueCustom,
]);
