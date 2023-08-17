import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import * as path from 'path';

const __dirname = path.resolve();
console.log(__dirname)
const commonConfigObject = {
  plugins: [react()],
  define: {
    'process.env': {},
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src/'),
      '@api': path.resolve(__dirname, './src/api'),
      '@assets': path.resolve(__dirname, './src/assets'),
      '@components': path.resolve(__dirname, './src/components'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@ReduxStore': path.resolve(__dirname, './src/ReduxStore'),
      '@routes': path.resolve(__dirname, './src/routes'),
      '@images': path.resolve(__dirname, './src/assets/images'),
      '@files': path.resolve(__dirname, './src/assets/files'),
      '@validators': path.resolve(__dirname, './src/validators'),
      '@constants': path.resolve(__dirname, './src/constants'),
      '@helpers': path.resolve(__dirname, './src/helpers'),
      '@context': path.resolve(__dirname, './src/context'),
      '@types': path.resolve(__dirname, './src/types'),
      '@roles': path.resolve(__dirname, './src/rolesBasedAccessControl'),
      '@utlis': path.resolve(__dirname, './src/utlis'),
      '@modals': path.resolve(__dirname, './src/components/Modals'),
      '@services': path.resolve(__dirname, './src/services'),

    },
  },
};


export default defineConfig(({ command, mode, ssrBuild }) => {
  
  console.log(mode, ssrBuild, command, commonConfigObject);
  // eslint-disable-next-line no-undef
  const env = loadEnv(mode, process.cwd(), '');

  if (mode === 'development') {
    return {
      // server: {
      //   proxy: {
      //     '/api': {
      //       target: env.BASE_URL,
      //       toProxy: true,
      //       changeOrigin: true,
      //       secure: true,
      //       rewrite: (path) => {
      //         return path.replace(/^\/api/, '');
      //       },
      //     },
      //     cors: false,
      //   },
      // },
      ...commonConfigObject,
    };
  } else if (mode === 'staging') {
    return {
      // server: {
      //   proxy: {
      //     '/api': {
      //       target: env.BASE_URL,
      //       toProxy: true,
      //       changeOrigin: false,
      //       secure: true,
      //       rewrite: (path) => path.replace(/^\/api/, ''),
      //     },
      //     cors: false,
      //     strictPort: true,
      //     port: 3000,
      //   },
      // },
      build: {
        minify: 'terser'
      },
      ...commonConfigObject,
    };
  } else if (mode === 'production') {
    return {
      // server: {
      //   proxy: {
      //     '/api': {
      //       target: env.BASE_URL,
      //       changeOrigin: true,
      //       secure: false,
      //       rewrite: (path) => path.replace(/^\/api/, ''),
      //     },
      //     cors: false,
      //   },
      // },
      build: {
        minify: 'terser',
      },
      ...commonConfigObject,
    };
  }
});
