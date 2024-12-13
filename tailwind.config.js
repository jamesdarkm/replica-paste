/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'Inter': ['Inter', 'sans-serif'],
      },
      zIndex: {
        '99': '99',
        '10': '10'
      },
      colors: {
        'socialpaste-purple': '#8129D9',
        'socialpaste-purple-dark': '#7329BD',
        'socialpaste-chinese-white': '#E0E2D9',
        'socialpaste-gray': '#676B5F',
        'socialpaste-lightergray': '#F6F7F5',
        'socialpaste-red': '#BF000B',
        'socialpaste-green': '#43E660',
        'border': '#F6F7F5'
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

