import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import EnvironmentPlugin from "vite-plugin-environment";

// Só use o plugin EnvironmentPlugin em ambiente de testes...
let arr;
if (process.env.NODE_ENV == "production") arr = [tailwindcss(), react()];
else arr = [tailwindcss(), react(), EnvironmentPlugin("all")];

// https://vite.dev/config/
export default defineConfig({
  plugins: arr
});
