import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule, NavController} from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner';
import { MomentModule } from 'angular2-moment';

import { ScannerPage } from '../pages/scanner/scanner';
import { SchedulePage } from './../pages/schedule/schedule';
import { LoginPage } from './../pages/login/login';

import { ResultPage } from './../pages/result/result';

import { HelpPage } from './../pages/help/help';
import { TutorialPage } from '../pages/tutorial/tutorial';

import { AuthProvider } from './../providers/auth/auth';

import { MyApp } from './app.component';


@NgModule({
  declarations: [
    MyApp,
    ScannerPage,
    SchedulePage,
    TutorialPage,
    HelpPage,
    LoginPage,
    ResultPage
    
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    MomentModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    ScannerPage,
    TutorialPage,
    HelpPage,
    LoginPage,
    ResultPage,
    SchedulePage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    QRScanner,
    AuthProvider,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
  ]
})
export class AppModule {}
