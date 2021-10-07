import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { Observable, Subject, throwError } from 'rxjs';

import { Post } from './post.model';

@Injectable({ providedIn: 'root' })
export class PostsService {
  API_END_POINT = "https://angular-complete-guide-9aa34-default-rtdb.asia-southeast1.firebasedatabase.app/post.json"
  error = new Subject<string>();

  constructor(private http: HttpClient) {}

  addPost(postData: Post): Observable<any> {
    return this.http
      .post<{ name: string }>(
        this.API_END_POINT,
        postData
      )
  }

  fetchPosts(): Observable<any> {
    return this.http
      .get<{ [key: string]: Post }>(
       this.API_END_POINT
      )
      .pipe(
        map(responseData => {
          const postsArray: Post[] = [];
          for (const key in responseData) {
            if (responseData.hasOwnProperty(key)) {
              postsArray.push({ ...responseData[key], id: key });
            }
          }
          return postsArray;
        }),
        catchError(errorRes => {
          // Send to analytics server
          return throwError(errorRes);
        })
      );
  }

  deletePosts(): Observable<any> {
    return this.http.delete(
      this.API_END_POINT
    );
  }
}
