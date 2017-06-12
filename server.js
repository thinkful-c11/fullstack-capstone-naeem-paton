const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');

// const {Driver, BrokerShipper} = global.models || (global.models = require('./models'));
const {Driver} = require('./models');
const {BrokerShipper} = require('./models');
const {DATABASE_URL, PORT} = require('./config');

const app = express();


app.use(morgan('common'));
app.use(bodyParser.json());

mongoose.Promise = global.Promise;

app.get('/drivers', (req, res) => {
  console.log(req)
    Driver
      .find()
      //.exec()
      .then(drivers => {
          res.json(drivers.map((driver) => driver.apiRepr()));
      })
      .catch(err => {
          console.error(err);
          res.status(500).json({error: 'our apologies, something went wrong'})
      });
});

app.get('/drivers/:id', (req, res) => {
  Driver
    .findById(req.params.id)
    .exec()
    .then(driver => res.json(driver.apiRepr()))
    .catch(err => {
      console.error(err);
      res.status(500).json({error: 'something went horribly awry'});
    });
});

app.get('/brokershippers', (req, res) => {
  console.log(req)
    BrokerShipper
      .find()
      //.exec()
      .then(brokerShippers => {
          res.json(brokerShippers.map((brokerShipper) => brokerShipper.apiRepr()));
      })
      .catch(err => {
          console.error(err);
          res.status(500).json({error: 'our apologies, something went wrong'})
      });
});

app.get('/brokershippers/:id', (req, res) => {
  BrokerShipper
    .findById(req.params.id)
    .exec()
    .then(brokershipper => res.json(brokershipper.apiRepr()))
    .catch(err => {
      console.error(err);
      res.status(500).json({error: 'something went horribly awry'});
    });
});

app.post('/drivers', (req, res) => {
  const requiredFields = ['driver', 'truck', 'freight', 'phoneNum', 'location'];
  for (let i=0; i<requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`;
      console.error(message);
      return res.status(400).send(message);
    }
  }

  Driver
    .create({
      driver: req.body.driver,
      truck: req.body.truck,
      freight: req.body.freight,
      phoneNum: req.body.phoneNum,
      location: req.body.location
    })
    .then(drivers => res.status(201).json(drivers.apiRepr()))
    .catch(err => {
        console.error(err);
        res.status(500).json({error: 'Something went wrong'});
    });

});

app.post('/brokershippers', (req, res) => {
  const requiredFields = ['companyName', 'phone', 'load'];
  for (let i=0; i<requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`;
      console.error(message);
      return res.status(400).send(message);
    }
  }

  BrokerShipper
    .create({
      companyName: req.body.companyName,
      load: req.body.load,
      phone: req.body.phone,
    })
    .then(brokershipper => res.status(201).json(brokershipper.apiRepr()))
    .catch(err => {
        console.error(err);
        res.status(500).json({error: 'Something went wrong'});
    });

});

app.put('/drivers/:id', (req, res) => {

  if (!(req.params.id && req.body.id === req.body.id)) {
    res.status(400).json({
      error: 'Request path id and request body id values must match'
    });
  }

  const updated = {};
  const updateableFields = ['driver', 'truck', 'freight', 'phoneNum', 'location'];
  updateableFields.forEach(field => {
    if (field in req.body) {
      updated[field] = req.body[field];
    }
  });

  Driver
    .findByIdAndUpdate(req.params.id, {$set: updated}, {new: true})
    .exec()
    .then(updateDriver => res.status(201).json(updateDriver.apiRepr()))
    .catch(err => res.status(500).json({message: 'Something went wrong'}));
});


app.put('/brokershippers/:id', (req, res) => {

  if (!(req.params.id && req.body.id === req.body.id )) {
    res.status(400).json({
      error: 'Request path id and request body id values must match'
    });
  }

  const updated = {};
  const updateableFields = ['phone', 'load'];
  updateableFields.forEach(field => {
    if (field in req.body) {
      updated[field] = req.body[field];
    }
  });

  BrokerShipper
    .findByIdAndUpdate(req.params.id, {$set: updated}, {new: true})
    .exec()
    .then(updateBrokerShipper => res.status(201).json(updateBrokerShipper.apiRepr()))
    .catch(err => res.status(500).json({message: 'Something went wrong'}));
});


app.delete('/drivers/:id', (req, res) => {
  Driver
    .findByIdAndRemove(req.params.id)
    .exec()
    .then(() => {
      console.log(`Deleted driver with id \`${req.params.ID}\``);
      res.status(204).end();
    });
});

app.delete('/brokershippers/:id', (req, res) => {
  BrokerShipper
    .findByIdAndRemove(req.params.id)
    .exec()
    .then(() => {
      console.log(`Deleted broker/shipper with id \`${req.params.ID}\``);
      res.status(204).end();
    });
});



app.use('*', function(req, res) {
  res.status(404).json({message: 'Not Found'});
});

// closeServer needs access to a server object, but that only
// gets created when `runServer` runs, so we declare `server` here
// and then assign a value to it in run
let server;

// this function connects to our database, then starts the server
function runServer(databaseUrl=DATABASE_URL, port=PORT) {
  return new Promise((resolve, reject) => {
    mongoose.connect(databaseUrl, err => {
      if (err) {
        return reject(err);
      }
      server = app.listen(port, () => {
        console.log(`Your app is listening on port ${port}`);
        resolve();
      })
      .on('error', err => {
        mongoose.disconnect();
        reject(err);
      });
    });
  });
}

// this function closes the server, and returns a promise. we'll
// use it in our integration tests later.
function closeServer() {
  return mongoose.disconnect().then(() => {
     return new Promise((resolve, reject) => {
       console.log('Closing server');
       server.close(err => {
           if (err) {
               return reject(err);
           }
           resolve();
       });
     });
  });
}

// if server.js is called directly (aka, with `node server.js`), this block
// runs. but we also export the runServer command so other code (for instance, test code) can start the server as needed.
if (require.main === module) {
  runServer().catch(err => console.error(err));
};

module.exports = {runServer, app, closeServer};