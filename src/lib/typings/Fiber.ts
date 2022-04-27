// 这和真实的fiber结构还是有很大出入的，在此为了方便我们将其修改为下面的简单结构
// 对于普通文本节点也不能仅 string 了事，文本节点也需要有return等指向
export const TEXT_ELEMENT = "TEXT_ELEMENT";
type EffectTag = "UPDATE" | "REPLACE" | "DELETE" | "CREATE" | "NO_EFFECT";
export type Fiber =
  | ((
      | {
          // 普通的html标签
          type: keyof HTMLElementTagNameMap;
          props:
            | {
                [K in string]: any;
              }
            | null;
          child: Fiber;
          stateNode: HTMLElement | null; // fiber对应的dom元素，create之前都是null
        }
      | {
          // 文本节点
          type: "TEXT_ELEMENT";
          value: string;
          stateNode: Text | null;
        }
    ) & {
      sibling: Fiber;
      return: Fiber;
      alternate: Fiber;
      effectTag: EffectTag;
    })
  | null;
