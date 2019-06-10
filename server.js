const sqlite = require('sqlite3').verbose();
const db = new sqlite.Database("real.sqlite");
const execSync = require('child_process').execSync;

const http = require('http');
const express = require('express');
const hand = require('express-handlebars');
const path = require('path');

const app = express();

app.engine('handlebars', hand({defaultLayout:'main'}));
app.set('view engine', 'handlebars');
app.set('port', 13000);
app.set('views', path.join(__dirname, 'views'));

app.get('/', (req, res)=>{
    
    db.all("SELECT word, COUNT(word) AS cnt " +
            "FROM words GROUP BY word " +
            "ORDER BY cnt DESC", (err, row)=>{
        res.render('home', {'list':row});

    });
});

http.createServer(app).listen(app.get('port'), ()=>{
    console.log('서버 실행중 : '+ app.get('port'));
});
