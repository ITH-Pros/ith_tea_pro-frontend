import React, { useState } from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import moment from "moment";
import "react-loading-skeleton/dist/skeleton.css";
const ROOT = `rating_table`;
import { Table } from "antd";

const RatingTableSkeleton = () => {
  const [days, setDays] = useState(moment().daysInMonth());


    const columns = [
        {
          title: "Name",
          width: 110,
          dataIndex: "name",
          key: "name",
          fixed: "left",
          ellipsis: "true",
          render: (name) => (
            <span className="text-turncate" title={name}>
              {<Skeleton />}
            </span>
          ),
        },
    
    
    
        ...Array(days)
          .fill(0)
          .map((day, index) => {
            return {
              title: (
                <div>
                  <span>
                    {index + 1 < 10 ? "0" : ""}
                    {index + 1}
                  </span>
                  <br></br>
                  <span>{<Skeleton/>}</span>
                </div>
              ),
              dataIndex: "rating",
              key: index + 1,
              width: 60,
              render: (text, record) => {
                return (
                  <div
                    
                  >
                    {<Skeleton />}
                  </div>
                );
              },
            };
          }),
        {
          title: "Average",
          key: "operation",
          fixed: "right",
          width: 70,
          dataIndex: "averageRating",
        },
      ];
      const data = [

        {
            name: <Skeleton />,
            rating: <Skeleton />,
            // averageRating: <Skeleton />,
        },

        ...Array(16)

      ];

    return (
        <SkeletonTheme color="#f3f3f3" highlightColor="#ecebeb">
             <div className={`${ROOT}__rating_table`}>
                  <Table
                    pagination={false}
                    columns={columns}
                    dataSource={data}
                    scroll={{
                      x: 1500,
                      y: 320,
                    }}
                  />
                </div>
        </SkeletonTheme>
    );
}

export default RatingTableSkeleton;

