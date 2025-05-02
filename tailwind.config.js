/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./src/**/*.{js,jsx,ts,tsx}",
      "./public/index.html"
    ],
    theme: {
      extend: {
        colors: {
          'jamoveo-primary': '#FFD43B',    // צהוב ראשי
          'jamoveo-secondary': '#FFE88C',  // צהוב בהיר
          'jamoveo-dark': '#1A1A1A',       // שחור/אפור כהה
          'jamoveo-light': '#FFFFFF',      // לבן
          'jamoveo-gray': '#333333',       // אפור
          'jamoveo-accent': '#FFA500',     // כתום
          'jamoveo-accent-dark': '#FF8C00', // כתום כהה
          'jamoveo-input-bg': '#F5F5F5',   // רקע אפור בהיר לשדות קלט
          'jamoveo-input-border': '#E0E0E0', // גבול אפור לשדות קלט
        },
        fontFamily: {
          sans: ['Rubik', 'sans-serif'],
        },
        boxShadow: {
          'jamoveo': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          'jamoveo-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        },
        borderRadius: {
          'jamoveo': '0.5rem',
          'jamoveo-lg': '1rem',
        },
      },
    },
    plugins: [],
  }