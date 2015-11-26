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

          res.send({result:'ok'});
       });

       app.get('/viewAnalysis', function(req, res) {
           res.sendfile('./public/views/analysis.html'); // load our public/index.html file
       });

       app.get('/getJSON', function(req, res) {
          var picksJSON = loadJSONfile("./public/json/picks.json");
           res.send(picksJSON);
       });


       app.get('*', function(req, res) {
           res.sendfile('./public/views/index.html'); // load our public/index.html file
       });



   };

   function loadJSONfile (filename, encoding) {
	try {
		// default encoding is utf8
		if (typeof (encoding) == 'undefined') encoding = 'utf8';

		// read file synchroneously
		var contents = fs.readFileSync(filename, encoding);

		// parse contents as JSON
		return JSON.parse(contents);

	} catch (err) {
		// an error occurred
		throw err;
	}
}
