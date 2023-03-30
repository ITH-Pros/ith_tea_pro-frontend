
exports.Truncate = (string , stringLength) => {
    return string.length === stringLength ? string : string.slice(0, stringLength) + '...'
}
