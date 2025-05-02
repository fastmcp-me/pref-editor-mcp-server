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

const appSchema = Object.assign(deviceSchema, {
  appId: z.string(),
});

const fileSchema = Object.assign(appSchema, {
  filename: z.string().regex(/.*\.(xml|preferences_pb)$/),
});

const prefSchema = {
  name: z.string(),
  value: z.string(),
  type: z.string(),
};

const addPrefSchema = {
  ...prefSchema,
  ...fileSchema,
};

const editPrefSchema = { ...addPrefSchema };

const deletePrefSchema = {
  name: z.string(),
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
    version: "0.2.0",
  },
  {
    capabilities: {
      resources: {},
      tools: {},
    },
  }
);

server.tool(
  "change_preference",
  "Changes the value of an existing preference",
  editPrefSchema,
  async ({ name, value, type, ...connection }) => {
    const pref: Preference = {
      value,
      key: name,
      type: parseDataType(type),
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
  async ({ name, ...connection }) => {
    // TODO Indicate success or failure
    deletePreference({ key: name }, connection);
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

server.tool(
  "add_preference",
  "Adds a new preference given the name, value and type.",
  addPrefSchema,
  async ({ name, value, type, ...connection }) => {
    const pref: Preference = {
      key: name,
      value,
      type: parseDataType(type),
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
  async (connection) => ({
    content: (await listFiles(connection)).map((file) => ({
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
