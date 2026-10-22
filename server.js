const express = require("express");
const { createDb } = require("./db");
const itemsRouter = require("./routes/items");

function createApp(storage) {
  const { sequelize, Item } = createDb(storage);
  const app = express();
  app.use(express.json());
  app.use("/items", itemsRouter(Item));
  app.sequelize = sequelize;
  app.Item = Item;
  return app;
}

async function start() {
  const app = createApp();
  await app.sequelize.sync();
  const port = process.env.PORT || 3000;
  app.listen(port, () => console.log(`listening on :${port}`));
}

if (require.main === module) {
  start();
}

module.exports = { createApp };
