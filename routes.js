"use strict";

//require the express module
const express = require("express");

//Creates a new router object
const routes = express.Router();

//Declare cart array
const cartItems = [
	{ id: 1, product: "cereal", price: 2.0, quantity: 4 },
	{ id: 2, product: "milk", price: 3.0, quantity: 2 },
	{ id: 3, product: "chips", price: 1.5, quantity: 1 },
	{ id: 4, product: "cheese", price: 3.0, quantity: 6 },
];
let nextId = 5;

routes.get("/cart-items", (req, res) => {
	const maxPrice = parseInt(req.query.maxPrice);
	const prefix = req.query.prefix;
	const pageSize = req.query.pageSize;

	if (maxPrice) {
		const filteredCart = cartItems.filter((item) => item.price <= maxPrice);
		res.json(filteredCart);
	} else if (prefix) {
		const filteredCart = cartItems.filter((item) => {
			let currentItem = item.product.toLowerCase();
			return currentItem.startsWith(req.query.prefix.toLowerCase());
		});
		res.json(filteredCart);
	} else if (pageSize) {
		const filteredCart = cartItems.filter((item) => item.id <= pageSize);
		res.json(filteredCart);
	} else {
		res.status(200);
		res.json(cartItems);
	}
});

//get one cart-item by id
routes.get("/cart-items/:id", (req, res) => {
	const id = parseInt(req.params.id);
	const item = cartItems.find((item) => item.id === id);
	if (item) {
		res.status(200);
		res.json(item);
	} else {
		res.status(404);
		res.send("ID not Found");
	}
});

//Add item to cart
routes.post("/cart-items", (req, res) => {
	const item = req.body;
	item.id = nextId++;
	cartItems.push(item);

	res.status(201);
	res.json(item);
});

//Update a cart-item
//items[index] = req.body
routes.put("/cart-items/:id", (req, res) => {
	const id = parseInt(req.params.id);
	const item = cartItems.find((item) => item.id === id);
	const newItem = req.body;
	const index = cartItems.findIndex((item) => item.id === id);
	newItem.id = item.id;
	cartItems.push(newItem);
	cartItems.splice(index, 1);
	res.status(200);
	res.json(cartItems);
});

//Delete an item
routes.delete("/cart-items/:id", (req, res) => {
	const id = parseInt(req.params.id);
	const index = cartItems.findIndex((item) => item.id === id);
	if (index !== -1) {
		cartItems.splice(index, 1);
	}
	res.status(204);
	res.send();
});

//Bottom of page
module.exports = routes;
