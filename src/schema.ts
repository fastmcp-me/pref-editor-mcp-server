import { z } from "zod";

export const DeviceSchema = z.object({
  deviceId: z.string().describe("The device's serial number."),
});

export const AppSchema = DeviceSchema.extend({
  appId: z.string().describe("The application's package name."),
});

export const FileSchema = AppSchema.extend({
  filename: z.string().describe("The filename with or without the extension."),
});

export const NameSchema = z.object({
  name: z.string().describe("The name/key of the user preference"),
});

export const PrefSchema = NameSchema.extend({
  value: z.string().describe("The value of user preference"),
});

export const TypedPrefSchema = PrefSchema.extend({
  type: z
    .string()
    .describe(
      "The type of the preference value: integer, boolean, float, double, long or string"
    ),
});

export const AddPrefSchema = TypedPrefSchema.merge(FileSchema);

export const EditPrefSchema = PrefSchema.merge(FileSchema);

export const DeletePrefSchema = NameSchema.merge(FileSchema);
