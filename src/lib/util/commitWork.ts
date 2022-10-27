import { Fiber } from "../typings/Fiber";
import { updateDom } from "./updateDom";

/** 递归操纵dom渲染页面，该过程不可打断 */
export function commitWork(fiber: Fiber) {
  if (!fiber) return;
  if (fiber.stateNode) {
    let parentDom = fiber.return.stateNode;
    let parent = fiber.return.return;
    while (!parentDom && parent) {
      parentDom = parent.stateNode;
      parent = parent.return;
    }
    switch (fiber.effectTag) {
      case "DELETE":
        parentDom.removeChild(fiber.stateNode);
        break;
      case "CREATE":
        parentDom.appendChild(fiber.stateNode);
        break;
      case "REPLACE":
        console.log(fiber.alternate.stateNode === parentDom.childNodes[0]);
        console.log(fiber.alternate.stateNode, parentDom.childNodes[0]);

        parentDom.replaceChild(fiber.stateNode, fiber.alternate.stateNode);
        break;
      case "UPDATE":
        if (
          fiber.type !== "TEXT_ELEMENT" &&
          fiber.alternate.type !== "TEXT_ELEMENT"
        ) {
          updateDom(fiber.stateNode, fiber.alternate.props, fiber.props);
        }
        break;
      default:
        break;
    }
  }
  // if (fiber.return) fiber.return.stateNode.appendChild(fiber.stateNode);
  if (fiber.type !== "TEXT_ELEMENT") commitWork(fiber.child);
  commitWork(fiber.sibling);
}
