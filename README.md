# Android-Preference-Editor MCP Server

An **MCP server** for editing Android preferences - based on the [Android Preference Editor](https://github.com/charlesmuchene/pref-editor-js.git) tool.

## Requirements

- Android [adb](https://developer.android.com/tools/adb)

## Tools

| Name              | Description                                           |
| ----------------- | ----------------------------------------------------- |
| change_preference | Changes the value of an existing preference           |
| delete_preference | Delete an existing preference                         |
| add_preference    | Adds a new preference given the name, value and type. |
| devices           | Lists connected Android devices                       |
| list_apps         | Lists apps installed on device                        |
| list_files        | Lists preference files for an app                     |
| read_preferences  | Reads all user preferences in a file                  |

## Usage

Add this to the server configuration file:

```json
{
  "mcpServers": {
    "pref-editor": {
      "command": "npx",
      "args": ["@charlesmuchene/pref-editor-mcp-server"]
    }
  }
}
```

## Demo

| Toggle a user preference                            | Available tools                              |
| --------------------------------------------------- | -------------------------------------------- |
| ![Toggle a user preference](./demo/toggle-pref.png) | ![Available tools](./demo/tools-listing.png) |

> See more demo screenshots [here](./demo/)

## Build

- `npm run install`
- `npm run build`

## Glamad

<a href="https://glama.ai/mcp/servers/@charlesmuchene/pref-editor-mcp-server">
  <img width="380" height="200" src="https://glama.ai/mcp/servers/@charlesmuchene/pref-editor-mcp-server/badge" />
</a>

## License

See [LICENSE](./LICENSE)
