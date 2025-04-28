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

| Add a user preference | Available tools |
|-------------------------|-------------------------|
| ![Add user preference](./demo/add-pref.png) | ![Available tools](./demo/tools-listing.png) |

| List connected devices | List installed apps |
|-------------------------|-------------------------|
| ![List connected devices](./demo/list-devices.png) | ![List installed apps](./demo/list-apps.png) |

## License

See [LICENSE](./LICENSE)
