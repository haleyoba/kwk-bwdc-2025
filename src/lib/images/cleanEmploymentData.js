// cleanEmploymentData.js
import * as d3 from "d3";

export async function loadCleanedEmploymentData(csvUrl) {
  // Load the CSV
  const rawData = await d3.csv(csvUrl, d => ({
    year: +d.year,
    date: new Date(d.date),
    rate_type: d.rate_type,
    rate: +d.rate,
    race_or_ethnicity: d.race_or_ethnicity,
  }));

  // Filter for Employment-Population Ratio and wanted races
  const filtered = rawData.filter(
    d =>
      d.rate_type === "Employment-Population Ratio" &&
      ["White", "Black", "Hispanic"].includes(d.race_or_ethnicity)
  );

  // Group data by race into an object: { White: [...], Black: [...], Hispanic: [...] }
  const grouped = { White: [], Black: [], Hispanic: [] };

  filtered.forEach(d => {
    grouped[d.race_or_ethnicity].push({
      date: d.date,
      rate: d.rate,
    });
  });

  // Sort each array by date
  Object.keys(grouped).forEach(race => {
    grouped[race].sort((a, b) => a.date - b.date);
  });

  return grouped;
}