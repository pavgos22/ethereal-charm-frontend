declare module 'bootstrap' {
  export interface CarouselOptions {
    interval?: number | false;
    keyboard?: boolean;
    pause?: 'hover' | false;
    ride?: 'carousel' | boolean;
    wrap?: boolean;
    touch?: boolean;
  }

  export class Carousel {
    constructor(element: Element | string, options?: CarouselOptions);

    next(): void;

    prev(): void;

    pause(): void;

    cycle(): void;

    to(index: number): void;
  }
}
