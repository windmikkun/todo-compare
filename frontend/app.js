const $ = (id) => document.getElementById(id);

const BASE = {
  node: {
    url: "http://localhost:3000",
    path: "/api/nodeTodos",
  },
  laravel: {
    url: "http://localhost:8000",
    path: "/api/laravelTodos",
  },
};


function setLog(target, v) {
  $(`${target}Log`).textContent =
    typeof v === "string" ? v : JSON.stringify(v, null, 2);
}

async function request(base, options = {}) {
  const res = await fetch(`${base.url}${base.path}${options.suffix ?? ""}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  const text = await res.text();
  const data = text ? JSON.parse(text) : null;

  if (!res.ok) {
    throw new Error(`${res.status}\n${JSON.stringify(data)}`);
  }
  return data;
}

async function load(target) {
  const cfg = BASE[target];
  const todos = await request(cfg);
  const ul = document.getElementById(`${target}List`);
  ul.innerHTML = "";

  for (const t of todos) {
    const li = document.createElement("li");
    li.textContent = `${t.id}. ${t.title}`;

    const del = document.createElement("button");
    del.textContent = "Delete";
    del.onclick = async () => {
      await request(cfg, {
        method: "DELETE",
        suffix: `/${t.id}`,
      });
      await load(target);
    };

    li.appendChild(del);
    ul.appendChild(li);
  }
}


async function add(target) {
  const cfg = BASE[target];
  const input =
    target === "node"
      ? document.getElementById("nodeTitle")
      : document.getElementById("lvTitle");

  const title = input.value.trim();
  if (!title) return;

  await request(cfg, {
    method: "POST",
    body: JSON.stringify({ title }),
  });

  input.value = "";
  await load(target);
}


function bind(target) {
  $(`${target}ReloadBtn`).onclick = async () => {
    try {
      await load(target);
    } catch (e) {
      setLog(target, String(e));
    }
  };

  $(`${target}AddBtn`).onclick = async () => {
    try {
      await add(target);
    } catch (e) {
      setLog(target, String(e));
    }
  };
}

bind("node");
bind("laravel");

// 初回ロード（両方）
load("node").catch((e) => setLog("node", String(e)));
load("laravel").catch((e) => setLog("laravel", String(e)));
