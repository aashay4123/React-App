import { useState, useEffect, Fragment } from "react";
import PieChart from "./components/pieChart";
import Loading from "./components/loading";
import _ from "lodash";
import "./App.css";
import Table from "./components/table";

function App() {
  const [currentDate, setCurrentDate] = useState(new Date("2021-05-29"));
  const [vaccineDates, setVaccineDates] = useState([]);

  useEffect(() => {
    fetch(`${process.env.PUBLIC_URL}/data/current_date.json`)
      .then((r) => r.json())
      .then((data) => {
        setCurrentDate(new Date(data.current_date));
      });
  }, []);

  useEffect(() => {
    fetch(`${process.env.PUBLIC_URL}/data/vaccine_dates.json`)
      .then((r) => r.json())
      .then((data) => {
        setVaccineDates(_.sortBy(data, "vaccination_date"));
        let vaccineData = [];
        let newobj = {};
        data.map((obj, key) => {
          if (new Date(obj.vaccination_date) >= currentDate) {
            newobj = {
              name: obj.person_name,
              status: "Vaccine Done",
              rowKey: obj.person_id, // not working
              className: "done",
            };
            vaccineData.push(newobj);
          } else {
            newobj = {
              name: obj.person_name,
              className: "pending",
              status: "Vaccine Pending",
              rowKey: obj.person_id, // not working
            };
            vaccineData.push(newobj);
          }
          return null;
        });
        setVaccineDates(vaccineData);
      });
  }, [currentDate]);

  const changeDate = (state) => {
    if (state === "next") {
      setCurrentDate(new Date(currentDate.setDate(currentDate.getDate() + 1)));
    } else {
      setCurrentDate(new Date(currentDate.setDate(currentDate.getDate() - 1)));
    }
  };

  let render = <Loading />;
  if (vaccineDates.length > 0) {
    let vaccinated = vaccineDates.filter(function (e) {
      return e.status === "Vaccine Done";
    }).length;
    let unvaccinated = vaccineDates.length - vaccinated;
    render = (
      <Fragment>
        <div className="App">
          <div className="head">
            <p>
              {vaccinated} out of {vaccineDates.length} people have been
              vaccinated
            </p>
          </div>
          <div className="date date_updated">
            <button className="margin" onClick={() => changeDate("prev")}>
              -
            </button>{" "}
            <div className="currentdate">{currentDate.toDateString()}</div>
            <button className="margin" onClick={() => changeDate("next")}>
              +
            </button>{" "}
          </div>
          <div
            className="chart"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <PieChart data={[vaccinated, unvaccinated]} />
            <Table data={vaccineDates} />
          </div>
        </div>
      </Fragment>
    );
  }
  return render;
}

export default App;
