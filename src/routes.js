import { writeFile, readFileSync } from 'fs'
import path from 'path'

const currentDir = path.dirname(new URL(import.meta.url).pathname)

function loadJSONfile(filename) {
  const contents = readFileSync(filename, 'utf8')
  return JSON.parse(contents)
}

export default function routes(app) {
  app.post('/saveJSON', (req, res) => {
    // save json here
    writeFile('./src/public/json/picks.json', JSON.stringify(req.body.JSONGenerated, null, 4), (err) => {
      if (err) {
        console.log(err)
      } else {
        console.log('JSON saved to ./public/json/picks.json')
      }
    })

    res.send({ result: 'ok' })
  })

  app.post('/saveJSONAnalysis', (req, res) => {
    // save json here
    writeFile('./src/public/json/analysis.json', JSON.stringify(req.body.JSONGenerated, null, 4), (err) => {
      if (err) {
        console.log(err)
      } else {
        console.log('JSON saved to ./public/json/analysis.json')
      }
    })

    res.send({ result: 'ok' })
  })

  app.get('/getJSON', (req, res) => {
    const picksJSON = loadJSONfile('./src/public/json/picks.json')
    res.send(picksJSON)
  })

  app.get('/getJSONAnalysis', (req, res) => {
    const analysisJSON = loadJSONfile('./src/public/json/analysis.json')
    res.send(analysisJSON)
  })

  app.get('/viewAnalysis', (req, res) => {
    res.sendFile(`${currentDir}/public/views/analysis.html`)
  })

  app.get('/', (req, res) => {
    res.sendFile(`${currentDir}/public/views/index.html`)
  })
}
