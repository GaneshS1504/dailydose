import { CanDeactivateFn } from '@angular/router';
import { Observable } from 'rxjs';

export interface DeactivateInterface{
  canExit: () => boolean | Observable<boolean> | Promise<boolean>
}

export const serviceGuard: CanDeactivateFn<DeactivateInterface> = (comp,route,state) => {
  return comp.canExit();
};
