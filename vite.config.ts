// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'
// import path from 'path';

// // https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [react()],
//   css: {
//     preprocessorOptions: {
//        less: {
//          modifyVars: {
//            hack: `true; @import (reference) "${path.resolve('src/assets/styles/base.less')}";`,
//          },
//          javascriptEnabled: true
//        }
//     }
//   }
// })
/*
 * @Author: your name
 * @Date: 2021-10-15 10:30:04
 * @lastTime: 2022-01-24 15:46:00
 * @LastAuthor: Huangxianwei
 * @Description: In User Settings Edit
 * @FilePath: /library/packages/web/vite.config.ts
 */
import { defineConfig } from 'vite';
import { resolve } from 'path';
import react from '@vitejs/plugin-react';
// import html from 'vite-plugin-html';
// import svgSprite from 'vite-plugin-svg-sprite';
// import viteCompression from 'vite-plugin-compression';
// import { VitePWA } from 'vite-plugin-pwa';
import { chunkPath, cdnBase } from './config';

// base域
const base = `${cdnBase}/`;
const plugins = [
    react(),
    // viteCompression(),
    // html({
    //     inject: {
    //         data: {
    //             title: 'vite-plugin-html-example',
    //             // injectScript: '<script src="./inject.js"></script>',
    //         },
    //     },
    //     minify: true,
    // }),
    // svgSprite({ symbolId: 'icon-[name]-[hash]' }),
];

const common = {
    server: {
        open: true,
        host: '0.0.0.0',
        port: 3001,
        // https: {
        // },
        proxy: {
            '/api/': 'http://note.test.kxsz.net',
        },
    },
    resolve: {
        alias: [
            {
                find: '@',
                replacement: resolve(__dirname, 'src'),
            },
            {
                find: '@img',
                replacement: resolve(__dirname, 'src/assets/img'),
            },
        ],
    },
};

/**
 * rollup打包配置
 * @param mode build 模式
 * @returns
 */
const rollupOptions = (mode) => {
    return {
        output: {
            // manualChunks: {
            //     'react-venders': ['react', 'react-dom', '@vitjs/runtime'],
            // },
            chunkFileNames: `${chunkPath}/[name]-[hash].js`,
            entryFileNames: `${chunkPath}/[name]-[hash].js`,
            assetFileNames: `${chunkPath}/[ext]/[name]-[hash].[ext]`,
        },
    };
};

export default defineConfig(({ command, mode }) => {
    const _plugins = [...plugins];
    if (mode === 'develop') {
        return {
            ...common,
            plugins: _plugins,
            build: {
                minify: 'terser',
                sourcemap: true,
                manifest: true,
            },
        };
    }

    return {
        // base: mode === 'production' ? base : '/',
        base: '/',
        ...common,
        plugins: _plugins,
        build: {
            minify: 'terser',
            sourcemap: false,
            manifest: true,
            terserOptions: {
                compress: {
                    drop_console: true,
                    drop_debugger: true,
                },
            },
            rollupOptions: rollupOptions(mode),
        },
    };
});
