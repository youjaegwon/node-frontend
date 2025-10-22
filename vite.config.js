import { defineConfig } from "vite";

// 필요 시 base 경로나 서버 프록시 등을 여기서 설정
export default defineConfig({
  server: { port: 5173 },
  build: { outDir: "dist" }
});
