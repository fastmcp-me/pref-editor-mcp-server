import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { configurePreferenceTools } from "./prefs";
import { configureCommonTools } from "./common";

const server = new McpServer(
  {
    name: "Pref-Editor",
    version: "0.4.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

configurePreferenceTools(server);
configureCommonTools(server);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch(console.error);
