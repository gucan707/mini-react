import { Fiber } from "../typings/Fiber";
import { updateDom } from "./updateDom";

/** 递归操纵dom渲染页面，该过程不可打断 */
export function commitWork(fiber: Fiber) {
  if (!fiber) return;
  switch (fiber.effectTag) {
    case "DELETE":
      fiber.return.stateNode.removeChild(fiber.stateNode);
      break;
    case "CREATE":
      fiber.return.stateNode.appendChild(fiber.stateNode);
      break;
    case "REPLACE":
      fiber.return.stateNode.replaceChild(
        fiber.stateNode,
        fiber.alternate.stateNode
      );
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
  // if (fiber.return) fiber.return.stateNode.appendChild(fiber.stateNode);
  if (fiber.type !== "TEXT_ELEMENT") commitWork(fiber.child);
  commitWork(fiber.sibling);
}
