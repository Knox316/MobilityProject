'use strict';
const mongoose = require('mongoose');
const Client = mongoose.model('Clients');
const Rental = mongoose.model('Rentals');

exports.getClients = function(req, res) {
  Client.find({}, function(error, clients) {
    if (error) {
      return res.json(error);
    }
    return res.json(clients);
  });
};

exports.getClientsById = function(req, res) {
  Client.findById(req.params.id, function(err, client) {
    if (err) {
      return res.send(err);
    }
    return res.json(client);
  });
};

exports.updateClient = function(req, res, next) {
  Client.findOneAndUpdate(
    { _id: req.params.id },
    req.body,
    { new: true },
    function(err, client) {
      if (err) res.send(err);
      res.json(client);
    }
  );
};

exports.getClientRentals = async function(req, res) {
  Client.findById(req.params.id, async function(err, evento) {
    if (err) {
      await res.send(err);
    }
    let rentals = await evento.rentals;
    Rental.find({ _id: { $in: rentals } }, async function(err, rental) {
      await res.json(rental);
    });
  });
};

//add new rental
exports.postClientRental = async function(req, res) {
  var newRental = new Rental(req.body);
  newRental
    .save()
    .then(result => {
      res.status(201).jsonp(newRental);
    })
    .catch(err => {
      res.status(500).jsonp({ error: { message: err.message } });
    });
};


//add new client
exports.postClient = async function(req, res) {
  var newClient = new Client(req);
  newClient
    .save()
    .then(result => {
      res.status(201).jsonp(newClient);
    })
    .catch(err => {
      res.status(500).jsonp({ error: { message: err.message } });
    });
};
