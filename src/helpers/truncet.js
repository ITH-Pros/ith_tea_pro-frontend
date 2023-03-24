
exports.truncateString = (string , stringLength) => {
    console.log("calling this function")
    return string.length === stringLength ? string : string.slice(0, stringLength) + '...'
}
