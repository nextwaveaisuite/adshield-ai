import { useEffect } from "react";
import Chart from "chart.js/auto";

export default function Metrics() {
  useEffect(() => {
    const ctx = document.getElementById("myChart");
    new Chart(ctx, {
      type: "bar",
      data: {
        labels: ["A", "B", "C"],
        datasets: [{ label: "Metrics", data: [10, 20, 30] }]
      }
    });
  }, []);

  return (
    <main style={{ padding: 40 }}>
      <h1>Metrics Dashboard</h1>
      <canvas id="myChart"></canvas>
    </main>
  );
}
