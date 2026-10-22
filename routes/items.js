const express = require("express");

module.exports = function itemsRouter(Item) {
  const router = express.Router();

  // POST /items - create
  router.post("/", async (req, res) => {
    const { name, description } = req.body;
    if (!name) return res.status(400).json({ error: "name is required" });
    const item = await Item.create({ name, description });
    res.status(201).json(item);
  });

  // GET /items - list all
  router.get("/", async (req, res) => {
    const items = await Item.findAll();
    res.json(items);
  });

  // GET /items/:id - get one
  router.get("/:id", async (req, res) => {
    const item = await Item.findByPk(req.params.id);
    if (!item) return res.status(404).json({ error: "not found" });
    res.json(item);
  });

  // PUT /items/:id - update
  router.put("/:id", async (req, res) => {
    const item = await Item.findByPk(req.params.id);
    if (!item) return res.status(404).json({ error: "not found" });
    const { name, description } = req.body;
    if (name !== undefined) item.name = name;
    if (description !== undefined) item.description = description;
    await item.save();
    res.json(item);
  });

  // DELETE /items/:id - delete
  router.delete("/:id", async (req, res) => {
    const item = await Item.findByPk(req.params.id);
    if (!item) return res.status(404).json({ error: "not found" });
    await item.destroy();
    res.status(204).send();
  });

  return router;
};
