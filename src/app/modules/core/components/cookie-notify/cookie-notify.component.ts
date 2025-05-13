import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-cookie-notify',
  templateUrl: './cookie-notify.component.html',
  styleUrls: ['./cookie-notify.component.scss']
})
export class CookieNotifyComponent implements OnInit {
  isVisible = false;

  ngOnInit(): void {
    const cookiesAccepted = localStorage.getItem('cookiesAccepted');
    if (!cookiesAccepted) {
      setTimeout(() => {
        this.isVisible = true;
      }, 100);
    }
  }

  acceptAllCookies(): void {
    this.setCookiesAccepted(true);
  }

  acceptNecessaryCookies(): void {
    this.setCookiesAccepted(false);
  }

  private setCookiesAccepted(acceptAll: boolean): void {
    localStorage.setItem('cookiesAccepted', 'true');
    localStorage.setItem('allCookies', String(acceptAll));
    this.hideNotification();
  }

  private hideNotification(): void {
    this.isVisible = false;
  }
}
