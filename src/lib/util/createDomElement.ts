import { Fiber } from "../typings/Fiber";

// createDOMElement不再深度create，只创建当前fiber的dom元素
export function createDOMElement(fiber: Fiber): HTMLElement | Text {
  if (fiber.type instanceof Function) throw new Error("内部错误");
  if (fiber.type === "TEXT_ELEMENT") {
    const textNode = document.createTextNode(fiber.value);
    return textNode;
  }
  const node = document.createElement(fiber.type);
  for (const key in fiber.props || {}) {
    if (key === "children") continue;
    if (key.startsWith("on")) {
      node.addEventListener(key.slice(2), fiber.props[key]);
      continue;
    }
    node.setAttribute(key, fiber.props[key]);
  }
  return node;
}
