import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContentComponent } from './content/content.component';
import { UploadImageComponent } from './upload-image/upload-image.component';
import { ListingPageComponent } from './listing-page/listing-page.component';
import { EditPostComponent } from './edit-post/edit-post.component';
import { serviceGuard } from './guard/service.guard';


const routes: Routes = [
  {path:'add-post',component:ContentComponent,canDeactivate:[serviceGuard]},
  {path: 'upload-image/:postId',component:UploadImageComponent},
  {path:'posts',component:ListingPageComponent},
  {path:'edit/:postId',component:EditPostComponent,canDeactivate:[serviceGuard]},
  {path:'',redirectTo:"posts",pathMatch:"full"}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
