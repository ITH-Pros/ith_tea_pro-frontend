import React from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

import {
  Accordion,
  ProgressBar,
  Dropdown,
  Badge,
  OverlayTrigger,
  Tooltip,
  Row,
  Col,
} from "react-bootstrap";

import "../../pages/Tasks/tasks.css";

const TaskSkeleton = () => {
  return (
    <SkeletonTheme color="#f3f3f3" highlightColor="#ecebeb">
    {Array.from({ length: 6 }).map((_, index) => (
      <Accordion.Item >
   
          <Accordion.Header>
            <Skeleton style={{marginRight:'5px'}} height={25} width={200} /> /{" "}
            <Skeleton style={{marginLeft:'5px'}} height={25} width={200} />
          </Accordion.Header>

        <div className="d-flex rightTags pt-2">

            <div>
                <Skeleton style={{ marginTop:'15px' }} borderRadius={5} height={20} width={300} />
            </div>

          <div style={{ position: "absolute", right: "10px", top: "10px" }}>
          <Skeleton style={{ marginTop:'15px' }} borderRadius={5} height={20} width={20} />
          </div>
        </div>
      </Accordion.Item>
    ))}
    </SkeletonTheme>
  );
};

export default TaskSkeleton;
