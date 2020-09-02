import { Component, OnInit } from '@angular/core';
import { PostsService } from 'src/app/service/posts.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-post-details',
  templateUrl: './post-details.component.html',
  styleUrls: ['./post-details.component.scss']
})
export class PostDetailsComponent implements OnInit {

  post;

  constructor(
    private postService: PostsService,
    private route: ActivatedRoute,
    ) {

  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.post = this.postService.getPost(params.id);
    });
  }

}
