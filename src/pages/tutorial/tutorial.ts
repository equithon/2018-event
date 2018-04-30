import { Component, ViewChild, OnInit } from '@angular/core';
import { NavController, NavParams, Slides, MenuController, Platform, ModalController, Events as EventControl, ViewController } from 'ionic-angular';
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

  @ViewChild('slides') slides: Slides;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public menu: MenuController,
              public platform: Platform,
              public qrScanner: QRScanner,
              public modalCtrl: ModalController,
              public eventCtrl: EventControl,
              public view: ViewController) {
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

  dismissTut(showLogin){
    if(showLogin) {
      //this.eventCtrl.publish('scanner:unfocus', Date.now());
      let loginView = this.modalCtrl.create(LoginPage);
      /*loginView.onDidDismiss(() => {
        this.navCtrl.setRoot(ScannerPage);
      })*/
      loginView.present();
    } else {
      this.navCtrl.setRoot(ScannerPage);
    }
  }

  allowScanning(){
    if (this.platform.is('cordova')) {
			this.qrScanner.prepare().then((status: QRScannerStatus) => {
        if (status.authorized) {
          document.getElementById('permission-granted').style.display = 'inline';
          document.getElementById('permission-ask').style.display = 'none';
        }
     });
		} else {
			console.log('cordova not running: make sure this is running natively on a phone.')
		}
    
  }

}
