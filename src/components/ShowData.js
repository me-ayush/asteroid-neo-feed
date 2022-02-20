import React from "react";
import { Bar } from "react-chartjs-2";
import { useState, useEffect } from "react";
import { Chart as ChartJS } from "chart.js/auto";

function ShowData(props) {
  const neo = props["data"][0]["near_earth_objects"];
  const startDate = props["data"][1];
  const endDate = props["data"][2];

  function dateRange(startDate, endDate, steps = 1) {
    const dateArray = [];
    let currentDate = new Date(startDate);

    while (currentDate <= new Date(endDate)) {
      var today = new Date(currentDate);
      var date = today.toJSON().slice(0, 10);
      var nDate =
        date.slice(0, 4) + "-" + date.slice(5, 7) + "-" + date.slice(8, 10);
      dateArray.push(nDate);
      currentDate.setUTCDate(currentDate.getUTCDate() + steps);
    }
    return dateArray;
  }
  const dates = dateRange(startDate, endDate);

  const dates_obj = [];
  for (var i in dates) {
    let key = dates[i];
    let fastest = 0;
    let fastestName = "";
    let c = 0;
    let sizeMin = 0;
    let sizeMax = 0;
    let nearestDist = 1.797693134862315e308;
    let nearestName = "";
    for (var k1 in neo[key]) {
      let currSpeed =
        neo[key][k1]["close_approach_data"][0]["relative_velocity"][
          "kilometers_per_hour"
        ];
      let currSizeMin =
        neo[key][k1]["estimated_diameter"]["kilometers"][
          "estimated_diameter_min"
        ];
      let currSizeMax =
        neo[key][k1]["estimated_diameter"]["kilometers"][
          "estimated_diameter_max"
        ];
      let currAstDist =
        neo[key][k1]["close_approach_data"][0]["miss_distance"]["kilometers"];
      if (currAstDist < nearestDist) {
        nearestDist = currAstDist;
        nearestName = neo[key][k1]["name"];
      }
      if (currSpeed > fastest) {
        fastest = currSpeed;
        fastestName = neo[key][k1]["name"];
      }
      sizeMin += currSizeMin;
      sizeMax += currSizeMax;
      c++;
    }
    sizeMax = sizeMax / c;
    sizeMin = sizeMin / c;
    dates_obj.push({
      date: key,
      ast: c,
      fastest: fastest,
      fastestName: fastestName,
      avgMax: sizeMax,
      avgMin: sizeMin,
      nearest: nearestDist,
      nearestName: nearestName,
    });
  }

  const [chartData, setUserData] = useState({
    labels: dates_obj.map((data) => data.date),
    datasets: [
      {
        label: "Asteroid",
        fontColor: ["black"],
        data: dates_obj.map((data) => data.ast),
        backgroundColor: [
          "rgba(255, 99, 132, 0.6)",
          "rgba(54, 162, 235, 0.6)",
          "rgba(255, 206, 86, 0.6)",
          "rgba(75, 192, 192, 0.6)",
          "rgba(153, 102, 255, 0.6)",
          "rgba(99, 252, 255, 0.6)",
          "rgba(116, 255, 99, 0.6)",
          "rgba(99, 111, 255, 0.6)",
        ],
        borderColor: "black",
        borderWidth: 1.5,
      }
    ],
  });

  useEffect(() => {
    document.getElementById("loading").innerHTML = "";
  });

  return (
    <div className="data-bg">
      <div className="table">
        <table width={`100%`}>
          <tr>
            <th></th>
            <th>Fastest Asteroid (Km/h)</th>
            <th>Average Size (Km)</th>
            <th>Nearest (Km)</th>
          </tr>
          {dates_obj.map((item, i) => (
            <tr key={item.date}>
              <td>{item.date}</td>
              <td>
                Name: {item.fastestName}
                <br />
                Speed: {item.fastest}
              </td>
              <td>
                Max: {item.avgMax}
                <br />
                Min: {item.avgMin}
              </td>
              <td>
                Name: {item.nearestName}
                <br />
                Distance: {item.nearest}
              </td>
            </tr>
          ))}
        </table>
      </div>
      <div className="chart">
        <Bar data={chartData} />
      </div>
    </div>
  );
}

export default ShowData;
