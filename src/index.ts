#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { configurePreferenceTools } from "./prefs.js";
import { configureCommonTools } from "./common.js";
import pkg from "../package.json" with { type: "json" };

const server = new McpServer(
  {
    name: "Pref-Editor",
    version: pkg.version,
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

try {
  await main()
} catch (error) {
  process.exit(1);
} 