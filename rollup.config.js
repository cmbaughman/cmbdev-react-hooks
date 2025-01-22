import { babel } from '@rollup/plugin-babel';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';

export default {
  input: 'src/index.ts', // Your main entry file (where you export the hooks)
  output: [
    {
      file: 'dist/index.js', // CommonJS output for Node.js
      format: 'cjs',
      sourcemap: true,
    },
    {
      file: 'dist/index.mjs', // ES Modules output for modern bundlers/browsers
      format: 'es',
      sourcemap: true,
    },
  ],
  plugins: [
    nodeResolve(),
    typescript(),
    babel({
      babelHelpers: 'bundled',
      exclude: 'node_modules/**',
      presets: ['@babel/preset-env', '@babel/preset-react'],
    }),
  ],
  external: ['react', 'react-dom'],
};