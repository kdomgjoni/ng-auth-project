import { Component, ElementRef, OnInit, Renderer2, ViewChild, AfterContentInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PostsService } from '../service/posts.service';
import { IPosts } from '../model/posts.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  @ViewChild('video', { static: true }) videoElement: ElementRef;
  @ViewChild('canvas', { static: true }) canvas: ElementRef;
  constraints = {
    video: {
      facingMode: 'environment',
      width: { ideal: 4096 },
      height: { ideal: 2160 }
    }
  };
  postFrom: FormGroup;
  videoWidth = 0;
  videoHeight = 0;
  image = true;
  videoStream = false;
  postPage = true;
  picture; // Blobl iamge coverted from image64
  uploadImage = false; // hide input file when browser support webcam
  imgURL: any; // Input image url
  $posts;
  pic;


  posts: IPosts = {
    id: 0,
    title: '',
    description: '',
    image: '',
  };


  constructor(
    private renderer: Renderer2,
    private formBuilder: FormBuilder,
    private postService: PostsService
  ) {

    this.$posts = this.postService.posts$;
    // this.postService.posts$.subscribe(data => {
    //   data.forEach((i, index, arr) => {
    //     if (index === arr.length - 1) {
    //       this.pic = this.createImageFromBlob(i.image);
    //       console.log(this);
    //     }
    //   });
    // });

  }

  ngOnInit() {
    this.postFrom = this.formBuilder.group({
      title: [''],
      description: ['']
    });

  }



  get form() { return this.postFrom.controls; }

  savePost() {
    this.postService.addPost(this.posts);
    this.clearForm();
  }

  removePost(post){
    this.postService.deletePost(post.id);
  }

  onSubmit() {
    if (this.postFrom.invalid) {
      return;
    }
    this.posts.title = this.postFrom.controls.title.value;
    this.posts.description = this.postFrom.controls.description.value;
    this.posts.image = this.picture;
    this.savePost();

  }



  // show input image to DOM
  preview(files) {
    if (files.length === 0) {
      return;
    }

    const mimeType = files[0].type;
    if (mimeType.match(/image\/*/) == null) {

      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(files[0]);
    reader.onload = (e) => {
      this.imgURL = reader.result;
    }
  }


  // Start web cam if is supported from the browser otherwise show input image file
  startCamera() {
    if (!!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)) {
      navigator.mediaDevices.getUserMedia(this.constraints).then(this.attachVideo.bind(this)).catch(() => {
        this.uploadImage = true;
      });
    }
  }


  // Play video cam
  attachVideo(stream) {
    this.renderer.setProperty(this.videoElement.nativeElement, 'srcObject', stream);
    this.renderer.listen(this.videoElement.nativeElement, 'play', (event) => {
      this.videoHeight = this.videoElement.nativeElement.videoHeight;
      this.videoWidth = this.videoElement.nativeElement.videoWidth;
    });
  }


  // show the post Page where you can add posts
  addPost() {
    this.postPage = !this.postPage;
    this.startCamera();
  }


  // showing canvas image and reading it as a file
  capture() {
    this.image = false;
    this.videoStream = true;
    this.renderer.setProperty(this.canvas.nativeElement, 'width', this.videoWidth);
    this.renderer.setProperty(this.canvas.nativeElement, 'height', this.videoHeight);
    this.canvas.nativeElement.getContext('2d').drawImage(this.videoElement.nativeElement, 0, 0);
    this.picture = this.canvas.nativeElement.toDataURL();
    //this.picture = this.dataURItoBlob(this.canvas.nativeElement.toDataURL());
    // const reader = new FileReader();
    // reader.onload = () => {
    //   this.pic = reader.result;
    // }
    // reader.readAsDataURL(this.picture);

  }


  // Terminate web cam
  onStop() {
    this.image = true;
    this.videoStream = false;
    this.postPage = !this.postPage;
    this.videoElement.nativeElement.pause();
    (this.videoElement.nativeElement.srcObject as MediaStream).getVideoTracks()[0].stop();
    this.videoElement.nativeElement.srcObject = null;
    this.clearImage();

  }

  clearImage() {
    const contex = this.canvas.nativeElement.getContext('2d');
    contex.clearRect(0, 0, this.videoWidth, this.videoHeight);
    this.picture = '';
  }

  // Reset camera to take another pic
  resetCamera() {
    this.image = true;
    this.videoStream = false;
  }

  // Converting image to Blob
  dataURItoBlob(dataURI) {
    var byteString = atob(dataURI.split(',')[1]);
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    var ab = new ArrayBuffer(byteString.length);
    var ia = new Uint8Array(ab);
    for (var i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    var blob = new Blob([ab], { type: mimeString });
    return blob;
  }

  clearForm(){
    this.postFrom.reset();
  }

  // createImageFromBlob(image: Blob) {
  //   let reader = new FileReader();
  //   reader.addEventListener('load', () => {
  //     this.pic = reader.result;
  //   }, false);
  //   if (image) {
  //     reader.readAsDataURL(image);
  //   }
  // }


}
