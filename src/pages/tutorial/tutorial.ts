import { Component, ViewChild, OnInit } from '@angular/core';
import { NavController, NavParams, Slides, MenuController, Platform } from 'ionic-angular';
import { Meteor } from 'meteor/meteor';
import { ScannerPage } from './../scanner/scanner';
import { LoginPage } from './../login/login';
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner';


@Component({
  selector: 'page-tutorial',
  templateUrl: 'tutorial.html',
})
export class TutorialPage implements OnInit {

  showSkip: boolean = true;
  permissionGranted: boolean = false;


  @ViewChild('slides') slides: Slides;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public menu: MenuController,
              public platform: Platform,
              public qrScanner: QRScanner) {
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
    this.showSkip = !slide.isEnd();
  }

  dismissTut(loggedIn){
    this.navCtrl.setRoot((loggedIn ? ScannerPage : LoginPage), {}, {animate: true});
  }

  allowScanning(){
    if (this.platform.is('cordova')) {
			this.qrScanner.prepare().then((status) => {
        if (status.authorized) {
          document.getElementById('permission-granted').style.display = 'inline';
          document.getElementById('permission-ask').style.display = 'none';
        } else if (status.denied) {
         // The video preview will remain black, and scanning is disabled. We can
         // try to ask the user to change their mind, but we'll have to send them
         // to their device settings with `QRScanner.openSettings()`.
        }
     });
		} else {
			console.log('cordova not running: make sure this is running natively on a phone.')
		}
    
  }

}
