import {
  listApps,
  listFiles,
  listDevices,
  readPreferences,
} from "@charlesmuchene/pref-editor";
import {
  McpServer,
  ResourceTemplate,
} from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const server = new McpServer(
  {
    name: "Pref-Editor",
    version: "1.0.0",
  },
  {
    capabilities: {
      resources: {},
      tools: {},
    },
  }
);

server.resource("devices", "pref-editor://devices", async (_uri) => ({
  contents: (await listDevices()).map((device) => ({
    uri: `pref-editor://${device.serial}`,
    text: device.serial,
  })),
}));

server.resource(
  "apps",
  new ResourceTemplate("pref-editor://{deviceId}", { list: undefined }),
  async (uri, { deviceId }) => ({
    contents: (await listApps(uri)).map((app) => ({
      uri: `pref-editor://${deviceId}/${app.packageName}`,
      text: app.packageName,
    })),
  })
);

server.resource(
  "files",
  new ResourceTemplate("pref-editor://{deviceId}/{appId}", {
    list: undefined,
  }),
  async (uri, { deviceId, appId }) => {
    return {
      contents: (await listFiles(uri)).map((file) => ({
        uri: `pref-editor://${deviceId}/${appId}/${file.name}`,
        text: file.name,
      })),
    };
  }
);

server.resource(
  "preferences",
  new ResourceTemplate("pref-editor://{deviceId}/{appId}/{filename}", {
    list: undefined,
  }),
  async (uri, { deviceId, appId, filename }) => {
    return {
      contents: (await readPreferences(uri)).map((pref) => ({
        uri: `pref-editor://${deviceId}/${appId}/${filename}/${pref.key}`,
        mimeType: "application/json",
        text: JSON.stringify(pref, null, 2),
      })),
    };
  }
);

server.tool(
  "edit",
  "Edit a preference",
  { key: z.string(), value: z.string(), uri: z.string().url() },
  async ({ key, value, uri }) => {
    return {
      isError: false,
      content: [
        {
          type: "text",
          text: `Preference edited successfully: ${key}, ${value}, ${uri}`,
        },
      ],
    };
  }
);
server.tool(
  "add",
  "Add a preference",
  { key: z.string(), value: z.string(), uri: z.string().url() },
  async ({ key, value, uri }) => {
    return {
      isError: false,
      content: [
        {
          type: "text",
          text: `Preference added successfully: ${key}, ${value}, ${uri}`,
        },
      ],
    };
  }
);
server.tool(
  "delete",
  "Delete a preference",
  { key: z.string(), uri: z.string().url() },
  async ({ key, uri }) => {
    return {
      isError: false,
      content: [
        {
          type: "text",
          text: `Preference deleted successfully: ${key}, ${uri}`,
        },
      ],
    };
  }
);

const transport = new StdioServerTransport();
await server.connect(transport);
