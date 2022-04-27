export function updateDom(
  dom: HTMLElement,
  preProps: Record<string, any>,
  curProps: Record<string, any>
) {
  const isEvent = (key: string) => key.startsWith("on");
  const isProperty = (key: string) => key !== "children" && !isEvent(key);
  const isNew = (key: string) => preProps[key] !== curProps[key];
  const isGone = (key: string) => !(key in curProps);

  const prePropsKey = Object.keys(preProps);
  const curPropsKey = Object.keys(curProps);

  // 移除旧事件
  prePropsKey
    .filter(isEvent)
    .filter((key) => isNew(key) || isGone(key))
    .forEach((key) => dom.removeEventListener(key.slice(2), preProps[key]));

  // 移除旧属性
  prePropsKey.filter(isProperty).filter(isGone).forEach(dom.removeAttribute);

  // 添加新事件
  curPropsKey
    .filter(isEvent)
    .filter(isNew)
    .forEach((key) => dom.addEventListener(key.slice(2), curProps[key]));

  // 添加新属性
  curPropsKey
    .filter(isProperty)
    .filter(isNew)
    .forEach((key) => dom.setAttribute(key, curProps[key]));
}
