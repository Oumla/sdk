import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  minify: false,
  target: 'es2020',
  outDir: 'dist',
  external: [],
  treeshake: true,
  bundle: true,
  platform: 'node',
  esbuildOptions(options) {
    options.banner = {
      js: '"use strict";',
    };
  },
});
