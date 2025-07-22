<!-- EmploymentScrollytelling.svelte -->
<script>
  import { onMount } from "svelte";
  import { writable } from "svelte/store";
  import { get } from "svelte/store";

  const currentScroll = writable(0);
  const totalSections = 7; // number of sections

  function onScroll() {
    const scrollTop = window.scrollY;
    const viewportHeight = window.innerHeight;
    currentScroll.set(scrollTop / viewportHeight);
  }

  // Stores for reactive data
  const currentSection = writable(0);
  const employmentData = writable({});
  const combinedData = writable([]);
  const showIndividualLines = writable(false);
  const showLegend = writable(false);
  const dataLoaded = writable(false);

  let d3;
  let chart1, chart2;
  let combinedPath;
  let observerInstance;

  // Chart dimensions
  const margin = { top: 20, right: 30, bottom: 40, left: 50 };
  const width = 800 - margin.left - margin.right;
  const height = 400 - margin.top - margin.bottom;

  // Color mapping - updated to match your data
  const colors = {
    White: "#2563eb",
    Black: "#dc2626",
    Hispanic: "#059669",
  };

  // Load cleaned employment data function
  async function loadCleanedEmploymentData(csvUrl) {
    // Load the CSV
    const rawData = await d3.csv(csvUrl, (d) => ({
      year: +d.year,
      date: new Date(d.date),
      rate_type: d.rate_type,
      rate: +d.rate,
      race_or_ethnicity: d.race_or_ethnicity,
    }));

    // Filter for Employment-Population Ratio and wanted races
    const filtered = rawData.filter(
      (d) =>
        d.rate_type === "Employment-Population Ratio" &&
        ["White", "Black", "Hispanic"].includes(d.race_or_ethnicity)
    );

    // Group data by race into an object: { White: [...], Black: [...], Hispanic: [...] }
    const grouped = {
      White: [],
      Black: [],
      Hispanic: [],
    };

    filtered.forEach((d) => {
      grouped[d.race_or_ethnicity].push({
        date: d.date,
        rate: d.rate,
      });
    });

    // Sort each array by date
    Object.keys(grouped).forEach((race) => {
      grouped[race].sort((a, b) => a.date - b.date);
    });

    return grouped;
  }

  async function loadCleanedAttainmentData(csvUrl) {
    const rawData = await d3.csv(csvUrl, (d) => ({
      sex: d.sex,
      educational_attainment: d.educational_attainment,
      year: +d.year,
      race_or_ethnicity: d.race_or_ethnicity,
      rate: +d.rate,
    }));

    // Filter out rows where race_or_ethnicity is "Asian"
    const filtered = rawData.filter((d) => d.race_or_ethnicity !== "Asian");

    // Group data by race_or_ethnicity
    const grouped = {};

    filtered.forEach((d) => {
      if (!grouped[d.race_or_ethnicity]) grouped[d.race_or_ethnicity] = [];
      grouped[d.race_or_ethnicity].push({
        year: d.year,
        rate: d.rate,
      });
    });

    // Sort each group's data by date ascending
    Object.keys(grouped).forEach((race) => {
      grouped[race].sort((a, b) => a.date - b.date);
    });

    return grouped;
  }

  function generateCombinedData(raceData) {
    // Get all unique dates from all races
    const allDates = new Set();
    Object.values(raceData).forEach((raceArray) => {
      raceArray.forEach((d) => allDates.add(d.date.getTime()));
    });

    const sortedDates = Array.from(allDates)
      .sort()
      .map((time) => new Date(time));

    return sortedDates
      .map((date) => {
        const ratesForDate = Object.keys(raceData)
          .map((race) => {
            const entry = raceData[race].find(
              (d) => d.date.getTime() === date.getTime()
            );
            return entry ? entry.rate : null;
          })
          .filter((rate) => rate !== null);

        if (ratesForDate.length === 0) return null;

        const averageRate =
          ratesForDate.reduce((sum, rate) => sum + rate, 0) /
          ratesForDate.length;

        return {
          date: date,
          rate: averageRate,
        };
      })
      .filter((d) => d !== null);
  }

  function globalRateExtent(data) {
    const arrays = Object.values(data).flat();
    const extent = d3.extent(arrays, (d) => d.rate);
    const padding = 2; // adjust padding if needed
    return [Math.floor(extent[0]) - padding, Math.ceil(extent[1]) + padding];
  }

  function createChart(containerId, data) {
    const svg = d3
      .select(containerId)
      .attr(
        "viewBox",
        `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`
      )
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Get data extent for scales
    const allData = Object.values(data).flat();
    const dateExtent = d3.extent(allData, (d) => d.date);
    const rateExtent = globalRateExtent(data);

    // Scales
    const xScale = d3.scaleTime().domain(dateExtent).range([0, width]);

    const yScale = d3
      .scaleLinear()
      .domain([Math.floor(rateExtent[0]) - 1, Math.ceil(rateExtent[1]) + 1])
      .range([height, 0]);

    // Add axes
    svg
      .append("g")
      .attr("class", "axis")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(xScale).tickFormat(d3.timeFormat("%Y")));

    svg.append("g").attr("class", "axis").call(d3.axisLeft(yScale));

    // Add axis labels
    svg
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x", 0 - height / 2)
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .style("font-size", "12px")
      .style("fill", "#666")
      .text("Employment-Population Ratio (%)");

    svg
      .append("text")
      .attr("transform", `translate(${width / 2}, ${height + margin.bottom})`)
      .style("text-anchor", "middle")
      .style("font-size", "12px")
      .style("fill", "#666")
      .text("Year");

    return { svg, xScale, yScale };
  }

  function animatePath(path, duration = 2000) {
    const totalLength = path.node().getTotalLength();

    path
      .attr("stroke-dasharray", `${totalLength} ${totalLength}`)
      .attr("stroke-dashoffset", totalLength)
      .transition()
      .duration(duration)
      .attr("stroke-dashoffset", 0);
  }

  function updateSection(sectionIndex) {
    currentSection.set(sectionIndex);

    const combined = get(combinedData);
    const emp = get(employmentData);
    if (!get(dataLoaded)) return;

    switch (sectionIndex) {
      case 1:
        setTimeout(() => {
          if (combinedPath && combined.length > 0) {
            const line = d3
              .line()
              .x((d) => chart1.xScale(d.date))
              .y((d) => chart1.yScale(d.rate))
              .curve(d3.curveCardinal);

            combinedPath
              .datum(combined)
              .attr("d", line)
              .classed("visible", true)
              .style("opacity", 1); // restore opacity when re-entering

            animatePath(combinedPath); // always re-animate
          }
        }, 300);
        break;

      case 2:
        setTimeout(() => {
          if (combinedPath) {
            combinedPath.style("opacity", 0); // fade out combined line
          }

          showLegend.set(true);
          showIndividualLines.set(true);

          Object.keys(emp).forEach((race, i) => {
            const line = d3
              .line()
              .x((d) => chart2.xScale(d.date))
              .y((d) => chart2.yScale(d.rate))
              .curve(d3.curveCardinal);

            const raceLine = chart2.svg.select(`.${race.toLowerCase()}-line`);

            raceLine
              .datum(emp[race])
              .attr("d", line)
              .classed("visible", true)
              .style("opacity", 1); // re-show

            animatePath(raceLine, 1500); // always re-animate
          });
        }, 300);
        break;

      default:
        // Reset visibility if needed for future sections
        if (combinedPath) combinedPath.style("opacity", 0);
        break;
    }
  }

  function setupIntersectionObserver() {
    const observerOptions = {
      threshold: 0.6,
      rootMargin: "-10% 0px -10% 0px",
    };

    observerInstance = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const sectionIndex = parseInt(entry.target.id.split("-")[1]);
          updateSection(sectionIndex);
        }
      });
    }, observerOptions);

    document.querySelectorAll(".scroll-section").forEach((section) => {
      observerInstance.observe(section);
    });
  }

  function scrollToSection(sectionIndex) {
    document.getElementById(`section-${sectionIndex}`).scrollIntoView({
      behavior: "smooth",
    });
  }

  function createAttainmentChart(containerId, data) {
    const svg = d3
      .select(containerId)
      .attr(
        "viewBox",
        `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`
      )
      .style("width", "100%")
      .style("height", "auto")
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Flatten all data arrays for extent calculation
    const allData = Object.values(data).flat();

    // x domain is years (numbers)
    const yearExtent = d3.extent(allData, (d) => d.year);
    // y domain is rate, padded a bit
    const rateExtent = d3.extent(allData, (d) => d.rate);
    const yDomain = [
      Math.floor(rateExtent[0]) - 2,
      Math.ceil(rateExtent[1]) + 2,
    ];

    // Scales
    const xScale = d3.scaleLinear().domain(yearExtent).range([0, width]);
    const yScale = d3.scaleLinear().domain(yDomain).range([height, 0]);

    // Axes
    svg
      .append("g")
      .attr("class", "axis")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(xScale).tickFormat(d3.format("d"))); // format as integer

    svg.append("g").attr("class", "axis").call(d3.axisLeft(yScale));

    // Axis labels
    svg
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x", 0 - height / 2)
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .style("font-size", "12px")
      .style("fill", "#666")
      .text("Attainment Rate (%)");

    svg
      .append("text")
      .attr("transform", `translate(${width / 2}, ${height + margin.bottom})`)
      .style("text-anchor", "middle")
      .style("font-size", "12px")
      .style("fill", "#666")
      .text("Year");

    return { svg, xScale, yScale };
  }

  onMount(() => {
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  });

  onMount(async () => {
    try {
      // Import D3
      const d3Module = await import("https://cdn.skypack.dev/d3@7");
      d3 = d3Module;

      const csvUrl = "src/lib/csvs/emp_03.csv";
      let empData;

      try {
        empData = await loadCleanedEmploymentData(csvUrl);
        console.log("Loaded real employment data:", empData);
      } catch (error) {
        console.warn("Failed to load CSV data, using fallback:", error);
        empData = generateEmploymentData();
      }

      let combData = generateCombinedData(empData);

      employmentData.set(empData);
      combinedData.set(combData);
      dataLoaded.set(true);

      const empDataValue = empData; // or get current value from store with subscribe if needed
      const combDataValue = combData;

      // Then create charts *with* the real data:
      chart1 = createChart("#employment-chart", combDataValue);
      chart2 = createChart("#employment-chart-2", empDataValue);

      // Create line generator
      const line = d3
        .line()
        .x((d) => chart1.xScale(d.date))
        .y((d) => chart1.yScale(d.rate))
        .curve(d3.curveCardinal);

      // Add combined line to first chart
      combinedPath = chart1.svg
        .append("path")
        .attr("class", "path combined-line")
        .style("stroke", "#667eea")
        .style("stroke-width", 3)
        .style("fill", "none")
        .style("opacity", 1);

      // Add lines to second chart (visible)
      Object.keys(empData).forEach((race) => {
        chart2.svg
          .append("path")
          .datum(empData[race])
          .attr("class", `path ${race.toLowerCase()}-line visible`)
          .attr("d", line)
          .style("stroke", colors[race])
          .style("stroke-width", 3)
          .style("fill", "none")
          .style("opacity", 1);
      });

      // Setup scroll observer
      setTimeout(() => {
        setupIntersectionObserver();
        updateSection(0);
      }, 100);

      const attainmentData = await loadCleanedAttainmentData(
        "src/lib/csvs/edu_01.csv"
      );
      const attainmentChart = createAttainmentChart(
        "#attainment-chart",
        attainmentData
      );

      const lineGen = d3
        .line()
        .x((d) => attainmentChart.xScale(d.year))
        .y((d) => attainmentChart.yScale(d.rate))
        .curve(d3.curveCardinal);

      Object.keys(attainmentData).forEach((race) => {
        attainmentChart.svg
          .append("path")
          .datum(attainmentData[race])
          .attr("class", `path ${race.toLowerCase()}-line visible`)
          .attr("d", lineGen)
          .style("stroke", colors[race] || "#000")
          .style("stroke-width", 3)
          .style("fill", "none")
          .style("opacity", 1);
      });
    } catch (error) {
      console.error("Error in onMount:", error);
    }

    return () => {
      if (observerInstance) {
        observerInstance.disconnect();
      }
    };
  });
