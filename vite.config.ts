import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import svgr from "vite-plugin-svgr";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react(), svgr(), tailwindcss()],
	base: "/discovraphy/",
	build: {
		rollupOptions: {
			input: {
				main: "./index.html",
				err: "./404.html",
			},
		},
	},
});
