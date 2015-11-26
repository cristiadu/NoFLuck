$(document).ready(function(){

  $.ajax({
    url: "/getJSON",
    type: "GET",
    success: function(data)
    {
      var matrixMatchups = new array(32);
      for(i = 0;i<32;i++)
        matrixMatchups[i] = new array(data[0].picks.length);

      $("#analysis").text(data[0].userPicks.length);

    },
    failure: function(errMsg) {
        alert(errMsg);
    }
  });
});
