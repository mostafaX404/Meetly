import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { BusyService } from '../services/busy-service';
import { delay, finalize, of, tap } from 'rxjs';

const cash = new Map<string,any>();

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  
  const  busyService = inject(BusyService)
if(req.method == "GET"){

  const cashresult = cash.get(req.url)

  if(cashresult){
    return of(cashresult)
  }

}
  
  busyService.Busy();

  return next(req).pipe(
    delay(500),
    tap(result=>{
      cash.set(req.url,result)
    })
    ,
    finalize(()=>{
      busyService.Idle()
    })
  );
};
