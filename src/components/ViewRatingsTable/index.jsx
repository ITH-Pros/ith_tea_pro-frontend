/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useContext, useEffect, useState } from "react";
import { getRatings } from "@services/user/api";
import { useQuery } from "react-query";

export default function ViewRatingsTable(props) {
  const [obj, setObj] = useState({});
  const {
    data: ratingsArray,
    isLoading,
    refetch,
  } = useQuery(
    ["getAllRatings", 8, 2023],
    async () => {
      const data = {
        month: 8,
        year: 2023,
      };
      const rating = await getRatings(data);
      console.log(rating);
      createRatingTable(rating.data);
      if (rating.error) {
        throw new Error(rating?.message || "Something Went Wrong");
      } else {
        return rating.data;
      }
    },
    {
      refetchOnWindowFocus: false,
    }
  );

  const createRatingTable = function (rating) {
    let obj = {};
    console.log(rating);
    rating.forEach((element) => {
      let days = 30;
      let userRatings = Array(days).fill(0);
      for (let i = 0; i < element.ratings.length; i++) {
        userRatings[element.ratings[i].date - 1] = element.ratings[i].rating;
      }
      obj[element._id] = userRatings;
    });
    setObj(obj);
  };

  return (
    <table>
        {Object.keys(obj).map((key) => {
          return (
      <tr>
              <td>{key + ":" + obj[key]} </td>
              <br></br>
              </tr>
          );
        })}
    </table>
  );
}
