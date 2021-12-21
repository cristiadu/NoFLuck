function sortObject(o) {
  const sorted = {}
  const a = []

  o.keys.forEach((key) => {
    if (Object.prototype.hasOwnProperty.call(o, key)) {
      a.push(key)
    }
  })
  a.sort()

  for (let key = 0; key < a.length; key += 1) {
    sorted[a[key]] = o[a[key]]
  }
  return sorted
}

$(document).ready(() => {
  $('#analysis').hide()
  $('#makeAnalysis').click(() => {
    $.ajax({
      url: '/getJSON',
      type: 'GET',
      success(data) {
        const matchupsObj = {}
        const teams = {}
        const users = []
        const numberOfWeeks = data.length
        let auxPick
        let inversePick

        for (let c = 0; c < data.length; c += 1) {
          if (data[c].week === 1) {
            for (let y = 0; y < data[c].games.length; y += 1) {
              teams[data[c].games[y].home.abbrevTeam] = data[c].games[y].home
              teams[data[c].games[y].vis.abbrevTeam] = data[c].games[y].vis
            }
          }
        }

        for (let i = 0; i < data.length; i += 1) {
          for (let j = 0; j < data[i].userPicks.length; j += 1) {
            if (i === 0) {
              users.push(data[i].userPicks[j].user)
            }

            for (let k = 0; k < data[i].userPicks[j].picks.length; k += 1) {
              auxPick = null
              inversePick = null
              auxPick = data[i].userPicks[j].picks[k]

              if (auxPick.pickedTeam === 'NONE') {
                inversePick = 'NONE'
              } else if (data[i].games[k].home.abbrevTeam === auxPick.pickedTeam) {
                inversePick = data[i].games[k].vis
              } else {
                inversePick = data[i].games[k].home
              }

              if (!matchupsObj[auxPick.pickedTeam]) {
                matchupsObj[auxPick.pickedTeam] = {}
                matchupsObj[auxPick.pickedTeam][data[i].userPicks[j].user] = {}

                matchupsObj[auxPick.pickedTeam][data[i].userPicks[j].user].win = 0
                matchupsObj[auxPick.pickedTeam][data[i].userPicks[j].user].loss = 0
                matchupsObj[auxPick.pickedTeam][data[i].userPicks[j].user].pickedAgainstAndWon = 0
                matchupsObj[auxPick.pickedTeam][data[i].userPicks[j].user].pickedAgainstAndLost = 0
              } else if (!matchupsObj[auxPick.pickedTeam][data[i].userPicks[j].user]) {
                matchupsObj[auxPick.pickedTeam][data[i].userPicks[j].user] = {}

                matchupsObj[auxPick.pickedTeam][data[i].userPicks[j].user].win = 0
                matchupsObj[auxPick.pickedTeam][data[i].userPicks[j].user].loss = 0
                matchupsObj[auxPick.pickedTeam][data[i].userPicks[j].user].pickedAgainstAndWon = 0
                matchupsObj[auxPick.pickedTeam][data[i].userPicks[j].user].pickedAgainstAndLost = 0
              }

              if (inversePick !== 'NONE') {
                if (!matchupsObj[inversePick.abbrevTeam]) {
                  matchupsObj[inversePick.abbrevTeam] = {}
                  matchupsObj[inversePick.abbrevTeam][data[i].userPicks[j].user] = {}

                  matchupsObj[inversePick.abbrevTeam][data[i].userPicks[j].user].win = 0
                  matchupsObj[inversePick.abbrevTeam][data[i].userPicks[j].user].loss = 0
                  matchupsObj[inversePick.abbrevTeam][data[i].userPicks[j].user].pickedAgainstAndWon = 0
                  matchupsObj[inversePick.abbrevTeam][data[i].userPicks[j].user].pickedAgainstAndLost = 0
                } else if (!matchupsObj[inversePick.abbrevTeam][data[i].userPicks[j].user]) {
                  matchupsObj[inversePick.abbrevTeam][data[i].userPicks[j].user] = {}

                  matchupsObj[inversePick.abbrevTeam][data[i].userPicks[j].user].win = 0
                  matchupsObj[inversePick.abbrevTeam][data[i].userPicks[j].user].loss = 0
                  matchupsObj[inversePick.abbrevTeam][data[i].userPicks[j].user].pickedAgainstAndWon = 0
                  matchupsObj[inversePick.abbrevTeam][data[i].userPicks[j].user].pickedAgainstAndLost = 0
                }
              }

              if (auxPick.resultPick === 'loss') {
                matchupsObj[auxPick.pickedTeam][data[i].userPicks[j].user].loss += 1
                if (auxPick.pickedTeam !== 'NONE') {
                  matchupsObj[inversePick.abbrevTeam][data[i].userPicks[j].user].pickedAgainstAndLost += 1
                }
              } else {
                matchupsObj[auxPick.pickedTeam][data[i].userPicks[j].user].win += 1
                matchupsObj[inversePick.abbrevTeam][data[i].userPicks[j].user].pickedAgainstAndWon += 1
              }
            }
          }
        }

        const wholeJSONObj = {
          teams, users, data: matchupsObj, numberOfWeeks,
        }
        $.ajax({
          url: '/saveJSONAnalysis',
          data: JSON.stringify({ JSONGenerated: wholeJSONObj }),
          type: 'POST',
          contentType: 'application/json; charset=utf-8',
          dataType: 'json',
          failure(errMsg) {
            console.log(`Error while trying to save analysis ${errMsg}`)
          },
        })
      },
      failure(errMsg) {
        console.log(`Error while trying to retrieve JSON data ${errMsg}`)
      },
    })
  })

  $('#showAnalysis').click(() => {
    let winHTML = ''
    let lossHTML = ''
    let againstWinHTML = ''
    let againstLossHTML = ''
    let effectiveHTML = ''
    $.ajax({
      url: '/getJSONAnalysis',
      type: 'GET',
      success(data) {
        const sortedTeams = sortObject(data.teams)
        const sortedPicks = sortObject(data.data)
        const sortedUsers = sortObject(data.users)
        let percentageEffective = 0
        let allGames = 0
        const weeksHigh = Math.floor((data.numberOfWeeks - 1) * 0.7)
        const weeksMedium = Math.floor((data.numberOfWeeks - 1) * 0.4)
        effectiveHTML += "<br/><table class='table table-striped table-bordered table-centered-elements'><tr><td>User</td>"
        winHTML += "<br/><table class='table table-striped table-bordered table-centered-elements'><tr><td>User</td>"
        lossHTML += "<br/><table class='table table-striped table-bordered table-centered-elements'><tr><td>User</td>"
        againstWinHTML += "<br/><table class='table table-striped table-bordered table-centered-elements'><tr><td>User</td>"
        againstLossHTML += "<br/><table class='table table-striped table-bordered table-centered-elements'><tr><td>User</td>"

        sortedTeams.values.forEach((i) => {
          effectiveHTML += `<td><img src='${data.teams[i].img}'/></td>`
          winHTML += `<td><img src='${data.teams[i].img}'/></td>`
          lossHTML += `<td><img src='${data.teams[i].img}'/></td>`
          againstWinHTML += `<td><img src='${data.teams[i].img}'/></td>`
          againstLossHTML += `<td><img src='${data.teams[i].img}'/></td>`
        })

        effectiveHTML += '</tr>'
        winHTML += '</tr>'
        lossHTML += '</tr>'
        againstWinHTML += '</tr>'
        againstLossHTML += '</tr>'

        sortedUsers.values.forEach((k) => {
          effectiveHTML += `<tr><td>${sortedUsers[k]}</td>`
          winHTML += `<tr><td>${sortedUsers[k]}</td>`
          lossHTML += `<tr><td>${sortedUsers[k]}</td>`
          againstWinHTML += `<tr><td>${sortedUsers[k]}</td>`
          againstLossHTML += `<tr><td>${sortedUsers[k]}</td>`

          sortedPicks.values.forEach((i) => {
            if (i === 'NONE') {
              return
            }

            allGames = sortedPicks[i][sortedUsers[k]].win
              + sortedPicks[i][sortedUsers[k]].pickedAgainstAndWon
              + sortedPicks[i][sortedUsers[k]].loss
              + sortedPicks[i][sortedUsers[k]].pickedAgainstAndLost

            percentageEffective = (sortedPicks[i][sortedUsers[k]].win + sortedPicks[i][sortedUsers[k]].pickedAgainstAndWon) / allGames
            if (percentageEffective >= 0.8) {
              effectiveHTML += `<td class='success'>${Math.round(percentageEffective * 100)}%</td>`
            } else if (percentageEffective >= 0.6) {
              effectiveHTML += `<td class='warning'>${Math.round(percentageEffective * 100)}%</td>`
            } else if (percentageEffective <= 0.3) {
              effectiveHTML += `<td class='danger'>${Math.round(percentageEffective * 100)}%</td>`
            } else {
              effectiveHTML += `<td>${Math.round(percentageEffective * 100)}%</td>`
            }

            if (weeksHigh <= sortedPicks[i][sortedUsers[k]].win) {
              winHTML += `<td class='success'>${sortedPicks[i][sortedUsers[k]].win}</td>`
            } else if (weeksMedium <= sortedPicks[i][sortedUsers[k]].win) {
              winHTML += `<td class='warning'>${sortedPicks[i][sortedUsers[k]].win}</td>`
            } else {
              winHTML += `<td>${sortedPicks[i][sortedUsers[k]].win}</td>`
            }

            if (weeksHigh <= sortedPicks[i][sortedUsers[k]].loss) {
              lossHTML += `<td class='danger'>${sortedPicks[i][sortedUsers[k]].loss}</td>`
            } else if (weeksMedium <= sortedPicks[i][sortedUsers[k]].loss) {
              lossHTML += `<td class='warning'>${sortedPicks[i][sortedUsers[k]].loss}</td>`
            } else {
              lossHTML += `<td>${sortedPicks[i][sortedUsers[k]].loss}</td>`
            }

            if (weeksHigh <= sortedPicks[i][sortedUsers[k]].pickedAgainstAndWon) {
              againstWinHTML += `<td class='success'>${sortedPicks[i][sortedUsers[k]].pickedAgainstAndWon}</td>`
            } else if (weeksMedium <= sortedPicks[i][sortedUsers[k]].pickedAgainstAndWon) {
              againstWinHTML += `<td class='warning'>${sortedPicks[i][sortedUsers[k]].pickedAgainstAndWon}</td>`
            } else {
              againstWinHTML += `<td>${sortedPicks[i][sortedUsers[k]].pickedAgainstAndWon}</td>`
            }

            if (weeksHigh <= sortedPicks[i][sortedUsers[k]].pickedAgainstAndLost) {
              againstLossHTML += `<td class='danger'>${sortedPicks[i][sortedUsers[k]].pickedAgainstAndLost}</td>`
            } else if (weeksMedium <= sortedPicks[i][sortedUsers[k]].pickedAgainstAndLost) {
              againstLossHTML += `<td class='warning'>${sortedPicks[i][sortedUsers[k]].pickedAgainstAndLost}</td>`
            } else {
              againstLossHTML += `<td>${sortedPicks[i][sortedUsers[k]].pickedAgainstAndLost}</td>`
            }
          })

          effectiveHTML += '</tr>'
          winHTML += '</tr>'
          lossHTML += '</tr>'
          againstWinHTML += '</tr>'
          againstLossHTML += '</tr>'
        })

        effectiveHTML += '</table>'
        winHTML += '</table>'
        lossHTML += '</table>'
        againstWinHTML += '</table>'
        againstLossHTML += '</table>'

        $('#effective').html(effectiveHTML)
        $('#pickWin').html(winHTML)
        $('#pickLoss').html(lossHTML)
        $('#pickedAgainstAndWon').html(againstWinHTML)
        $('#pickedAgainstAndLost').html(againstLossHTML)

        $('#analysis').show()
      },
      failure(errMsg) {
        console.log(`Error while trying to retrieve analysis ${errMsg}`)
      },
    })
  })
})
