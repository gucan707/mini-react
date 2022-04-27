export type VDom =
  | {
      type: keyof HTMLElementTagNameMap;
      props: {
        [K in string]: any;
      } & {
        children: VDom[];
      };
    }
  | string;
