# Android-Preference-Editor MCP Server

An **MCP server** for editing Android preferences - based on the [Android Preference Editor](https://github.com/charlesmuchene/pref-editor-js.git) tool.

## Requirements

- Android [adb](https://developer.android.com/tools/adb)

## Usage

Add this to the server configuration file:

```json
{
  "mcpServers": {
    "pref-editor": {
      "command": "node",
      "args": ["dist/index.js"]
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

`npm run build`

## License

See [LICENSE](./LICENSE)
