import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Observable, BehaviorSubject } from 'rxjs';
import { PrimitiveProduct } from '../models/product.model';
import { ProductsService } from './products.service';
import { NotifierService } from 'angular-notifier';

@Injectable({
  providedIn: 'root'
})
export class FavouriteService {
  apiUrl = `${environment.apiUrl}/user/favourites`;

  private favouritesSubject = new BehaviorSubject<PrimitiveProduct[]>([]);
  favourites$ = this.favouritesSubject.asObservable();

  constructor(
    private http: HttpClient,
    private productService: ProductsService,
    private notifier: NotifierService
  ) {}

  fetchFavourites(): void {
    this.http
      .get<PrimitiveProduct[]>(this.apiUrl, { withCredentials: true })
      .subscribe({
        next: (favourites) => {
          this.favouritesSubject.next(favourites);
        },
        error: (err) => console.error('Error fetching favourites:', err)
      });
  }

  toggleFavourite(productUid: string): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}?productUid=${productUid}`,
      null,
      { withCredentials: true }
    );
  }

  updateFavouritesLocally(productUid: string) {
    const favourites = this.favouritesSubject.getValue();
    const isAlreadyFavorite = favourites.some((fav) => fav.uid === productUid);

    if (isAlreadyFavorite) {
      this.favouritesSubject.next(
        favourites.filter((fav) => fav.uid !== productUid)
      );
      this.notifier.notify('warning', 'Usunięto produkt z ulubionych');
    } else {
      this.productService.getProductByUid(productUid).subscribe({
        next: (fullProduct) => {
          if (fullProduct) {
            this.favouritesSubject.next([...favourites, fullProduct]);
            this.notifier.notify('success', 'Dodano produkt do ulubionych');
          } else {
            console.error(`Product with uid ${productUid} not found`);
          }
        },
        error: (err) => {
          console.error(`Error fetching product with uid ${productUid}:`, err);
        }
      });
    }
  }
}