</script>

<div class="scroll-indicator">
  {#each Array(6) as _, i}
    <div
      class="scroll-dot"
      class:active={$currentSection === i}
      on:click={() => scrollToSection(i)}
    ></div>
  {/each}
</div>

<div class="container">
  <!-- Hero Section -->
  <section class="scroll-section" id="section-0">
    <div class="hero">
      <h1>Employment Patterns</h1>
      <p>Exploring the hidden disparities in America's job market</p>
      <div class="scroll-hint">Scroll to explore the data story</div>
    </div>
  </section>

  <!-- Fade stack container for sections 1-3 -->
  <div class="fade-stack">
    <!-- Opening Chart Section -->
    <section class="scroll-section" id="section-1">
      <div class="chart-container">
        <div class="chart-title">Employment Trends</div>
        <div class="chart-subtitle" class:visible={$currentSection >= 1}>
          The average employment-population ratio since 2013 looks like this:
        </div>
        <svg id="employment-chart"></svg>
        <div class="legend" class:visible={$showLegend}>
          {#each Object.entries(colors) as [race, color]}
            <div class="legend-item">
              <div class="legend-color" style="background: {color};"></div>
              <span>{race}</span>
            </div>
          {/each}
        </div>
      </div>
    </section>

    <!-- "Let's go deeper" Section -->
    <section class="scroll-section" id="section-2">
      <div class="hero">
        <h2>Let's go deeper...</h2>
      </div>
    </section>

    <!-- Deeper Look Section -->
    <section class="scroll-section" id="section-3">
      <div class="chart-container">
        <div class="chart-title">Employment Trends</div>
        <div class="chart-subtitle" class:visible={$currentSection >= 3}>
          The employment-population ratio split by race/ethnicity look like
          this:
        </div>
        <svg id="employment-chart-2"></svg>
        <div class="legend" class:visible={$showLegend}>
          {#each Object.entries(colors) as [race, color]}
            <div class="legend-item">
              <div class="legend-color" style="background: {color};"></div>
              <span>{race}</span>
            </div>
          {/each}
        </div>
      </div>
    </section>

    <section class="scroll-section" id="section-4">
      <div class="hero">
        <h2>Let's look at bachelor degree attainment...</h2>
      </div>
    </section>

    <section class="scroll-section" id="section-5">
      <div class="chart-container">
        <div class="chart-title">Educational Attainment Rates Over Time</div>
        <div class="chart-subtitle visible">
          This chart displays the percentage of people with specified
          educational attainment levels by race/ethnicity over the years.
        </div>
        <svg id="attainment-chart"></svg>
        <div class="legend visible">
          {#each Object.entries(colors) as [race, color]}
            <div class="legend-item">
              <div class="legend-color" style="background: {color};"></div>
              <span>{race}</span>
            </div>
          {/each}
        </div>
      </div>
    </section>

    <section class="scroll-section" id="section-6">
      <div class="hero">
        <h2>Implications</h2>
        <p>TBC...</p>
      </div>
    </section>
  </div>
</div>

<style>
  :global(*) {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  :global(body) {
    font-family:
      "Inter",
      -apple-system,
      BlinkMacSystemFont,
      sans-serif;
    line-height: 1.6;
    background: white;
    color: #333;
  }

  .container {
    max-width: 1200px;
    margin: 0 auto;
    position: relative;
  }

  .scroll-section {
    min-height: 100vh;
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: flex-start;
    position: relative;
    padding: 2rem;
  }

  /* .hero {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    border-radius: 20px;
    padding: 4rem;
    text-align: center;
    box-shadow: 0 25px 50px rgba(0, 0, 0, 0.1);
  } */

  .hero h1 {
    font-size: 3.5rem;
    font-weight: 800;
    margin-bottom: 1rem;
    background: linear-gradient(135deg, #667eea, #764ba2);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .hero p {
    font-size: 1.3rem;
    color: #666;
    margin-bottom: 2rem;
  }

  .scroll-hint {
    font-size: 0.9rem;
    color: #999;
    margin-top: 2rem;
  }

  .hero,
  .chart-container {
    width: 100vw; /* full viewport width */
    height: 100vh; /* full viewport height */
    border-radius: 0; /* optional: remove rounded corners for full fill */
    padding: 2rem; /* keep some padding if you want */
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    box-shadow: none; /* optional: remove shadow if you want clean edges */
    backdrop-filter: none; /* optional */
  }

  /* .chart-container {
    background: rgba(255, 255, 255, 0.98);
    border-radius: 20px;
    padding: 3rem;
    box-shadow: 0 25px 50px rgba(0, 0, 0, 0.1);
    backdrop-filter: blur(10px);
    width: 100%;
    max-width: 900px;
  } */

  .chart-title {
    font-size: 2rem;
    font-weight: 700;
    text-align: center;
    margin-bottom: 2rem;
    color: #333;
  }

  .chart-subtitle {
    font-size: 1.1rem;
    text-align: center;
    color: #666;
    margin-bottom: 3rem;
    opacity: 0;
    transform: translateY(20px);
    transition: all 0.8s ease;
  }

  .chart-subtitle.visible {
    opacity: 1;
    transform: translateY(0);
  }

  .legend {
    display: flex;
    justify-content: center;
    gap: 2rem;
    margin-top: 2rem;
    flex-wrap: wrap;
    opacity: 0;
    transition: opacity 0.8s ease;
  }

  .legend.visible {
    opacity: 1;
  }

  .legend-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-weight: 500;
  }

  .legend-color {
    width: 20px;
    height: 4px;
    border-radius: 2px;
  }

  #attainment-chart {
    width: 100%;
    height: 400px;
    display: block;
  }

  .scroll-indicator {
    position: fixed;
    right: 2rem;
    top: 50%;
    transform: translateY(-50%);
    display: flex;
    flex-direction: column;
    gap: 1rem;
    z-index: 1000;
  }

  .scroll-dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.4);
    transition: all 0.3s ease;
    cursor: pointer;
  }

  .scroll-dot.active {
    background: white;
    transform: scale(1.2);
  }

  :global(.path) {
    fill: none;
    stroke-width: 3;
    opacity: 0;
    transition: opacity 0.8s ease;
  }

  :global(.path.visible) {
    opacity: 1;
  }

  :global(.axis) {
    font-size: 12px;
    color: #666;
  }

  :global(.axis path),
  :global(.axis line) {
    fill: none;
    stroke: #ddd;
    shape-rendering: crispEdges;
  }

  @media (max-width: 768px) {
    .hero h1 {
      font-size: 2.5rem;
    }
    .hero p {
      font-size: 1.1rem;
    }
    .chart-container {
      padding: 2rem;
      margin: 1rem;
    }
    .legend {
      flex-direction: column;
      align-items: center;
      gap: 1rem;
    }
    .scroll-indicator {
      display: none;
    }

    .fade-stack {
      position: relative;
      height: 100vh;
      width: 100vw;
      overflow: hidden;
    }

    .fade-stack > .scroll-section {
      position: absolute;
      top: 0;
      left: 0;
      height: 100vh;
      width: 100vw;
      padding: 2rem;
      opacity: 0;
      transition: opacity 0.8s ease;
      pointer-events: none;
    }

    .fade-stack > .scroll-section.visible {
      opacity: 1;
      pointer-events: auto;
    }
  }
</style>
