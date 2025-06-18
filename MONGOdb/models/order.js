const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    orderID: { type: Number, required: true },
    shipName: { type: String, required: true },
    freight: { type: Number, required: true },
    orderDate: { type: Date}
},
{
    timestamps:true
}
);

module.exports = mongoose.model('order', orderSchema);