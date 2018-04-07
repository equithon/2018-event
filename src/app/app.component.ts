
import { Component, ViewChild } from '@angular/core';
import { Platform, MenuController, Nav } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { DirectoryPage } from './../pages/directory/directory';
import { TutorialPage } from '../pages/tutorial/tutorial';
import { ScannerPage } from '../pages/scanner/scanner';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = TutorialPage;

  constructor(public platform: Platform, 
              public menu: MenuController,
              public statusBar: StatusBar, 
              public splashScreen: SplashScreen) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }

  openScanner(){
    this.nav.setRoot(ScannerPage);
    this.menu.close();
  }

  openDirectory(){
    this.nav.setRoot(DirectoryPage);
    this.menu.close();
  }
}

