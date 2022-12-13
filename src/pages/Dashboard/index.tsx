import { v4 as uuidv4 } from "uuid";
import moment from "moment";
import "./index.css";
import { Key } from "react";
type User = {
  name: String;
  rating: Array<Number>;
  id: Key;
};
type Users = Array<any>;

const Rating = () => {
  const days = moment().daysInMonth();

  const users: Users = [
    { name: "Kshitij", rating: [2], id: uuidv4() },
    { name: "Rashid", rating: [3], id: uuidv4() },
    { name: "User3", rating: [4], id: uuidv4() },
  ];

  const handleChange = (e: any, userIndex: number, dayIndex: number) => {
    const tempUser: Users = [...users];
    tempUser[userIndex][dayIndex] = e.target.value;
  };

  return (
    <div className="py-4">
      <div>
        <h4 className="text-center">
          Current Date : {`${moment().format("DD MMMM YYYY")}`}
        </h4>
      </div>
      <div className="m-3 d-flex justify-content-center flex-column">
        <div>
          <h3 className="text-center">
            Ratings for {moment().format("MMMM, YYYY")}
          </h3>
        </div>
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              {Array(days)
                .fill(0)
                .map((rating, index) => {
                  return (
                    <th key={`${index}_${index}`} className={`text-center`}>{`${moment()
                      .startOf("month")
                      .add(index, "days")
                      .format("DD")}`}</th>
                  );
                })}
              <th>Average</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, userIndex) => {
              return (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  {Array(days)
                    .fill(0)
                    .map((day, dayIndex) => {
                      return (
                        <td key={`${user.id}_${dayIndex}`} >
                          <input
                            type="text"
                            name=""
                            id=""
                            className="input_dashboard"
                            value={`${user.rating[dayIndex] || ""}`}
                            disabled={
                              moment().diff(
                                moment().startOf("month").add(dayIndex, "days"),
                                "days"
                              ) > 0
                            }
                            onChange={(e) =>
                              handleChange(e, userIndex, dayIndex)
                            }
                          />
                        </td>
                      );
                    })}
                  <td>Average</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {/* <table>
          <tbody>
            <tr>
              <th>Name</th>
              {Array(days)
                .fill(0)
                .map((rating, index) => {
                  return (
                    <th key={`${index}_${index}`}>{`${moment()
                      .startOf("month")
                      .add(index, "days")
                      .format("DD")}`}</th>
                  );
                })}
              <th>Average</th>
            </tr>
            {users.map((user, userIndex) => {
              return (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  {Array(days)
                    .fill(0)
                    .map((day, dayIndex) => {
                      return (
                        <td key={`${user.id}_${dayIndex}`}>
                          <input
                            type="text"
                            name=""
                            id=""
                            className="input_dashboard"
                            value={`${user.rating[dayIndex] || ""}`}
                            disabled={
                              moment().diff(
                                moment().startOf("month").add(dayIndex, "days"),
                                "days"
                              ) > 0
                            }
                            onChange={(e) =>
                              handleChange(e, userIndex, dayIndex)
                            }
                          />
                        </td>
                      );
                    })}
                  <td>Average</td>
                </tr>
              );
            })}
          </tbody>
        </table> */}
      </div>
    </div>
  );
};

export default Rating;
