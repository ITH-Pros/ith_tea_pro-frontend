
exports.getIconClassForStatus = (status) => {
    let className;
    switch (status) {
        case 'COMPLETED':
            className = 'fa fa-check-circle'
            break;
        case 'ONHOLD':
            className = 'fa fa-stop'
            break;
        case 'NOT_STARTED':
            className = 'fa fa-bath'
            break;
        case "ONGOING":
            className = 'fa fa-line-chart'
            break;
        default:
            className = "fa fa-exclamation-circle"
    }
    return className
}
