const functionDefinitions = {
  respondAsUnauthorized(response) {
    response.writeHead(401, { 'Content-Type': 'application/json' })
    response.end(JSON.stringify({ status: 'FAIL', message: 'Unauthorized' }))
  },
  respondAsFailed(response, message) {
    response.end(JSON.stringify({ status: 'FAIL', message }))
  },
}

export default functionDefinitions
