import { Component, ViewChild, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, Slides, MenuController, Platform } from 'ionic-angular';
import { Meteor } from 'meteor/meteor';
import { ScannerPage } from './../scanner/scanner';
import { LoginPage } from './../login/login';


@Component({
  selector: 'page-tutorial',
  templateUrl: 'tutorial.html',
})
export class TutorialPage implements OnInit {

  show_skip: boolean;

  @ViewChild('slides') slides: Slides;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public menu: MenuController,
              public platform: Platform) {
    this.show_skip = true;
  }

  ionViewDidLoad(){
  }

  ngOnInit() {
    if(Meteor.userId()) {
      console.log('loading logged in view');
      document.getElementById('loggedOutEnd').style.display = 'none';
      document.getElementById('loggedInEnd').style.display = 'default';
    } else {
      console.log('loading logged out view');
      document.getElementById('loggedOutEnd').style.display = 'default';
      document.getElementById('loggedInEnd').style.display = 'none';
    }
  }

  toggleSkip(slide: Slides){
    this.show_skip = !slide.isEnd();
  }

  dismissTut(loggedIn){
    this.navCtrl.setRoot((loggedIn ? ScannerPage : LoginPage), {}, {animate: true});
  }

}
