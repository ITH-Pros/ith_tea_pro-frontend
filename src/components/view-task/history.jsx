import React, { useState, useEffect } from "react";
import "./history.css";
import { getTaskHistoryById } from "@services/user/api";
import LoadingSpinner from "../Shared/Spinner/spinner";

export default function History(props) {
  const { taskId } = props;

  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const getTaskHistoryByTaskId = async () => {
    setIsLoading(true);
    let dataToSend = {
      taskId: taskId,
    };

    try {
      const response = await getTaskHistoryById(dataToSend);
      if (response.error) {
        setIsLoading(false);
      } else {
        setHistory(response.data);
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getTaskHistoryByTaskId();
  }, []);

  return (
    <>
      <div className="history">
        {history.map((item, index) => {
          const options = {
            timeZone: "Asia/Kolkata",
            dateStyle: "medium",
            timeStyle: "medium",
          };

          const createdAt = new Date(item?.createdAt).toLocaleString(
            "en-US",
            options
          );
          return (
            <div key={index} className="history-container">
              <div className="timeline"></div>
              <div className="events">
                <div className="event">
                  <div className="d-block">
                    <div className="event-icon">
                      {item.actionTaken === "TASK_ADDED" && (
                        <i className="fas fa-tasks"></i>
                      )}
                      {item.actionTaken === "TASK_COMMENT" && (
                        <i className="far fa-comment"></i>
                      )}
                      {item.actionTaken === "TASK_DUEDATE_UPDATED" && (
                        <i className="far fa-calendar-alt"></i>
                      )}
                      {item.actionTaken === "TASK_STATUS_UPDATED" && (
                        <i className="fas fa-check"></i>
                      )}
                      {item.actionTaken === "TASK_UPDATED" && (
                        <i className="far fa-edit"></i>
                      )}
                      {item.actionTaken === "REOPEN_TASK" && (
                        <i className="fa fa-retweet"></i>
                      )}
                    </div>
                  </div>
                  <div className="event-content">
                    <div className="event-header">
                      <h3 className="event-title">
                        {item.actionTaken === "TASK_ADDED" && "Task Added"}
                        {item.actionTaken === "TASK_COMMENT" &&
                          "Task Commented"}
                        {item.actionTaken === "TASK_DUEDATE_UPDATED" &&
                          "Task Due Date Updated"}
                        {item.actionTaken === "TASK_STATUS_UPDATED" &&
                          "Task Status Updated"}
                        {item.actionTaken === "TASK_UPDATED" && "Task Updated"}
                        {item.actionTaken === "REOPEN_TASK" && "Task Re-Opened"}
                      </h3>
                      <span className="event-date ms-2">{createdAt}</span>
                    </div>
                    <div className="event-description">
                      {item?.actionTaken === "TASK_ADDED" && (
                        <p>
                          <span className="text-dark">Task added by :</span>{" "}
                          {item?.actionBy?.name}
                        </p>
                      )}
                      {item?.actionTaken === "TASK_COMMENT" && (
                        <div className="event-description">
                          <h4>Task commented by {item?.actionBy?.name}:</h4>
                          <div
                            className="comment"
                            dangerouslySetInnerHTML={{
                              __html: item?.commentId.comment,
                            }}
                          />
                        </div>
                      )}

                      {item.actionTaken === "TASK_DUEDATE_UPDATED" && (
                        <div className="event-description">
                          <h4>
                            Task due date updated by {item?.actionBy?.name}:
                          </h4>
                          <div className="details-card pb-0">
                            <div className="detail-item">
                              <span>Changed due date from:</span>
                              <p className="previous">
                                {new Date(
                                  item?.previous?.dueDate
                                ).toLocaleDateString()}
                              </p>
                              <span>to:</span>
                              <p className="new">
                                {new Date(
                                  item?.new?.dueDate
                                ).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      {item.actionTaken === "TASK_STATUS_UPDATED" && (
                        <div className="event-description">
                          <h4>
                            Task status updated by {item?.actionBy?.name}:
                          </h4>
                          <div className="details-card pb-0">
                            <div className="detail-item">
                              <span>Changed status from:</span>
                              <p
                                className={`previous-status ${item?.previous?.status?.toLowerCase()}`}
                              >
                                {item?.previous?.status}
                              </p>
                              <span> to: </span>
                              <p
                                className={`new-status ${item?.new?.status?.toLowerCase()}`}
                              >
                                {item?.new?.status}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      {item.actionTaken === "TASK_UPDATED" && (
                        <div className="event-description">
                          <h4>Task updated by {item?.actionBy?.name}:</h4>
                          <div className="details-card pb-0">
                            {item?.previous?.title !== item?.new?.title && (
                              <div className="detail-item">
                                <span>Changed title from:</span>
                                <p className="previous">
                                  {item?.previous?.title}
                                </p>
                                <span> to: </span>
                                <p className="new">{item?.new?.title}</p>
                              </div>
                            )}
                            {item?.previous?.description !==
                              item?.new?.description && (
                              <div className="detail-item">
                                <span>Changed description from:</span>
                                <div
                                  className="previous"
                                  dangerouslySetInnerHTML={{
                                    __html: item?.previous?.description,
                                  }}
                                ></div>
                                <span> to: </span>
                                <div
                                  className="new"
                                  dangerouslySetInnerHTML={{
                                    __html: item?.new?.description,
                                  }}
                                ></div>
                              </div>
                            )}
                            {item?.previous?.assignedTo !==
                              item?.new?.assignedTo && (
                              <div className="detail-item">
                                <span>Changed assigned to from:</span>
                                <p className="previous">
                                  {item?.previous?.assignedTo?.name} (
                                  {item?.previous?.assignedTo?.email})
                                </p>
                                <span> to: </span>
                                <p className="new">
                                  {item?.new?.assignedTo?.name} (
                                  {item?.new?.assignedTo?.email})
                                </p>
                              </div>
                            )}
                            {item?.previous?.priority !==
                              item?.new?.priority && (
                              <div className="detail-item">
                                <span>Changed priority from:</span>
                                <p className="previous">
                                  {item?.previous?.priority}
                                </p>
                                <span> to: </span>
                                <p className="new">{item?.new?.priority}</p>
                              </div>
                            )}
                            {item?.previous?.section !== item?.new?.section && (
                              <div className="detail-item">
                                <span>Moved from section:</span>
                                <p className="previous">
                                  {item?.previous?.section?.name}
                                  {/* {item?.previous?.section?.description}) */}
                                </p>
                                <span> to: </span>
                                <p className="new">
                                  {item?.new?.section?.name}
                                  {/* {item?.new?.section?.description}) */}
                                </p>
                              </div>
                            )}
                            {item?.previous?.lead !== item?.new?.lead && (
                              <div className="detail-item">
                                <span>Changed lead from:</span>
                                <p className="previous">
                                  {item?.previous?.lead?.name} (
                                  {item?.previous?.lead?.email})
                                </p>
                                <span> to: </span>
                                <p className="new">
                                  {item?.new?.lead?.name} (
                                  {item?.new?.lead?.email})
                                </p>
                              </div>
                            )}

                            {/* Due date */}
                            {item?.previous?.dueDate !== item?.new?.dueDate && (
                              <div className="detail-item">
                                <span>Changed due date from:</span>
                                <p className="previous">
                                  {new Date(
                                    item?.previous?.dueDate
                                  ).toLocaleDateString()}
                                </p>
                                <span> to: </span>
                                <p className="new">
                                  {new Date(
                                    item?.new?.dueDate
                                  ).toLocaleDateString()}
                                </p>
                              </div>
                            )}
                            {/* status */}
                            {item?.previous?.status !== item?.new?.status && (
                              <div className="detail-item">
                                <span>Changed status from:</span>
                                <p className="previous">
                                  {item?.previous?.status}
                                </p>
                                <span> to: </span>
                                <p className="new">{item?.new?.status}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {item?.actionTaken === "REOPEN_TASK" && (
                        <h4>Task re-opened by {item?.actionBy?.name}:</h4>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {isLoading ? <LoadingSpinner /> : null}
    </>
  );
}
