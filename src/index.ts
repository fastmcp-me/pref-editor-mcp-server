import {
  TypeTag,
  listApps,
  listFiles,
  Preference,
  listDevices,
  addPreference,
  deletePreference,
  changePreference,
  readPreferences,
  PartialPreference,
} from "@charlesmuchene/pref-editor";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z, ZodType } from "zod";

const DeviceSchema = z.object({
  deviceId: z.string().describe("The device's serial number."),
});

const AppSchema = DeviceSchema.extend({
  appId: z.string().describe("The application's package name."),
});

const FileSchema = AppSchema.extend({
  filename: z.string().describe("The filename with or without the extension."),
});

const NameSchema = z.object({
  name: z.string().describe("The name/key of the user preference"),
});

const PrefSchema = NameSchema.extend({
  value: z.string().describe("The value of user preference"),
});

const TypedPrefSchema = PrefSchema.extend({
  type: z
    .string()
    .describe(
      "The type of the preference value: integer, boolean, float, double, long or string"
    ),
});

const AddPrefSchema = TypedPrefSchema.merge(FileSchema);

const EditPrefSchema = PrefSchema.merge(FileSchema);

const DeletePrefSchema = NameSchema.merge(FileSchema);

const parseDataType = (type: string): TypeTag => {
  const result = TypeTag[type.toUpperCase() as keyof typeof TypeTag];
  if (result === undefined)
    throw new Error(
      `Invalid data type: '${type}'. Choose one of: integer, boolean, float, double, long or string`
    );
  return result;
};

const validate = (input: unknown, type: ZodType) => {
  const validationResult = type.safeParse(input);
  if (!validationResult.success)
    throw new Error(
      `Invalid input: ${validationResult.error.errors
        .map((err) => err.message)
        .join(", ")}`
    );
};

const server = new McpServer(
  {
    name: "Pref-Editor",
    version: "0.3.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

server.tool(
  "change_preference",
  "Changes the value of an existing preference",
  EditPrefSchema.shape,
  async (input) => {
    try {
      validate(input, EditPrefSchema);

      const { name, value, ...connection } = input;

      const pref: PartialPreference = {
        value,
        key: name,
      };

      await changePreference(pref, connection);

      return {
        content: [
          {
            type: "text",
            text: `Preference changed`,
          },
        ],
      };
    } catch (error) {
      return {
        isError: true,
        content: [
          {
            type: "text",
            text: error instanceof Error ? error.message : "Unknown error",
          },
        ],
      };
    }
  }
);

server.tool(
  "delete_preference",
  "Delete an existing preference",
  DeletePrefSchema.shape,
  async (input) => {
    try {
      validate(input, DeletePrefSchema);

      const { name, ...connection } = input;

      await deletePreference({ key: name }, connection);

      return {
        content: [
          {
            type: "text",
            text: `Preference deleted`,
          },
        ],
      };
    } catch (error) {
      return {
        isError: true,
        content: [
          {
            type: "text",
            text: error instanceof Error ? error.message : "Unknown error",
          },
        ],
      };
    }
  }
);

server.tool(
  "add_preference",
  "Adds a new preference given the name, value and type.",
  AddPrefSchema.shape,
  async (input) => {
    try {
      validate(input, AddPrefSchema);

      const { name, value, type, ...connection } = input;

      const pref: Preference = {
        key: name,
        value,
        type: parseDataType(type),
      };

      await addPreference(pref, connection);

      return {
        content: [
          {
            type: "text",
            text: `Preference added`,
          },
        ],
      };
    } catch (error) {
      return {
        isError: true,
        content: [
          {
            type: "text",
            text: error instanceof Error ? error.message : "Unknown error",
          },
        ],
      };
    }
  }
);

server.tool("devices", "Lists connected Android devices", async () => {
  try {
    return {
      content: (await listDevices()).map((device) => ({
        type: "text",
        text: device.serial,
      })),
    };
  } catch (error) {
    return {
      isError: true,
      content: [
        {
          type: "text",
          text: error instanceof Error ? error.message : "Unknown error",
        },
      ],
    };
  }
});

server.tool(
  "list_apps",
  "Lists apps installed on device",
  DeviceSchema.shape,
  async (connection) => {
    try {
      validate(connection, DeviceSchema);

      return {
        content: (await listApps(connection)).map((app) => ({
          type: "text",
          text: app.packageName,
        })),
      };
    } catch (error) {
      return {
        isError: true,
        content: [
          {
            type: "text",
            text: error instanceof Error ? error.message : "Unknown error",
          },
        ],
      };
    }
  }
);

server.tool(
  "list_files",
  "Lists preference files for an app",
  AppSchema.shape,
  async (connection) => {
    try {
      validate(connection, AppSchema);

      return {
        content: (await listFiles(connection)).map((file) => ({
          type: "text",
          text: file.name,
        })),
      };
    } catch (error) {
      return {
        isError: true,
        content: [
          {
            type: "text",
            text: error instanceof Error ? error.message : "Unknown error",
          },
        ],
      };
    }
  }
);

server.tool(
  "read_preferences",
  "Reads all user preferences in a file",
  FileSchema.shape,
  async (connection) => {
    try {
      validate(connection, FileSchema);

      return {
        content: (await readPreferences(connection)).map((pref) => ({
          type: "text",
          mimeType: "application/json",
          text: JSON.stringify(pref, null, 2),
        })),
      };
    } catch (error) {
      return {
        isError: true,
        content: [
          {
            type: "text",
            text: error instanceof Error ? error.message : "Unknown error",
          },
        ],
      };
    }
  }
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch(console.error);
