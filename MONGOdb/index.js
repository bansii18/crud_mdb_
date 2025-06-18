const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const path = require('path');

const app = express();
const Order = require('./models/order');

mongoose.connect('mongodb+srv://vraj_10:Atlas123@vrajcluster.f25aaog.mongodb.net/CRUD_db?retryWrites=true&w=majority&appName=vrajcluster', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log(" MongoDB Connected"))
.catch(err => console.error("Connection Error:", err));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get('/', async (req, res) => {
    const { sortBy = 'orderID', sortDir = 'asc', filterOrderID, filterShipName, filterFreight, filterDate } = req.query;

    // Build MongoDB filter query
    let filter = {};
    if (filterOrderID) filter.orderID = Number(filterOrderID);
    if (filterShipName) filter.shipName = new RegExp(filterShipName, 'i');
    if (filterFreight) filter.freight = Number(filterFreight);
    if (filterDate) filter.orderDate = new Date(filterDate);

    // Create sort object
    const sortOptions = {};
    sortOptions[sortBy] = sortDir === 'asc' ? 1 : -1;

    const orders = await Order.find(filter).sort(sortOptions);
    res.render('index', { orders, sortBy, sortDir, filters: { filterOrderID, filterShipName, filterFreight, filterDate } });
});


app.get('/new', (req, res) => {
    res.render('new');
});

app.post('/', async (req, res) => {
    await Order.create(req.body);
    res.redirect('/');
});

app.get('/:id/edit', async (req, res) => {
    const order = await Order.findById(req.params.id);
    res.render('edit', { order });
});

app.put('/:id', async (req, res) => {
    await Order.findByIdAndUpdate(req.params.id, req.body);
    res.redirect('/');
});

app.delete('/:id', async (req, res) => {
    await Order.findByIdAndDelete(req.params.id);
    res.redirect('/');
});

app.listen(3000, () => console.log('Server started at localhost:3000'));