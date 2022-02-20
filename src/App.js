import ShowData from "./components/ShowData";
import { useState } from "react";
import axios from "axios";

function App() {
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [data, setData] = useState(null);
  const [error, setError] = useState();
  const [isLoading, setLoading] = useState("");

  const check = (e) => {
    setData(null);
    e.preventDefault();
    if (start === "") {
      setError("Please Choose Start Date");
    } else if (end === "") {
      setError("Please Choose End Date");
    } else if (end < start) {
      setError("Start Date Should Be Before End Date");
    } else {
      var date1 = new Date(start);
      var date2 = new Date(end);
      var Difference_In_Time = date2.getTime() - date1.getTime();
      var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);

      if (Difference_In_Days > 7) {
        setError("The Feed date limit is only 7 Days");
      } else {
        setLoading("Fetching Data...");
        document.getElementById("loading").innerHTML = "Fetching Data...";
        fetchData();
      }
    }
  };

  const fetchData = async () => {
    setData(null);
    getData().then((res) => setData(res), setError(false));
  };

  function getData() {
    return axios({
      url: `https://api.nasa.gov/neo/rest/v1/feed?start_date=${start}&end_date=${end}&api_key=JVRGRgawXWo22txapRAqh0MYhAqLiH3GtV7zUiz7`,
      method: "get",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.data)
      .catch((err) => console.log(err));
  }

  const toSend = [data, start, end, isLoading];
  return (
    <>
    <div className="main">

      <div className="container">
        <h1>Asteroid Neo Feed</h1>
        <form onSubmit={check}>
          <span>Start Date:</span>
          <input
            className="start-date"
            type="date"
            onChange={(e) => setStart(e.target.value)}
          ></input>
          <span>End Date:</span>
          <input
            className="end-date"
            type="date"
            onChange={(e) => setEnd(e.target.value)}
          ></input>
          <button className="btn btn-success btn-large" id="show-btn">
            Submit
          </button>
        </form>
      </div>
      <div className="show-data">
        <p id="loading">{isLoading}</p>
        {data ? <ShowData data={toSend} /> : <p className="error">{error}</p>}
      </div>
    </div>
    </>
  );
}

export default App;
