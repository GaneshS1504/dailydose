import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import * as ClassicEditor from '../ckeditor/build/ckeditor';
import { SaveContentService } from '../service/save-content.service';
import { DeactivateInterface } from '../guard/service.guard';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-edit-post',
  templateUrl: './edit-post.component.html',
  styleUrls: ['./edit-post.component.css']
})
export class EditPostComponent implements OnInit,DeactivateInterface{
 
  post:any;
  blogContent!:FormGroup;
  public Editor:any = ClassicEditor;
  flag:boolean=true;
  postId:any;
  isSubmitted:boolean=false;
  
  titleMaxLength = 40;
  titleMinLength = 30;

  shortDescMaxLength = 80;
  shortDescMinLength = 70;

  constructor(private router:Router,private formBuilder:FormBuilder,private service:SaveContentService,
    private activateRoute: ActivatedRoute){
    this.post=this.router.getCurrentNavigation()?.extras.state;
    this.buildForm();
  }
  
  ngOnInit(){
    
  }

  onReady($event:any) {
    $event.ui
    .getEditableElement()
    .parentElement.insertBefore(
      $event.ui.view.toolbar.element,
      $event.ui.getEditableElement()
    );

    $event.plugins.get('FileRepository').createUploadAdapter = (loader:any) => {
      return new MyUploadAdapter(loader);
    };
  }

  public categoryData: { [key: string]: Object }[] = [
    { categoryName: 'News', categoryVal: 'news' },
    { categoryName: 'Sports', categoryVal: 'sports' },
    { categoryName: 'Entertainment', categoryVal: 'entertainment' },
    { categoryName: 'Technology', categoryVal: 'tech' },
    { categoryName: 'Business', categoryVal: 'business' },
    { categoryName: 'Travel', categoryVal: 'travel' }
  ];

  subCategory:{ [key: string]: Object }[] =[];

  public subCategoryData: { [key: string]: Object }[] = [
    { subCategoruName: 'Political', categoryVal: 'news', subCategoryVal: 'politics' },
    { subCategoruName: 'National', categoryVal: 'news', subCategoryVal: 'politics' },
    { subCategoruName: 'International', categoryVal: 'news', subCategoryVal: 'politics' },
    { subCategoruName: 'Cricket', categoryVal: 'sports', subCategoryVal: 'cricket' }
  ];

  buildForm(){
    this.blogContent = this.formBuilder.group({
      link:new FormControl(this.post.link,[Validators.required]),
      title: new FormControl(this.post.title,[Validators.required,Validators.minLength(this.titleMinLength),
        Validators.maxLength(this.titleMaxLength)]),
      desc: new FormControl(this.post.desc,[Validators.required]),
      shortDesc: new FormControl(this.post.shortDesc,[Validators.required,Validators.minLength(this.shortDescMinLength),
        Validators.maxLength(this.shortDescMaxLength)]),
      category: new FormControl(this.post.category,[Validators.required]),
      subCategory: new FormControl(this.post.subCategory)
    });
  
  }

  get title(){
    return this.blogContent.get('title');
  }

  get shortDesc(){
    return this.blogContent.get('shortDesc');
  }

  categoryChange(value:string){

    this.subCategory = this.subCategoryData.filter((item) => item['categoryVal'] == value);
    if(this.subCategory.length != 0){
      this.flag=false;
    }else{
      this.flag = true;
    }   
  }

  onSubmit(){
    this.isSubmitted=true;
    this.postId = this.activateRoute.snapshot.paramMap.get('postId');
    this.service.editPost(this.postId,this.blogContent.value).subscribe(
      (res) => {
        console.log(res);
        this.router.navigateByUrl('/posts');
      },(err) => {
        console.log(err);
      }
    )
  }
  
  canExit():boolean{
    debugger;
    if((this.blogContent.value) && !this.isSubmitted){
         return confirm('Changes are not saved!! Are you sure to exit current page?');
      }
      else{
        return true;
      }
  }
}

class MyUploadAdapter {
  xhr: any;
  loader: any;
  constructor(loader:any) {
    // The file loader instance to use during the upload.
    this.loader = loader;
  }
 
  // Starts the upload process.
  upload() {
    return this.loader.file
      .then((file:any) => new Promise((resolve, reject) => {
        this._initRequest();
        this._initListeners(resolve, reject, file);
        this._sendRequest(file);
      }));
  }
 
  // Aborts the upload process.
  abort() {
    if (this.xhr) {
      this.xhr.abort();
    }
  }
 
  // Initializes the XMLHttpRequest object using the URL passed to the constructor.
  _initRequest() {

    const xhr = this.xhr = new XMLHttpRequest();
 
    // Note that your request may look different. It is up to you and your editor
    // integration to choose the right communication channel. This example uses
    // a POST request with JSON as a data structure but your configuration
    // could be different.
    //Replace below url with your API url
    xhr.open('POST', 'http://localhost:8081/post/upload-image', true);
    xhr.responseType = 'json';
  }
 
  // Initializes XMLHttpRequest listeners.
  _initListeners(resolve:any, reject:any, file:any) {
    const xhr = this.xhr;
    const loader = this.loader;
    const genericErrorText = `Couldn't upload file: ${file.name}.`;
 
    xhr.addEventListener('error', () => reject(genericErrorText));
    xhr.addEventListener('abort', () => reject());
    xhr.addEventListener('load', () => {
      const response = xhr.response;
 
      // This example assumes the XHR server's "response" object will come with
      // an "error" which has its own "message" that can be passed to reject()
      // in the upload promise.
      //
      // Your integration may handle upload errors in a different way so make sure
      // it is done properly. The reject() function must be called when the upload fails.
      if (!response || response.error) {
        return reject(response && response.error ? response.error.message : genericErrorText);
      }
 
      // If the upload is successful, resolve the upload promise with an object containing
      // at least the "default" URL, pointing to the image on the server.
      // This URL will be used to display the image in the content. Learn more in the
      // UploadAdapter#upload documentation.
      resolve({
        default: response.url
      });
    });
 
    // Upload progress when it is supported. The file loader has the #uploadTotal and #uploaded
    // properties which are used e.g. to display the upload progress bar in the editor
    // user interface.
    if (xhr.upload) {
      xhr.upload.addEventListener('progress', (evt:any) => {
        if (evt.lengthComputable) {
          loader.uploadTotal = evt.total;
          loader.uploaded = evt.loaded;
        }
      });
    }
  }
 
  // Prepares the data and sends the request.
  _sendRequest(file:any) {
    // Prepare the form data.
    const data = new FormData();
 
    data.append('image', file);
 
    // Important note: This is the right place to implement security mechanisms
    // like authentication and CSRF protection. For instance, you can use
    // XMLHttpRequest.setRequestHeader() to set the request headers containing
    // the CSRF token generated earlier by your application.
 
    // Send the request.
    this.xhr.send(data);
  }
 }
