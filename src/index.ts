import { Recat } from "./lib";

function Hello() {
  const [count, setCount] = Recat.useState(0);

  const hello = Recat.createElement(
    "div",
    null,
    Recat.createElement("h1", null, "hello"),
    Recat.createElement("h2", null, "react"),
    Recat.createElement("button", { onclick: () => setCount(count + 1) }, "+"),
    Recat.createElement(
      "button",
      { onclick: () => setCount((count) => count - 1) },
      "-"
    ),
    // 由于我忘记处理文本节点可能是number的情况了，所以这里将就一下toString好了。。
    Recat.createElement("h3", null, count.toString())
    // Recat.createElement(Input, null)
  );

  return hello;
}

function Input() {
  const [value, setValue] = Recat.useState("");
  console.log(value);
  return Recat.createElement(
    "div",
    null,
    Recat.createElement("input", {
      value,
      oninput: (e: { target: { value: string } }) => {
        setValue(e.target.value);
      },
    }),
    Recat.createElement("div", null, value)
  );
}
Recat.render(Recat.createElement(Hello, null), document.querySelector("#root"));
// <Hello />