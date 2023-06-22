/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react'
import { getFreeUsers, getUsersByProject } from '../../services/user/api'
import './dashboard.css'
import Loader from '../../components/Loader'
import Toaster from '../../components/Toaster'
import { Col, OverlayTrigger, Row, Tooltip } from 'react-bootstrap'

export default function ProjectGrid() {
  const [toaster, showToaster] = useState(false)
  const setShowToaster = param => showToaster(param)
  const [toasterMessage, setToasterMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [projectList, setProjectListValue] = useState([])
  const [freeUsersList, setFreeUsersList] = useState([])

  useEffect(() => {
    getAllProjectsWIthUsers()
    getAllFreeUsers()
  }, [])

  const getAllProjectsWIthUsers = async () => {
    try {
      setLoading(true)
      const users = await getUsersByProject()
      if (users.error) {
        setLoading(false)
        setToasterMessage(users?.message || 'Something Went Wrong')
        setShowToaster(true)
      } else {
        setProjectListValue(users?.data)
        // setUsersList(names)
        setLoading(false)
      }
    } catch (error) {
      setLoading(false)
      setToasterMessage(error?.error?.message || 'Something Went Wrong')
      setShowToaster(true)
      return error.message
    }
  }

  const getAllFreeUsers = async () => {
    try {
      setLoading(true)
      const users = await getFreeUsers()
      if (users.error) {
        setLoading(false)
        setToasterMessage(users?.message || 'Something Went Wrong')
        setShowToaster(true)
      } else {
        let names = users?.data?.map(user => user.name)
        setFreeUsersList(names)
        setLoading(false)
      }
    } catch (error) {
      setLoading(false)
      setToasterMessage(error?.error?.message || 'Something Went Wrong')
      setShowToaster(true)
      return error.message
    }
  }

  return (
    <>
      <div className='mb-3 mt-3'
        // style={{ marginTop: '2%' }}
      >
        <Row>

          <Col md='9'>

            <Row className='mr-0'>
            {projectList &&
              projectList.map((element, projectIndex) => {
                return (                    
                      <Col md= '3'>
                      <OverlayTrigger
                    trigger="hover"
                    placement="right"
                    overlay={
                      <Tooltip>
                        <ol style={{ textAlign: 'left' }}>
                          {element?.users?.map((ele)=>{
                            return (<li>{ele}</li>)
                          })}
                        </ol>
                      </Tooltip>
                    }
                  >
                      <div
                      key={projectIndex}
                      className="card project-card-grid"
                      style={{ height: '150px' }}
                    >
                      <span>{element?.projectName}</span>
                    </div>
                  </OverlayTrigger>
                      </Col>
                   
                )
              })}
                    </Row>

            {!projectList?.length && (
              <div>
                <p className="alig-nodata">No Project Found</p>
              </div>
            )}
          </Col>
          <Col md='3'>
          <div
            className="free-users"
            // style={{ border: `3px solid`, height: 'fit-content', width: '200px',padding: '10px' }}
          >
            <h4>Free Resources</h4>
            {freeUsersList.length > 0 ? (
              <ul>
                {freeUsersList.map((username, index) => {
                  return <li key={index}>{username}</li>
                })}
              </ul>
            ) : (
              <>No user is free!</>
            )}
          </div>
          </Col>
        </Row>
      </div>
      {loading ? <Loader /> : null}
      {toaster && (
        <Toaster
          message={toasterMessage}
          show={toaster}
          close={() => showToaster(false)}
        />
      )}
    </>
  )
}
