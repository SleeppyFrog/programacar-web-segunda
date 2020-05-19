const express = require('express');

const app = express();

const morgan = require('morgan');

const bodyParser = require('body-parser');

const mongoose = require('mongoose');

const produtoRoutes = require('./api/routes/produtos');

mongoose.connect('mongodb+srv://unidesc:unidesc@unidesc-proweb-natan-wg71h.mongodb.net/test?retryWrites=true&w=majority',
{
    useNewUrlParser: true,
    useUnifiedTopology: true
});

app.use(morgan('dev'));

app.use(bodyParser.urlencoded({
    extended:false
}));
app.use(bodyParser.json());

app.use((req, res, next) =>{
    res.header("Acess-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers", 
        "Origin, X-requested-With, Content-Type, Accept, Autorization"
    );
    if(req.method == "OPTIONS"){
        req.header("Access-Control-Allow-Methods", "PUT, POST, PATH, GET, DELETE");
        return res.status(200).json({});
    }
    next();
});



app.use('/produtos', produtoRoutes);



app.use((req, res, next) =>{
    const error = new Error('not found');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) =>{
    res.status(error.status || 500);
    res.json({
        error:{
            message: error.message
        }
    });
});

module.exports = app;