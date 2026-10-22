const test = require("node:test");
const assert = require("node:assert/strict");
const { createApp } = require("../server");

async function withApp(fn) {
  const app = createApp(":memory:");
  await app.sequelize.sync();
  try {
    await fn(app);
  } finally {
    await app.sequelize.close();
  }
}

function listen(app) {
  return new Promise((resolve) => {
    const server = app.listen(0, () => resolve(server));
  });
}

async function request(server, method, path, body) {
  const port = server.address().port;
  const res = await fetch(`http://127.0.0.1:${port}${path}`, {
    method,
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  return { status: res.status, body: text ? JSON.parse(text) : null };
}

test("POST /items creates an item", async () => {
  await withApp(async (app) => {
    const server = await listen(app);
    try {
      const res = await request(server, "POST", "/items", { name: "Widget", description: "A thing" });
      assert.equal(res.status, 201);
      assert.equal(res.body.name, "Widget");
      assert.ok(res.body.id);
    } finally {
      server.close();
    }
  });
});

test("POST /items without name returns 400", async () => {
  await withApp(async (app) => {
    const server = await listen(app);
    try {
      const res = await request(server, "POST", "/items", { description: "no name" });
      assert.equal(res.status, 400);
    } finally {
      server.close();
    }
  });
});

test("GET /items lists all items", async () => {
  await withApp(async (app) => {
    const server = await listen(app);
    try {
      await request(server, "POST", "/items", { name: "A" });
      await request(server, "POST", "/items", { name: "B" });
      const res = await request(server, "GET", "/items");
      assert.equal(res.status, 200);
      assert.equal(res.body.length, 2);
    } finally {
      server.close();
    }
  });
});

test("GET /items/:id returns one item", async () => {
  await withApp(async (app) => {
    const server = await listen(app);
    try {
      const created = await request(server, "POST", "/items", { name: "A" });
      const res = await request(server, "GET", `/items/${created.body.id}`);
      assert.equal(res.status, 200);
      assert.equal(res.body.name, "A");
    } finally {
      server.close();
    }
  });
});

test("GET /items/:id returns 404 for missing item", async () => {
  await withApp(async (app) => {
    const server = await listen(app);
    try {
      const res = await request(server, "GET", "/items/999");
      assert.equal(res.status, 404);
    } finally {
      server.close();
    }
  });
});

test("PUT /items/:id updates an item", async () => {
  await withApp(async (app) => {
    const server = await listen(app);
    try {
      const created = await request(server, "POST", "/items", { name: "A", description: "old" });
      const res = await request(server, "PUT", `/items/${created.body.id}`, { description: "new" });
      assert.equal(res.status, 200);
      assert.equal(res.body.name, "A");
      assert.equal(res.body.description, "new");
    } finally {
      server.close();
    }
  });
});

test("PUT /items/:id returns 404 for missing item", async () => {
  await withApp(async (app) => {
    const server = await listen(app);
    try {
      const res = await request(server, "PUT", "/items/999", { name: "X" });
      assert.equal(res.status, 404);
    } finally {
      server.close();
    }
  });
});

test("DELETE /items/:id removes an item", async () => {
  await withApp(async (app) => {
    const server = await listen(app);
    try {
      const created = await request(server, "POST", "/items", { name: "A" });
      const del = await request(server, "DELETE", `/items/${created.body.id}`);
      assert.equal(del.status, 204);
      const get = await request(server, "GET", `/items/${created.body.id}`);
      assert.equal(get.status, 404);
    } finally {
      server.close();
    }
  });
});

test("DELETE /items/:id returns 404 for missing item", async () => {
  await withApp(async (app) => {
    const server = await listen(app);
    try {
      const res = await request(server, "DELETE", "/items/999");
      assert.equal(res.status, 404);
    } finally {
      server.close();
    }
  });
});
