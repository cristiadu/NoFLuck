$(document).ready(function(){
    $("#makeAnalysis").click(function(){


          $.ajax({
            url: "/getJSON",
            type: "GET",
            success: function(data)
            {
              var matchupsObj = {};
              var teams = {};
              var users = [];
              var auxPick;
              var inversePick;

              for(c = 0;c<data[0].games.length;c++)
              {
                teams[data[0].games[c].home.abbrevTeam] = data[0].games[c].home;
                teams[data[0].games[c].vis.abbrevTeam] = data[0].games[c].vis;

              }

              for(i = 0; i< data.length;i++)
              {
                for(j = 0;j < data[i].userPicks.length;j++)
                {
                   if(i==0)
                     users.push(data[i].userPicks[j].user);

                   for(k = 0; k < data[i].userPicks[j].picks.length;k++)
                   {
                     auxPick = null;
                     inversePick = null;
                     auxPick = data[i].userPicks[j].picks[k];

                    if (auxPick.pickedTeam == "NONE")
                       inversePick = "NONE";
                    else if(data[i].games[k].home.abbrevTeam == auxPick.pickedTeam)
                        inversePick = data[i].games[k].vis;
                    else
                        inversePick = data[i].games[k].home;

                     if(!matchupsObj[auxPick.pickedTeam])
                     {
                       matchupsObj[auxPick.pickedTeam] = {};
                       matchupsObj[auxPick.pickedTeam][data[i].userPicks[j].user] = {};

                       matchupsObj[auxPick.pickedTeam][data[i].userPicks[j].user].win = 0
                       matchupsObj[auxPick.pickedTeam][data[i].userPicks[j].user].loss = 0;
                       matchupsObj[auxPick.pickedTeam][data[i].userPicks[j].user].pickedAgainstAndWon = 0
                       matchupsObj[auxPick.pickedTeam][data[i].userPicks[j].user].pickedAgainstAndLost = 0;

                     }
                     else if(!matchupsObj[auxPick.pickedTeam][data[i].userPicks[j].user])
                     {
                       matchupsObj[auxPick.pickedTeam][data[i].userPicks[j].user] = {};

                       matchupsObj[auxPick.pickedTeam][data[i].userPicks[j].user].win = 0
                       matchupsObj[auxPick.pickedTeam][data[i].userPicks[j].user].loss = 0;
                       matchupsObj[auxPick.pickedTeam][data[i].userPicks[j].user].pickedAgainstAndWon = 0
                       matchupsObj[auxPick.pickedTeam][data[i].userPicks[j].user].pickedAgainstAndLost = 0;

                     }

                     if(inversePick != "NONE")
                     {

                         if(!matchupsObj[inversePick.abbrevTeam])
                         {
                           matchupsObj[inversePick.abbrevTeam] = {};
                           matchupsObj[inversePick.abbrevTeam][data[i].userPicks[j].user] = {};

                           matchupsObj[inversePick.abbrevTeam][data[i].userPicks[j].user].win = 0
                           matchupsObj[inversePick.abbrevTeam][data[i].userPicks[j].user].loss = 0;
                           matchupsObj[inversePick.abbrevTeam][data[i].userPicks[j].user].pickedAgainstAndWon = 0
                           matchupsObj[inversePick.abbrevTeam][data[i].userPicks[j].user].pickedAgainstAndLost = 0;

                         }
                         else if(!matchupsObj[inversePick.abbrevTeam][data[i].userPicks[j].user])
                         {
                           matchupsObj[inversePick.abbrevTeam][data[i].userPicks[j].user] = {};

                           matchupsObj[inversePick.abbrevTeam][data[i].userPicks[j].user].win = 0
                           matchupsObj[inversePick.abbrevTeam][data[i].userPicks[j].user].loss = 0;
                           matchupsObj[inversePick.abbrevTeam][data[i].userPicks[j].user].pickedAgainstAndWon = 0
                           matchupsObj[inversePick.abbrevTeam][data[i].userPicks[j].user].pickedAgainstAndLost = 0;

                         }


                     }

                     if(auxPick.resultPick == "loss")
                     {
                       matchupsObj[auxPick.pickedTeam][data[i].userPicks[j].user].loss++;
                       if(auxPick.pickedTeam != "NONE")
                         matchupsObj[inversePick.abbrevTeam][data[i].userPicks[j].user].pickedAgainstAndLost++;

                     }
                     else
                     {
                       matchupsObj[auxPick.pickedTeam][data[i].userPicks[j].user].win++;
                       matchupsObj[inversePick.abbrevTeam][data[i].userPicks[j].user].pickedAgainstAndWon++;
                     }
                   }
                }
              }

              var wholeJSONObj = {'teams': teams,'users': users,'data': matchupsObj};
              $.ajax({
                url: "/saveJSONAnalysis",
                data: JSON.stringify({ JSONGenerated: wholeJSONObj }),
                type: "POST",
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function(data){/*window.location = "/viewAnalysis"*/},
                failure: function(errMsg) {
                    alert(errMsg);
                }
              });

            },
            failure: function(errMsg) {
                alert(errMsg);
            }
          });

    });


    $("#showAnalysis").click(function(){
      var appendHTML ="";
      $.ajax({
        url: "/getJSONAnalysis",
        type: "GET",
        success: function(data){
          appendHTML += "<table border='1' cellpadding='2'><tr><td>Team</td>";
          for(i = 0;i< data['users'].length;i++)
            appendHTML += "<td>"+data['users'][i]+"</td>";

          appendHTML+="</tr>";

          for(i in data['data'])
          {
            if(i == "NONE")
              continue;

              if(!data['teams'][i])
                alert(i);

              appendHTML+="<tr><td>"+data['teams'][i]+"</td>";

            for(j in data['data'][i])
            {
               appendHTML +="<td>"+data['data'][i][j].win+"</td>"
            }

            appendHTML+="</tr>";
          }
          appendHTML+= "</table>";
          $("#analysis").html(appendHTML);
          
  
        },
        failure: function(errMsg) {
            alert(errMsg);
        }
      });
    });
});
