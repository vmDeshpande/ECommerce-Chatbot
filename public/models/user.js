const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    product: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: 'Pending' // You can set a default status if not provided
    }
    // Add more order details as needed
});

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    orders: [orderSchema] // Embed the order schema as an array of orders
});

const User = mongoose.model('User', userSchema);

module.exports = User;
