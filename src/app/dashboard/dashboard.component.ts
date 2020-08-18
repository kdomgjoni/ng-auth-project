import { Component, OnInit, OnDestroy, PLATFORM_ID, Inject, ViewChild, ElementRef } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  @ViewChild('video', {static: true}) video: ElementRef<HTMLVideoElement>;

  constructor(@Inject(PLATFORM_ID) private _platform: Object) { }

  ngOnInit() {
  }

  onStart(){
    if(isPlatformBrowser(this._platform) && 'mediaDevices' in navigator) {
      navigator.mediaDevices.getUserMedia({video: true}).then((ms: MediaStream) => {
        const _video = this.video.nativeElement;
        _video.srcObject = ms;
        _video.play();
      });
    }
  }

}
