/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.js", "./screens/ConcatStringDropdown.js" , "./screens/CreateSessionScreen.js" , "./screens/HomeScreen.js" , "./screens/JoinSessionScreen.js"  ,"./screens/ListeningScreen.js"],
  theme: {
    extend: {
      colors: {
        'black': '#000000',
        'gray': '#808080',
      },
      backgroundImage: {
        'gradient-to-gray': 'linear-gradient(90deg, #000000, #808080)',
      },
      fontfamily: {
        "VeraMono" : "VeraMono"
      }
    },
  },
  plugins: [],
}

