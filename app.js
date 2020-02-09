const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
app.use(cors());
const db = require("./db");
const port = 3000;

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

app.get("/items", db.getItems);

app.post("/api/orders/insert", function(req, res) {
  if (req.body.firstName == "failtest") {
    console.log("failtest");
    res.json({ success: false });
  } else {
    var result = db.insertOrder(req.body);
    if (result == null || result == undefined) {
      console.log("result success");
      res.json({ success: true });
    } else {
      console.log("result failure");
      res.json({ success: false });
    }
  }
});

var router = express.Router();

app.use("/router", router);


app.listen(port, () => {
  console.log(`App running on port ${port}.`);
});
