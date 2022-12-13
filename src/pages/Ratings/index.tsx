import React, { useState } from "react";

import Dashboard from "../Dashboard";
import SelectDropdown from "components/ReactSelect";
import DateSelect from "components/DateSelect ";
import FormInput from "components/FormInput";
import TextArea from "components/TextArea";

const Ratings = () => {
  const [currentView, setCurrentView] = useState("Add");
  const handleViewChange = (view: any) => {
    setCurrentView(view);
  };

  const [team, setTeam] = useState("");
  const [date, setDate] = useState(new Date());
  const [rating, setRating] = useState("");
  const [comments, setComments] = useState("");
  const onchangeTeam = (e: any) => {
    console.log(e);
    setTeam(e);
  };
  const handleChangeDate = (date: Date) => {
    setDate(date);
  };
  const teamOptions = () => {
    const optionsArray = Array(5)
      .fill(0)
      .map((e, index) => {
        return {
          value: `Team ${index}`,
          label: `Team ${index}`,
        };
      });
    return optionsArray;
  };

  const handleRatingChange = (e: any) => {
    setRating(e.target.value);
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    const params = {
      team: team.value,
      date: date,
      comments: comments,
      rating: rating,
    };
    console.log(params);
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case "Add":
        return (
          <div className="border border-3 border-rounded border-primary ">
            <div
              className={`d-flex border-start border-end border-bottom bg-white`}
            >
              <div className="d-flex justify-content-center flex-grow-1">
                <div className="d-flex justify-content-center mt-4">
                  <form>
                    <SelectDropdown
                      options={teamOptions()}
                      placeholder={`Select Team`}
                      onChange={onchangeTeam}
                      value={team}
                    />
                    <div>
                      <div>Date</div>

                      <DateSelect value={date} onChange={handleChangeDate} />
                    </div>
                    <FormInput
                      label={`Rating`}
                      value={rating}
                      placeholder={"Rating"}
                      onChange={handleRatingChange}
                    />
                    <TextArea
                      value={comments}
                      onChange={(e: any) => setComments(e.target.value)}
                    />

                    <button
                      type="submit"
                      className="btn btn-primary my-5 w-100"
                      onClick={handleSubmit}
                    >
                      Submit
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        );

      case "View":
        return (
          <div className={`border-start border-end border-bottom`}>
            <Dashboard />
          </div>
        );
    }
  };

  return (
    <div className="m-3">
      <div className="d-flex w-100 justify-content-center ">
        <div
          onClick={() => handleViewChange("Add")}
          className={`p-3 border-top border-start border-end flex-grow-1 text-center rounded ${
            currentView === "Add" ? "text-white bg-primary" : "border-bottom "
          }`}
          style={{ cursor: "pointer" }}
        >
          Add
        </div>
        <div
          onClick={() => handleViewChange("View")}
          className={`p-3 border-top border-start border-end flex-grow-1 text-center rounded ${
            currentView === "View" ? "" : "border-bottom "
          }`}
          style={{ cursor: "pointer" }}
        >
          View
        </div>
      </div>
      {renderCurrentView()}
    </div>
  );
};

export default Ratings;
