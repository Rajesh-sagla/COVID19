const express = require('express')
const path = require('path')
const app = express()
const {open} = require('sqlite')
const sqlite3 = require('sqlite3')
let db = null
app.use(express.json())
const dbpath = path.join(__dirname, 'covid19India.db')
let intializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbpath,
      driver: sqlite3.Database,
    })
    app.listen(3000, () => {
      console.log('Server Running...')
    })
  } catch (e) {
    console.log(`error is : ${e.message}`)
  }
}
intializeDBAndServer()
//1.GET STATES
app.get('/states/', async (request, response) => {
  let getStatesQuery = `SELECT * FROM state`
  let getStates = await db.all(getStatesQuery)
  response.send(getStates)
})
//2.GET statesid
app.get('/states/:stateId/', async (request, response) => {
  let {stateId} = request.params
  let getStateQuery = `SELECT * FROM state where state_id=?`
  let getState = await db.get(getStateQuery, [stateId])
  response.send(getState)
})
//3.post
app.post('/districts/', async (request, response) => {
  let districtDetails = request.body
  let {districtName, stateId, cases, cured, active, deaths} = districtDetails
  let insertDistrictQuery = `INSERT INTO district (distict_name,state_id,cases,cured,active,deaths) VALUES (?,?,?,?,?,?);`
  let insertDistrict = await db.run(insertDistrictQuery, [
    districtName,
    stateId,
    cases,
    cured,
    active,
    deaths,
  ])
  response.send('District Successfully Added')
})
