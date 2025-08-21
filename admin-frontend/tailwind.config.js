module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        heading: ["Poppins", "sans-serif"], // Headings
        subheading: ["Montserrat", "sans-serif"], // Subheadings
        body: ["Open Sans", "sans-serif"], // Body text
        accent: ["Raleway", "sans-serif"], // Callouts / Labels
      },
      fontSize: {
        heading: "36px",
        subheading: "24px",
        body: "16px",
        accent: "14px",
      },
    },
  },
  plugins: [],
};
