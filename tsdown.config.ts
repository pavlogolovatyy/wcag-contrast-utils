import { defineConfig } from 'tsdown';

const validatePackage = process.env.TSDOWN_VALIDATE_PACKAGE === 'true';

export default defineConfig({
  entry: 'src/index.ts',
  format: ['esm', 'cjs'],
  dts: true,
  sourcemap: true,
  clean: true,
  target: 'es2020',
  publint: validatePackage
    ? {
        level: 'error',
        strict: true,
      }
    : false,
  attw: validatePackage
    ? {
        profile: 'node16',
        level: 'error',
      }
    : false,
});
