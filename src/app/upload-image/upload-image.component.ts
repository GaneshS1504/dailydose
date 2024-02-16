import { Component, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SaveContentService } from '../service/save-content.service';

@Component({
  selector: 'app-upload-image',
  templateUrl: './upload-image.component.html',
  styleUrls: ['./upload-image.component.css']
})
export class UploadImageComponent {

  @ViewChild('imageType') type!: ElementRef;
  @ViewChild('imageInput') file!: ElementRef;

  constructor(private activatedRoute: ActivatedRoute, private service: SaveContentService,
    private router:Router){}
  postId!:any;
  postData!:any;

  processFile(imageInput:any){

    debugger;
    const file = imageInput.files[0];
    const formData = new FormData();
    const imageType = this.type.nativeElement.value;
    formData.append('image',file);
    this.postId = this.activatedRoute.snapshot.paramMap.get('postId');
    this.service.uploadImage(formData,this.postId,imageType).subscribe(
      (res) => {
       console.log(res)
      },
      (err) => {
        console.log(err);
      }
    )

  }

  submitData(){
     this.postData = localStorage.getItem('post');
     const parsedPost = JSON.parse(this.postData);
     this.postId = this.activatedRoute.snapshot.paramMap.get('postId');
     this.service.saveAndSubmitPost(parsedPost,this.postId).subscribe(
      (res) => {
        localStorage.removeItem("post");
        this.router.navigateByUrl("");
      },
      (err) => {
        console.log(err);
      }
    )
  }

  clearInputs(){
    this.type.nativeElement.value = '';
    this.file.nativeElement.value = '';
  }
}
