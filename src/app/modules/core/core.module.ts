import { NgModule } from '@angular/core';
import { HeaderComponent } from './components/header/header.component';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ErrorHandlingInterceptor } from './interceptors/error-handling.interceptor';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { MatPaginatorCustomIntl } from './material/mat-paginator-custom-intl';
import { CookieNotifyComponent } from './components/cookie-notify/cookie-notify.component';
import { FooterComponent } from './components/footer/footer.component';

@NgModule({
  declarations: [HeaderComponent, CookieNotifyComponent, FooterComponent],
  imports: [SharedModule, HttpClientModule, RouterLink, RouterLinkActive],
  exports: [HeaderComponent, CookieNotifyComponent, FooterComponent],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorHandlingInterceptor,
      multi: true
    },
    {
      provide: MatPaginatorIntl,
      useClass: MatPaginatorCustomIntl
    }
  ]
})
export class CoreModule {}
