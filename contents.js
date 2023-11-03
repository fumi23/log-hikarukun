function queryDataCellsInColumn(column) {
  const selector = `tbody tr td:nth-of-type(${column})`
  return document.querySelectorAll(selector)
}

function generateCallback({ timestamp, modifier }) {
  let prevTimestamp = NaN
  return function(node) {
    const currentTimestamp = timestamp(node)
    const elapsed = currentTimestamp - prevTimestamp
    modifier(node, elapsed)
    prevTimestamp = currentTimestamp
  }
}

const nodeList = queryDataCellsInColumn(2)
const callback = generateCallback({
  timestamp(node) {
    return Date.parse(node.textContent)
  },
  modifier(node, elapsed) {
    const alpha = Math.log1p(elapsed) / Math.log(1024)
    node.style.backgroundColor = `hsla(50, 100%, 50%, ${alpha})`
    node.title = `${elapsed}ms`
  }
})
nodeList.forEach(callback)
