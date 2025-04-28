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
} from "@charlesmuchene/pref-editor";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const deviceSchema = {
  deviceId: z.string(),
};

const appSchema = Object.assign(
  {
    appId: z.string(),
  },
  deviceSchema
);

const fileSchema = Object.assign(
  {
    filename: z
      .string()
      .endsWith(".xml")
      .or(z.string().endsWith(".preferences_pb")),
  },
  appSchema
);

const prefSchema = {
  key: z.string(),
  value: z.string(),
  type: z.string(),
};

const addPrefSchema = {
  ...prefSchema,
  ...fileSchema,
};

const editPrefSchema = { ...addPrefSchema };

const deletePrefSchema = {
  key: z.string(),
  ...fileSchema,
};

const parseDataType = (type: string): TypeTag => {
  const result = TypeTag[type.toUpperCase() as keyof typeof TypeTag];
  if (result === undefined) throw new Error(`Invalid data type: ${type}`);
  return result;
};

const server = new McpServer(
  {
    name: "Pref-Editor",
    version: "0.1.0",
  },
  {
    capabilities: {
      resources: {},
      tools: {},
    },
  }
);

server.tool(
  "add_preference",
  "Adds a new preference given the key, value and type.",
  addPrefSchema,
  async ({ key, value, type, ...connection }) => {
    const pref: Preference = {
      key,
      value,
      tag: parseDataType(type),
    };
    // TODO Indicate success or failure
    addPreference(pref, { ...connection });
    return {
      content: [
        {
          type: "text",
          text: `Preference added`,
        },
      ],
    };
  }
);

server.tool(
  "change_preference",
  "Changes the value of an existing preference",
  editPrefSchema,
  async ({ key, value, type, ...connection }) => {
    const pref: Preference = {
      key,
      value,
      tag: parseDataType(type),
    };
    // TODO Indicate success or failure
    changePreference(pref, connection);
    return {
      content: [
        {
          type: "text",
          text: `Preference edited`,
        },
      ],
    };
  }
);

server.tool(
  "delete_preference",
  "Delete an existing preference",
  deletePrefSchema,
  async ({ key, ...connection }) => {
    // TODO Indicate success or failure
    deletePreference({ key }, connection);
    return {
      isError: false,
      content: [
        {
          type: "text",
          text: `Preference deleted`,
        },
      ],
    };
  }
);

server.tool("devices", "Lists connected Android devices", async () => ({
  content: (await listDevices()).map((device) => ({
    type: "text",
    text: device.serial,
  })),
}));

server.tool(
  "list_apps",
  "Lists apps installed on device",
  deviceSchema,
  async ({ deviceId }) => ({
    content: (await listApps({ deviceId })).map((app) => ({
      type: "text",
      text: app.packageName,
    })),
  })
);

server.tool(
  "list_files",
  "Lists preference files for an app",
  appSchema,
  async ({ deviceId, appId }) => ({
    content: (await listFiles({ deviceId, appId })).map((file) => ({
      type: "text",
      text: file.name,
    })),
  })
);

server.tool(
  "read_preferences",
  "Reads all user preferences in a file",
  fileSchema,
  async (connection) => ({
    content: (await readPreferences(connection)).map((pref) => ({
      type: "text",
      mimeType: "application/json",
      text: JSON.stringify(pref, null, 2),
    })),
  })
);

const transport = new StdioServerTransport();
await server.connect(transport);
