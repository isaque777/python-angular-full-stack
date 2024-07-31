import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import { CoreService } from '../service/core.service';


@Injectable()
export class AppErrorInterceptor implements HttpInterceptor {
  constructor(private _coreService: CoreService) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(catchError(err => {
      // const error = err.error.message || err.statusText;
      this._coreService.openSnackBar(this._coreService.handlerException(err), "Error!");
      return throwError(err);
    }))
  }
}
