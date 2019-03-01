
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

app.listen(port, ()=>{
    console.log(`Listening on port: ${port}`);
});
