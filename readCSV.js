const fs = require('fs');

let fileName = "2018.csv";

let text = fs.readFileSync(fileName, "utf-8");

let lines = text.split("\r\n");

lines.forEach(line => {
    console.log(line.split(","));
});