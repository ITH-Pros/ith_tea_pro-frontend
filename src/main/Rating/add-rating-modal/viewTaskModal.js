/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react'
import Col from 'react-bootstrap/Col'
import { useState, useEffect } from 'react'
import '../rating.css'
import { getProjectsTask } from '../../../services/user/api'
import Toaster from '../../../components/Toaster'
import Loader from '../../../components/Loader'
import { Accordion, Button, OverlayTrigger, Tooltip } from 'react-bootstrap'
import { useAuth } from '../../../auth/AuthProvider'
import { toast } from 'react-toastify'

export default function TasksModalBody(props) {
  const { setModalShow, data, raitngForDay} = props
  let user = data?.user
  let date = data?.date
  let month = data?.month
  let year = data?.year

  const [toaster, showToaster] = useState(false)
  const setShowToaster = param => showToaster(param)
  const [toasterMessage, setToasterMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [userTasks, setUserTasks] = useState('')

  useEffect(() => {
    if (data !== undefined || data !== '' || data !== {}) {
      const formattedDate = `${year}-${String(month).padStart(2, '0')}-${String(date).padStart(2, '0')}`
      let id = [user._id]
      id = JSON.stringify(id)
      localStorage.setItem('userId', id)
      getTasksDataUsingProjectId(formattedDate)
    }
  }, [data])

  function convertToUTCDay(dateString) {
    let utcTime = new Date(dateString)
    utcTime = new Date(utcTime.setUTCHours(0, 0, 0, 0))
    const timeZoneOffsetMinutes = new Date().getTimezoneOffset()
    const timeZoneOffsetMs = timeZoneOffsetMinutes * 60 * 1000
    const localTime = new Date(utcTime.getTime() + timeZoneOffsetMs)
    let localTimeString = new Date(localTime.toISOString())
    return localTimeString
  }

  function convertToUTCNight(dateString) {
    let utcTime = new Date(dateString)
    utcTime = new Date(utcTime.setUTCHours(23, 59, 59, 999))
    const timeZoneOffsetMinutes = new Date().getTimezoneOffset()
    const timeZoneOffsetMs = timeZoneOffsetMinutes * 60 * 1000
    const localTime = new Date(utcTime.getTime() + timeZoneOffsetMs)
    let localTimeString = new Date(localTime.toISOString())
    return localTimeString
  }

  const getTasksDataUsingProjectId = async date => {
    let assignedTo = JSON.parse(localStorage.getItem('userId'))
    assignedTo = JSON.stringify(assignedTo)
    setLoading(true)
    try {
      let data = {
        groupBy: 'default', // for all tasks list (no grouping by project) send 'assignedTo' instaed of default
        assignedTo: assignedTo,
        fromDate: convertToUTCDay(date),
        toDate: convertToUTCNight(date),
      }
      const tasks = await getProjectsTask(data)
      setLoading(false)
      if (tasks.error) {
        toast.dismiss()
      toast.info(tasks?.error?.message || 'Something Went Wrong1')
        // setShowToaster(true)
      } else {
        let allTask = tasks?.data
        setUserTasks(allTask)
      }
    } catch (error) {
      toast.dismiss()
      toast.info(error?.error?.message || 'Something Went Wrong2')
      // setShowToaster(true)
      setLoading(false)
      return error.message
    }
  }

  return (
    <>
      {userTasks?.length > 0 ? (
        <div className="dv-50-rating ">
              <h3>Rating: {raitngForDay}</h3>
          <div style={{ marginTop: '30px' }}>
            <h5>{user?.name} tasks for {date}/{month}/{year} </h5>
            {userTasks.length > 0 &&
              (userTasks?.map((task, index) => {
                  return (
                    <div>
                      <br></br>
                      <p>
                        {' '}
                        <strong className="fw-normal">
                          {task?._id?.projectId}
                          {' / '}
                          {task?._id?.section}
                        </strong>
                      </p>
                      <div>
                        {task?.tasks?.map((ele, i) => {
                          return (
                            <Accordion
                              defaultActiveKey={index}
                              flush
                            >
                              <Accordion.Item
                                eventKey={i + 1}
                                className="mb-0"
                              >
                                <Accordion.Header className="gap_status">
                                <span>
                                    {ele?.status === 'NOT_STARTED' && (
                                      <OverlayTrigger
                                      placement="top"
                                      overlay={<Tooltip>{ele?.status}</Tooltip>}
                                    >
                                      <i
                                        className="fa fa-check-circle secondary"
                                        aria-hidden="true"
                                      >
                                        {' '}
                                      </i>
                                      </OverlayTrigger>
                                    )}
                                    {ele?.status === 'ONGOING' && (
                                      <OverlayTrigger
                                      placement="top"
                                      overlay={<Tooltip>{ele?.status}</Tooltip>}
                                    >
                                      <i
                                        className="fa fa-check-circle warning"
                                        aria-hidden="true"
                                      >
                                        {' '}
                                      </i>
                                      </OverlayTrigger>
                                    )}
                                    {ele?.status === 'COMPLETED' && (
                                      <OverlayTrigger
                                      placement="top"
                                      overlay={<Tooltip>{ele?.status}</Tooltip>}
                                    >
                                      <i
                                        className="fa fa-check-circle success"
                                        aria-hidden="true"
                                      >
                                        {' '}
                                      </i>
                                      </OverlayTrigger>
                                    )}
                                    {ele?.status === 'ONHOLD' && (
                                      <OverlayTrigger
                                      placement="top"
                                      overlay={<Tooltip>{ele?.status}</Tooltip>}
                                    >
                                      <i
                                        className="fa fa-check-circle warning"
                                        aria-hidden="true"
                                      >
                                        {' '}
                                      </i>
                                      </OverlayTrigger>
                                    )}
                                  </span>
                                  <OverlayTrigger
                                    placement="top"
                                    overlay={<Tooltip>{ele?.title}</Tooltip>}
                                  >
                                    <p
                                      className="text-dark fw-normal"
                                      style={{ fontSize: '15px' }}
                                      onClick={() => window.open('/view-task/' + ele._id, '_blank')}
                                    >
                                      {ele?.title}
                                    </p>
                                  </OverlayTrigger>

                                  {ele?.isReOpen && (
                                    <OverlayTrigger
                                      placement="top"
                                      overlay={<Tooltip>Re-opened</Tooltip>}
                                    >
                                      <i
                                        className="fa fa-retweet red-flag"
                                        aria-hidden="true"
                                      ></i>
                                    </OverlayTrigger>
                                  )}
                                  {ele?.isDelayTask && (
                                    <OverlayTrigger
                                      placement="top"
                                      overlay={<Tooltip>Overdue</Tooltip>}
                                    >
                                      <i
                                        className="fa fa-flag red-flag"
                                        aria-hidden="true"
                                      ></i>
                                    </OverlayTrigger>
                                  )}
                                  {task?._id?.section !== 'Misc' &&
                                    (ele?.isVerified ? (
                                      <OverlayTrigger
                                    placement="top"
                                    overlay={<Tooltip>Verified</Tooltip>}
                                  >
                                      <i
                                        className="fa fa-check"
                                        style={{ color: 'green' }}
                                        aria-hidden="true"
                                      >
                                        {' '}
                                      </i>
                                      </OverlayTrigger>
                                    ) : (
                                      <OverlayTrigger
                                      placement="top"
                                      overlay={<Tooltip>Not Verified</Tooltip>}
                                    >
                                      <i
                                        className="fa fa-times"
                                        style={{ color: 'red', fontSize: '15px' }}
                                        aria-hidden="true"
                                      >
                                        {' '}
                                      </i>
                                      </OverlayTrigger>
                                    ))}
                                  <br></br>
                                  
                                </Accordion.Header>
                                <Accordion.Body>
                                  {ele?.isVerified && (
                                    <Col>
                                      {' '}
                                      <h6>
                                        <strong>Verification Comments</strong>
                                      </h6>
                                      {ele?.verificationComments?.length ? (
                                        ele?.verificationComments?.map((item, index) => {
                                          const options = {
                                            timeZone: 'Asia/Kolkata',
                                            dateStyle: 'medium',
                                            timeStyle: 'medium',
                                          }
                                          const createdAt = new Date(item?.createdAt).toLocaleString('en-US', options)

                                          return (
                                            <div
                                              className="comment mb-0 mt-0 pt-0 px-0"
                                              key={index}
                                            >
                                              <div className="pb-2">{item?.commentedBy?.name}</div>
                                              <p
                                                dangerouslySetInnerHTML={{ __html: item?.comment }}
                                                className="comment-tex"
                                              ></p>
                                              <span className="date sub-text">{createdAt}</span>
                                            </div>
                                          )
                                        })
                                      ) : (
                                        <p>No Comments!</p>
                                      )}
                                    </Col>
                                  )}
                                </Accordion.Body>
                              </Accordion.Item>
                            </Accordion>
                          )
                        })}
                      </div>
                    </div>
                  )
                }))
              }
          </div>
        </div>
      ):("No tasks Found!") }

      {loading ? <Loader /> : null}

    </>
  )
}
