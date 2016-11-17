function webSocket(socket) {
  const responses = {}

  responses.sendBoxScoreSocketResponse = (teams) => {
    const teamsResponseData = []
    teams.forEach((team) => {
      const json = {
        team,
        score: team.score,
      }
      teamsResponseData.push(json)
    })

    const socketRes = { type: 'BOX-SCORE', teams: teamsResponseData }

    socket.clients.forEach((client) => {
      client.send(JSON.stringify(socketRes))
    })
  }

  responses.sendPlayByPlaySocketResponse = (response) => {
    const socketResponse = response
    socketResponse.type = 'PLAY-BY-PLAY'
    socket.clients.forEach((client) => {
      client.send(JSON.stringify(socketResponse))
    })
  }

  return responses
}

export default webSocket
