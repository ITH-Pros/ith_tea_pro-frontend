/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { getFreeUsers, getUsersByProject } from "@services/user/api";
import "@pages/Dashbord/dashboard.css";
import Loader from "../Shared/Loader";

import { Col, OverlayTrigger, Row, Tooltip } from "react-bootstrap";
import { toast } from "react-toastify";
import { useQuery } from "react-query";

export default function ProjectGrid() {
  const {
    data: projectList,
    isLoading: isProjectLoading,
    isFetching: isProjectFetching,
  } = useQuery("usersList", getUsersByProject, {
    refetchOnWindowFocus: false,
    enabled: true,
    select: (data) => {
      return data?.data;
    },
  });

  const {
    data: freeUsersList,
    isLoading: isUsersLoading,
    isFetching: isUsersFetching,
  } = useQuery("freeUsersList", getFreeUsers, {
    refetchOnWindowFocus: false,
    enabled: true,
    select: (data) => {
      let names = data?.data?.map((user) => user.name);
      return names;
    },
  });

  return (
    <>
      <div className="mb-3 mt-3">
        <Row>
          <Col md="9">
            <Row>
              {isProjectLoading && (
                <div>
                  <p className="alig-nodata">Loading...</p>
                </div>
              )}
              {isProjectFetching && (
                <div>
                  <div className="text-left refresh">Refreshing List....</div>
                </div>
              )}
              {projectList &&
                projectList.map((element, projectIndex) => {
                  return (
                    <Col md="3" className="px-0 px-2 py-2">
                      <OverlayTrigger
                        trigger="hover"
                        placement="right"
                        overlay={
                          <Tooltip>
                            <ol
                              style={{
                                textAlign: "left",
                                padding: "0px",
                                margin: "0px",
                                listStyle: "none",
                              }}
                            >
                              {element?.users?.map((ele) => {
                                return <li>{ele}</li>;
                              })}
                            </ol>
                          </Tooltip>
                        }
                      >
                        <div
                          key={projectIndex}
                          className="card project-card-grid m-0"
                          style={{ height: "150px" }}
                        >
                          <span>{element?.projectName}</span>
                        </div>
                      </OverlayTrigger>
                    </Col>
                  );
                })}
            </Row>
            {!projectList?.length &&
              !isProjectLoading &&
              !isProjectFetching && (
                <div>
                  <p className="alig-nodata">No Project Found</p>
                </div>
              )}
          </Col>
          <Col md="3" className="py-2">
            <div className="free-users">
              <h4>Free Resources</h4>
              <div className="scroll-y-team">
                {isUsersLoading && (
                  <div>
                    <p>Loading...</p>
                  </div>
                )}
                {isUsersFetching && !isUsersLoading && (
                  <div>
                    <p>Refreshing list...</p>
                  </div>
                )}
                {freeUsersList?.length > 0 ? (
                  <ul>
                    {freeUsersList.map((username, index) => {
                      return <li key={index}>{username}</li>;
                    })}
                  </ul>
                ) : (
                  <>No user is free!</>
                )}
              </div>
            </div>
          </Col>
        </Row>
      </div>
    </>
  );
}
