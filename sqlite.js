const sqlite = require('sqlite3').verbose();

const db = new sqlite.Database('test.sqlite');

db.serialize(()=>{
    db.run("CREATE TABLE IF NOT EXISTS items(name, value)");

    let stmt = db.prepare("INSERT INTO items VALUES(?, ?)");
    stmt.run(["R", 59]);
    stmt.run(["O", 22]);
    stmt.run(["H", 23]);

    stmt.finalize();
});