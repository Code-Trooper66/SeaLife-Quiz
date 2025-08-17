import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const SOURCE_PATH = path.resolve("src");
export const VIEWS_PATH = path.resolve(SOURCE_PATH, "views");
export const PUBLIC_PATH = path.resolve("public");
export const LOCALES_PATH = path.resolve(__dirname, "locales");
export const PORT = process.env.PORT || 3000;
