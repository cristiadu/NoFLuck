$(document).ready(function(){
    $("#makeAnalysis").click(function(){


          $.ajax({
            url: "/getJSON",
            type: "GET",
            success: function(data)
            {
              var matchupsObj = {};
              var auxPick;
              var inversePick;
              for(i = 0; i< data.length;i++)
              {
                for(j = 0;j < data[i].userPicks.length;j++)
                {
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

              $.ajax({
                url: "/saveJSONAnalysis",
                data: JSON.stringify({ JSONGenerated: matchupsObj }),
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
      $.ajax({
        url: "/getJSONAnalysis",
        type: "GET",
        success: function(data){
          $("#analysis").append("<table><tr><td>Team</td></tr>");
          for(i = 0;i< data.length;i++)
          {
            if(i==0)
            {
              $("#analysis").append("<td>")
            }
            for(j = 0; j< data[i].length;j++)
            {

            }
          }
        },
        failure: function(errMsg) {
            alert(errMsg);
        }
      });
    });
});
