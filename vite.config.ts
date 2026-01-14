import { resolve } from 'node:path';
import { URL, fileURLToPath } from 'node:url';

import VueI18n from '@intlify/unplugin-vue-i18n/vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import Unocss from 'unocss/vite';
import AutoImport from 'unplugin-auto-import/vite';
import IconsResolver from 'unplugin-icons/resolver';
import Icons from 'unplugin-icons/vite';
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers';
import Components from 'unplugin-vue-components/vite';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';
import markdown from 'vite-plugin-vue-markdown';
import svgLoader from 'vite-svg-loader';
import { configDefaults } from 'vitest/config';

const baseUrl = process.env.BASE_URL ?? '/';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    VueI18n({
      runtimeOnly: true,
      jitCompilation: true,
      compositionOnly: true,
      fullInstall: true,
      strictMessage: false,
      include: [
        resolve(__dirname, 'locales/**'),
      ],
    }),
    AutoImport({
      imports: [
        'vue',
        'vue-router',
        '@vueuse/core',
        'vue-i18n',
        {
          'naive-ui': ['useDialog', 'useMessage', 'useNotification', 'useLoadingBar'],
        },
      ],
      vueTemplate: true,
      eslintrc: {
        enabled: true,
      },
    }),
    Icons({ compiler: 'vue3' }),
    vue({
      include: [/\.vue$/, /\.md$/],
    }),
    vueJsx(),
    markdown(),
    svgLoader(),
    VitePWA({
      registerType: 'autoUpdate',
      strategies: 'generateSW',
      manifest: {
        name: 'ToolsApp Lab',
        shortName: 'ToolsApp Lab',
        description: 'The Pro Developer Playground - 100+ privacy-focused tools running locally in your browser.',
        display: 'standalone',
        lang: 'en-US',
        start_url: `${baseUrl}?utm_source=pwa&utm_medium=pwa`,
        orientation: 'any',
        theme_color: '#0B0E14',
        background_color: '#0B0E14',
        icons: [
          {
            src: '/favicon-16x16.png',
            type: 'image/png',
            sizes: '16x16',
          },
          {
            src: '/favicon-32x32.png',
            type: 'image/png',
            sizes: '32x32',
          },
          {
            src: '/android-chrome-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/android-chrome-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ],
      },
    }),
    Components({
      dirs: ['src/'],
      extensions: ['vue', 'md'],
      include: [/\.vue$/, /\.vue\?vue/, /\.md$/],
      resolvers: [NaiveUiResolver(), IconsResolver({ prefix: 'icon' })],
    }),
    Unocss(),
  ],
  base: baseUrl,
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  define: {
    'import.meta.env.PACKAGE_VERSION': JSON.stringify(process.env.npm_package_version),
  },
  test: {
    exclude: [...configDefaults.exclude, '**/*.e2e.spec.ts'],
  },
  build: {
    target: 'esnext',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info'],
        // Additional optimizations
        dead_code: true,
        conditionals: true,
        evaluate: true,
        side_effects: true,
      },
      format: {
        comments: false,
      },
    },
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Vendor chunks for better caching
          if (id.includes('node_modules')) {
            // Vue ecosystem
            if (id.includes('vue') || id.includes('pinia') || id.includes('@vueuse')) {
              return 'vue-vendor';
            }
            // Naive UI - split into smaller chunks
            if (id.includes('naive-ui')) {
              return 'naive-ui';
            }
            // Monaco Editor - lazy loaded chunk
            if (id.includes('monaco-editor')) {
              return 'editor';
            }
            // Utility libraries
            if (id.includes('lodash') || id.includes('date-fns') || id.includes('colord')) {
              return 'utils';
            }
            // Markdown and text processing
            if (id.includes('markdown-it') || id.includes('marked') || id.includes('dompurify')) {
              return 'markdown';
            }
            // Crypto and security libraries
            if (id.includes('crypto') || id.includes('bcrypt') || id.includes('node-forge')) {
              return 'crypto';
            }
            // QR code and image libraries
            if (id.includes('qrcode') || id.includes('sharp')) {
              return 'images';
            }
            // Other vendor code
            return 'vendor';
          }
        },
        // Optimize chunk file names
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
      },
      // Optimize Rollup performance
      treeshake: {
        moduleSideEffects: false,
        propertyReadSideEffects: false,
        unknownGlobalSideEffects: false,
      },
    },
    // Optimize chunk size - increased for better code splitting
    chunkSizeWarningLimit: 600,
    // Enable source code transformation
    sourcemap: false,
    // CSS code splitting
    cssCodeSplit: true,
    // Enable build optimizations
    reportCompressedSize: false,
    maxParallelFileOps: 8,
  },
  // Optimize dependencies pre-bundling
  optimizeDeps: {
    include: [
      'vue',
      'vue-router',
      'pinia',
      'naive-ui',
      '@vueuse/core',
      'date-fns',
      'colord',
    ],
    // Exclude large dependencies from pre-bundling
    exclude: ['monaco-editor'],
  },
  // Server configuration
  server: {
    port: 5173,
    host: true,
  },
});
