# Pref-Editor MCP Server

This is the [Pref-Editor](https://github.com/charlesmuchene/pref-editor-js.git) MCP server

## Usage

Add this to the server configuration file:

```json
{
    "mcpServers": {
        "pref-editor": {
            "command": "node",
            "args": [ "dist/index.js" ]
        }
    }
}
```

## Demo

| Connected Devices| Apps, Files, Preferences |
|-------------------------|-------------------------|
| ![Connected Devices](./demo-1.png) | ![Apps, Files, Preferences](./demo-2.png) |

| Listing Datastore Prefs | Adding a preference |
|-------------------------|-------------------------|
| ![Listing Datastore Prefs](./demo-3.png) | ![Adding a preference](./demo-4.png) |

## License

See [LICENSE](./LICENSE)
