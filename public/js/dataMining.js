$(document).ready(function(){
  var jsonGenerated = [];
  var countWeek;
  $("#generateJSON").click(function(){
    countWeek = 0;
    var weekMin = parseInt($("#weekMin").val()) + 51;
    var weekMax = parseInt($("#weekMax").val()) + 51;
    for (weekNumber = weekMin; weekNumber <= weekMax; weekNumber++) {
        $.ajax({
              url: "https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20html%20where%20url%3D%22http%3A%2F%2Fgames.espn.go.com%2Fnfl-pigskin-pickem%2F2015%2Fen%2Fscoresheet%3Fperiod%3D"+weekNumber+"%26groupID%3D90955%22&diagnostics=true",
              success: function(data) {

                // Get Current week from HTML page
                var optionsWeekDiv = getElementsByAttribute(data.getElementsByTagName("body")[0],"div","class","custom-select")[0];
                var week = getElementsByAttribute(optionsWeekDiv,"option","selected","selected")[0];
                var jsonObj = {};
                jsonObj.week = week.innerHTML.split(" ")[1];
                // End of getting week from HTML page

                // Call method to get Which games were played that week
                var tableScoresheet = getElementsByAttribute(data.getElementsByTagName("body")[0],"table","class","tablehead stats2 scoresheet");
                var gamesElements = getElementsByAttribute(tableScoresheet[0],"tr","class","scoresheethead stathead")[0].getElementsByTagName("th");
                gamesOfWeek(gamesElements,jsonObj);
                // Got all games from that specific week


                // Get which player picked which team on a specific week
                var playersAndPicks = tableScoresheet[0].getElementsByTagName("tbody")[0];
                picksOfWeek(playersAndPicks,jsonObj);
                // Got all picks, finished JSON inclusions for this week.


                jsonGenerated.push(jsonObj);

                // To count ajax requests that answered.
                countWeek++;

                if((weekMax - weekMin + 1) == countWeek)
                  saveJSONFile(jsonGenerated);

              }
          });


    }
  });
});

function saveJSONFile(jsonGenerated)
{
  $.ajax({
    url: "/saveJson",
    data: JSON.stringify({ JSONGenerated: jsonGenerated }),
    type: "POST",
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    success: function(data){window.location = "/viewAnalysis"},
    failure: function(errMsg) {
        alert(errMsg);
    }
  });
}

function gamesOfWeek(gamesElements,weekObj)
{
    var obj;
    var jsonObj;
    weekObj.games = [];

    for(i = 2;i < (gamesElements.length -3);i++)
    {
      jsonObj = {};

      obj = gamesElements[i].getElementsByTagName("img")[0].getAttribute("src").split(".png")[0].split("/").pop();
      jsonObj.home = {};
      jsonObj.home.abbrevTeam = obj;
      jsonObj.home.img = gamesElements[i].getElementsByTagName("img")[0].getAttribute("src");
      jsonObj.home.fullTeam = nameTeam(obj);

      obj = gamesElements[i].getElementsByTagName("img")[1].getAttribute("src").split(".png")[0].split("/").pop();
      jsonObj.vis = {};
      jsonObj.vis.abbrevTeam = obj;
      jsonObj.vis.img = gamesElements[i].getElementsByTagName("img")[1].getAttribute("src");
      jsonObj.vis.fullTeam = nameTeam(obj);


      weekObj.games.push(jsonObj);
    }

}

function picksOfWeek(playersAndPicks,weekObj)
{
    var jsonObj;
    var pickObj;
    var aux;
    weekObj.userPicks = [];

    // Catch each player
    obj = playersAndPicks.getElementsByTagName("tr");

    for(i = 0; i < obj.length;i++)
    {
      // Getting user that made picks
      jsonObj = {};
      jsonObj.user = obj[i].getElementsByClassName("games-left")[0].getElementsByTagName("a")[0].innerHTML;

      jsonObj.picks = [];
      aux = obj[i].getElementsByClassName("pick");
      for(j = 0;j< aux.length;j++)
      {
          pickObj = {};

          if(aux[j].getElementsByTagName("img")[0])
            pickObj.pickedTeam = aux[j].getElementsByTagName("img")[0].getAttribute("alt");
          else
            pickObj.pickedTeam = "NONE";

          if(aux[j].getElementsByTagName("span")[0])
            pickObj.resultPick = aux[j].getElementsByTagName("span")[0].getAttribute("class");
          else
            pickObj.resultPick = "---";

          jsonObj.picks.push(pickObj);
      }


      weekObj.userPicks.push(jsonObj);
    }
}

function nameTeam(abbrev)
{
  switch (abbrev) {
    case 'buf':
      return "Buffalo Bills"
      break;
    case 'nyj':
      return "New York Jets"
      break;
    case 'hou':
      return "Houston Texans"
      break;
    case 'jax':
      return "Jaxsonville Jaguars"
      break;
    case 'oak':
      return "Oakland Raiders"
      break;
    case 'dal':
      return "Dallas Cowboys"
      break;
    case 'ari':
      return "Arizona Cardinals"
      break;
    case 'chi':
      return "Chicago Bears"
      break;
    case 'den':
      return "Denver Broncos"
      break;
    case 'tam':
      return "Tampa Bay Buccaneers"
      break;
    case 'sfo':
      return "San Francisco 49ers"
      break;
    case 'nwe':
      return "New England Patriots"
      break;
    case 'stl':
      return "St Louis Rams"
      break;
    case 'was':
      return "Washington Redskins"
      break;
    case 'sdg':
      return "San Diego Chargers"
      break;
    case 'atl':
      return "Atlanta Falcons"
      break;
    case 'pit':
      return "Pittsburg Steelers"
      break;
    case 'ind':
      return "Indianapolis Colts"
      break;
    case 'gnb':
      return "Green Bay Packers"
      break;
    case 'cle':
      return "Cleveland Browns"
      break;
    case 'kan':
      return "Kansas City Chiefs"
      break;
    case 'sea':
      return "Seattle Seahawks"
      break;
    case 'mia':
      return "Miami Dolphins"
      break;
    case 'car':
      return "Carolina Panthers"
      break;
    case 'det':
      return "Detroit Lions"
      break;
    case 'nor':
      return "New Orleans Saints"
      break;
    case 'cin':
      return "Cincinnati Bengals"
      break;
    case 'bal':
      return "Baltimore Ravens"
      break;
    case 'ten':
      return "Tennesee Titans"
      break;
    case 'nyg':
      return "New York Giants"
      break;
    case 'phi':
      return "Philadelphia Eagles"
      break;
    case 'min':
      return "Minnesota Vikings"
      break;
    default:

  }
}

function getElementsByAttribute(xml,tag, attr, attrValue) {
    //Get elements and convert to array
    var elems = Array.prototype.slice.call(xml.getElementsByTagName(tag), 0);

    //Matches an element by its attribute and attribute value
    var matcher = function(el) {
        return el.getAttribute(attr) == attrValue;
    };

    return elems.filter(matcher);
}
