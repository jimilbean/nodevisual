const sqlite = require('sqlite3').verbose();
const db = new sqlite.Database("real.sqlite");

//노드에서 외부 프로그램 실행시킬 때 사용하는 모듈
const execSync = require('child_process').execSync;

let cnt = 0;

let id = setInterval(()=>{
    //1분에 한번씩 실행하는 매서드
    let cmd = "node realSearch.js";
    let opt = {encoding:"utf-8"};

    execSync(cmd, opt);
    cnt++;
    if(cnt >= 10){
        calc();
        clearInterval(id);
    }
    console.log("1회 수집 완료");
}, 1000 * 60);

function calc(){
    db.each("SELECT word, COUNT(word) AS cnt " +
            "FROM words GROUP BY word " +
            "ORDER BY cnt DESC", (err, row)=>{
        console.log(row.cnt + "회 : " + row.word);
    });
}