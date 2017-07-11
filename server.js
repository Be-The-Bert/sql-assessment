const express = require('express')
    , bodyParser = require('body-parser')
    , cors = require('cors')
    , massive = require('massive');

const mainCtrl = require('./mainCtrl'); //I was too lazy to bust out the functions into a ctrl file just for an assessment sorry
const config = require('./config');
const app = express();

app.use(bodyParser.json())
app.use(cors());

// You need to complete the information below to connect
// to the assessbox database on your postgres server.
massive(config.connectionString)
.then( db => {
  app.set('db', db)

  // Initialize user table and vehicle table.
  db.init_tables.user_create_seed().then( response => {
    console.log('User table init');
    db.init_tables.vehicle_create_seed().then( response => {
      console.log('Vehicle table init');
    })
  })

}).catch( err => console.log(err));


// ===== Build enpoints below ============
app.get('/api/users', (req, res) => {
  const db = req.app.get('db');
  db.getUsers().then(users => res.status(200).send(users));
});
app.get('/api/vehicles', (req, res) => {
  const db = req.app.get('db');
  db.getVehicles().then(users => res.status(200).send(users));
});
app.post('/api/users', (req, res) => {
  const db = req.app.get('db');
  db.postUser([req.body.name, req.body.email]).then(user => res.status(200).send(user));
});
app.post('/api/vehicles', (req, res) => {
  const db = req.app.get('db');
  const { make, model, year, owner_id } =req.body;
  db.postVehicle([make, model, year, owner_id]).then(user => res.status(200).send(user));
});
app.get('/api/user/:userId/vehiclecount', (req, res) => {
  const db = req.app.get('db');
  db.getVehicleCount([req.params.userId]).then(count => res.status(200).send(count));
});
app.get('/api/user/:userId/vehicle', (req, res) => {
  const db = req.app.get('db');
  db.getVehiclesByUserId([req.params.userId]).then( vehicles => res.status(200).send(vehicles));
});
app.get('/api/vehicle', (req, res) => {
  const db = req.app.get('db');
  if (req.query.userEmail) {
    db.getVehiclesByEmail([req.query.userEmail]).then( vehicles => res.status(200).send(vehicles));
  } else if (req.query.userFirstStart) {
    db.getVehiclesByLetters([`${req.query.userFirstStart}%`]).then( vehicles => res.status(200).send(vehicles));
  }
});
app.get('/api/newervehiclesbyyear', (req, res) => {
  const db = req.app.get('db');
  db.getNewerVehicles().then(vehicles => res.status(200).send(vehicles));
});
app.put('/api/vehicle/:vehicleId/user/:userId', (req,res) => {
  const db = req.app.get('db');
  const { vehicleId, userId } = req.params;
  db.putNewVehicleOwner([vehicleId, userId]).then(vehicle => res.status(200).send(vehicle));
});
app.delete('/api/user/:userId/vehicle/:vehicleId', (req, res) => {
  const db = req.app.get('db');
  const { userId, vehicleId } = req.params;
  db.deleteVehicleOwnership([userId, vehicleId]).then(vehicle => res.status(200).send(vehicle));
})
app.delete('/api/vehicle/:vehicleId', (req, res) => {
  const db = req.app.get('db');
  db.deleteVehicle([req.params.vehicleId]).then(vehicle => res.status(200).send(vehicle));
})





// ===== Do not change port ===============
app.listen(config.port, () => {
  console.log('Listening on port: ', config.port);
})


  // host: "ec2-50-17-217-166.compute-1.amazonaws.com",
  // port: 5432,
  // database: "d8sic2fjjtn2mt",
  // user: "vrckelegcsebxt",
  // password: "c3186d10cf52840063053be3936d014cc85ba494c8b42f57662894eeeaf0b2dc"