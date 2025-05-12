import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-images-carousel',
  templateUrl: './images-carousel.component.html',
  styleUrls: ['./images-carousel.component.scss']
})
export class ImagesCarouselComponent {
  @Input() productName!: string;
  @Input() imageUrls!: string[];
}
