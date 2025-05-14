import {
  Component,
  Input,
  ViewChild,
  ElementRef,
  AfterViewInit,
  ChangeDetectorRef
} from '@angular/core';
import { Carousel } from 'bootstrap';

@Component({
  selector: 'app-images-carousel',
  templateUrl: './images-carousel.component.html',
  styleUrls: ['./images-carousel.component.scss']
})
export class ImagesCarouselComponent implements AfterViewInit {
  @Input() productName!: string;
  @Input() imageUrls!: string[];

  @ViewChild('carousel', { static: true }) carouselEl!: ElementRef<HTMLElement>;

  constructor(private cd: ChangeDetectorRef) {}

  ngAfterViewInit(): void {
    const carouselElement = this.carouselEl.nativeElement;

    carouselElement.setAttribute('data-bs-ride', 'carousel');

    const instance = new Carousel(carouselElement, {
      interval: 200000,
      wrap: true,
      touch: true
    });

    instance.cycle();
  }

  trackByIdx(_: number, __: unknown): number {
    return _;
  }
}
