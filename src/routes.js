import { writeFile, readFileSync } from "fs";

export default function (app) {
  app.post('/saveJSON', function (req, res) {
    // save json here
    writeFile("./public/json/picks.json", JSON.stringify(req.body.JSONGenerated, null, 4), function (err) {
      if (err) {
        console.log(err);
      } else {
        console.log("JSON saved to ./public/json/picks.json");
      }
    });

    res.send({ result: 'ok' });
  });

  app.post('/saveJSONAnalysis', function (req, res) {
    // save json here
    writeFile("./public/json/analysis.json", JSON.stringify(req.body.JSONGenerated, null, 4), function (err) {
      if (err) {
        console.log(err);
      } else {
        console.log("JSON saved to " + "./public/json/analysis.json");
      }
    });

    res.send({ result: 'ok' });
  });

  app.get('/getJSON', function (req, res) {
    var picksJSON = loadJSONfile("./public/json/picks.json");
    res.send(picksJSON);
  });

  app.get('/getJSONAnalysis', function (req, res) {
    var analysisJSON = loadJSONfile("./public/json/analysis.json");
    res.send(analysisJSON);
  });

  app.get('/viewAnalysis', function (req, res) {
    res.sendfile('./public/views/analysis.html');
  });

  app.get('/', function (req, res) {
    res.sendfile('./public/views/index.html');
  });
};

function loadJSONfile(filename, encoding) {
  try {
    // default encoding is utf8
    if (typeof (encoding) == 'undefined') encoding = 'utf8';
    var contents = readFileSync(filename, encoding);
    return JSON.parse(contents);

  } catch (err) {
    throw err;
  }
}
