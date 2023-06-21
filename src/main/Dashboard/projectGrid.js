/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react'
import { getFreeUsers, getUsersByProject } from '../../services/user/api'
import './dashboard.css'
import Loader from '../../components/Loader'
import Toaster from '../../components/Toaster'
import { OverlayTrigger, Popover, Tooltip } from 'react-bootstrap'

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
      <div
        style={{ marginTop: '2%' }}
      >
        <div
          className="project-boxes  d-grid"
          style={{ gridTemplateColumns: '4fr 1fr' }}
        >
          <div
            className="project-boxes  d-grid"
            style={{ gridTemplateColumns: 'auto auto auto auto' }}
          >
            {projectList &&
              projectList.map((element, projectIndex) => {
                return (
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
                      className="project-card"
                      style={{ border: `3px solid`, height: '150px', width: '150px' }}
                    >
                      <span>{element?.projectName}</span>
                    </div>
                  </OverlayTrigger>
                )
              })}
            {!projectList?.length && (
              <div>
                <p className="alig-nodata">No Project Found</p>
              </div>
            )}
          </div>
          <div
            className="d-grid free-users"
            style={{ border: `3px solid`, height: '150px', width: '150px' }}
          >
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
        </div>
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
