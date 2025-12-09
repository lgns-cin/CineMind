import { defineConfig, loadEnv, type PluginOption } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import EnvironmentPlugin from "vite-plugin-environment";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Só use o plugin EnvironmentPlugin em ambiente de testes...
  const arr: (PluginOption | PluginOption[])[] = [tailwindcss(), react()];
  if (process.env.NODE_ENV != "production") arr.push(EnvironmentPlugin("all"));

  const env = loadEnv(mode, process.cwd(), "");

  return {
    define: {
      "process.env.ENVIRONMENT": JSON.stringify(env.ENVIRONMENT),
      "process.env.BACKEND_URL": JSON.stringify(env.BACKEND_URL)
    },
    plugins: arr
  };
});
