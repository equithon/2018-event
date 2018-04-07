import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Slides, MenuController } from 'ionic-angular';

import { ScannerPage } from './../scanner/scanner';


@Component({
  selector: 'page-tutorial',
  templateUrl: 'tutorial.html',
})
export class TutorialPage {

  show_skip: boolean = true;

  @ViewChild('slides') slides: Slides;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public menu: MenuController) {
  }

  ionViewDidEnter() {
  }

  toggleSkip(slide: Slides){
    this.show_skip = !slide.isEnd();
  }

  dismissTut(){
    this.navCtrl.setRoot(ScannerPage, {}, {animate: true});
  }

}
