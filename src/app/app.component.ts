import { Component, ViewChild } from '@angular/core';
import { Platform, MenuController, ModalController, Nav, Events as EventControl, ToastController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { Meteor } from 'meteor/meteor';

import { AuthProvider } from './../providers/auth/auth';
import { UserRole } from './../../api/server/models';

import { TutorialPage } from '../pages/tutorial/tutorial';
import { HelpPage } from '../pages/help/help';

import { ScannerPage } from '../pages/scanner/scanner';
import { LoginPage } from './../pages/login/login';
import { SchedulePage } from './../pages/schedule/schedule';


export interface PageInterface {
  title: string,
  component: any, 
  display: string,
  class?: string,
  logsOut?: boolean, // page will log user out if true
  icon: string // side menu icon
}

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = Meteor.userId() ? ScannerPage : TutorialPage; 

  navigationPages: PageInterface[] = [
    //{ title: 'Scanner', component: ScannerPage, display: 'set', icon: '' }
  ];

  shiftsPages: PageInterface[] = [
    { title: 'Shifts', component: SchedulePage, display: 'show', icon: '' }
  ];

  loggedInPages: PageInterface[] = [
    { title: 'Log out', component: ScannerPage, logsOut: true, display: 'set', icon: '' }
  ];

  loggedOutPages: PageInterface[] = [
    { title: 'Log in', component: LoginPage, display: 'show', icon: '' }
  ];

  miscPages: PageInterface[] = [
    { title: 'Tutorial', component: TutorialPage, display: 'set', class: 'fullscreenModal', icon: '' },
    { title: 'Help', component: HelpPage, display: 'show', icon: '' }
  ]

  curAvatar: number = 0;
  
  constructor(public platform: Platform, 
              public menu: MenuController,
              public toastCtrl: ToastController,
              public auth: AuthProvider,
              public eventCtrl: EventControl,
              public statusBar: StatusBar, 
              public splashScreen: SplashScreen,
              public modalCtrl: ModalController,
              public screenOrient: ScreenOrientation) {
    
    platform.ready().then(() => {
      statusBar.styleDefault();
      splashScreen.hide();
      this.switchMenu(Meteor.userId() !== null); // displays correct menu for loggedIn status
      if(platform.is('cordova')) this.screenOrient.lock('portrait');
      this.refreshProfile(true);
      this.updateAvatar();
    });

    this.listenToLoginEvents();
    
  }


  openPage(page: PageInterface){

    if(page.logsOut){
      this.auth.logout();
      return;
    }

    switch(page.display) {
      case 'set': {
        this.nav.setRoot(page.component, {}, {animate: true});
        break;
      }

      case 'push': {
        // have tutorial display as a modal
        this.nav.push(page.component);
        break;
      }

      case 'show': {
        this.eventCtrl.publish('scanner:unfocus', Date.now());
        let newPage = this.modalCtrl.create(page.component, {}, { cssClass: page.class });
        newPage.onDidDismiss(() => {
          this.eventCtrl.publish('scanner:focus', Date.now());
        });
        newPage.present();
        break;
      }
    }
  }


  /* 
		Updates the side menu/shows updates whenever login/logout events happen
	*/
  listenToLoginEvents() { 

    this.eventCtrl.subscribe('user:register', () => {
      this.auth.alertUser('User successfully registered!');
      this.switchMenu(true);
    });

    this.eventCtrl.subscribe('user:login', () => {
      this.auth.alertUser('Welcome back!')
      this.switchMenu(true);
      this.refreshProfile(true);
      this.nav.setRoot(ScannerPage, {}, {animate: true});
    });

    this.eventCtrl.subscribe('user:logout', () => {
      this.auth.alertUser('Successfully logged out.');
      this.switchMenu(false);
      this.refreshProfile(true);
      this.statusBar.styleDefault();
    });

  }


  /* 
		Updates the profile of the user to reflect current state in db
	*/
  refreshProfile(userChanged: boolean) {
    this.statusBar.styleLightContent();
  
    let curUser = (Meteor.user() as any);
    
    try {

      if(userChanged){ 
        document.getElementById('profileName').innerHTML = curUser.firstName;
        document.getElementById('profileRole').innerHTML = this.auth.roleToString(curUser.role);
      }
      
      document.getElementById('shiftsView').style.display = 'none';
      if(curUser && curUser.checkedIn) document.getElementById('profileRegistered').style.display = 'inline';
      
      if(curUser && (curUser.role === UserRole.ORGANIZER || curUser.role === UserRole.VOLUNTEER)) {
        document.getElementById('profileScan').style.display = 'inline';
        document.getElementById('profileDetails').style.display = 'inline';
        document.getElementById('profileDetails').innerHTML = curUser.amtScanned;
        document.getElementById('shiftsView').style.display = 'inline';
        
      } else if (curUser && curUser.role === UserRole.HACKER) {
        document.getElementById('profileJudge').style.display = 'inline';
        document.getElementById('profileDetails').style.display = 'inline';
        document.getElementById('profileDetails').innerHTML = curUser.judgingLoc && curUser.judgingTime ? (new Date(curUser.judgingTime)).toString() + ' > ' + curUser.judgingLoc : 'Unreleased'

      } else {
        document.getElementById('profileDetails').style.display = 'inline';
        document.getElementById('profileScan').style.display = 'none';
        document.getElementById('profileJudge').style.display = 'none';

      } 

    } catch(err) {
      console.log(err);
    }
  }

  updateAvatar() {
    try {
      document.getElementById('avatar' + ((this.curAvatar + 1) % 6)).style.display = 'inline';
      document.getElementById('avatar' + (this.curAvatar)).style.display = 'none';
      this.curAvatar = (this.curAvatar + 1) % 6;
    } catch(err) {
      console.log(err);
    }
    
  }

  switchMenu(loggedIn) {
    this.menu.enable(loggedIn, 'loggedInView');
    this.menu.enable(!loggedIn, 'loggedOutView');
  }

}

