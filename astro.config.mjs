import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

// https://astro.build/config
export default defineConfig({
    // 【重要】独自ドメインを設定
    site: 'https://mori-mori.tokyo',
    // リポジトリ名を含まないトップレベルドメインなので base は '/' でOK（デフォルト）
    base: '/',
    integrations: [tailwind()],
    build: {
        assets: 'assets'
    }
});