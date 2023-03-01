import { useEffect, useState } from "react";
import { Button, Col, Form, Modal, Row } from "react-bootstrap";
import { useLocalStorage } from "../../../auth/useLocalStorage";
import Loader from "../../../components/Loader";
import { CONSTENTS } from "../../../constents";
import "./filter.css"

const FilterModal = (props) => {
    const { selectedProject, setTaskFilters } = props

    const statusList = CONSTENTS.statusList
    const priorityList = CONSTENTS.priorityList
    const groupByList = CONSTENTS.TASK_GROUPS
    const filterFormFileds = { createdBy: '', assignedTo: '', category: '', priority: '', status: '', groupBy: '' }

    const [loading, setLoading] = useState(false);
    const [filterModalShow, setFilterModalShow] = useState(false);
    const [localStorageTaskFilters, setLocalStorageTaskFilters] = useLocalStorage("taskFilters");
    const [filterFormValue, setFilterFormValue] = useState(filterFormFileds);

    useEffect(() => {
        if (localStorageTaskFilters) {
            setFilterFormValue(localStorageTaskFilters)
        }
    }, [])


    const updateFilterFormValue = (e) => {
        setFilterFormValue({ ...filterFormValue, [e.target.name]: e.target.value })
    }
    const closeModalAndgetAllTaskOfProject = () => {
        //TODO
        setLocalStorageTaskFilters(filterFormValue)
        setTaskFilters(filterFormValue)
    }
    const clearFilterFormValue = () => {
        console.log('key pressed')

        setFilterFormValue(filterFormFileds)
        setLocalStorageTaskFilters(filterFormFileds)
        setTaskFilters(filterFormFileds)
    }

    return (
      <>
        {/* <button className='btn btn-gradient-border btn-glow' onClick={() => setFilterModalShow(true)} style={{ float: "left" }} > Filter </button > */}
        {/* <Button
                className="btnDanger"
                type="button"
                onClick={clearFilterFormValue}
            >
                Clear Filter
            </Button> */}
        <div className="filter-main-tag">
          <div>
            <img
              style={{
                width: "18px",
                height: "18px",
                marginRight: "2px",
                cursor: "pointer",
              }}
              src={require("../../../assests/img/filter.png")}
              alt="filter"
            />
            <span onClick={clearFilterFormValue} className="filter-task-tag">
              Filter
            </span>
          </div>
          <div>
            <img
              style={{
                width: "18px",
                height: "18px",
                marginRight: "2px",
                cursor: "pointer",
              }}
              src={require("../../../assests/img/removeFilter.jpg")}
              alt="filter"
            />
            <span className="filter-task-tag"> Clear Filter</span>
          </div>

          <Button
            className="addTaskBtn"
            type="button"
          >
            Add Task
          </Button>
        </div>
        {
          <Modal
            show={filterModalShow}
            onHide={() => setFilterModalShow(false)}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            backdrop="static"
          >
            <Modal.Header closeButton>
              <Modal.Title id="contained-modal-title-vcenter">
                Task Filter
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form noValidate>
                <Row className="mb-3">
                  <Form.Group as={Col} md="3">
                    <Form.Control
                      as="select"
                      type="select"
                      name="createdBy"
                      onChange={updateFilterFormValue}
                      value={filterFormValue.createdBy}
                    >
                      <option value="">Created By</option>
                      {selectedProject?.accessibleBy?.map((user) => (
                        <option value={user._id} key={user._id}>
                          {user.name}
                        </option>
                      ))}
                    </Form.Control>
                  </Form.Group>
                  <Form.Group as={Col} md="3">
                    <Form.Control
                      as="select"
                      type="select"
                      name="assignedTo"
                      onChange={updateFilterFormValue}
                      value={filterFormValue.assignedTo}
                    >
                      <option value="">User Assigned</option>
                      {selectedProject?.accessibleBy?.map((user) => (
                        <option value={user._id} key={user._id}>
                          {user.name}
                        </option>
                      ))}
                    </Form.Control>
                  </Form.Group>
                  <Form.Group as={Col} md="3">
                    <Form.Control
                      as="select"
                      type="select"
                      name="category"
                      onChange={updateFilterFormValue}
                      value={filterFormValue.category}
                    >
                      <option value="">Category</option>
                      {selectedProject?.categories?.map((category) => (
                        <option value={category} key={category}>
                          {category}
                        </option>
                      ))}
                    </Form.Control>
                  </Form.Group>
                  <Form.Group as={Col} md="3">
                    <Form.Control
                      as="select"
                      type="select"
                      name="priority"
                      onChange={updateFilterFormValue}
                      value={filterFormValue.priority}
                    >
                      <option value="">Priority</option>
                      {priorityList?.map((priority) => (
                        <option value={priority} key={priority}>
                          {priority}
                        </option>
                      ))}
                    </Form.Control>
                  </Form.Group>
                </Row>
                <Row className="mb-3">
                  <Form.Group as={Col} md="3">
                    <Form.Control
                      as="select"
                      type="select"
                      name="status"
                      onChange={updateFilterFormValue}
                      value={filterFormValue.status}
                    >
                      <option value="">Status</option>
                      {statusList?.map((status) => (
                        <option value={status} key={status}>
                          {status}
                        </option>
                      ))}
                    </Form.Control>
                  </Form.Group>

                  <Form.Group as={Col} md="3">
                    <Form.Control
                      as="select"
                      type="select"
                      name="groupBy"
                      onChange={updateFilterFormValue}
                      value={filterFormValue.groupBy}
                    >
                      <option value="">Group By</option>
                      {groupByList?.map((group) => (
                        <option value={group} key={group}>
                          {group}
                        </option>
                      ))}
                    </Form.Control>
                  </Form.Group>

                  <Button
                    as={Col}
                    md="2"
                    className="btnDanger"
                    type="submit"
                  >
                    Clear Filter
                  </Button>
                </Row>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <button
                className="btn btn-gradient-border"
                onClick={() => setFilterModalShow(false)}
              >
                Close
              </button>
              <button
                className="btn btn-gradient-border"
                onClick={closeModalAndgetAllTaskOfProject}
              >
                Search
              </button>
            </Modal.Footer>
          </Modal>
        }

        {loading && <Loader />}
      </>
    );
}

export default FilterModal;