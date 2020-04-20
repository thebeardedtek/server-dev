const express = require('express');
const path = require('path');
const passwordHash = require('password-hash');
const session = require('express-session');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const app = express();
const router = express.Router();
const Schema = mongoose.Schema;
const mongoDB = 'mongodb://localhost:27017/admin';
const jwt = require('jsonwebtoken');
const fs = require('fs');
const multer = require('multer');
const getMenuSchema = require('./schemas/menu-schema');
const getPortfolioSchemas = require('./schemas/portfolio-schema');
const getAuthSchemas = require('./schemas/auth-schema');
const getDocumentsSchema = require('./schemas/documents-schema');
const getBannerSchema = require('./schemas/banner-schema');
const getContactFormSchema = require('./schemas/contact-form-schema');
const getPageHeaderSchemas = require('./schemas/page-header-schema');
const getPricingSchema = require('./schemas/pricing-schema');
const getProjectsSchema = require('./schemas/projects-schema');
const getProjectStatusSchema = require('./schemas/project-status-schema');
const getCoursesSchema = require('./schemas/courses-schema');
const getBillingSchema = require('./schemas/billing-schema');
const getHistorySchema = require('./schemas/history-schema');
// STRIPE STUFF
const strikeKey = process.env.NODE_ENV === 'development' ? 'sk_test_tnLDkmZuXbCMEuidwcGnnDXp' : 'pk_live_1jsaeBxuCCwo8fMA4h6ATb5N';
const stripe = require('stripe')(`${strikeKey}`);
const stripeMethods = require('./stripe/stripe');
const stripeBase = `https://api.stripe.com`;
// STRIPE STUFF
const moment = require('moment');
const profileStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, `./../src/assets/documents/profiles`);
  },
  filename: function (req, file, cb) {
    cb(null, `${file.originalname}`);
  } 
});
const profileUpload = multer({storage: profileStorage});
// const upload = multer({dest: __dirname + '/uploads/images'});
const RSA_PRIVATE_KEY = fs.readFileSync('./key.pem');
// mongoose.connect(mongoDB, options);
mongoose.Promise = global.Promise;
let db = mongoose.connection;
const expiryDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
const setSession = session({
      secret: 'sessionSecret',
      resave: false,
      saveUninitialized: true,
      cookie: {
        secureProxy: true,
        httpOnly: true,
        domain: 'example.com',
        expires: expiryDate
      }
    })
 
app.use(setSession)
const options = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  autoIndex: false, // Don't build indexes
  reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
  reconnectInterval: 500, // Reconnect every 500ms
  poolSize: 10, // Maintain up to 10 socket connections
  // If not connected, return errors immediately rather than waiting for reconnect
  bufferMaxEntries: 0,
  connectTimeoutMS: 10000, // Give up initial connection after 10 seconds
  socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
  family: 4 // Use IPv4, skip trying IPv6
};

const conn = mongoose.createConnection('mongodb://localhost:27017/admin', options);
db.on('error', console.error.bind(console, 'DB connection error:'));

const rawParser = bodyParser.raw();
const textParser = bodyParser.text();
const jsonParser = bodyParser.json();
const urlencodedParser = bodyParser.urlencoded({ extended: false });

app.set('trust proxy', 1) // trust first proxy

let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        type: 'OAuth2',
        clientId: '26338801886-ah3d799uvmtvped3of7m1r0v8fodsk27.apps.googleusercontent.com',
        clientSecret: 'MMuZzmrjyI0ecHkvyuDaPh6c'
    }
});

const mailOptions = {
  from: 'thebeardedtek@gmail.com',
  to: 'markrussell21@yahoo.com',
  subject: 'Sending Email using Node.js',
  text: 'You successfully logged in! That was easy!'
};


