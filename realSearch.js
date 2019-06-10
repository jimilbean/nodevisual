const client = require('cheerio-httpcli');
const sqlite = require('sqlite3').verbose();

const url = "https://datalab.naver.com/keyword/realtimeList.naver";

let param = [];

const db = new sqlite.Database("real.sqlite");

db.serialize(()=>{
    db.run("CREATE TABLE IF NOT EXISTS words(word, time)");

    let stmt = db.prepare("INSERT INTO words VALUES(?, ?)");

    client.fetch(url, param, (err, data, res)=>{
        if(err) {
            console.log("에러 발생");
            return;
        }

        let words = data(".rank_list .title");
        let time = data("._title_hms").text();
        console.log(time);
        words.each((idx, item)=>{
            let word = data(item).text();

            stmt.run([word, time]);
        })
    });
});