import {Injectable} from "@angular/core";
import {MatSnackBar} from "@angular/material/snack-bar";

@Injectable()
export class CoreService {

  constructor(private _snackBar: MatSnackBar) {}

  openSnackBar(message: string, action: string = 'ok') {
    this._snackBar.open(message, action, {
      duration: 5000,
      verticalPosition: 'top',
    });
  }

  public handlerException = (err: any) => {
    // Do messaging and error handling here
    console.log("Error occured");
    console.log(err);
    var errorBody = "";
    if (err.error === undefined) {
      if (err[0]) {
        errorBody = err[0].description;
      } else {
        errorBody = err.message;
      }
    } else {
      if (Array.isArray(err['error'])) {
        err['error'].forEach(msg => {
          errorBody += msg.description + "\n"
        });
      } else {
        if (err['error'] !== undefined && err['error'].message !== undefined) {
          errorBody = err['error'].message;
        } else if (err.message !== undefined && err.message !== undefined) {
          errorBody = err.message;
        } else {
          errorBody = JSON.stringify(err);
        }
      }

    }
    return errorBody;
  };
}