const documentsSchema = getDocumentsSchema.documentsSchema;
const authSchema = getAuthSchemas.authSchema;
const clientSchema = getAuthSchemas.clientSchema;
const personSchema = getAuthSchemas.personSchema;
const userSchema = getAuthSchemas.userSchema;
const menuSchema = getMenuSchema.obj;
const portfolioTypeMeta = getPortfolioSchemas.portfolioTypeMeta;
const webappTypeMeta = getPortfolioSchemas.webappTypeMeta;
const portfolioMeta = getPortfolioSchemas.portfolioMeta;
const mimeTypeMeta = getPortfolioSchemas.mimeTypeMeta;
const contactFormTypeMeta = getContactFormSchema.contactFormTypeMeta;
const bannerTypeMeta = getBannerSchema.bannerTypeMeta;
const pageHeaderTypeMeta = getPageHeaderSchemas.pageHeaderTypeMeta;
const pricingTypeMeta = getPricingSchema.pricingTypeMeta;
const projectsTypeMeta = getProjectsSchema.projectsTypeMeta;
const projectStatusMeta = getProjectStatusSchema.projectStatusMeta;
const coursesMeta = getCoursesSchema.coursesMeta;
const historyMeta = getHistorySchema.historyMeta;
// const billingMeta = getBillingSchema.billingMeta;


const Auth = conn.model("Auth", authSchema, "auth");
const Menu = conn.model("Menu", menuSchema, "menu");
const Clients = conn.model("Clients", clientSchema, "clients");
const PersonMeta = conn.model("PersonMeta", personSchema, "person-meta");
const User = conn.model("User", userSchema, "clients");
const Portfolio = conn.model("Portfolio", portfolioMeta, "portfolio");
const PortfolioTypes = conn.model("PortfolioTypes", portfolioTypeMeta, "portfolio-types");
const WebappTypes = conn.model("WebappTypes", webappTypeMeta, "webapp-types");
const Documents = conn.model("Documents", documentsSchema, "documents");
const MimeTypes = conn.model("MimeTypes", mimeTypeMeta, "mime-types");
const BannerTypes = conn.model("BannerTypes", bannerTypeMeta, "banner");
const ContactForm = conn.model("ContactForm", contactFormTypeMeta, "contact-form");
const pageHeader = conn.model("pageHeader", pageHeaderTypeMeta, "page-header");
const Pricing = conn.model("pricing", pricingTypeMeta, "pricing");
const Projects = conn.model("projects", projectsTypeMeta, "projects");
const ProjectStatus = conn.model("project-status", projectStatusMeta, "project-status");
const Courses = conn.model("courses", coursesMeta, "courses");
const History = conn.model("History", historyMeta, "history");
// const Billing = conn.model("billing", billingMeta, "billing");

/* BASE HREF */
// router.get('/', (req, res, next) => {res.send(process.env.NODE_ENV);});

router.get('/', (req, res) => {
res.send(null);
});

function setMimeType(mimetype){
  switch(mimetype){
    case 'image/png': return 'png';
    break;
    case 'image/jpg': return 'jpg';
    break;
    case 'image/jpeg': return 'jpeg';
    break;
    default: return 'jpg';

  }
}

router.post('/history', jsonParser,  (req, res) => {
  const historyInstance = new History();
      historyInstance.action = req.body.action || `GENERAL`;
      historyInstance.createdDate = req.body.createdDate || new Date();
      historyInstance.device = req.body.device;
      historyInstance.navigator = req.body.navigator;
      historyInstance.location = req.body.location;
      historyInstance.environment = process.env.NODE_ENV === 'development' ? 'DEVELOPMENT' : 'PRODUCTION';

      historyInstance.save((err, confirm)=>{
        if(err){
          res.send({status:404, confirmation: 'failure', authorization: 'INVALID'});
        } else {
          res.send({status:200, confirmation:'success', data: 'success'});
        }
      });
});

router.post(`/documents`, profileUpload.single('profilepic'), (req, res)=>{
  const newDoc = {};
  newDoc.createdDate = new Date();
  newDoc.fieldname = req.file.fieldname;
  newDoc.filename = req.file.originalname;
  newDoc.originalname = req.file.originalname;
  newDoc.encoding = req.file.encoding;
  newDoc.mimetype = req.file.mimetype;
  newDoc.destination = req.file.destination;
  newDoc.path = req.file.path;
  newDoc.size = req.file.size;
  newDoc.mimeCode = setMimeType(req.file.mimetype);
  newDoc.docReference = `${moment().format('YYYYMMDDhhmmss')}-${req.file.originalname}`;
  const saveDoc = new Documents(newDoc); 
  saveDoc.save((err, doc)=>{
    if(err){
      res.send({status:404, confirmation: 'failure', authorization: 'INVALID', message:'Not able to upload document'});
    } else {
      const tempFile = `./../src/assets/documents/profiles/temp.txt`;
      let createStream = fs.createWriteStream(tempFile);
      createStream.end();
      res.send({status:200, confirmation:'success', data: doc});
    }
  });
});

