import type { Config } from "drizzle-kit";

// Since, this is not inside the ./src folder,
// so we cannot access the .env's without the dotenv package.
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

export default {
  driver: "pg",
  out: "./drizzle",
  schema: "./src/db/schema.ts",
  dbCredentials: {
    connectionString: process.env.DATABASE_URL!,
  },
} satisfies Config;
