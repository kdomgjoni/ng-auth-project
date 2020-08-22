import { Component, ElementRef, OnInit, Renderer2, ViewChild, AfterContentInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

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
      facingMode: "environment",
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


  constructor(
    private renderer: Renderer2,
    private formBuilder: FormBuilder) { }

  ngOnInit() {
      this.postFrom = this.formBuilder.group({
        title: ['', Validators.required],
        description: ['', Validators.required]
      });
  }

  get form() { return this.postFrom.controls; }

  onSubmit(){
    if(this.postFrom.invalid){
      return;
    }

    console.log(this.form);
  }


  startCamera() {
    if (!!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)) {
      navigator.mediaDevices.getUserMedia(this.constraints).then(this.attachVideo.bind(this)).catch(this.handleError);
    } else {
      alert('Sorry, camera not available.');
    }
  }

  handleError(error) {
    console.log('Error: ', error);
  }

  attachVideo(stream) {
    this.renderer.setProperty(this.videoElement.nativeElement, 'srcObject', stream);
    this.renderer.listen(this.videoElement.nativeElement, 'play', (event) => {
      this.videoHeight = this.videoElement.nativeElement.videoHeight;
      this.videoWidth = this.videoElement.nativeElement.videoWidth;
    });
  }

  addPost(){
    this.postPage = !this.postPage;
    this.startCamera();
  }

  capture() {
    this.image = false;
    this.videoStream = true;
    this.renderer.setProperty(this.canvas.nativeElement, 'width', this.videoWidth);
    this.renderer.setProperty(this.canvas.nativeElement, 'height', this.videoHeight);
    this.canvas.nativeElement.getContext('2d').drawImage(this.videoElement.nativeElement, 0, 0);
  }

  onStop() {
    this.image = true;
    this.videoStream = false;
    this.postPage = !this.postPage;
    this.videoElement.nativeElement.pause();
    (this.videoElement.nativeElement.srcObject as MediaStream).getVideoTracks()[0].stop();
    this.videoElement.nativeElement.srcObject = null;
  }

  resetCamera(){
    this.image = true;
    this.videoStream = false;
  }


}