router.get(`/documents`, jsonParser, (req, res)=>{
  Documents.find({docReference: req.query.docReference}, (err, doc)=>{
    if(err){
      res.send({status:404, confirmation: 'failure', authorization: 'INVALID'});
    } else {
      if(doc.length > 0){
        res.send({status:200, confirmation:'success', data: doc[0]});
      } else {
        res.send({status:200, confirmation:'success', data: `default-avatar.png`});
      }
    }
  });
});

// const profileStorage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, `./../src/assets/documents/profiles`);
//   },
//   filename: function (req, file, cb) {
//     cb(null, `${Date.now()}-${file.originalname}`);
//   }
// });


router.get(`/user`, (req, res, next) => {
  const token = req.query.token, user = req.query.clientEmail;
  if(typeof token !== 'string'){token = token.toString();}
  if(typeof user !== 'string'){user = user.toString();}
  if(token && user){
    jwt.verify(token, 'sessionSecret', ()=>{
      User.find({clientEmail: req.query.clientEmail}, function(err, user){
        if(err){console.log('Error retrieving data');} else {
          res.send(user);}})});}
        else {res.sendStatus(403);}});


router.put('/user', jsonParser, (req, res, next) => {

  req.body.updatedDate = new Date();

  Auth.find({clientEmail: req.body.clientEmail}, (err, existing)=>{
    if(err){
      res.send({status:404, confirmation: 'failure', authorization: 'INVALID'});
    } else {
      if(existing.length > 0 && Number(req.body.clientAccountNum) !== Number(existing[0].clientAccountNum)){
        res.send({status:404, confirmation: 'failure', authorization: 'INVALID', message:'User Exists'});
      } else {

  const token = req.body.token, email = req.body.clientEmail, acct = Number(req.body.clientAccountNum);
  if(typeof token !== 'string'){token = token.toString();}
  if(typeof email !== 'string'){email = email.toString();}

  if(token && email){
    jwt.verify(token, 'sessionSecret', ()=>{

    Auth.update({clientAccountNum:acct}, {clientEmail: email, updatedDate: req.body.updatedDate}, (err, auth)=>{
      if(err){
        res.send({status:404, confirmation: 'failure', authorization: 'INVALID'});
      }
    });

      Clients.update({clientAccountNum:acct}, req.body, (err, client)=>{
        if(err){res.send({status:404, confirmation: 'failure', authorization: 'INVALID', message: 'not able to update'});
        } else {
          Clients.find({clientAccountNum:acct}, (err, updated)=>{
              if(updated.length > 0){
                if(updated[0].stripeId){
                  stripeMethods.updateStripe(updated[0].stripeId, updated[0]);
                }

                const results = {status:201, confirmation:'success', client: updated[0]};
                res.send(results);
                res.end();
              } else {
                res.send({status:404, confirmation: 'failure', authorization: 'INVALID'});
              }
            });
        }});
    });
  } else {
    res.sendStatus(403);
  }
}
}
});
});

/* LOGIN */
router.post('/login', jsonParser,  (req, res) => {
  const clientPassword = req.body.clientPassword;
  Auth.find({clientEmail: req.body.clientEmail}, function(err, auths){
    if(auths.length > 0){
      if(passwordHash.verify(clientPassword, auths[0].clientPassword)){
        Clients.find({clientEmail: auths[0].clientEmail}, function(err, client){
          if(err){res.send({status:403, confirmation:'failure', authorization:'INVALID', message:'Not able to find client'}); res.end();
          } else {


let lastSignIn = req.body.lastSignIn || moment();

Auth.update({clientEmail: req.body.clientEmail}, {lastSignIn: lastSignIn}, (err, auth)=>{
      if(err){
        res.send({status:404, confirmation: 'failure', authorization: 'INVALID', lastSignIn: 'FALSE'});
      }
    });

Clients.update({clientEmail: req.body.clientEmail}, {lastSignIn: lastSignIn}, (err, client)=>{
      if(err){
        res.send({status:404, confirmation: 'failure', authorization: 'INVALID', lastSignIn: 'FALSE'});
      }
    });

              if(client.length > 0){
                const subjectId = client[0].clientAccountNum.toString();
                const jwtBearerToken = jwt.sign({}, RSA_PRIVATE_KEY, {
                algorithm: 'RS256',
                expiresIn: 24 * 60 * 60,
                subject: subjectId ? subjectId : 0});
                client[0].token = jwtBearerToken;
                const results = {status:200, confirmation:'success', token:jwtBearerToken.toString(), client: client[0]};
                res.send(results); res.end();
              } else {
                res.send({status:403, confirmation:'failure', authorization:'INVALID', message:'Client length === 0'}); res.end();
              }
          }})
    } else {res.send({status:403, confirmation:'failure', authorization:'INVALID', message:'Not able to verify password'}); res.end();}
    } else {res.send({status:403, confirmation:'failure', authorization:'INVALID', message:'Not able to find Auth user'}); res.end();}
  });});

