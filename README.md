# Employment Scrollytelling Website

This project is a Svelte-powered scrollytelling experience that explores how employment-population ratios across different racial and ethnic groups combined with educational attainment data serves as an indicator of Black wealth as part of the KWK x BWDC 2025 Challenge.

---

## Project Structure

```txt
employment-scrollytelling/
├── public/
│   ├── employment_data.json              # Cleaned data for all groups
│   └── combined_employment_data.json     # Overall employment trend
├── src/
│   ├── components/
│   │   └── EmploymentScrollytelling.svelte  # Main visualization component
│   └── App.svelte                         # App entry point
├── data_cleaner.js                        # Script to clean and format raw CSV
├── static/
│   └── your-original-raw.csv              # Source CSV data file
├── package.json                           # Project dependencies and scripts
├── vite.config.js                         # Vite dev/build configuration
└── README.md                              # This file
```

---

## Built With

- [Svelte](https://svelte.dev/)
- [D3.js](https://d3js.org/)
- [Vite](https://vitejs.dev/)
- [IntersectionObserver API](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API)
- [Node.js](https://nodejs.org/) for data cleaning

---

## Author

Haley Oba
