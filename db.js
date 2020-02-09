const { Pool } = require("pg");
const fs = require('fs');


const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "webshop",
  password: "qwer1234",
  port: 5432
});

// const getItems = (request, response) => {
//   pool.query('SELECT * FROM "ITEMS"', (error, results) => {
//     var result;
//     if(error){
//       console.log(error);
//     }else{
//        result = results.rows; 
//     }
//     console.log(result);
//     response.status(200).json(result);
//   });
// };

const getItems = (request, response) => {
  fs.readFile('./data/items.json', (err, data) => {
    if (err) throw err;
    let items = JSON.parse(data);
    response.status(200).json(items);
});
};

const insertOrder = order => {
  console.log(order);
  pool.query(
    'INSERT INTO "ORDERS" ("firstName", "lastName", "deliveryAddress", note, time, "phoneNumber", "email") VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING id',
    [order.firstName, order.lastName, order.deliveryAddress, order.note, new Date(), order.phoneNumber, order.email],
    (error, results) => {
      console.log(error);
      console.log(results);

      var id = results.rows[0].id;
      if (!error) {
        for (var i = 0; i < order.items.length; ++i) {
          pool.query(
            'INSERT INTO "ORDER_ITEMS" ("orderId", "itemId", quantity) VALUES($1, $2, $3)',
            [id, order.items[i].id, order.items[i].countInBag],
            (error, results) => {
              // console.log(error);
              // console.log(results);
            }
          );
        }
      }
      return id;
    }
  );
};

module.exports = {
  getItems,
  insertOrder
};