/* REGISTER */
router.post('/register', jsonParser, (req, res) => {
  let registrar = req.body;
  req.body.clientPassword = passwordHash.generate(req.body.clientPassword);
  req.body.createdDate = new Date();
  req.body.updatedDate = createdDate;

  Auth.where({clientEmail: req.body.clientEmail}).find({}, function(err, client){
    if(err){
      res.status(500).send(err);
    } else {
        if(client.length !== 0){
          res.send({authorization : 'INVALID'});
        } else {

          function getRandomInt(min, max) {
            min = Math.ceil(min);
            max = Math.floor(max);
            return Math.floor(Math.random() * (max - min)) + min;
          }

          const acctNum = `${getRandomInt(100000000,999999999)}`;

          stripeEmail = req.body.clientEmail;
          stripeAccountNumber = acctNum;

            stripe.customers.create(
              {email: stripeEmail, name:req.body.stripeFullName,
              metadata:{accountNumber: stripeAccountNumber}},
              (err, customer) => {

                if(req.body.stripeNumber){
                  stripe.paymentMethods.create(
                  {
                    type: 'card',
                    card: {
                      number: req.body.stripeNumber,
                      exp_month: req.body.stripeExpMonth,
                      exp_year: req.body.stripeExpYear,
                      cvc: req.body.stripeCvc,
                    },
                  },
                  function(err, paymentMethod) {

                    stripe.paymentMethods.attach(
                      paymentMethod.id,
                      {customer: customer.id},
                      function(err, paymentMethod) {

                      }
                    ); //end payment methods

                    // asynchronously called
                  }
                );
                }


                if(err){
                  return err;
                } else {
                  const authInstance = new Auth();
                  authInstance.clientEmail = req.body.clientEmail;
                  authInstance.clientPassword = req.body.clientPassword;
                  authInstance.clientType = req.body.clientType;
                  authInstance.clientAccountNum = acctNum;
                  authInstance.stripeId = customer ? customer.id : null;
                  authInstance.createdDate = req.body.createdDate || new Date();
                  authInstance.updatedDate = req.body.updatedDate || authInstance.createdDate;

                  const clientsInstance = new Clients();
                  clientsInstance.clientEmail = authInstance.clientEmail;
                  clientsInstance.clientPassword = authInstance.clientPassword;
                  clientsInstance.clientType = authInstance.clientType;
                  clientsInstance.clientAccountNum = acctNum;
                  clientsInstance.stripeId = customer ? customer.id : null;
                  clientsInstance.createdDate = req.body.createdDate;
                  clientsInstance.updatedDate = req.body.updatedDate;

   

                  authInstance.save(err =>{
                    if(err){
                      res.status(500).send(err);
                    } else {
                        clientsInstance.save(err => {
                    if(err){
                      return res.status(500).send(err)
                    } else {
                      Clients.find({clientEmail: clientsInstance.clientEmail}, function(err, client){
                        const subjectId = client[0].clientAccountNum.toString();
                        const jwtBearerToken = jwt.sign({}, RSA_PRIVATE_KEY, {
                        algorithm: 'RS256',
                        expiresIn: 24 * 60 * 60,
                        subject: subjectId ? subjectId : 0
                        });
                        client[0].token = jwtBearerToken;
                        const results = {'token':jwtBearerToken.toString(), 'client': client[0]};
                        res.status(200).send(results);
                        })
                      };
                    });
                }
              });}})}}
});
})

/* PRICING */
router.get('/all-pricing-plans', (req, res) => {
  Pricing.find({}, function(err, price){
    if(err){return res.status(500).send(err);} else {res.status(200).send(price);}});});

/* MENU */
router.get('/menu', (req, res) => {
  Menu.find({}, function(err, menus){
    if(err){return res.status(500).send(err);} else {res.status(200).send(menus);}});});


