import { Component, ViewChild } from '@angular/core';
import { Platform, MenuController, ModalController, Nav, Events as EventControl, Modal, ToastController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Meteor } from 'meteor/meteor';

import { AuthProvider } from './../providers/auth/auth';

import { TutorialPage } from '../pages/tutorial/tutorial';
import { HelpPage } from '../pages/help/help';

import { ProfilePage } from '../pages/profile/profile';
import { ScannerPage } from '../pages/scanner/scanner';
import { DirectoryPage } from './../pages/directory/directory';
import { LoginPage } from './../pages/login/login';
import { SignupPage } from './../pages/signup/signup';
import { SchedulePage } from './../pages/schedule/schedule';


export interface PageInterface {
  title: string,
  name: string,
  component: any,
  logsOut?: boolean,
  icon: string
}

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = Meteor.userId() ? ScannerPage : TutorialPage; //NOT WORKING

  navigationPages: PageInterface[] = [
    { title: 'Scanner', name: 'ScannerPage', component: ScannerPage, icon: '' }
  ];

  organizerPages: PageInterface[] = [
    { title: 'Directory', name: 'DirectoryPage', component: DirectoryPage, icon: '' }
  ]

  loggedInPages: PageInterface[] = [
    { title: 'Profile', name: 'ProfilePage', component: ProfilePage, icon: '' },
    { title: 'Log out', name: 'ScannerPage', component: LoginPage, logsOut: true, icon: '' }
  ];

  loggedOutPages: PageInterface[] = [
    { title: 'Log in', name: 'LoginPage', component: LoginPage, icon: '' },
    { title: 'Sign up', name: 'LoginPage', component: SignupPage, icon: '' },
  ];

  miscPages: PageInterface[] = [
    { title: 'Tutorial', name: 'TutorialPage', component: TutorialPage, icon: '' },
    { title: 'Help', name: 'HelpPage', component: HelpPage, icon: '' }
  ]

  constructor(public platform: Platform, 
              public menu: MenuController,
              public toastCtrl: ToastController,
              public auth: AuthProvider,
              public eventCtrl: EventControl,
              public statusBar: StatusBar, 
              public splashScreen: SplashScreen) {

    console.log('starting')
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
      this.switchMenu(Meteor.user() !== null); // changes menu if the user is logged in
    });

    this.listenToLoginEvents();
    
  }

  openPage(page: PageInterface){
    if(page.logsOut){
      this.auth.logout();
    }
    this.nav.setRoot(page.component);
  }

  listenToLoginEvents() { 
    //add toast notifications!
    this.eventCtrl.subscribe('user:register', () => {
      this.alertUser('User successfully registered!');
      this.switchMenu(true);
    });

    this.eventCtrl.subscribe('user:login', () => {
      this.alertUser('Welcome back!')
      if ((Meteor.user() as any).role === 1) document.getElementById('organizerView').style.display = 'inline';
      this.switchMenu(true);
      this.nav.setRoot(ProfilePage, {}, {animate: true});
    });

    this.eventCtrl.subscribe('user:logout', () => {
      this.alertUser('Successfully logged out.');
      document.getElementById('organizerView').style.display = 'none';
      this.switchMenu(false);
    });
  }

  switchMenu(loggedIn) {
    this.menu.enable(loggedIn, 'loggedInView');
    this.menu.enable(!loggedIn, 'loggedOutView');
  }

  alertUser(msg: string) {
    let alert_toast = this.toastCtrl.create({
      message: msg,
      duration: 1000,
      position: 'top',
      showCloseButton: true
    })
    alert_toast.present();
  }
}

