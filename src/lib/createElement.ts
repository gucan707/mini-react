import { VDom } from "./typings/VDom";

export function createElement(
  type: keyof HTMLElementTagNameMap | Function,
  props: Record<string, any>,
  ...children: VDom[]
): VDom {
  return {
    type,
    props: {
      ...props,
      children,
    },
  };
}