/* PORTFOLIO TYPES */
router.get('/portfolio-types', (req, res) => {
  PortfolioTypes.find({}, function(err, types){
    if(err){return res.status(500).send(err);} else {res.status(200).send(types);}});});

/* WEBAPP TYPES */
router.get('/webapp-types', (req, res) => {
  WebappTypes.find({}, function(err, webapps){
    if(err){return res.status(500).send(err);} else {res.status(200).send(webapps);}});});

/* CLIENTS */
router.get('/clients', (req, res) => {
  Clients.find({}, function(err, clients){
    if(err){return res.status(500).send(err);} else {res.status(200).send(clients);}});});

/* PORTFOLIO META */
router.get('/portfolio-meta', (req, res) => {
  Portfolio.find({}, function(err, portfolioMeta){
        if(err){return res.status(500).send(err);} else {res.status(200).send(portfolioMeta);}});});

/* PERSON META */
router.get('/person-meta', (req, res) => {
  PersonMeta.find({}, function(err, personMeta){
        if(err){return res.status(500).send(err);} else {res.status(200).send(personMeta);}});});

/* GEO LOCATIONS */
router.get('/geo-locations', (req, res) => {
  Clients.find({}, function(err, clients){
        if(err){return res.status(500).send(err);} else {res.status(200).send(clients);}});});

/* PHONE META */
router.get('/phone-meta', (req, res) => {
  Clients.find({}, function(err, clients){
        if(err){return res.status(500).send(err);} else {res.status(200).send(clients);}});});

router.get(`/mimetypes`, jsonParser, (req, res)=>{
  MimeTypes.find({}, (err, mimes)=>{
    if(err){
      res.send({status:404, confirmation: 'failure', authorization: 'INVALID'});
    } else {
      res.send({status:200, confirmation:'success', data: mimes});
    }
  });
});

router.get(`/banner`, jsonParser, (req, res)=>{
  BannerTypes.find({}, (err, banner)=>{
    if(err){
      res.send({status:404, confirmation: 'failure', authorization: 'INVALID'});
    } else {
      res.send({status:200, confirmation:'success', data: banner});
    }
  });
});

router.get(`/page-header`, jsonParser, (req, res)=>{
  pageHeader.find({}, (err, page)=>{
    if(err){
      res.send({status:404, confirmation: 'failure', authorization: 'INVALID'});
    } else {
      res.send({status:200, confirmation:'success', data: page});
    }
  });
});

router.get(`/projects`, jsonParser, (req, res)=>{
  Projects.find({clientEmail: req.query.clientemail}, (err, project)=>{
    if(err){
      res.send({status:404, confirmation: 'failure', authorization: 'INVALID'});
    } else {
      res.send({status:200, confirmation:'success', data: project});
    }
  });
});

router.get(`/project-status`, jsonParser, (req, res)=>{
  ProjectStatus.find({}, (err, project)=>{
    if(err){
      res.send({status:404, confirmation: 'failure', authorization: 'INVALID'});
    } else {
      res.send({status:200, confirmation:'success', data: project});
    }
  });
});





router.get(`/billing`, jsonParser, (req, res)=>{

  Clients.find({clientEmail: req.query.clientemail}, (err, client)=>{
    if(err){
      res.send({status:404, confirmation: 'failure', authorization: 'INVALID'});
    } else {
        let clientBilling = {};

        /*STRIP OUT EVERYTHING WE DONT WANT EXPOSED AND JUST SEND THE DATA YOU WANT THE USER TO SEE AND BE ABLE TO UPDATE*/
        try {stripe.customers.retrieve(
          client[0].stripeId,
          function(err, customer) {
            
            if(customer){
              clientBilling.customer = {
                name: customer.name,
                address: customer.address,
                balance: customer.balance,
                delinquent: customer.delinquent,
                discount: customer.discount,
                phone: customer.phone,
                shipping: customer.shipping,
                subscriptions: customer.subscriptions,
                tax_exempt: customer.tax_exempt,
  
              } || {};  
              stripe.paymentMethods.list(
                {customer: client[0].stripeId, type: 'card'},
                function(err, paymentMethods) {
                  let method = paymentMethods.data[0];
                  clientBilling.paymentMethods = {
                    paymentMethodId: method.id,
                    billing_details: method.billing_details,
                    card: method.card,
                  } || {};
                  res.send({status:200, confirmation:'success', data: clientBilling});
                }
              );
            } else {
              clientBilling.customer = {};
              clientBilling.paymentMethods = {};
              res.send({status:200, confirmation:'success', data: clientBilling});
            }

          }
        );
      } catch(err){
        clientBilling.customer = {};
        clientBilling.paymentMethods = {};
        res.send({status:200, confirmation:'success', data: clientBilling});
      }




    }
  });
});

