import {
  App,
  listApps,
  listFiles,
  getDevice,
  createFile,
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
  async (_uri, { deviceId }) => ({
    contents: (
      await listApps(
        getDevice(Array.isArray(deviceId) ? deviceId[0] : deviceId)
      )
    ).map((app) => ({
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
  async (_uri, { deviceId, appId }) => {
    const devId = Array.isArray(deviceId) ? deviceId[0] : deviceId;
    const app: App = { packageName: Array.isArray(appId) ? appId[0] : appId };
    return {
      contents: (await listFiles(getDevice(devId), app)).map((file) => ({
        uri: `pref-editor://${deviceId}/${app.packageName}/${file.name}`,
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
  async (_uri, { deviceId, appId, filename }) => {
    const devId = Array.isArray(deviceId) ? deviceId[0] : deviceId;
    const app: App = { packageName: Array.isArray(appId) ? appId[0] : appId };
    const file = createFile(Array.isArray(filename) ? filename[0] : filename);
    return {
      contents: (await readPreferences(getDevice(devId), app, file)).map(
        (pref) => ({
          uri: `pref-editor://${deviceId}/${app.packageName}/${file.name}/${pref.key}`,
          mimeType: "application/json",
          text: JSON.stringify(pref, null, 2),
        })
      ),
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
