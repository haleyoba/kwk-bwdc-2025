async function loadCleanedAttainmentData(csvUrl) {
  const rawData = await d3.csv(csvUrl, (d) => ({
    sex: d.sex,
    educational_attainment: d.educational_attainment,
    year: +d.year,
    race_or_ethnicity: d.race_or_ethnicity,
    rate: +d.rate,
  }));

  // Filter out rows where race_or_ethnicity is "Asian"
  const filtered = rawData.filter(d => d.race_or_ethnicity !== "Asian");

  // Group data by race_or_ethnicity
  const grouped = {};

  filtered.forEach(d => {
    if (!grouped[d.race_or_ethnicity]) grouped[d.race_or_ethnicity] = [];
    grouped[d.race_or_ethnicity].push({
      sex: d.sex,
      attainment: d.educational_attainment,
      year: d.year,
      rate: d.rate,
    });
  });

  // Sort each group's data by year ascending
  Object.keys(grouped).forEach(race => {
    grouped[race].sort((a, b) => a.year - b.year);
  });

  return grouped;
}