router.put(`/billing`, jsonParser, (req, res)=>{
  let addressPayload = {
    line1: req.body.line1,
    line2: req.body.line2,
    city: req.body.city,
    state: req.body.state,
    postal_code: req.body.postalCode,
  };

  let paymentMethodPayload = {
    stripeFullName: req.body.stripeFullName,
    stripeNumber: req.body.stripeNumber,
    stripeExpDate: req.body.stripeExpDate,
    stripeCvc: req.body.stripeCvc,
    stripeZip: req.body.stripeZip,
  };

  stripe.customers.update(
    req.body.stripeId, {address: addressPayload},
    function(err, customer) {
      if(err){
        return err;
        res.send({status:404, confirmation: 'failure', authorization: 'INVALID'});
      } else {
        if(req.body.stripeNumber){
          stripe.paymentMethods.create(
          {
            type: 'card',
            card: {
              number: req.body.stripeNumber,
              exp_month: req.body.stripeExpMonth,
              exp_year: req.body.stripeExpYear,
              cvc: req.body.stripeCvc,
            },
            billing_details:{
              address:{
                line1: req.body.line1,
                line2: req.body.line2,
                city: req.body.city,
                state: req.body.state,
                postal_code: req.body.postalCode,
              },
              name: req.body.stripeFullName,
              email: req.body.clientEmail,
              phone: req.body.clientPhone1,

            },
            
          },
          function(err, paymentMethod) {

            if(err){
              res.send({status:404, confirmation: 'failure', authorization: 'INVALID'});
            } else {
              stripe.paymentMethods.attach(
                paymentMethod.id,
                {customer: customer.id},
                function(err, paymentMethod) {
                  if(err){
                    res.send({status:404, confirmation: 'failure', authorization: 'INVALID'});
                  } else {
                    stripe.paymentMethods.detach(
                      req.body.paymentMethodId,
                      function(err, paymentMethod) {
                        if(err){
                          res.send({status:404, confirmation: 'failure', authorization: 'INVALID'});
                        } else {
                          res.send({status:200, confirmation:'success'});
                        }
                      }
                    );
                  }
                }
              ); //end payment methods
  
              // asynchronously called
            }
          }
        );
        } else {
          res.send({status:200, confirmation:'success'});
        }
        // paymentMethodId
      }
    }
  );
});


router.get(`/courses`, jsonParser, (req, res)=>{
  Courses.find({}, (err, courses)=>{
    if(err){
      res.send({status:404, confirmation: 'failure', authorization: 'INVALID'});
    } else {
      res.send({status:200, confirmation:'success', data: courses});
    }
  });
});

router.put(`/courses`, jsonParser, (req, res)=>{
  Clients.update({clientEmail: req.body.clientEmail}, req.body, (err, client)=>{
    if(err){
      res.send({status:404, confirmation: 'failure', authorization: 'INVALID'});
    } else {

      res.send({status:200, confirmation:'success', data: client});
    }
  });
});

// STRIPE
router.get(`${stripeBase}/page-header`, jsonParser, (req, res)=>{
  pageHeader.find({}, (err, page)=>{
    if(err){
      res.send({status:404, confirmation: 'failure', authorization: 'INVALID'});
    } else {
      res.send({status:200, confirmation:'success', data: page});
    }
  });
});

// STRIPE

