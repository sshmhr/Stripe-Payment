const express = require('express');
const keys = require('./config/keys');
const stripe = require('stripe')(keys.stripeSecretKey);
const bodyParser=require('body-parser');
const exphbs=require('express-handlebars');
const app = express();

// handlebar middleware

app.engine('handlebars',exphbs({defaultLayout:'main'}));
app.set('view engine','handlebars');

// bodyparser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

// set static folder
app.use(express.static(__dirname + '/public'));


// index route
app.get("/",function(req,res) {
    res.render("index",{
        stripePublishableKey:keys.stripePublishableKey
    });
});

// Charge Route
app.post('/pay', (req, res) => {
    const amount = 50000;

    stripe.customers.create({
            email: req.body.stripeEmail,
            source: req.body.stripeToken
        })
        .then(customer => stripe.charges.create({
            amount:amount,
            description: 'Subscription fee',
            currency: 'inr',
            customer: customer.id
        }))
        .then(charge => res.render('success')).catch(charge => res.render('failure'));
});

const port = process.env.PORT || 5000;
app.listen(port,function(){
console.log("server is running");
});