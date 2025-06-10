import { McpServer } from "@modelcontextprotocol/sdk/server/mcp";
import { parseDataType, validate } from "./utils";
import { EditPrefSchema, AddPrefSchema, DeletePrefSchema } from "./schema";
import {
  PartialPreference,
  changePreference,
  deletePreference,
  Preference,
  addPreference,
} from "@charlesmuchene/pref-editor";

export const configurePreferenceTools = (server: McpServer) => {
  server.tool(
    "change_preference",
    "Changes the value of an existing preference",
    EditPrefSchema.shape,
    async (input) => {
      try {
        validate(input, EditPrefSchema);

        const { name, value, ...connection } = input;

        const pref: PartialPreference = {
          value,
          key: name,
        };

        await changePreference(pref, connection);

        return {
          content: [
            {
              type: "text",
              text: `Preference changed`,
            },
          ],
        };
      } catch (error) {
        return {
          isError: true,
          content: [
            {
              type: "text",
              text: error instanceof Error ? error.message : "Unknown error",
            },
          ],
        };
      }
    }
  );

  server.tool(
    "delete_preference",
    "Delete an existing preference",
    DeletePrefSchema.shape,
    async (input) => {
      try {
        validate(input, DeletePrefSchema);

        const { name, ...connection } = input;

        await deletePreference({ key: name }, connection);

        return {
          content: [
            {
              type: "text",
              text: `Preference deleted`,
            },
          ],
        };
      } catch (error) {
        return {
          isError: true,
          content: [
            {
              type: "text",
              text: error instanceof Error ? error.message : "Unknown error",
            },
          ],
        };
      }
    }
  );

  server.tool(
    "add_preference",
    "Adds a new preference given the name, value and type.",
    AddPrefSchema.shape,
    async (input) => {
      try {
        validate(input, AddPrefSchema);

        const { name, value, type, ...connection } = input;

        const pref: Preference = {
          key: name,
          value,
          type: parseDataType(type),
        };

        await addPreference(pref, connection);

        return {
          content: [
            {
              type: "text",
              text: `Preference added`,
            },
          ],
        };
      } catch (error) {
        return {
          isError: true,
          content: [
            {
              type: "text",
              text: error instanceof Error ? error.message : "Unknown error",
            },
          ],
        };
      }
    }
  );
};
