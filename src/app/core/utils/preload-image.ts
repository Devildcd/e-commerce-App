import { Observable } from 'rxjs';

export function preloadImage(url: string): Observable<void> {
  return new Observable<void>((sub) => {
    const img = new Image();

    const done = () => {
      img.onload = null;
      img.onerror = null;
      sub.next();
      sub.complete();
    };

    img.onload = done;
    img.onerror = done;
    img.src = url;

    return () => done();
  });
}