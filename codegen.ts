import { type CodegenConfig } from "@graphql-codegen/cli";
import dotenv from "dotenv";

import { getBasicAuthToken } from "./src/lib/utilities/getBasicAuthToken";

dotenv.config();

if (!process.env.API_URL || process.env.API_URL.trim() === "") {
  throw new Error("API_URL is missing or empty. Please set it in .env.");
}

const headers: Record<string, string> = {};
const token = getBasicAuthToken();

if (token) {
  headers.Authorization = token;
}

const config: CodegenConfig = {
  schema: [
    {
      [`${process.env.API_URL}`]: {
        headers,
      },
    },
  ],
  documents: ["src/graphql/**/*.{graphql}"],
  generates: {
    "./src/graphql/generated/": {
      preset: "client",
      plugins: [],
      presetConfig: {
        gqlTagName: "gql",
      },
      config: {
        maybeValue: "T | null | undefined",
        scalars: {
          DateTime: "string",
          Date: "string",
        },
      },
    },
  },
  ignoreNoDocuments: true,
};

export default config;
