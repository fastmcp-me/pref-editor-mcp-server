import { listDevices } from "@charlesmuchene/pref-editor";
const main = async () => {
  console.log("Application started: MCPing...");
  const devices = await listDevices();
  console.log(devices);
  console.log("Application finished.");
};

main().catch(console.error);
