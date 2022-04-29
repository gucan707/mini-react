export type VDom =
  | {
      type: keyof HTMLElementTagNameMap | Function;
      props: {
        [K in string]: any;
      } & {
        children: VDom[];
      };
    }
  | string;
