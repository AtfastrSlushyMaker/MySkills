/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: '#1E40AF',
                    hover: '#1D4ED8',
                    light: '#DBEAFE',
                },
                accent: {
                    green: '#10B981',
                    blue: '#3B82F6',
                    orange: '#F97316',
                    purple: '#8B5CF6',
                },
            },
        },
    },
    plugins: [],
}

