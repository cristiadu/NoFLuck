// app/routes.js
    var fs = require("fs");
   module.exports = function(app) {

       // server routes ===========================================================
       // handle things like api calls
       // authentication routes

       // sample api route
       app.post('/saveJSON', function(req, res) {
           // save json here
          fs.writeFile("./public/json/picks.json", JSON.stringify(req.body.JSONGenerated, null, 4), function(err) {
              if(err) {
                console.log(err);
              } else {
                console.log("JSON saved to " + "./public/json/picks.json");
              }
          });

          res.sendfile('./public/views/index.html'); // load our public/index.html file
       });

       // route to handle creating goes here (app.post)
       // route to handle delete goes here (app.delete)

       // frontend routes =========================================================
       // route to handle all angular requests
       app.get('*', function(req, res) {
           res.sendfile('./public/views/index.html'); // load our public/index.html file
       });

   };
