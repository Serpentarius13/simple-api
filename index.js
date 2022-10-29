const http = require("http");
const url = require("url");
const fs = require("fs");

const data = fs.readFileSync("./data.json", "utf-8");

const dataObj = JSON.parse(data)["data"];
console.log(dataObj)

const sorts = function (type) {
  return dataObj.filter((data) => data.type === type);
};

const arr = [
  sorts("income"),
  sorts("outcome"),
  sorts("loan"),
  sorts("investment"),
];

arr.forEach((data) => data.map((d) => (d.amount = 21123)));

const news = arr.map((arr) => arr[0].type);

const listItem = fs.readFileSync("./gen.html", "utf-8");
const main = fs.readFileSync("./main.html", "utf-8");

const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);

  if (pathname === "/container" && query.tab) {
    if (!arr[query.tab]) {
      res.end("Error");
      return;
    }
    res.writeHead(200, { "Header-type": "text/html" });
    let out = "";
    arr[query.tab].map((data) => {
      out += listItem
        .replace(/{%NAME%}/g, `${data.name.first} ${data.name.last}`)
        .replace(/{%AMOUNT%}/g, data.amount);
    });

    final = main
      .replace(/{%PLACEHOLDER%}/g, out)
      .replace(/{%TYPEHOLDER%}/g, arr[query.tab][0].type);

    res.end(final);
  } else if (pathname === "/container" || pathname === "/") {
    res.end(
      main
        .replace(/{%PLACEHOLDER%}/g, "Click a button above")
        .replace(/{%TYPEHOLDER%}/g, "")
    );
  } else if (pathname === "/json") {
    res.end(JSON.stringify(dataObj))
  } else res.end("error");
});

server.listen(8000, "127.0.0.1", () => {
  console.log("listening");
});
