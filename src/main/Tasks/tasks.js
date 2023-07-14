/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from 'react'
import * as FileSaver from 'file-saver'
import * as XLSX from 'xlsx'
import './tasks.css'
import { addSectionApi, archiveSectionApi, deleteSectionApi, downloadExcel, getProjectsTask, updateSection, updateTaskStatusById } from '../../services/user/api'
import Loader from '../../components/Loader'

import FilterModal from './FilterModal'
import AddTaskModal from './AddTaskModal'
import { Accordion, ProgressBar, Dropdown, Badge, Modal, Button, OverlayTrigger, Tooltip, Row, Col } from 'react-bootstrap'
import moment from 'moment'
import { useAuth } from '../../auth/AuthProvider'
import ViewTaskModal from './view-task'
import UserIcon from '../Projects/ProjectCard/profileImage'
import Offcanvas from 'react-bootstrap/Offcanvas'
import { useParams } from 'react-router-dom'
import { toast } from 'react-toastify'

const Tasks = () => {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(false)  
  const [selectedProject, setSelectedProject] = useState({})
  const [showAddTask, setShowAddTask] = useState(false)
  const [selectedTask, setSelectedTask] = useState({})
  const [modalShow, setModalShow] = useState(false)
  const [sectionEditMode, setSectionEditMode] = useState(false)
  const [selectedProjectId, setSelectedProjectId] = useState('')
  const [selectedSectionId, setSelectedSectionId] = useState('')
  const [showViewTask, setShowViewTask] = useState(false)
  
  const [selectedTaskId, setSelectedTaskId] = useState('')
  const [deleteSectionModal, setDeleteSectionModal] = useState(false)
  const [isArchive, setIsArchive] = useState(false)
  const [taskInfo, setTaskInfo] = useState(null)
  const [sectionName, setSectionName] = useState('')
  const [archiveSectionModal, setArchiveSectionModal] = useState(false)
  const { userDetails } = useAuth()
  const params = JSON.parse(localStorage.getItem('project_details'))
  const {projectId} = useParams();

  useEffect(() => {
    if (localStorage.getItem('showTaskToaster')) {
      setTimeout(() => {
        toast.dismiss()
      toast.info(localStorage.getItem('showTaskToaster'))
        // set
        localStorage.removeItem('showTaskToaster')
      }, 500)
    }
  }, [localStorage.getItem('showTaskToaster')])

  const handleAddTaskFromSection = project => {
    console.log('section', project)
    setSelectedTask()
    localStorage.setItem('addTaskModal', true)
    setShowAddTask(true)

    setSelectedProject({
      _id: project?.projectId,
      section: project?.sectionId,
      sectionName: project?._id.section,
    })
  }

  // remove filter data from local storage when compenent leave

  useEffect(() => {
    return () => {
      localStorage.removeItem('taskFilters')
      localStorage.removeItem('selectedFilterTypes')
      localStorage.removeItem('selectedLead')
      localStorage.removeItem('fromDate')
      localStorage.removeItem('toDate')
      localStorage.removeItem('sortOrder')
      localStorage.removeItem('sortType')
      localStorage.removeItem('selectedFilter')
      localStorage.removeItem('dueDate')
      console.log('filterData removed')
    }
  }, [])



  useEffect(() => {
    getTasksDataUsingProjectId(projectId)
    let paramsData
    if (params?.projectId) {
      paramsData = params?.projectId
    }

    if (paramsData?.projectId) {
      setSelectedProjectId(paramsData?.projectId)
    }
    if (paramsData?.isArchive) {
      setIsArchive(paramsData?.isArchive)
    }
  }, [isArchive])


  const handleProgressBarHover = project => {
    const completedTasks = project.completedTasks || 0
    const totalTasks = project.totalTasks || 0
    const pendingTasks = totalTasks - completedTasks
    setTaskInfo({ completedTasks, pendingTasks })
  }

  const deleteConFirmation = sectionId => {
    setSelectedSectionId(sectionId?._id)
    setDeleteSectionModal(true)
  }

  const deleteSection = async () => {
    let dataToSend = {
      sectionId: selectedSectionId,
    }
    try {
      const res = await deleteSectionApi(dataToSend)
      if (res.status === 200) {
        toast.dismiss()
      toast.info('Section deleted successfully')
        // set
        setDeleteSectionModal(false)
        closeModal()
        getTasksDataUsingProjectId()
        let paramsData
        if (params?.projectId) {
          paramsData = params?.projectId
        }
        if (paramsData?.projectId) {
          setSelectedProjectId(paramsData?.projectId)
        }
      } else {
        toast.dismiss()
      toast.info(res?.message)
        // set
      }
    } catch (error) {
      // console.log('error in deleteSection', error)
    }
  }

  const archiveSection = async () => {
    let dataToSend = {
      sectionId: selectedSectionId,
      isArchived: true,
    }
    try {
      const res = await archiveSectionApi(dataToSend)
      if (res.status === 200) {
        toast.dismiss()
      toast.info('Section archived successfully')
        // set
        setArchiveSectionModal(false)
        closeModal()
        getTasksDataUsingProjectId()
        let paramsData
        if (params?.projectId) {
          paramsData = params?.projectId
        }
        if (paramsData?.projectId) {
          setSelectedProjectId(paramsData?.projectId)
        }
      } else {
        toast.dismiss()
      toast.info(res?.message)
        // set
      }
    } catch (error) {
      // console.log('error in archiveSection', error)
    }
  }

  const editSection = (sectionId, projectId) => {
    setSelectedProjectId(sectionId?.projectId)
    setSectionName(sectionId?.section)
    setSelectedSectionId(sectionId?._id)
    setModalShow(true)
    setSectionEditMode(true)
  }

  const sectionUpdate = async () => {
    let dataToSend = {
      name: sectionName,
      projectId: selectedProjectId,
      sectionId: selectedSectionId,
    }
    try {
      const res = await updateSection(dataToSend)
      if (res.status === 200) {
        toast.dismiss()
      toast.info('Section updated successfully')
        setSectionEditMode(false)
        // set
        setModalShow(false)
        closeModal()
        getTasksDataUsingProjectId()
        let paramsData
        if (params?.projectId) {
          paramsData = params?.projectId
        }
        if (paramsData?.projectId) {
          setSelectedProjectId(paramsData?.projectId)
        }
      } else {
        toast.dismiss()
      toast.info(res?.message)
        // set
      }
    } catch (error) {
      // console.log('error in sectionUpdate', error)
    }
  }

  const handleViewDetails = taskId => {
    setSelectedTaskId(taskId)
    setShowViewTask(true)
  }

  const closeViewTaskModal = () => {
    setShowViewTask(false)
    setSelectedTaskId(null)
  }

  const handleStatusChange = (e, taskId, status) => {
    const newStatus = status
    let dataToSend = {
      taskId: taskId,
      status: newStatus,
    }
    updateTaskStatus(dataToSend)
  }

  const updateTaskStatus = async dataToSend => {
    try {
      const res = await updateTaskStatusById(dataToSend)
      if (res.error) {
        toast.dismiss()
      toast.info(res?.message || 'Something Went Wrong in update task status')
        // set
      } else {
        toast.dismiss()
      toast.info(res?.message || 'Response in update task status 1')
        // set
        getTasksDataUsingProjectId()
      }
    } catch (error) {
      toast.dismiss()
      toast.info(error?.error?.message || 'Something Went Wrong in update task status error')
      // set
      return error.message
    }
  }

  const showAddSectionModal = isTrue => {
    setSectionName('')
    setModalShow(isTrue)
  }

  const addSection = async () => {
    if (sectionEditMode) {
      sectionUpdate()
      return
    } else {
      setLoading(true)
      try {
        let dataToSend = {
          name: sectionName,
          projectId: selectedProjectId,
        }

        const res = await addSectionApi(dataToSend)
        setLoading(false)
        if (res.error) {
          toast.dismiss()
      toast.info(res?.message || 'Something Went Wrong in add section')
          // set
        } else {
          toast.dismiss()
      toast.info(res?.message || 'Response in add section')
          // set
          setModalShow(false)
          closeModal()
          getTasksDataUsingProjectId()
          let paramsData
          if (params?.projectId) {
            paramsData = params?.projectId
          }
          if (paramsData?.projectId) {
            setSelectedProjectId(paramsData?.projectId)
          }
          // getProjectList();
        }
      } catch (error) {
        toast.dismiss()
      toast.info(error?.error?.message || 'Something Went Wrong in add section error')
        // set
        setLoading(false)
        return error.message
      }
    }
  }

  function convertToUTCDay(dateString) {
    let utcTime = new Date(dateString)
    utcTime = new Date(utcTime.setUTCHours(0, 0, 0, 0))
    const timeZoneOffsetMinutes = new Date().getTimezoneOffset()
    const timeZoneOffsetMs = timeZoneOffsetMinutes * 60 * 1000
    const localTime = new Date(utcTime.getTime() + timeZoneOffsetMs)
    let localTimeString = new Date(localTime.toISOString())
    // // console.log('==========', localTimeString)
    return localTimeString
  }

  function convertToUTCNight(dateString) {
    // // console.log(dateString, '------------------')
    let utcTime = new Date(dateString)
    utcTime = new Date(utcTime.setUTCHours(23, 59, 59, 999))
    const timeZoneOffsetMinutes = new Date().getTimezoneOffset()
    const timeZoneOffsetMs = timeZoneOffsetMinutes * 60 * 1000
    const localTime = new Date(utcTime.getTime() + timeZoneOffsetMs)
    let localTimeString = new Date(localTime.toISOString())
    // // console.log('==========', localTimeString)
    return localTimeString
  }

  const getTasksDataUsingProjectId = async () => {
    try {
      let paramsData = projectId || null;
      setLoading(true);
  
      let data = {
        groupBy: 'default',
        isArchived: isArchive || false,
        projectId: paramsData
      };
  
      if (localStorage.getItem('selectedLead')) {
        let leads = JSON.parse(localStorage.getItem('selectedLead'));
        if (leads && leads.length > 0) {
          data.leads = JSON.stringify(leads);
        }
      }
  
      if (localStorage.getItem('taskFilters')) {
        let filterData = JSON.parse(localStorage.getItem('taskFilters'));
        let selectedFilter = localStorage.getItem('selectedFilterTypes');
        console.log(filterData)
        if (filterData?.projectIds && filterData.projectIds.length > 0) {
          data.projectIds = JSON.stringify(filterData.projectIds);
        }
        if (filterData?.createdBy) {
          data.createdBy = JSON.stringify(filterData.createdBy);
        }
        if (filterData?.assignedTo && filterData.assignedTo.length > 0) {
          data.assignedTo = JSON.stringify(filterData.assignedTo);
        }
        if (filterData?.category && filterData.category.length > 0) {
          data.sections = JSON.stringify(filterData.category);
        }
        if (filterData?.priority) {
          data.priority = JSON.stringify(filterData.priority);
        }
        if (filterData?.status) {
          data.status = JSON.stringify(filterData.status);
        }
        if (filterData?.sortType) {
          data.sortType = JSON.stringify(filterData.sortType);
        }
        if (filterData?.sortOrder) {
          data.sortOrder = JSON.stringify(filterData.sortOrder);
        }
        if (filterData?.fromDate && selectedFilter && selectedFilter !== 'null' && selectedFilter !== 'Today' && selectedFilter !== 'Tomorrow') {
          data.fromDate = convertToUTCDay(filterData.fromDate);
        }
        if (filterData?.toDate && selectedFilter && selectedFilter !== 'null' && selectedFilter !== 'Today' && selectedFilter !== 'Tomorrow') {
          data.toDate = convertToUTCNight(filterData.toDate);
        }
        if (selectedFilter === 'Today' || selectedFilter === 'Tomorrow') {
          data.fromDate = convertToUTCDay(filterData.fromDate);
          data.toDate = convertToUTCNight(filterData.toDate);
        }
      }
  
      const tasks = await getProjectsTask(data);
      setLoading(false);
  
      if (tasks.error) {
        toast.dismiss()
      toast.info(tasks.error.message);
        // set
      } else {
        let allTasks = tasks.data;
        allTasks.forEach((item) => {
          item.tasks.forEach((task) => {
            if (task.dueDate) {
              let today = new Date().toISOString().split('T')[0];
  
              if (task.dueDate.split('T')[0] === today || new Date(task.dueDate).getTime() < new Date().getTime()) {
                task.dueToday = true;
              } else {
                task.dueToday = false;
              }
  
              if (task.completedDate && new Date(task.completedDate).getTime() > new Date(task.dueDate).getTime()) {
                task.dueToday = true;
              }
  
              if (task.completedDate && task.completedDate.split('T')[0] === task.dueDate.split('T')[0]) {
                task.dueToday = false;
              }
            }
          });
        });
  
        setProjects(allTasks);
        if (paramsData) {
          setSelectedProjectId(paramsData);
        }
      }
    } catch (error) {
      toast.dismiss()
      toast.info(error?.message || 'Something Went Wrong in get project task error')
      // set
      setLoading(false)
      // console.log(error.message)
    }
  };
  

  const exportTasks = async () => {
    let paramsData
    if (params?.projectId) {
      paramsData = params?.projectId
    }
    console.log("-------")
    console.log(paramsData)
    setLoading(true)
    try {
      let data = {
        groupBy: 'default',
      }
      if (isArchive) {
        data.isArchived = true
      }
      if (params?.projectId) {
        data.projectId = paramsData
      }
      if (localStorage.getItem('selectedLead')) {
        // // console.log(JSON.parse(localStorage.getItem('selectedLead')))
        let leadsToSend = localStorage.getItem('selectedLead')
        let leads = JSON.parse(localStorage.getItem('selectedLead'))
        if (leads?.length) {
          data.leads = leadsToSend
        }
      }

      if (localStorage.getItem('taskFilters')) {
        let filterData = JSON.parse(localStorage.getItem('taskFilters'))
        let selectedFilter = localStorage.getItem('selectedFilter')
        // // console.log(selectedFilter, 'selectedFilter')
        // // console.log(filterData)
        if (filterData?.projectIds && filterData.projectIds.length > 0) {
          data.projectIds = JSON.stringify(filterData?.projectIds)
        }
        if (filterData?.createdBy) {
          data.createdBy = JSON.stringify(filterData?.createdBy)
        }
        if (filterData?.assignedTo && filterData?.assignedTo.length > 0) {
          data.assignedTo = JSON.stringify(filterData?.assignedTo)
        }
        if (filterData?.category?.length) {
          data.sections = JSON.stringify(filterData?.category)
        }
        if (filterData?.priority) {
          data.priority = JSON.stringify(filterData?.priority)
        }
        if (filterData?.status) {
          data.status = JSON.stringify(filterData?.status)
        }
        if (filterData?.sortType) {
          data.sortType = filterData?.sortType
        }
        if (filterData?.sortOrder) {
          data.sortOrder = filterData?.sortOrder
        }
        if (filterData?.fromDate && selectedFilter && selectedFilter !== 'null' && selectedFilter !== 'Today' && selectedFilter !== 'Tomorrow') {
          // // console.log(selectedFilter, '----------------')

          data.fromDate = convertToUTCDay(filterData?.fromDate)
        }
        if (filterData?.toDate && selectedFilter && selectedFilter !== 'null' && selectedFilter !== 'Today' && selectedFilter !== 'Tomorrow') {
          // // console.log(selectedFilter, '----------------')

          data.toDate = convertToUTCNight(filterData?.toDate)
        }
        if (selectedFilter === 'Today' || selectedFilter === 'Tomorrow') {
          // // console.log(selectedFilter, '----------------')

          data.fromDate = convertToUTCDay(filterData?.fromDate)
          data.toDate = convertToUTCNight(filterData?.toDate)
        }
      }
      const res = await downloadExcel(data)

      if (res.error) {
        toast.dismiss()
      toast.info(res?.message || 'Something Went Wrong in download excel')
        // set
      } else {
        // console.log(res,'download excel') // Make sure the response contains the expected data

        const blob = new Blob([res], {
          type: '.xlsx',
        })

        const url = window.URL.createObjectURL(blob)

        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', `${Date.now()}.xlsx`)

        document.body.appendChild(link)
        link.click()

        link.remove()
      }
      setLoading(false)
    } catch (error) {
      setLoading(false)
      toast.dismiss()
      toast.info(error?.message || 'Something Went Wrong in download excel error')
      // set
      return error.message
    }
  }

  const downloadExportData = () => {
    exportTasks()
  }

  const getNewTasks = id => {
    closeModal()
    getTasksDataUsingProjectId()
  }

  const getTaskFilters = () => {
    getTasksDataUsingProjectId()
  }

  const closeModal = () => {
    setShowAddTask(false)
    setSelectedProject()
    setSelectedTask()
  }

  return (
    <>
      <div
        className="rightDashboard"
        style={{ marginTop: '7%' }}
      >
        <Row>
          <Col lg={6}>
            <h1 className="h1-text mt-0">
              <i
                className="fa fa-list-ul"
                aria-hidden="true"
              ></i>
              Task
            </h1>
          </Col>
          <Col lg={6}>
            <div className="text-end">
              {!isArchive && (
                <button
                  className="addTaskBtn"
                  style={{
                    float: 'right',
                  }}
                  onClick={() => {
                    setSelectedTask()
                    setSelectedProject()
                    localStorage.setItem('addTaskModal', true)
                    setShowAddTask(true)
                  }}
                >
                  <i
                    className="fa fa-plus-circle"
                    aria-hidden="true"
                  ></i>{' '}
                  Add Task
                </button>
              )}

              {projects?.length !== 0 && userDetails?.role !== 'CONTRIBUTOR' && !isArchive && projectId && (
                <button
                  className="addTaskBtn addSectionBtn"
                  onClick={() => {
                    showAddSectionModal(true)
                  }}
                >
                  <i
                    className="fa fa-plus-circle"
                    aria-hidden="true"
                  ></i>{' '}
                  Add Section
                </button>
              )}
              <button className="filter_btn">
                <FilterModal
                  handleProjectId={selectedProjectId}
                  getTaskFilters={getTaskFilters}
                  isArchive={isArchive}
                  downloadExportData={downloadExportData}
                  projectId={params?.projectId}
                />
              </button>
            </div>
          </Col>
        </Row>

        <AddTaskModal
          selectedProjectFromTask={selectedProject}
          selectedTask={selectedTask}
          getNewTasks={getNewTasks}
          showAddTask={showAddTask}
          closeModal={closeModal}
          handleProjectId={selectedProjectId}
        />

        <ViewTaskModal
          showViewTask={showViewTask}
          closeViewTaskModal={closeViewTaskModal}
          selectedTaskId={selectedTaskId}
          getTasksDataUsingProjectId={getTasksDataUsingProjectId}
        />

        <Accordion alwaysOpen="true">
          {/* {!projects?.length && params?.projectId && !isArchive && userDetails?.role !== 'CONTRIBUTOR' && (
            <div className="add-section-center">
              <Button
                variant="primary"
                onClick={() => {
                  showAddSectionModal(true)
                }}
              >
                <i className="fa fa-plus-circle"> </i> Add Section
              </Button>
            </div>
          )} */}
          {!projects?.length && !selectedProjectId && (
            <p
              className="alig-nodata"
              style={{ textAlign: 'center' }}
            >
              No Tasks Found
            </p>
          )}

          {projects.map((project, index) => (
            // check if tasks array has data
            <Accordion.Item
              key={index}
              eventKey={index}
            >
              {project?._id?.projectId && project?._id?.section && (
                <Accordion.Header>
                  {project?._id?.projectId} / {project?._id?.section}
                </Accordion.Header>
              )}

              <div className="d-flex rightTags">
                <OverlayTrigger
                  placement="top"
                  overlay={
                    <Tooltip>
                      {taskInfo && (
                        <div>
                          <div>Completed Tasks: {taskInfo.completedTasks}</div>
                          <div>Pending Tasks: {taskInfo.pendingTasks}</div>
                        </div>
                      )}
                    </Tooltip>
                  }
                >
                  <div
                    onMouseEnter={() => handleProgressBarHover(project)}
                    onMouseLeave={() => setTaskInfo(null)}
                  >
                    {parseFloat((Number(project?.completedTasks || 0) / Number(project?.totalTasks || 1)) * 100).toFixed(2) + ' % '}
                    <ProgressBar>
                      <ProgressBar
                        variant="success"
                        now={100 * (Number(project?.completedTasks || 0) / Number(project?.totalTasks || 1))}
                        key={1}
                      />
                    </ProgressBar>
                  </div>
                </OverlayTrigger>
                <div>
                  <Dropdown>
                    <Dropdown.Toggle
                      id="dropdown-basic"
                      className="action_btn"
                    >
                      <i
                        className="fa fa-ellipsis-v"
                        aria-hidden="true"
                      ></i>
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                      {!isArchive && (
                        <Dropdown.Item
                          onClick={() => {
                            handleAddTaskFromSection(project)
                          }}
                        >
                          <i
                            className="fa fa-plus-circle"
                            aria-hidden="true"
                          ></i>{' '}
                          Add Tasks
                        </Dropdown.Item>
                      )}

                      {(userDetails.role === 'SUPER_ADMIN' || userDetails.role === 'ADMIN') && (
                        <>
                          {!isArchive && (
                            <Dropdown.Item
                              onClick={() =>
                                editSection({
                                  section: project?._id?.section,
                                  projectId: project?.projectId,
                                  _id: project?.sectionId,
                                })
                              }
                            >
                              <i
                                className="fa fa-pencil-square"
                                aria-hidden="true"
                              ></i>{' '}
                              Edit Section
                            </Dropdown.Item>
                          )}
                          {!isArchive && (
                            <Dropdown.Item>
                              <i
                                className="fa fa-files-o"
                                aria-hidden="true"
                              ></i>{' '}
                              Copy/Move
                            </Dropdown.Item>
                          )}
                          <Dropdown.Item
                            disabled={project?.tasks?.length > 0}
                            onClick={() =>
                              deleteConFirmation({
                                _id: project?.sectionId,
                              })
                            }
                          >
                            <i
                              className="fa fa-trash"
                              aria-hidden="true"
                            ></i>{' '}
                            Delete Section
                          </Dropdown.Item>
                        </>
                      )}
                    </Dropdown.Menu>
                  </Dropdown>
                </div>
              </div>
              <Accordion.Body>
                <ul className="mb-0">
                  {project?.tasks?.map(task => (
                    <li
                      key={task?._id}
                      className="share-wrapper-ui"
                    >
                      <div className="clickLabelArea">
                        <Row className="align-items-center justify-content-start">
                          <Col
                            lg={4}
                            className="align-items-center"
                          >
                            <Row>
                              <Col lg={1} >
                                <div >
                                  {(userDetails.id === task?.assignedTo?._id ||
                                    (userDetails.role === 'LEAD' && (userDetails.id === task?.assignedTo?._id || task?.lead?.includes(userDetails.id) || userDetails.id === task?.createdBy?._id)) ||
                                    userDetails.role === 'SUPER_ADMIN' ||
                                    userDetails.role === 'ADMIN') && (
                                    <Dropdown>
                                      <Dropdown.Toggle
                                        variant="success"
                                        id="dropdown-basic"
                                      >
                                        {task.status === 'NOT_STARTED' && (
                                          <i
                                            className="fa fa-check-circle secondary"
                                            aria-hidden="true"
                                          ></i>
                                        )}
                                        {task.status === 'ONGOING' && (
                                          <i
                                            className="fa fa-check-circle warning"
                                            aria-hidden="true"
                                          ></i>
                                        )}
                                        {task.status === 'COMPLETED' && (
                                          <i
                                            className="fa fa-check-circle success"
                                            aria-hidden="true"
                                          ></i>
                                        )}
                                        {task.status === 'ONHOLD' && (
                                          <i
                                            className="fa fa-check-circle primary"
                                            aria-hidden="true"
                                          ></i>
                                        )}
                                      </Dropdown.Toggle>

                                      {task.status !== 'COMPLETED' && (
                                        <Dropdown.Menu>
                                          <Dropdown.Item onClick={event => handleStatusChange(event, task?._id, 'NOT_STARTED')}>
                                            <i
                                              className="fa fa-check-circle secondary  "
                                              aria-hidden="true"
                                            ></i>{' '}
                                            Not Started
                                          </Dropdown.Item>
                                          <Dropdown.Item onClick={event => handleStatusChange(event, task?._id, 'ONGOING')}>
                                            <i
                                              className="fa fa-check-circle warning"
                                              aria-hidden="true"
                                            ></i>{' '}
                                            Ongoing
                                          </Dropdown.Item>
                                          <Dropdown.Item onClick={event => handleStatusChange(event, task?._id, 'COMPLETED')}>
                                            <i
                                              className="fa fa-check-circle success"
                                              aria-hidden="true"
                                            ></i>{' '}
                                            Completed
                                          </Dropdown.Item>
                                          <Dropdown.Item onClick={event => handleStatusChange(event, task?._id, 'ONHOLD')}>
                                            <i
                                              className="fa fa-check-circle primary"
                                              aria-hidden="true"
                                            ></i>{' '}
                                            On Hold
                                          </Dropdown.Item>
                                        </Dropdown.Menu>
                                      )}
                                    </Dropdown>
                                  )}
                                </div>
                              </Col>
                              <Col lg={8}>
                                <p
                                  className={task?.status === 'COMPLETED' ? 'line-strics' : ''}
                                  // onClick={() => handleViewDetails(task?._id)}
                                >
                                  <p
                                    onClick={() => handleViewDetails(task?._id)}
                                    className="text-truncate"
                                  >
                                    {task?.title}
                                  </p>
                                </p>
                              </Col>
                              <Col
                                lg={3}
                                className="d-flex align-items-center "
                              >
                                {task?.isReOpen && (
                                  <div className="text-danger">
                                    <OverlayTrigger
                                      placement="top"
                                      overlay={<Tooltip>Re-opened</Tooltip>}
                                    >
                                      <i
                                        className="fa fa-retweet"
                                        aria-hidden="true"
                                      ></i>
                                    </OverlayTrigger>
                                  </div>
                                )}
                                {task?.isDelayTask && (
                                  <div className="text-danger"
                                  style={{marginLeft:'10px'}}
                                  >
                                    <OverlayTrigger
                                      placement="top"
                                      overlay={<Tooltip>Overdue</Tooltip>}
                                    >
                                      <i
                                        className="fa fa-flag"
                                        aria-hidden="true"
                                      ></i>
                                    </OverlayTrigger>
                                  </div>
                                )}
                              </Col>
                            </Row>
                          </Col>

                          <Col lg={3}>
                            {task?.status === 'NOT_STARTED' && <Badge bg="secondary">NOT STARTED</Badge>}
                            {task?.status === 'ONGOING' && <Badge bg="warning">ONGOING</Badge>}
                            {task?.status === 'COMPLETED' && <Badge bg="success">completed {moment(task?.completedDate?.split('T')[0]).format('MMM DD,YYYY')}</Badge>}
                            {task?.status === 'ONHOLD' && <Badge bg="primary">ON HOLD</Badge>}
                            {task?.priority === 'LOW' && <Badge bg="primary">LOW</Badge>}
                            {task?.priority === 'REPEATED' && <Badge bg="warning">REPEATED</Badge>}
                            {task?.priority === 'MEDIUM' && <Badge bg="warning">MEDIUM</Badge>}
                            {task?.priority === 'HIGH' && <Badge bg="danger">HIGH</Badge>}
                          </Col>
                          <Col
                            lg={2}
                            className="align-items-center justify-content-start ps-0 d-flex"
                          >
                            {!task?.assignedTo?.profilePicture && task?.assignedTo?.name && (
                              <div className="nameTag">
                                <UserIcon  style={{width:'25px'}}
                                  key={index}
                                  firstName={task?.assignedTo?.name || ''}
                                />
                              </div>
                            )}
                            {task?.assignedTo?.profilePicture && (
                              <div
                                className="nameTag"
                                style={{ display: 'contents' }}
                              >
                                <img
                                  style={{
                                    width: '25px',
                                    height: '25px',
                                    borderRadius: '50%',
                                  }}
                                  src={`${task?.assignedTo?.profilePicture}`}
                                  alt="profile"
                                ></img>
                              </div>
                            )}
                            <span  className="text-truncate d-block"> {task?.assignedTo?.name}</span>
                            {!task?.assignedTo?.name && <span> NOT ASSIGNED </span>}
                          </Col>
                          {/* for lead  */}

                          <Col
                            lg={2}
                            className="align-items-center justify-content-start"
                          >
                            {!task?.lead[0]?.profilePicture && task?.lead[0]?.name && (
                              <div className="nameTag">
                                <UserIcon
                                  key={index}
                                  firstName={task?.lead[0]?.name || ''}
                                />
                              </div>
                            )}
                            {task?.lead[0]?.profilePicture && (
                              <div
                                className="nameTag"
                                style={{ display: 'contents' }}
                              >
                                <img
                                  style={{
                                    width: '20px',
                                    height: '20px',
                                    borderRadius: '50%',
                                  }}
                                  src={`${task?.lead[0]?.profilePicture}`}
                                  alt="profile"
                                ></img>
                              </div>
                            )}
                            <span> {task?.lead[0]?.name}</span>
                            {!task?.lead[0]?.name && <span> NOT ASSIGNED </span>}
                          </Col>

                          <Col lg={1}>
                            {task?.dueDate && (
                              <Badge bg={new Date(task?.dueDate) < new Date() && !(task?.status === 'COMPLETED') ? 'danger' : 'primary'}>Due {moment(task?.dueDate?.split('T')[0]).format('MMM DD,YYYY')}</Badge>
                              // onClick={() => handleViewDetails(task?._id)}
                            )}
                          </Col>
                        </Row>
                      </div>
                      {(userDetails.id === task?.assignedTo?._id || (userDetails.role === 'LEAD' && (userDetails.id === task?.assignedTo?._id || task?.lead?.includes(userDetails.id) || userDetails.id === task?.createdBy?._id)) || userDetails.role === 'SUPER_ADMIN' || userDetails.role === 'ADMIN') &&
                        !isArchive && (
                          <a
                            style={{
                              float: 'right',
                              color: '#6c757d',
                              cursor: 'pointer',
                              marginRight: '10px',
                              position: 'relative',
                              top: '10px',
                            }}
                            onClick={() => {
                              setSelectedProject()
                              setShowAddTask(true)
                              setSelectedTask(task)
                            }}
                          >
                            <i
                              className="fa fa-pencil-square-o"
                              aria-hidden="true"
                            ></i>
                          </a>
                        )}
                    </li>
                  ))}
                </ul>
              </Accordion.Body>
            </Accordion.Item>
          ))}
          {projects && projects.length === 0 && <p> {isArchive ? 'No Task archived.' : ''} </p>}
        </Accordion>


        {/* ////// */}
        <Offcanvas
          className="Offcanvas-modal"
          style={{ height: '100vh' }}
          show={modalShow}
          placement="end"
          onHide={() => setModalShow(false)}
        >
          <Offcanvas.Header closeButton>
            <Offcanvas.Title> {sectionEditMode ? 'Update Section' : 'Add section'}</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <div className="form-group">
              <label>Section</label>
              <input
                required
                type="text"
                className="form-control"
                maxLength={40}
                value={sectionName}
                onChange={e => setSectionName(e.target.value)}
              />
            </div>
            <div className="text-right">
              {selectedProjectId && sectionName && (
                <Button
                  style={{ marginLeft: '10px' }}
                  className="btn btn-danger mr-3"
                  onClick={() => addSection()}
                >
                  {sectionEditMode ? 'Update Section' : 'Add section'}
                </Button>
              )}

              <Button
                style={{ marginLeft: '5px', color: '#fff' }}
                className="btn btn-light"
                onClick={() => setModalShow(false)}
              >
                Cancel
              </Button>
            </div>
          </Offcanvas.Body>
        </Offcanvas>
        {/* /// */}

        <Modal
          className="confirmation-popup"
          show={deleteSectionModal}
          onHide={() => setDeleteSectionModal(false)}
        >
          <Modal.Header closeButton>
            <Modal.Title>Delete Section</Modal.Title>
          </Modal.Header>
          <Modal.Body className="body_ui">Are you sure you want to delete this section</Modal.Body>
          <Modal.Footer
            className="footer_ui"
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              position: 'inherit',
              width: 'auto',
            }}
          >
            <Button
              variant="secondary"
              onClick={() => setDeleteSectionModal(false)}
            >
              Close
            </Button>
            <Button
              variant="primary"
              onClick={() => deleteSection()}
            >
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>

        <Modal
          className="confirmation-popup"
          show={archiveSectionModal}
          onHide={() => setArchiveSectionModal(false)}
        >
          <Modal.Header closeButton>
            <Modal.Title>Archive Section</Modal.Title>
          </Modal.Header>
          <Modal.Body>Are you sure you want to Archive this section</Modal.Body>
          <Modal.Footer style={{ alignItems: 'center', justifyContent: 'center' }}>
            <Button
              variant="secondary"
              onClick={() => setArchiveSectionModal(false)}
            >
              Close
            </Button>
            <Button
              variant="primary"
              onClick={() => archiveSection()}
              className="text-white"
            >
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>

        {loading ? <Loader /> : null}


      </div>
    </>
  )
}

export default Tasks
