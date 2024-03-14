const express=require('express');
const app=express();
const path=require('path');
require("dotenv").config();
const cors=require('cors')
const PORT=process.env.PORT || 3500;
const {logger}=require('./middleware/LogEvents');
const errorHandler=require('./middleware/errorHandler');
const { json } = require('express');
const cookieParser=require("cookie-parser");
const corsOptions=require('./config/corsOptions')
const credentials=require('./middleware/credentials');
const { generateToken } = require('./middleware/mpesaAuth');
const fileUpload = require("express-fileupload");
const nodemailer = require('nodemailer');
const mongoose = require('mongoose');



app.use(logger);

app.use(credentials);

app.use(cors(corsOptions));


app.use(express.urlencoded({extended: false}));

app.use(json());

app.use(cookieParser());

app.use(fileUpload({ createParentPath: true }));

app.use(express.static("public"));

app.use("/images", express.static("public/images"));


// app.use('/',express.static(path.join(__dirname,'/public')));


app.use('/register',require("./routes/register"));
app.use('/auth',require("./routes/auth"));
app.use('/refresh',require("./routes/refresh"));
app.use('/logOut',require('./routes/logOut'));

app.use('/products',require("./routes/product"));
app.use('/pendingproducts',require("./routes/pendingProducts"));
app.use('/sendmail',require("./routes/mailer"));
app.use('/stk',generateToken,require('./routes/mpesa'));
app.use('/gentoken',require('./routes/genToken'));
app.use('/callback',require('./routes/callback'));


(async ()=>{
  await mongoose.connect(process.env.DATABASE_URI)
  .then(() => {
    console.log('Connected!')
    app.listen(PORT,()=>{console.log(`server listening on port ${PORT}`)});
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

})()

app.use(errorHandler);


