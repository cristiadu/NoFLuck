/* eslint-disable no-param-reassign */

function getElementsByAttribute(xml, tag, attr, attrValue) {
  // Get elements and convert to array
  const elems = Array.prototype.slice.call(xml.getElementsByTagName(tag), 0)

  // Matches an element by its attribute and attribute value
  const matcher = (el) => el.getAttribute(attr) === attrValue

  return elems.filter(matcher)
}

function saveJSONFile(jsonGenerated) {
  $.ajax({
    url: '/saveJson',
    data: JSON.stringify({ JSONGenerated: jsonGenerated }),
    type: 'POST',
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
    success() { window.location = '/viewAnalysis' },
    failure(errMsg) {
      console.log(`Error while trying to load analysis: ${errMsg}`)
    },
  })
}

function nameTeam(abbrev) {
  switch (abbrev) {
    case 'buf':
      return 'Buffalo Bills'
    case 'nyj':
      return 'New York Jets'
    case 'hou':
      return 'Houston Texans'
    case 'jax':
      return 'Jaxsonville Jaguars'
    case 'oak':
      return 'Oakland Raiders'
    case 'dal':
      return 'Dallas Cowboys'
    case 'ari':
      return 'Arizona Cardinals'
    case 'chi':
      return 'Chicago Bears'
    case 'den':
      return 'Denver Broncos'
    case 'tam':
      return 'Tampa Bay Buccaneers'
    case 'sfo':
      return 'San Francisco 49ers'
    case 'nwe':
      return 'New England Patriots'
    case 'stl':
      return 'St Louis Rams'
    case 'was':
      return 'Washington Redskins'
    case 'sdg':
      return 'San Diego Chargers'
    case 'atl':
      return 'Atlanta Falcons'
    case 'pit':
      return 'Pittsburg Steelers'
    case 'ind':
      return 'Indianapolis Colts'
    case 'gnb':
      return 'Green Bay Packers'
    case 'cle':
      return 'Cleveland Browns'
    case 'kan':
      return 'Kansas City Chiefs'
    case 'sea':
      return 'Seattle Seahawks'
    case 'mia':
      return 'Miami Dolphins'
    case 'car':
      return 'Carolina Panthers'
    case 'det':
      return 'Detroit Lions'
    case 'nor':
      return 'New Orleans Saints'
    case 'cin':
      return 'Cincinnati Bengals'
    case 'bal':
      return 'Baltimore Ravens'
    case 'ten':
      return 'Tennesee Titans'
    case 'nyg':
      return 'New York Giants'
    case 'phi':
      return 'Philadelphia Eagles'
    case 'min':
      return 'Minnesota Vikings'
    default:
      return ''
  }
}

function gamesOfWeek(gamesElements, weekObj) {
  let obj
  let jsonObj
  weekObj.games = []

  for (let i = 2; i < (gamesElements.length - 3); i += 1) {
    jsonObj = {}

    obj = gamesElements[i].getElementsByTagName('img')[0].getAttribute('src').split('.png')[0].split('/').pop()
    jsonObj.home = {}
    jsonObj.home.abbrevTeam = obj.toUpperCase()
    jsonObj.home.img = gamesElements[i].getElementsByTagName('img')[0].getAttribute('src')
    jsonObj.home.fullTeam = nameTeam(obj)

    obj = gamesElements[i].getElementsByTagName('img')[1].getAttribute('src').split('.png')[0].split('/').pop()
    jsonObj.vis = {}
    jsonObj.vis.abbrevTeam = obj.toUpperCase()
    jsonObj.vis.img = gamesElements[i].getElementsByTagName('img')[1].getAttribute('src')
    jsonObj.vis.fullTeam = nameTeam(obj)

    weekObj.games.push(jsonObj)
  }
}

function picksOfWeek(playersAndPicks, weekObj) {
  let jsonObj
  let pickObj
  let aux
  weekObj.userPicks = []

  // Catch each player
  const obj = playersAndPicks.getElementsByTagName('tr')

  for (let i = 0; i < obj.length; i += 1) {
    // Getting user that made picks
    jsonObj = {}
    jsonObj.user = obj[i].getElementsByClassName('games-left')[0].getElementsByTagName('a')[0].innerHTML

    jsonObj.picks = []
    aux = obj[i].getElementsByClassName('pick')
    for (let j = 0; j < aux.length; j += 1) {
      pickObj = {}

      if (aux[j].getElementsByTagName('img')[0]) {
        pickObj.pickedTeam = aux[j].getElementsByTagName('img')[0].getAttribute('alt')
      } else {
        pickObj.pickedTeam = 'NONE'
      }

      if (aux[j].getElementsByTagName('span')[0]) {
        pickObj.resultPick = (aux[j].getElementsByTagName('span')[0].getAttribute('class') === 'win') ? 'win' : 'loss'
      } else {
        pickObj.resultPick = 'loss'
      }

      jsonObj.picks.push(pickObj)
    }

    weekObj.userPicks.push(jsonObj)
  }
}

/* eslint-disable no-loop-func */
$(document).ready(() => {
  const jsonGenerated = []
  $('#generateJSON').click(() => {
    let countWeek = 0
    const weekMin = 52
    const weekMax = parseInt($('#weekMax').val(), 10) + 51
    for (let weekNumber = weekMin; weekNumber <= weekMax; weekNumber += 1) {
      $.ajax({
        /* eslint-disable max-len */
        url: `https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20html%20where%20url%3D%22http%3A%2F%2Fgames.espn.go.com%2Fnfl-pigskin-pickem%2F2015%2Fen%2Fscoresheet%3Fperiod%3D${weekNumber}%26groupID%3D90955%22&diagnostics=true`,
        /* eslint-enable max-len */
        success(data) {
          // Get Current week from HTML page
          const optionsWeekDiv = getElementsByAttribute(data.getElementsByTagName('body')[0], 'div', 'class', 'custom-select')[0]

          const week = getElementsByAttribute(optionsWeekDiv, 'option', 'selected', 'selected')[0]
          const jsonObj = {};
          /* eslint-disable no-undef */
          [_, jsonObj.week, _] = week.innerHTML.split(' ')
          /* eslint-enable no-undef */
          // End of getting week from HTML page

          // Call method to get Which games were played that week
          const tbScoresheet = getElementsByAttribute(data.getElementsByTagName('body')[0], 'table', 'class', 'tablehead stats2 scoresheet')
          const gamesElem = getElementsByAttribute(tbScoresheet[0], 'tr', 'class', 'scoresheethead stathead')[0].getElementsByTagName('th')
          gamesOfWeek(gamesElem, jsonObj)
          // Got all games from that specific week

          // Get which player picked which team on a specific week
          const playersAndPicks = tbScoresheet[0].getElementsByTagName('tbody')[0]
          picksOfWeek(playersAndPicks, jsonObj)
          // Got all picks, finished JSON inclusions for this week.

          jsonGenerated.push(jsonObj)

          // To count ajax requests that answered.
          countWeek += 1

          if ((weekMax - weekMin + 1) === countWeek) saveJSONFile(jsonGenerated)
        },
        error(err) {
          console.log(`Error while executing YQL: ${err}`)
        },
      })
    }
  })
})
/* eslint-enable no-loop-func */