router.post(`/forgot-password`, jsonParser, (req, res)=>{
  Auth.find({clientEmail: req.body.clientEmail}, (err, auth)=>{
    if(err){
      return err;
      // res.send({status:404, confirmation: 'failure', authorization: 'INVALID'});
    } else {
      // res.send({status:200, confirmation:'success', data: mimes});

      if(auth.length > 0){

        // transporter.sendMail({
        //   from: 'mark@thebeardedtek.com',
        //   to: req.body.clientEmail,
        //   subject: 'Message',
        //   text: 'I hope this message gets through!',
        //   auth: {
        //       user: 'mark@thebeardedtek.com',
        //       refreshToken: '1/XXxXxsss-xxxXXXXXxXxx0XXXxxXXx0x00xxx',
        //       accessToken: 'ya29.Xx_XX0xxxxx-xX0X0XxXXxXxXXXxX0x',
        //       expires: 1484314697598
        //   }
        // });

      //   auth: {
      //     type: 'OAuth2',
      //     clientId: '26338801886-ah3d799uvmtvped3of7m1r0v8fodsk27.apps.googleusercontent.com',
      //     clientSecret: 'MMuZzmrjyI0ecHkvyuDaPh6c'
      // }


      }
    }
  });
});

router.post(`/contact-form`, jsonParser, (req, res)=>{
  ContactForm.find({}, (err, contact)=>{
    if(err){
      res.send({status:404, confirmation: 'failure', authorization: 'INVALID'});
    } else {
      const contactInstance = new ContactForm();
      contactInstance.name = req.body.name;
      contactInstance.email = req.body.email;
      contactInstance.number = req.body.number;
      contactInstance.message = req.body.message;
      contactInstance.createdDate = req.body.createdDate;
      contactInstance.currentUrl = req.body.currentUrl;
      contactInstance.userAgent = req.body.userAgent;
      contactInstance.appName = req.body.appName;

      // transporter.sendMail({
      //   from: 'mark@thebeardedtek.com',
      //   to: `mark@thebeardedtek.com`,
      //   subject: 'Contact Form',
      //   text: `
      //   You received a message from ${contactInstance.name}. The client writes ${contactInstance.message}. 
        
      //   You may contact the client at <a href="mailto:${contactInstance.email}">${contactInstance.email}</a> or call, <a href="mailto:${contactInstance.number}">${contactInstance.number}</a>
      //   `,
      //   auth: {
      //       user: 'mark@thebeardedtek.com',
      //       refreshToken: '1/XXxXxsss-xxxXXXXXxXxx0XXXxxXXx0x00xxx',
      //       accessToken: 'ya29.Xx_XX0xxxxx-xX0X0XxXXxXxXXXxX0x',
      //       expires: 1484314697598
      //   }
      // });

      

      contactInstance.save((err, confirm)=>{
        if(err){
          res.send({status:404, confirmation: 'failure', authorization: 'INVALID'});
        } else {
          res.send({status:200, confirmation:'success', data: 'success'});
        }
      });
    }
  });
});

//  STRIPE
router.get(`/customer`, jsonParser, (req, res)=>{
    let customerResponse = {};
  let customerId = req.query.customerId.toString();
  let errorsArray = [];

  stripe.customers.retrieve(
    customerId,
    function(err, customer) {
      if(err){
        errorsArray.push(err);
      } else {
        customerResponse.customer = customer;

        stripe.invoices.list(
          {limit: req.query.invoiceLimit || 5, 'customer': customerId},
          function(err, invoices) {
            if(err){
              errorsArray.push(err);
          } else {
            customerResponse.invoice = invoices;

            stripe.subscriptions.list(
              {limit: req.query.subscriptionLimit || 5, customer: customerId},
              function(err, subscriptions) {
                if(err){
                  errorsArray.push(err);
                } else {
                  customerResponse.subscriptions = subscriptions;

                  stripe.charges.list(
                    {limit: req.query.chargeLimit || 10, customer: customerId},
                    function(err, charges) {
                      if(err){
                        errorsArray.push(err);
                      } else {
                        customerResponse.charges = charges;
//THIS NEEDS TO GO IN THE LAST CALL BACK FUNCTION; MOVE WHEN CREATING ADDITIONAL STRIPE CALLS
                        if(errorsArray.length > 0){
                          res.send({status:404, confirmation: 'failure', authorization: 'INVALID', errors: errorsArray});
                        } else {
                          res.send({status:200, confirmation:'success', data: customerResponse});
                        }
//THIS NEEDS TO GO IN THE LAST CALL BACK FUNCTION; MOVE WHEN CREATING ADDITIONAL STRIPE CALLS

                      }//end charges if
              }// end charges callback
            );//end charges retrieve



                }//end subscriptions if
              }// end subscriptions callback
            );//end subscriptions retrieve


          }//end invoice if
    }// end invoice callback
  );//end invoice retrieve


      }//end customer if
    }// end customer callback
  );//end custmoer retrieve

});


module.exports = router;
