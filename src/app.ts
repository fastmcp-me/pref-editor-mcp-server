import { listDevices } from "@charlesmuchene/pref-editor";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

const server = new McpServer({
  name: "Pref-Editor",
  version: "1.0.0",
});

server.tool("devices", "Lists connected devices", async () => ({
  content: [
    {
      type: "text",
      text: (await listDevices()).map((device) => device.serial).toString(),
    },
  ],
}));

const transport = new StdioServerTransport();
await server.connect(transport);
