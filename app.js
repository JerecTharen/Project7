
const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const bodyParser = require('body-parser');
const userFile = require('./users/usersFile');

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
    resp.render('users', {allUsers: userFile.users});
});
app.get('/users/:uid', (req, resp)=>{
    let user;
    let found = false;
    for(let i = 0; i < userFile.users.length; i++){
        // console.log(userFile.users[i]);
        if(userFile.users[i].uid===req.params.uid){
            found = true;
            user = userFile.users[i];
            // console.log(user);
            resp.render('userEdit', {uid: req.params.uid, user: user});
        }
    }
    if(!found){
        resp.send('We could not find that user');
    }
});
app.get('/delete/:uid', (req, resp)=>{
    let newJSON = {
        numUsers: numUsers,
        users: userFile.users
    };
    for(let i = 0; i<newJSON.users.length; i++){
        if(newJSON.users[i].uid === req.params.uid){
            newJSON.users.splice(i, 1);
        }
    }
    console.log(newJSON);
    fs.writeFile('./users/usersFile.json', JSON.stringify(newJSON), (err)=>{
        if (err) throw err;
        resp.redirect('/users');
    });
});

app.post('/addUser', (req, resp)=>{
    numUsers++;
    let userData = req.body;
    userData.uid = `${userData.userName}${numUsers}`;
    let newJSON = {
        numUsers: numUsers,
        users: userFile.users
    };
    newJSON.users.push(userData);
    console.log(newJSON);
    fs.writeFile('./users/usersFile.json', JSON.stringify(newJSON), (err)=>{
        if (err) throw err;
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
