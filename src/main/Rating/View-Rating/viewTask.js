/* eslint-disable no-useless-concat */
/* eslint-disable react/jsx-no-target-blank */
import React, { useState, useEffect } from 'react'
import { useAuth } from '../../../auth/AuthProvider'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import Row from 'react-bootstrap/Row'
import Toaster from '../../../components/Toaster'
import Loader from '../../../components/Loader'
import Offcanvas from 'react-bootstrap/Offcanvas'
import ToastContainer from 'react-bootstrap/ToastContainer'
import Modal from 'react-bootstrap/Modal'
import { taskById } from '../../../services/user/api'
import UserIcon from '../../Projects/ProjectCard/profileImage'
import './index.css'
import { useParams } from 'react-router-dom'
import History from '../../Tasks/view-task/history'
import { Accordion } from 'react-bootstrap'

export default function ViewTask(props) {
  const [loading, setLoading] = useState(false)
  const [toasterMessage, setToasterMessage] = useState('')
  const [toaster, showToaster] = useState(false)
  const [task, setTaskData] = useState({})

  const { taskId } = useParams()

  useEffect(() => {
    if (taskId) getTaskDetailsById()
  }, [])

  const getTaskDetailsById = async () => {
    let dataToSend = {
      taskId: taskId,
    }
    setLoading(true)
    try {
      let response = await taskById(dataToSend)
      if (response.status === 200) {
        setTaskData(response?.data)
        // console.log(response?.data, 'response?.data')
      }
    } catch (error) {
      setToasterMessage(error)
    }
    setLoading(false)
  }

  function formatDate(dateString) {
    const date = new Date(dateString)
    const day = date.getUTCDate().toString().padStart(2, '0')
    const month = (date.getUTCMonth() + 1).toString().padStart(2, '0')
    const year = date.getUTCFullYear()
    if (day && month && year) {
      return `${day}/${month}/${year}`
    } else {
      return '--'
    }
  }

  const MinutesToDaysHoursMinutes = props => {
    const minutes = props.minutes
    const days = Math.floor(minutes / 1440) // 24 hours * 60 minutes = 1440 minutes in a day
    const hours = Math.floor((minutes % 1440) / 60)
    const remainingMinutes = minutes % 60

    return (
      <div className="task-completion-time">
        <h6 className="mb-0">Task Completion Time : </h6>{' '}
        <div className="time-details">
          {days > 0 && <p>Days: {days}</p>}
          {hours > 0 && <p>Hours: {hours}</p>}
          {remainingMinutes > 0 && <p>Minutes: {remainingMinutes}</p>}
        </div>
      </div>
    )
  }

  return (
    <div className="addUserFrom rightDashboard" style={{ marginTop: '7%', }}>
    <div>
      <Row className="mb-3">
        <Col className='d-flex'>
          <h6 className='pe-2'>Project Name : </h6>
          <p>{task?.projectId?.name} </p>
        </Col>
        <Col className='d-flex'>
          <h6 className='pe-2'>Section Name : </h6>
          <p>{task?.section?.name} </p>
        </Col>
        <Col className='d-flex'>
          <h6 className='pe-2'>Lead : </h6>
          {task?.lead?.map((item, index) => {
            return <p key={index}>{item?.name} </p>
          })}
        </Col>
      </Row>

      <Row className="mb-3">
        <Col>
          <h6>Task Title</h6>
          <p>{task?.title} </p>
        </Col>
      </Row>

      <Row className="mb-3">
        <Col>
          <h6>Task Description</h6>
          <p
            className="text-muted"
            dangerouslySetInnerHTML={{ __html: task?.description }}
          ></p>
        </Col>
      </Row>

      <Row className="mb-3">
        <Col as={Col} md="3" className='d-flex'>
          <h6 className='pe-2'>Assigned To : </h6>
          <p>{task?.assignedTo?.name || 'Not Assigned'} </p>
        </Col>
        <Col as={Col} md="3" className="d-flex">
          <h6 className='pe-2'>Due Date : </h6>
          <p style={{ fontSize: '13px', marginBottom: '0' }}>{task?.dueDate ? formatDate(task?.dueDate) : '--'} </p>
        </Col>

        <Col as={Col} md="3" className='d-flex'>
          <h6 className='pe-2'>Priority : </h6>
          <p>{task?.priority} </p>
        </Col>
        <Col as={Col} md="3" className="d-flex">
          <h6 className='pe-2'>Status : </h6>

          <p>{task.status}</p>
        </Col>
      </Row>
      <Row className="mb-3 mt-3">
        <Col as={Col} md="3" className='d-flex'>
          <h6 className='pe-2'>Completed Date : </h6>
          <p>{formatDate(task?.completedDate) || '--'} </p>
        </Col>

        <Col as={Col} md="3">
          <MinutesToDaysHoursMinutes minutes={task?.timeTaken} />
        </Col>
        <Col as={Col} md="3" className='d-flex'>
          <h6 className='pe-2'>Estimated Time :</h6>{' '}
          <div className="time">
            <p>
              {task?.defaultTaskTime?.hours} Hour(s) {task?.defaultTaskTime?.minutes !== null && <>& {task?.defaultTaskTime?.minutes} Minute</>}
            </p>
          </div>
        </Col>
        <Col as={Col} md="3" className='d-flex'>
          <h6 className='pe-2'>Attachments : </h6>
          {task.attachments &&
            task.attachments.map((file, index) => {
              return (
                <Col
                  key={index}
                  sm={12}
                >
                  <div className="assignPopup">
                    <a
                      href={`${file}`}
                      target="_blank"
                    >
                      {'Attachment' + ' ' + (index + 1)}
                    </a>
                  </div>
                </Col>
              )
            })}
        </Col>
      </Row>

      <Row className="comment-section">
        {/* <Col className='d-flex'>
          <h6 className='pe-2'>Attachments : </h6>
          {task.attachments &&
            task.attachments.map((file, index) => {
              return (
                <Col
                  key={index}
                  sm={12}
                >
                  <div className="assignPopup">
                    <a
                      href={`${file}`}
                      target="_blank"
                    >
                      {'Attachment' + ' ' + (index + 1)}
                    </a>
                  </div>
                </Col>
              )
            })}
        </Col> */}
         <Col as={Col}
          md="3">
          {' '}
          <h6 className='pe-2'>Ratings : </h6>
          {task?.ratingComments?.length ? (
            task?.ratingComments?.map((item, index) => {
              const options = {
                timeZone: 'Asia/Kolkata',
                dateStyle: 'medium',
                timeStyle: 'medium',
              }

              const createdAt = new Date(item?.createdAt).toLocaleString('en-US', options)

              return (
                <div
                  className="comment comment mb-0 mt-0 pt-0"
                  key={index}
                >
                  <div className="commentedBy pb-2">
                    <UserIcon
                      style={{ float: 'left' }}
                      key={index}
                      firstName={item?.commentedBy?.name}
                    />
                    {item?.commentedBy?.name}
                  </div>
                  <p
                    dangerouslySetInnerHTML={{ __html: item?.comment }}
                    className="comment-tex"
                  ></p>
                  <span className="date sub-text">{createdAt}</span>
                </div>
              )
            })
          ) : (
            <p>No Ratings!</p>
          )}
        </Col>
        <Col as={Col}
          md="3">
          {' '}
          <h6 className='pe-2'>Comments : </h6>
          {task?.comments?.length ? (
            task?.comments?.map((item, index) => {
              const options = {
                timeZone: 'Asia/Kolkata',
                dateStyle: 'medium',
                timeStyle: 'medium',
              }
              const createdAt = new Date(item?.createdAt).toLocaleString('en-US', options)

              return (
                <div
                  className="comment mb-0 mt-0 pt-0"
                  key={index}
                >
                  <div className="commentedBy pb-2">
                    <UserIcon
                      style={{ float: 'left' }}
                      key={index}
                      firstName={item?.commentedBy?.name}
                    />
                    {item?.commentedBy?.name}
                  </div>

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
        <Col as={Col}
          md="5">
          {' '}
          <h6 className='pe-2'>Verified Comments : </h6>
          {task?.verificationComments?.length ? (
            task?.verificationComments?.map((item, index) => {
              const options = {
                timeZone: 'Asia/Kolkata',
                dateStyle: 'medium',
                timeStyle: 'medium',
              }
              const createdAt = new Date(item?.createdAt).toLocaleString('en-US', options)

              return (
                <div
                  className="comment mb-0 mt-0 pt-0"
                  key={index}
                >
                  <div className="commentedBy pb-2">
                    <UserIcon
                      style={{ float: 'left' }}
                      key={index}
                      firstName={item?.commentedBy?.name}
                    />
                    {item?.commentedBy?.name}
                  </div>

                  <p
                    dangerouslySetInnerHTML={{ __html: item?.comment }}
                    className="comment-tex"
                  ></p>
                  <span className="date sub-text">{createdAt}</span>
                </div>
              )
            })
          ) : (
            <p>{task.isVerified ? 'No Comments!' : 'Not Verified'}</p>
          )}
        </Col>
       
      </Row>
      <Row>
        <Accordion>
          <Accordion.Header>
            <h6>History</h6>
          </Accordion.Header>
          <Accordion.Body>
            <History taskId={taskId} />
          </Accordion.Body>
        </Accordion>
      </Row>

      {loading ? <Loader /> : null}
      {toaster && (
        <ToastContainer
          position="top-end"
          className="p-3"
        >
          <Toaster
            message={toasterMessage}
            show={toaster}
            close={() => showToaster(false)}
          />
        </ToastContainer>
      )}
    </div>
    </div>
  )
}
