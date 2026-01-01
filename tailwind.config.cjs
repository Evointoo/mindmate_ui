/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // Premium Black System
                black: {
                    primary: '#0B0F0E',
                    secondary: '#121212',
                    tertiary: '#1A1A1A',
                    surface: '#1E1E1E',
                },
                // Neon Green Accent (used sparingly)
                green: {
                    neon: '#22C55E',
                    soft: '#34D399',
                    muted: '#10B981',
                    dark: '#059669',
                },
                // Glass & Borders
                glass: {
                    border: 'rgba(255, 255, 255, 0.1)',
                    bg: 'rgba(255, 255, 255, 0.05)',
                },
                // Mood Colors (Muted, Professional)
                mood: {
                    low: '#EF4444',
                    medium: '#F59E0B',
                    good: '#FBBF24',
                    great: '#22C55E',
                },
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
                display: ['Poppins', 'Inter', 'sans-serif'],
            },
            backdropBlur: {
                xs: '2px',
                glass: '12px',
            },
            borderRadius: {
                'glass': '16px',
            },
            boxShadow: {
                'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
                'glow-green': '0 0 20px rgba(34, 197, 94, 0.3)',
                'glow-green-lg': '0 0 40px rgba(34, 197, 94, 0.4)',
            },
            animation: {
                'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'pulse-green': 'pulse-green 2s ease-in-out infinite',
                'float': 'float 3s ease-in-out infinite',
                'wave': 'wave 1s ease-in-out infinite',
            },
            keyframes: {
                'pulse-green': {
                    '0%, 100%': {
                        opacity: '1',
                        boxShadow: '0 0 20px rgba(34, 197, 94, 0.3)'
                    },
                    '50%': {
                        opacity: '0.8',
                        boxShadow: '0 0 40px rgba(34, 197, 94, 0.5)'
                    },
                },
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-10px)' },
                },
                wave: {
                    '0%, 100%': { transform: 'scaleY(0.5)' },
                    '50%': { transform: 'scaleY(1)' },
                },
            },
        },
    },
    plugins: [],
}
