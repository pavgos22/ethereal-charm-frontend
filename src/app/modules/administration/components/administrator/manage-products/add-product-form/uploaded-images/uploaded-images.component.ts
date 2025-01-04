import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Image } from '../../../../../../core/models/image.model';
import { ImageService } from '../../../../../../core/services/image.service';

@Component({
  selector: 'app-uploaded-images',
  templateUrl: './uploaded-images.component.html',
  styleUrls: ['./uploaded-images.component.scss']
})
export class UploadedImagesComponent implements OnInit {
  @Input() imageUrls: Image[] = [];
  @Output() deleteImageUrl = new EventEmitter<Image[]>();

  constructor(private imageService: ImageService) {}

  activeImage = '';
  errorMsg: null | string = null;

  ngOnInit(): void {
    this.activeImage = this.imageUrls[0].url;
  }

  setActiveImage(url: string) {
    this.activeImage = url;
  }

  deleteImage(url: string) {
    const [, uuid] = url.split('uuid=');
    this.imageService.deleteImage(uuid).subscribe({
      next: () => {
        this.imageUrls = this.imageUrls.filter((image) => image.url !== url);
        this.deleteImageUrl.emit([...this.imageUrls]);
        if (this.imageUrls.length > 0) {
          this.activeImage = this.imageUrls[0].url;
        }
      },
      error: (err) => {
        this.errorMsg = err;
      }
    });
  }
}
