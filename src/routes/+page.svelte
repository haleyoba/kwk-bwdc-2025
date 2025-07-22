<!-- EmploymentScrollytelling.svelte -->
<script>
  // import { onMount } from "svelte";
  // import { writable } from "svelte/store";

  // // Stores for reactive data
  // const currentSection = writable(0);
  // const employmentData = writable({});
  // const combinedData = writable([]);
  // const showIndividualLines = writable(false);
  // const showLegend = writable(false);

  // let d3;
  // let chart1, chart2;
  // let combinedPath;
  // let observerInstance;

  // // Chart dimensions
  // const margin = { top: 20, right: 30, bottom: 40, left: 50 };
  // const width = 800 - margin.left - margin.right;
  // const height = 400 - margin.top - margin.bottom;

  // // Color mapping
  // const colors = {
  //   White: "#2563eb",
  //   Black: "#dc2626",
  //   Hispanic: "#059669",
  // };

  // function generateEmploymentData() {
  //   const races = ["White", "Black", "Hispanic"];
  //   const data = {};

  //   races.forEach((race) => {
  //     data[race] = [];
  //     let baseRate;

  //     switch (race) {
  //       case "White":
  //         baseRate = 59;
  //         break;
  //       case "Hispanic":
  //         baseRate = 56;
  //         break;
  //       case "Black":
  //         baseRate = 54;
  //         break;
  //     }

  //     for (let year = 2013; year <= 2024; year++) {
  //       for (let month = 1; month <= 12; month++) {
  //         const date = new Date(year, month - 1, 1);
  //         let rate = baseRate;

  //         rate += Math.sin((year - 2013) * 0.5 + month * 0.1) * 2;
  //         rate += (Math.random() - 0.5) * 1;

  //         if (year === 2020 && month >= 3 && month <= 8) {
  //           rate -= 8 - (month - 3) * 0.8;
  //         }

  //         if (year === 2021) {
  //           rate -= 3 + (month - 1) * 0.2;
  //         }

  //         data[race].push({
  //           date: date,
  //           rate: Math.max(40, Math.min(70, rate)),
  //         });
  //       }
  //     }
  //   });

  //   return data;
  // }

  // function generateCombinedData(raceData) {
  //   const dates = raceData["White"].map((d) => d.date);
  //   return dates.map((date) => {
  //     const ratesForDate = Object.keys(raceData).map((race) => {
  //       const entry = raceData[race].find(
  //         (d) => d.date.getTime() === date.getTime()
  //       );
  //       return entry ? entry.rate : 0;
  //     });

  //     const averageRate =
  //       ratesForDate.reduce((sum, rate) => sum + rate, 0) / ratesForDate.length;

  //     return {
  //       date: date,
  //       rate: averageRate,
  //     };
  //   });
  // }

  // function createChart(containerId) {
  //   const svg = d3
  //     .select(containerId)
  //     .attr(
  //       "viewBox",
  //       `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`
  //     )
  //     .append("g")
  //     .attr("transform", `translate(${margin.left},${margin.top})`);

  //   // Scales
  //   const xScale = d3
  //     .scaleTime()
  //     .domain(d3.extent($combinedData, (d) => d.date))
  //     .range([0, width]);

  //   const yScale = d3.scaleLinear().domain([45, 65]).range([height, 0]);

  //   // Add axes
  //   svg
  //     .append("g")
  //     .attr("class", "axis")
  //     .attr("transform", `translate(0,${height})`)
  //     .call(d3.axisBottom(xScale).tickFormat(d3.timeFormat("%Y")));

  //   svg.append("g").attr("class", "axis").call(d3.axisLeft(yScale));

  //   // Add axis labels
  //   svg
  //     .append("text")
  //     .attr("transform", "rotate(-90)")
  //     .attr("y", 0 - margin.left)
  //     .attr("x", 0 - height / 2)
  //     .attr("dy", "1em")
  //     .style("text-anchor", "middle")
  //     .style("font-size", "12px")
  //     .style("fill", "#666")
  //     .text("Employment-Population Ratio (%)");

  //   svg
  //     .append("text")
  //     .attr("transform", `translate(${width / 2}, ${height + margin.bottom})`)
  //     .style("text-anchor", "middle")
  //     .style("font-size", "12px")
  //     .style("fill", "#666")
  //     .text("Year");

  //   return { svg, xScale, yScale };
  // }

  // function animatePath(path, duration = 2000) {
  //   const totalLength = path.node().getTotalLength();

  //   path
  //     .attr("stroke-dasharray", `${totalLength} ${totalLength}`)
  //     .attr("stroke-dashoffset", totalLength)
  //     .transition()
  //     .duration(duration)
  //     .attr("stroke-dashoffset", 0);
  // }

  // function updateSection(sectionIndex) {
  //   currentSection.set(sectionIndex);

  //   switch (sectionIndex) {
  //     case 1:
  //       setTimeout(() => {
  //         if (combinedPath && $combinedData.length > 0) {
  //           const line = d3
  //             .line()
  //             .x((d) => chart1.xScale(d.date))
  //             .y((d) => chart1.yScale(d.rate))
  //             .curve(d3.curveCardinal);

  //           combinedPath
  //             .datum($combinedData)
  //             .attr("d", line)
  //             .classed("visible", true);

  //           animatePath(combinedPath);
  //         }
  //       }, 800);
  //       break;

  //     case 2:
  //       setTimeout(() => {
  //         if (combinedPath) {
  //           combinedPath.style("opacity", 0);
  //         }
  //         showLegend.set(true);
  //         showIndividualLines.set(true);

  //         Object.keys($employmentData).forEach((race, i) => {
  //           setTimeout(() => {
  //             const line = d3
  //               .line()
  //               .x((d) => chart1.xScale(d.date))
  //               .y((d) => chart1.yScale(d.rate))
  //               .curve(d3.curveCardinal);

  //             const raceLine = chart1.svg.select(`.${race.toLowerCase()}-line`);
  //             raceLine
  //               .datum($employmentData[race])
  //               .attr("d", line)
  //               .classed("visible", true);

  //             animatePath(raceLine, 1500);
  //           }, i * 200);
  //         });
  //       }, 300);
  //       break;
  //   }
  // }

  // function setupIntersectionObserver() {
  //   const observerOptions = {
  //     threshold: 0.6,
  //     rootMargin: "-10% 0px -10% 0px",
  //   };

  //   observerInstance = new IntersectionObserver((entries) => {
  //     entries.forEach((entry) => {
  //       if (entry.isIntersecting) {
  //         const sectionIndex = parseInt(entry.target.id.split("-")[1]);
  //         updateSection(sectionIndex);
  //       }
  //     });
  //   }, observerOptions);

  //   document.querySelectorAll(".scroll-section").forEach((section) => {
  //     observerInstance.observe(section);
  //   });
  // }

  // function scrollToSection(sectionIndex) {
  //   document.getElementById(`section-${sectionIndex}`).scrollIntoView({
  //     behavior: "smooth",
  //   });
  // }

  // onMount(async () => {
  //   // Import D3
  //   const d3Module = await import("https://cdn.skypack.dev/d3@7");
  //   d3 = d3Module;

  //   // Generate data
  //   const empData = generateEmploymentData();
  //   const combData = generateCombinedData(empData);

  //   employmentData.set(empData);
  //   combinedData.set(combData);

  //   // Create charts
  //   chart1 = createChart("#employment-chart");
  //   chart2 = createChart("#employment-chart-2");

  //   // Create line generator
  //   const line = d3
  //     .line()
  //     .x((d) => chart1.xScale(d.date))
  //     .y((d) => chart1.yScale(d.rate))
  //     .curve(d3.curveCardinal);

  //   // Add combined line to first chart
  //   combinedPath = chart1.svg
  //     .append("path")
  //     .attr("class", "path combined-line")
  //     .style("stroke", "#667eea")
  //     .style("stroke-width", 3)
  //     .style("fill", "none")
  //     .style("opacity", 0);

  //   // Add individual race lines to first chart (initially hidden)
  //   Object.keys(empData).forEach((race) => {
  //     chart1.svg
  //       .append("path")
  //       .attr("class", `path ${race.toLowerCase()}-line`)
  //       .style("stroke", colors[race])
  //       .style("stroke-width", 3)
  //       .style("fill", "none")
  //       .style("opacity", 0);
  //   });

  //   // Add lines to second chart (visible)
  //   Object.keys(empData).forEach((race) => {
  //     chart2.svg
  //       .append("path")
  //       .datum(empData[race])
  //       .attr("class", `path ${race.toLowerCase()}-line visible`)
  //       .attr("d", line)
  //       .style("stroke", colors[race])
  //       .style("stroke-width", 3)
  //       .style("fill", "none")
  //       .style("opacity", 1);
  //   });

  //   // Setup scroll observer
  //   setTimeout(() => {
  //     setupIntersectionObserver();
  //     updateSection(0);
  //   }, 100);

  //   return () => {
  //     if (observerInstance) {
  //       observerInstance.disconnect();
  //     }
  //   };
  // });

  import { onMount } from "svelte";
  import { writable, get } from "svelte/store";
  import { loadCleanedEmploymentData } from "./cleanEmploymentData.js"; // Adjust path as needed
  import * as d3 from "d3";

  const races = ["White", "Black", "Hispanic"];
  const colors = {
    White: "#2563eb",
    Black: "#dc2626",
    Hispanic: "#059669",
  };

  // Reactive stores for data and UI state
  const currentSection = writable(0);
  const employmentData = writable({}); // { White: [...], Black: [...], Hispanic: [...] }
  const combinedData = writable([]); // average employment-pop ratio across races
  const showIndividualLines = writable(false);
  const showLegend = writable(false);

  let chart1, chart2;
  let combinedPath;
  let observerInstance;

  // Chart dimensions
  const margin = { top: 20, right: 30, bottom: 40, left: 50 };
  const width = 800 - margin.left - margin.right;
  const height = 400 - margin.top - margin.bottom;

  // Helper: generate combined data from race data
  function generateCombinedData(raceData) {
    const dates = raceData["White"].map((d) => d.date);
    return dates.map((date) => {
      const ratesForDate = Object.keys(raceData).map((race) => {
        const entry = raceData[race].find(
          (d) => d.date.getTime() === date.getTime()
        );
        return entry ? entry.rate : 0;
      });
      const averageRate =
        ratesForDate.reduce((sum, rate) => sum + rate, 0) / ratesForDate.length;
      return {
        date: date,
        rate: averageRate,
      };
    });
  }

  function createChart(containerId, dataForScale) {
    const svg = d3
      .select(containerId)
      .attr(
        "viewBox",
        `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`
      )
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Scales
    const xScale = d3
      .scaleTime()
      .domain(d3.extent(dataForScale, (d) => d.date))
      .range([0, width]);

    const yScale = d3.scaleLinear().domain([45, 65]).range([height, 0]);

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

  // Use get() to access store values inside non-reactive functions
  function updateSection(sectionIndex) {
    currentSection.set(sectionIndex);

    switch (sectionIndex) {
      case 1:
        setTimeout(() => {
          const combined = get(combinedData);
          if (combinedPath && combined.length > 0) {
            const line = d3
              .line()
              .x((d) => chart1.xScale(d.date))
              .y((d) => chart1.yScale(d.rate))
              .curve(d3.curveCardinal);

            combinedPath
              .datum(combined)
              .attr("d", line)
              .classed("visible", true);

            animatePath(combinedPath);
          }
        }, 800);
        break;

      case 2:
        setTimeout(() => {
          if (combinedPath) {
            combinedPath.style("opacity", 0);
          }
          showLegend.set(true);
          showIndividualLines.set(true);

          const empData = get(employmentData);
          Object.keys(empData).forEach((race, i) => {
            setTimeout(() => {
              const line = d3
                .line()
                .x((d) => chart1.xScale(d.date))
                .y((d) => chart1.yScale(d.rate))
                .curve(d3.curveCardinal);

              const raceLine = chart1.svg.select(`.${race.toLowerCase()}-line`);
              raceLine
                .datum(empData[race])
                .attr("d", line)
                .classed("visible", true);

              animatePath(raceLine, 1500);
            }, i * 200);
          });
        }, 300);
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

  onMount(async () => {
    // Load cleaned employment data from external file
    const empDataRaw = await loadCleanedEmploymentData();

    // Convert date strings to Date objects
    const empData = {};
    races.forEach((race) => {
      empData[race] = empDataRaw[race].map((d) => ({
        date: new Date(d.date),
        rate: +d.rate,
      }));
    });

    employmentData.set(empData);

    // Generate combined average data
    const combData = generateCombinedData(empData);
    combinedData.set(combData);

    // Create charts using combinedData for scales
    chart1 = createChart("#employment-chart", combData);
    chart2 = createChart("#employment-chart-2", combData);

    // Line generator for charts
    const line = d3
      .line()
      .x((d) => chart1.xScale(d.date))
      .y((d) => chart1.yScale(d.rate))
      .curve(d3.curveCardinal);

    // Add combined line to first chart (initially hidden)
    combinedPath = chart1.svg
      .append("path")
      .attr("class", "path combined-line")
      .style("stroke", "#667eea")
      .style("stroke-width", 3)
      .style("fill", "none")
      .style("opacity", 0);

    // Add individual race lines to first chart (initially hidden)
    Object.keys(empData).forEach((race) => {
      chart1.svg
        .append("path")
        .attr("class", `path ${race.toLowerCase()}-line`)
        .style("stroke", colors[race])
        .style("stroke-width", 3)
        .style("fill", "none")
        .style("opacity", 0);
    });

    // Add lines to second chart (always visible)
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

    return () => {
      if (observerInstance) observerInstance.disconnect();
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

  <!-- Opening Chart Section -->
  <section class="scroll-section" id="section-1">
    <div class="chart-container">
      <div class="chart-title">Employment Trends</div>
      <div class="chart-subtitle" class:visible={$currentSection >= 1}>
        The employment-population ratio since 2013 looks like this:
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

  <!-- Deeper Look Section -->
  <section class="scroll-section" id="section-2">
    <div class="chart-container">
      <div class="chart-title">Let's go deeper...</div>
      <div class="chart-subtitle visible">
        But when we look by race and ethnicity, patterns emerge:
      </div>
      <svg id="employment-chart-2"></svg>
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

  <!-- Coming Soon Sections -->
  <section class="scroll-section" id="section-3">
    <div class="coming-soon">
      <h2>Interactive Map</h2>
      <p>Employment-population ratios by state and metro area</p>
      <p class="coming-soon-text">Coming in the next iteration...</p>
    </div>
  </section>

  <section class="scroll-section" id="section-4">
    <div class="coming-soon">
      <h2>Industry Concentrations</h2>
      <p>Exploring sectoral employment patterns</p>
      <p class="coming-soon-text">Coming in the next iteration...</p>
    </div>
  </section>

  <section class="scroll-section" id="section-5">
    <div class="coming-soon">
      <h2>Policy Implications</h2>
      <p>Understanding the patterns and their significance</p>
      <p class="coming-soon-text">Coming in the next iteration...</p>
    </div>
  </section>
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
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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
    justify-content: center;
    position: relative;
    padding: 2rem;
  }

  .hero {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    border-radius: 20px;
    padding: 4rem;
    text-align: center;
    box-shadow: 0 25px 50px rgba(0, 0, 0, 0.1);
  }

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

  .chart-container {
    background: rgba(255, 255, 255, 0.98);
    border-radius: 20px;
    padding: 3rem;
    box-shadow: 0 25px 50px rgba(0, 0, 0, 0.1);
    backdrop-filter: blur(10px);
    width: 100%;
    max-width: 900px;
  }

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

  .coming-soon {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    border-radius: 20px;
    padding: 4rem;
    text-align: center;
    box-shadow: 0 25px 50px rgba(0, 0, 0, 0.1);
    max-width: 600px;
  }

  .coming-soon h2 {
    font-size: 2.5rem;
    margin-bottom: 1rem;
    color: #333;
  }

  .coming-soon p {
    font-size: 1.2rem;
    color: #666;
    margin-bottom: 1rem;
  }

  .coming-soon-text {
    font-style: italic;
    color: #999 !important;
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
  }
</style>
