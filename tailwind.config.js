/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'gt-super': ['GT-Super-Display-Super-Trial', 'sans-serif'],
      },
      zIndex: {
        '99': '99',
        '10': '10'
      },
      colors: {
        'custom-purple': '#4f15a6',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms')   
  ],
  corePlugins: {
    // Ensure border utilities are enabled
    border: true,
  },
}

