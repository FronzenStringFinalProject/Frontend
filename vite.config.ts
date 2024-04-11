import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import vuetify, {transformAssetUrls} from "vite-plugin-vuetify";
import svgLoader from "vite-svg-loader"
import {fileURLToPath, URL} from 'node:url'
import {viteStaticCopy} from "vite-plugin-static-copy";
// https://vitejs.dev/config/
export default defineConfig({
    plugins: [vue({
        template: {transformAssetUrls}
    }), vuetify({
        autoImport: true,

    }), viteStaticCopy({
        targets: [{src: "node_modules/@ricky0123/vad-web/dist/vad.worklet.bundle.min.js", dest: "/"},
          {
            src: "node_modules/@ricky0123/vad-web/dist/*.onnx",
            dest: "/",
          },
          { src: "node_modules/onnxruntime-web/dist/*.wasm", dest: "/" },
        ]
    }),
        svgLoader({
            defaultImport: "url"
        })

    ], define: {'process.env': {}}, resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        }, extensions: ['.js', '.json', '.jsx', '.mjs', '.ts', '.tsx', '.vue',],
    },
    server:{
        port:3000
    }
})
