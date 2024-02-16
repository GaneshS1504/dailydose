import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SaveContentService {

  constructor(private http: HttpClient) { }
  private API_URL = "http://localhost:8081/post/add";
  private API_UPLOAD_IMAGE_URL = "http://localhost:8081/post/upload-image/";
  private API_SUBMIT_URL = "http://localhost:8081/post/submit/";
  private API_POSTS_LIST = "http://localhost:8081/post/getAllPosts";
  private API_GET_POST = "http://localhost:8081/post/getById";
  private API_EDIT_POST = "http://localhost:8081/post/update";
  private API_DELETE_POST = "http://localhost:8081/post/deleteById"

  addPost(post:any):Observable<any>{
    debugger;
    return this.http.post(this.API_URL,post).pipe(
      catchError((err) => {
        console.log(err);
        return throwError(err);
      })
    );
  }

  uploadImage(imageData:any,postId:any,imageType:any){
    debugger;
    return this.http.post(this.API_UPLOAD_IMAGE_URL+postId+"/"+imageType,imageData).pipe(
      catchError((err) => {
        console.log(err);
        return throwError(err);
      })
    );
  }

  saveAndSubmitPost(postData:any,postId:any){
    debugger;
    return this.http.post(this.API_SUBMIT_URL+postId,postData).pipe(
      catchError((err) => {
        console.log(err);
        return throwError(err);
      })
    );
  }

  renderTable():Observable<any>{
    return this.http.get(this.API_POSTS_LIST).pipe(
      catchError((err) => {
        console.log(err);
        return throwError(err);
      }
      )
    )
  }

  getPostById(postId:any){
    return this.http.get(this.API_GET_POST+"/"+postId).pipe(
      catchError((err) => {
        console.log(err);
        return throwError(err);
      }
    )
    )
  }

  editPost(postId:any,postRequest:any){
    return this.http.put(this.API_EDIT_POST+"/"+postId,postRequest).pipe(
      catchError((err) => {
        console.log(err);
        return throwError(err);
      }
    )
    )
  }

  deletePost(postId:any){
    return this.http.delete(this.API_DELETE_POST+"/"+postId).pipe(
      catchError((err) => {
        console.log(err);
        return throwError(err);
      }
    )
    )
  }
}
