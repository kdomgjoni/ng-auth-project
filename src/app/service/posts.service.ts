import { Injectable } from '@angular/core';
import { IPosts } from '../model/posts.model';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PostsService {
  constructor() { }

  posts: IPosts[] = [
    {
      id: this.getRandomNumber(),
      title: 'this is title',
      description: 'this is description',
      image: 'https://www.publicdomainpictures.net/pictures/320000/nahled/background-image.png'
    },
    {
      id: this.getRandomNumber(),
      title: 'this is title two',
      description: 'this is description two',
      image: 'https://www.publicdomainpictures.net/pictures/320000/nahled/background-image.png'
    }
  ];

  posts$ = new BehaviorSubject<IPosts[]>(this.posts);

  getRandomNumber() {
    return Math.floor(Math.random() * 10000);
  }

  addPost(post: IPosts){
    this.posts = [
      ...this.posts,{
        ...post,
        id: this.getRandomNumber()
      }
    ];
    this.posts$.next(this.posts);
  }


}
