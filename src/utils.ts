import { TypeTag } from "@charlesmuchene/pref-editor";
import { ZodType } from "zod";

export const parseDataType = (type: string): TypeTag => {
  const result = TypeTag[type.toUpperCase() as keyof typeof TypeTag];
  if (result === undefined)
    throw new Error(
      `Invalid data type: '${type}'. Choose one of: integer, boolean, float, double, long or string`
    );
  return result;
};

export const validate = (input: unknown, type: ZodType) => {
  const validationResult = type.safeParse(input);
  if (!validationResult.success)
    throw new Error(
      `Invalid input: ${validationResult.error.errors
        .map((err) => err.message)
        .join(", ")}`
    );
};
