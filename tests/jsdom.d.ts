declare module "jsdom" {
  export class JSDOM {
    constructor(html?: string, options?: { url?: string });
    window: {
      document: Document;
      navigator: Navigator;
      HTMLElement: typeof HTMLElement;
      Node: typeof Node;
      MutationObserver: typeof MutationObserver;
      getComputedStyle: typeof getComputedStyle;
    };
  }
}
