import { Injectable, Injector } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse, HttpResponse } from '@angular/common/http'
import { Observable, throwError } from 'rxjs';
import { AuthService } from './service/auth.service';
import { catchError } from 'rxjs/operators';
import { NotificationService } from './service/notification.service'

@Injectable({
  providedIn: 'root'
})
export class InterceptorService implements HttpInterceptor {

  constructor(
    private authService: AuthService,
    private notifyService : NotificationService,
    private injector: Injector) {
  }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    const tokenValue = this.authService.getUserToken();
    const request = req.clone({
      setHeaders: {
        Autherization: `bearer ${tokenValue}`
      }
    })
    return next.handle(request).pipe(catchError(err => {
      let errorMessage = '';
      if (err.error instanceof ErrorEvent) {
        // client-side error
        errorMessage = `Error: ${err.error.message}`;
      } else {
        // server-side error
        errorMessage = `Error Code: ${err.status}\nMessage: ${err.message}`;
      }
      this.notifyService.showError("Wrong username or password !!", "Check Again");


      return throwError(errorMessage);

    }))
  }
}
