import { Injectable } from '@angular/core';
import { IPosts } from '../model/posts.model';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PostsService {
  constructor(
    private http: HttpClient
  ) { }

  posts: IPosts[] = [
    {
      id: this.getRandomNumber(),
      title: 'this is title',
      description: 'this is description',
      image: 'https://p.bigstockphoto.com/GeFvQkBbSLaMdpKXF1Zv_bigstock-Aerial-View-Of-Blue-Lakes-And--227291596.jpg'
    },
    {
      id: this.getRandomNumber(),
      title: 'this is title two',
      description: 'this is description two',
      image: 'https://p.bigstockphoto.com/GeFvQkBbSLaMdpKXF1Zv_bigstock-Aerial-View-Of-Blue-Lakes-And--227291596.jpg'
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
        id: this.getRandomNumber(),
      }
    ];
    this.posts$.next(this.posts);
  }

  deletePost(id: number){
    const index = this.posts.findIndex(post => post.id === id);
    this.posts = [
      ...this.posts.slice(0, index),
      ...this.posts.slice(index + 1),
    ];
    this.posts$.next(this.posts);
  }

  getPost(id: number) {
    return this.posts.find(p => p.id == id);
  }



}


