import { Component, OnInit } from '@angular/core';
import { SaveContentService } from '../service/save-content.service';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-listing-page',
  templateUrl: './listing-page.component.html',
  styleUrls: ['./listing-page.component.css']
})
export class ListingPageComponent implements OnInit{

  postsLists:any;
  post:any;
  dtoptions:DataTables.Settings={}
  dtTrigger:Subject<any>=new Subject<any>();

  constructor(private service : SaveContentService,private router: Router){

  }

  ngOnInit(): void {
    this.dtoptions={
      pagingType: "simple_numbers",
      lengthChange:false

    }
    this.showTable();
  }

  showTable(){
    this.service.renderTable().subscribe(
      (res)=>{
        console.log(res);
        this.postsLists = res;
        this.dtTrigger.next(null);
      },
      (err) => {
        console.log(err);
      }
    )
  }

  getPost(postId:any){
    this.service.getPostById(postId).subscribe(
      (res)=>{
        this.post = res;
        this.router.navigate(['/edit',postId],{state:this.post[0]});
      },(err) =>{
        console.log(err);
      }
    )  
  }

  deletePost(postId:any){
    debugger;
    this.service.deletePost(postId).subscribe(
      (res) => {
        console.log(res);
        window.location.reload();
      },(err)=>{
        console.log(err);
      }
    )
  }

}
