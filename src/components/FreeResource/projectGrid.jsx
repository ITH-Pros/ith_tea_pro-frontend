/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react'
import { getFreeUsers, getUsersByProject } from '@services/user/api'
import '@pages/Dashbord/dashboard.css'
import Loader from '../Shared/Loader'

import { Col, OverlayTrigger, Row, Tooltip } from 'react-bootstrap'
import { toast } from 'react-toastify'

export default function ProjectGrid() {
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
        toast.dismiss()
      toast.info(users?.message || 'Something Went Wrong')
        // set
      } else {
        setProjectListValue(users?.data)
        // setUsersList(names)
        setLoading(false)
      }
    } catch (error) {
      setLoading(false)
      toast.dismiss()
      toast.info(error?.error?.message || 'Something Went Wrong')
      // set
      return error.message
    }
  }

  const getAllFreeUsers = async () => {
    try {
      setLoading(true)
      const users = await getFreeUsers()
      if (users.error) {
        setLoading(false)
        toast.dismiss()
      toast.info(users?.message || 'Something Went Wrong')
        // set
      } else {
        let names = users?.data?.map(user => user.name)
        setFreeUsersList(names)
        setLoading(false)
      }
    } catch (error) {
      setLoading(false)
      toast.dismiss()
      toast.info(error?.error?.message || 'Something Went Wrong')
      // set
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

            <Row>
            {projectList &&
              projectList.map((element, projectIndex) => {
                return (                    
                      <Col md= '3' className='px-0 px-2 py-2'>
                      <OverlayTrigger
                    trigger="hover"
                    placement="right"
                    overlay={
                      <Tooltip>
                        <ol style={{ textAlign: 'left', padding:'0px', margin:'0px', listStyle:'none' }}>
                          {element?.users?.map((ele)=>{
                            return (<li>{ele}</li>)
                          })}
                        </ol>
                      </Tooltip>
                    }
                  >
                      <div
                      key={projectIndex}
                      className="card project-card-grid m-0"
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
          <Col md='3' className='py-2'>
          <div
            className="free-users"
            // style={{ border: `3px solid`, height: 'fit-content', width: '200px',padding: '10px' }}
          >
            <h4>Free Resources</h4>
            <div className='scroll-y-team'>
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
          </Col>
        </Row>
      </div>
      {loading ? <Loader /> : null}

    </>
  )
}
