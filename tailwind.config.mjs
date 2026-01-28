/** @type {import('tailwindcss').Config} */
export default {
    content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
    theme: {
        extend: {
            fontFamily: {
                display: ['Outfit', 'sans-serif'],
                body: ['Inter', 'sans-serif'],
                jp: ['Zen Kaku Gothic New', 'sans-serif'],
                wild: ['Rubik Dirt', 'cursive'],
                serif: ['Noto Serif JP', 'serif'],
            },
            colors: {
                neon: '#ccff00',     /* Vibrant Lime/Neon */
                dark: '#050505',     /* Deep Black */
                surface: '#111111',  /* Dark Gray Surface */
                primary: '#00ff9d',  /* Secondary Neon Green */
                accent: '#ff0055',   /* Hot Pink Accent */
                ivy: '#1F4D34',      /* Ivy Green Core */
                ivyLight: '#4E8F5D', /* Lighter Ivy Accent */
            },
            backgroundImage: {
                'noise': "url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22 opacity=%220.05%22/%3E%3C/svg%3E')",
                'hero-gradient': 'linear-gradient(to bottom, rgba(5,5,5,0) 0%, rgba(5,5,5,0.7) 70%, rgba(5,5,5,0.9) 100%)',
            },
            animation: {
                'float': 'float 6s ease-in-out infinite',
                'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'marquee': 'marquee 25s linear infinite',
            },
            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-20px)' },
                },
                marquee: {
                    '0%': { transform: 'translateX(0%)' },
                    '100%': { transform: 'translateX(-100%)' },
                }
            }
        },
    },
    plugins: [],
};
