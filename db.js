const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "webshop",
  password: "qwer1234",
  port: 5432
});

const getItems = (request, response) => {
  pool.query('SELECT * FROM "ITEMS"', (error, results) => {
    response.status(200).json(error ? error : results.rows);
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
