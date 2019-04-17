const express = require('express');
const mongoose = require('mongoose');

const app = express();
const port = process.env.PORT || 8080;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost/users', {useNewUrlParser: true}); // "userManagement" is the db name
const db = mongoose.connection;
const userSchema = new mongoose.Schema({
    name: String,
    role: String,
    age: { type: Number, min: 18, max: 70 },
    createdDate: { type: Date, default: Date.now }
});

const user = mongoose.model('usercollections', userSchema);

app.post('/newUser', (req, res) => {
    console.log(`POST /newUser: ${JSON.stringify(req.body)}`);
    const newUser = new user();
    newUser.name = req.body.name;
    newUser.role = req.body.role;
    newUser.save((err, data) => {
        if (err) {
            return console.error(err);
        }
        console.log(`new user save: ${data}`);
        res.send(`done ${data}`);
    });
});

app.get('/user/:name', (req, res) => {
    // let userName = req.params.name;
    // console.log(`GET /user/:name: ${JSON.stringify(req.params)}`);
    user.find({}, (err, data) => {
        //user.findOne({ name: userName }, (err, data) => {
        if (err) return console.log(`Oops! ${err}`);
        console.log(`data -- ${JSON.stringify(data)}`);
        // let returnMsg = `user name : ${userName} role : ${data.role}`;
        // console.log(returnMsg);
        res.send('Hello There');
    });
});


app.listen(port, (err) => {
    if (err) console.log(err);
    console.log(`App Server listen on port: ${port}`);
});
