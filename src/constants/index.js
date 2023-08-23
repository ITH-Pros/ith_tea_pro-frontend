export const CONSTANTS = {
  statusList: ["NOT_STARTED", "ONGOING", "COMPLETED", "ONHOLD"],
  priorityList: ["None", "LOW", "REPEATED", "MEDIUM", "HIGH"],
  TASK_GROUPS: ["category", "status", "priority", "assignedTo", "createdBy"],
  ROLES: ["CONTRIBUTOR", "SUPER_ADMIN", "ADMIN", "LEAD", "GUEST"],
  SORTEDBY: ["Date", "Time"],
  MISCTYPE: ["Meeting", "Demo", "Stakeholder meeting", "MOM/Notes", "Others"],
  statusListObj: [
    { name: "NOT_STARTED", _id: "NOT_STARTED" },
    { name: "ONGOING", _id: "ONGOING" },
    { name: "COMPLETED", _id: "COMPLETED" },
    { name: "ONHOLD", _id: "ONHOLD" },
  ],
  priorityListObj: [
    { name: "None", _id: "None" },
    { name: "LOW", _id: "LOW" },
    { name: "REPEATED", _id: "REPEATED" },
    { name: "MEDIUM", _id: "MEDIUM" },
    { name: "HIGH", _id: "HIGH" },
  ],
};

export const CUSTOMSTYLES = {
  option: (provided) => ({
    ...provided,
    padding: 5,
    fontSize: "12px",
  }),

  control: (provided) => ({
    ...provided,
    boxShadow: "none",
    padding: "0px",
    borderRadius: "5px",
    height: "40px",
    color: "#767474",
    margin: "0px",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    width: "100%",
  }),
  placeholder: (provided) => ({
    ...provided,
  }),
  menu: (provided) => ({
    ...provided,
    fontSize: 12,
    borderRadius: "0px 0px 10px 10px",
    boxShadow: "10px 15px 30px rgba(0, 0, 0, 0.05)",
    top: "32px",
    padding: "5px",
    zIndex: "2",
  }),
  valueContainer: (provided) => ({
    ...provided,
    width: "200px",
height:'35px',
    overflowY: "auto",
    padding: "0px 5px",
    fontSize: "12px",
    margin: "0px",
  }),
};
