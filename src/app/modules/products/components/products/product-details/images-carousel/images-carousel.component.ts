import {
  Component,
  Input,
  ViewChild,
  ElementRef,
  AfterViewInit
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

  @ViewChild('carousel', { static: true }) carousel!: ElementRef<HTMLElement>;

  ngAfterViewInit(): void {
    new Carousel(this.carousel.nativeElement, {
      interval: 5000,
      ride: 'carousel',
      wrap: true,
      touch: true
    });
  }
}
