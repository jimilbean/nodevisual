const sqlite = require('sqlite3').verbose();
const db = new sqlite.Database("real.sqlite");
const execSync = require('child_process').execSync;

const http = require('http');
const express = require('express');
const hand = require('express-handlebars');
const path = require('path');
const fs = require('fs');

const app = express();

app.engine('handlebars', hand({defaultLayout:'main'}));
app.set('view engine', 'handlebars');
app.set('port', 13000);
app.set('views', path.join(__dirname, 'views'));

app.get('/', (req, res)=>{
    
    db.all("SELECT word, COUNT(word) AS cnt " +
            "FROM words GROUP BY word " +
            "ORDER BY cnt DESC LIMIT 0, 10", (err, row)=>{
        
        let labelData = [];
        let valueData = [];

        for(let i=0; i < row.length; i++){
            labelData.push(row[i].word);
            valueData.push(row[i].cnt);
        }

        res.render('home', {'labels':labelData, 'values':valueData});
    });
});

app.get('/temp', (req, res)=>{
    let fileName = "2018.csv";
    let text = fs.readFileSync(fileName, "utf-8");

    let lines = text.split("\r\n");

    let labels = []; //라벨
    let averList = []; //평균기온
    let minList = []; //최저기온
    let maxList = []; //최고기온

    let beforeMonth = 0;
    let avrSum = 0, minSum = 0, maxSum = 0;
    let cnt = 0;

    lines.forEach(line => {
        let datas = line.split(",");

        let date = datas[0];
        let month = date.split("-")[1];
        if(month != beforeMonth){
            if(beforeMonth != 0){
                labels.push(beforeMonth);
                averList.push(avrSum / cnt);
                minList.push(minSum / cnt);
                maxList.push(maxSum / cnt);

                avrSum = minSum = maxSum = 0;
                cnt = 0;
            }
            beforeMonth = month;
        }
        
        avrSum += datas[1] * 1;
        minSum += datas[2] * 1;
        maxSum += datas[3] * 1;
        cnt++;
    });
    labels.push(beforeMonth);
    averList.push(avrSum / cnt);
    minList.push(minSum / cnt);
    maxList.push(maxSum / cnt);

    res.render('temp', {
        'labels': labels, 
        'averList':averList, 
        'minList': minList,
        'maxList': maxList
    });
});

http.createServer(app).listen(app.get('port'), ()=>{
    console.log('서버 실행중 : ' + app.get('port'));
});
