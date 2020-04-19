const stripe = require('stripe')('sk_test_tnLDkmZuXbCMEuidwcGnnDXp');

const stripeMethods = {
  createStripe: (stripeEmail, stripeAccountNumber)=>{
    return stripe.customers.create(
    {email: stripeEmail, metadata:{accountNumber: stripeAccountNumber}},function(err, customer) {return customer;});
    },
  updateStripe: (id, customer)=>{
    let payload = {};
    payload.email = customer.clientEmail;
    payload.name = `${customer.clientFirstName} ${customer.clientMiddleName} ${customer.clientLastName}`;
    payload.phone = customer.clientPhone1;
    stripe.customers.update(id, payload);
  }

};


module.exports = stripeMethods;
