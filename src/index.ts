import { Recat } from "./lib";

let count = 0;

function add() {
  count++;
  console.log("+");
  Recat.render(
    Recat.createElement(Hello, null),
    document.querySelector("#root")
  );
}

function minus() {
  count--;
  console.log("-");
  Recat.render(
    Recat.createElement(Hello, null),
    document.querySelector("#root")
  );
}

function Hello() {
  const hello = Recat.createElement(
    "div",
    null,
    Recat.createElement("h1", null, "hello"),
    Recat.createElement("h2", null, "react"),
    Recat.createElement("button", { onclick: add }, "+"),
    Recat.createElement("button", { onclick: minus }, "-"),
    // 由于我忘记处理文本节点可能是number的情况了，所以这里将就一下toString好了。。
    Recat.createElement("h3", null, count.toString()),
    Recat.createElement("input", null)
  );

  return hello;
}

Recat.render(Recat.createElement(Hello, null), document.querySelector("#root"));
