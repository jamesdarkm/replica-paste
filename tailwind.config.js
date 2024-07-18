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

