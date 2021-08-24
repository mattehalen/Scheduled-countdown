const readXlsxFile = require('read-excel-file/node')

function getExcelData(filePath) {
  return readXlsxFile(filePath).then((rows) => {
    return rows
  })
}

module.exports = {
  getExcelData
}