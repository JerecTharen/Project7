
const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const bodyParser = require('body-parser');
const userFile = require('./users/usersFile');
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/users', {useNewUrlParser: true});
const db = mongoose.connection;
const userSchema = new mongoose.Schema({
    userName: String,
    email: String,
    age: String
});
const user = mongoose.model('usercollections', userSchema);

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', ()=> console.log('db connected'));

const port = 3000;
let numUsers;
if(userFile.numUsers){
    numUsers = userFile.numUsers;
}
else{
    numUsers = 0;
}


app.use(express.static('./public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.set('views', path.join(__dirname, 'pugViews'));
app.set('view engine', 'pug');


app.get('/', (req, resp)=>{
    resp.render('index');
});
app.get('/users', (req, resp)=>{
    // console.log('in users');
    user.find({}, (err, data)=>{
        if(err) return console.log(`Opps: ${err}`);
        // console.log(`data -- ${JSON.stringify(data)}`);
        // console.log(data[0]._id);
        resp.render('users', {allUsers: data});
    });
});
app.get('/users/:uid', (req, resp)=>{
    user.findById(req.params.uid, (err, data)=>{
        if(data){
            resp.render('userEdit', {uid: req.params.uid, user: data});
        }
        else{
            resp.send('We could not find that user');
        }
    });

});
app.get('/delete/:uid', (req, resp)=>{
    user.deleteOne({_id: req.param.uid}, (err)=>{
        if(err) return console.error(err);
        resp.redirect('/users');
    });
});

app.post('/addUser', (req, resp)=>{
    let newUser = new user({
        userName: req.body.userName,
        email: req.body.email,
        age: req.body.age.toString()
    });
    // let userData = req.body;
    newUser.save((err, addedUser)=>{
        if(err) return console.error(err);
        console.log(addedUser.userName + ' saved to user collection');
        resp.redirect('/users');
    });
});
app.post('/users/:uid', (req, resp)=>{
    let userData = req.body;
    userData.uid = `${userData.userName}${numUsers}`;
    let newJSON = {
        numUsers: numUsers,
        users: userFile.users
    };
    for(let i = 0; i<newJSON.users.length; i++){
        if(newJSON.users[i].uid === req.params.uid){
            newJSON.users[i] = userData;
        }
    }
    console.log(newJSON);
    fs.writeFile('./users/usersFile.json', JSON.stringify(newJSON), (err)=>{
        if (err) throw err;
        resp.redirect('/users');
    });
});

app.listen(port, ()=>{
    console.log(`Listening on port: ${port}`);
});
