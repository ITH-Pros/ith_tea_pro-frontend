
exports.CONSTENTS = {
    statusList: ["NOT_STARTED", "ONGOING", "COMPLETED", "ONHOLD"],
    priorityList: ["None", "LOW", "REPEATED", "MEDIUM", "HIGH"],
    TASK_GROUPS: ["category", "status", "priority", "assignedTo", "createdBy"],
    ROLES: ["CONTRIBUTOR", "SUPER_ADMIN", "ADMIN", "LEAD"],
	SORTEDBY: ["Date","Time"],
	statusListObj: [{name:"NOT_STARTED", _id: "NOT_STARTED"},{name:"ONGOING", _id: "ONGOING"},{name:"COMPLETED", _id: "COMPLETED"},{name:"ONHOLD", _id: "ONHOLD"} ],
    priorityListObj: [
	{name:"None", _id: "None"},
	{name:"LOW", _id: "LOW"},
	{name:"REPEATED", _id: "REPEATED"},
	{name:"MEDIUM", _id: "MEDIUM"},
	{name:"HIGH", _id: "HIGH"}],
}