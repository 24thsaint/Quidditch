let currentPlayer
let currentButton

function goal() {
  $.ajax({
    url: `${location.protocol}//${window.location.host}/game/${$('#gameId').val()}/chaser/goal/123`,
    type: 'POST',
    data: JSON.stringify({ chaser: currentPlayer }),
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
    success(response) {
      const notif = document.getElementById('notification')
      if (response.status === 'OK') {
        document.getElementById(response.teamId).innerHTML = response.score
        notif.className = ''
        notif.className = 'alert alert-success'
        $('#notification').fadeIn()
        $('#notification').html(`<b>Goal!</b> ${response.player} scored a goal for ${response.team}.`)
        $('#notification').delay(2000).slideUp()
      } else {
        notif.className = ''
        notif.className = 'alert alert-danger'
        $('#notification').fadeIn()
        $('#notification').html(`<b>Warning!</b> ${response.message}.`)
        $('#notification').delay(2000).slideUp()
      }
    },
  })
}

function miss() {
  $.ajax({
    url: `${location.protocol}//${window.location.host}/game/${$('#gameId').val()}/chaser/miss/123`,
    type: 'POST',
    data: JSON.stringify({ chaser: currentPlayer }),
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
    success(response) {
      const notif = document.getElementById('notification')
      if (response.status === 'OK') {
        notif.className = ''
        notif.className = 'alert alert-warning'
        $('#notification').fadeIn()
        $('#notification').html(`<b>Missed!</b> ${response.player} missed a goal.`)
        $('#notification').delay(2000).slideUp()
      } else {
        notif.className = ''
        notif.className = 'alert alert-danger'
        $('#notification').fadeIn()
        $('#notification').html(`<b>Warning!</b> ${response.message}.`)
        $('#notification').delay(2000).slideUp()
      }
    },
  })
}

function block() {
  $.ajax({
    url: `${location.protocol}//${window.location.host}/game/${$('#gameId').val()}/keeper/block/123`,
    type: 'POST',
    data: JSON.stringify({ keeper: currentPlayer }),
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
    success(response) {
      const notif = document.getElementById('notification')
      if (response.status === 'OK') {
        notif.className = ''
        notif.className = 'alert alert-info'
        $('#notification').fadeIn()
        $('#notification').html(`<b>Blocked!</b> ${response.player} blocked an attempted goal.`)
        $('#notification').delay(2000).slideUp()
      } else {
        notif.className = ''
        notif.className = 'alert alert-danger'
        $('#notification').fadeIn()
        $('#notification').html(`<b>Warning!</b> ${response.message}.`)
        $('#notification').delay(2000).slideUp()
      }
    },
  })
}

function end() {
  $.ajax({
    url: `${location.protocol}//${window.location.host}/game/${$('#gameId').val()}/seeker/catchSnitch/123`,
    type: 'POST',
    data: JSON.stringify({ seeker: currentPlayer }),
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
    success(response) {
      const notif = document.getElementById('notification')
      if (response.status === 'OK') {
        document.getElementById(response.teamId).innerHTML = response.score
        notif.className = ''
        notif.className = 'alert alert-success'
        $('#notification').fadeIn()
        $('#notification').html(`<b>GAME ENDED ON ${new Date(response.endTime).toLocaleString()}!</b> Snitch was caught by ${response.player}.`)
      } else {
        notif.className = ''
        notif.className = 'alert alert-danger'
        $('#notification').fadeIn()
        $('#notification').html(`<b>Warning!</b> ${response.message}.`)
        $('#notification').delay(2000).slideUp()
      }
    },
  })
}

function snitchAppeared() {
  $.ajax({
    url: `${location.protocol}//${window.location.host}/game/${$('#gameId').val()}/snitch/appeared/123`,
    type: 'POST',
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
    success(response) {
      const notif = document.getElementById('notification')
      if (response.status === 'OK') {
        notif.className = ''
        notif.className = 'alert alert-info'
        $('#notification').fadeIn()
        $('#notification').html(`<b>Snitch has appeared</b> on <br /> ${new Date(response.appearanceDate).toLocaleString()}`)
        $('#notification').delay(2000).slideUp()
      } else {
        notif.className = ''
        notif.className = 'alert alert-danger'
        $('#notification').fadeIn()
        $('#notification').html(`<b>Warning!</b> ${response.message}.`)
        $('#notification').delay(2000).slideUp()
      }
    },
  })
}

function select(button, player) {
  if (currentButton !== undefined) {
    currentButton.className = ''
    currentButton.className = 'btn btn-default'
  }
  currentPlayer = player
  currentButton = button
  button.className = ''
  button.className = 'btn btn-primary'
}
