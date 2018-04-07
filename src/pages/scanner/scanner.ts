import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner';
import { Observable } from 'rxjs';
import * as moment from 'moment';


@Component({
  templateUrl: 'scanner.html'
})
export class ScannerPage {
    users;
   
	constructor(public platform: Platform,
				public qrScanner: QRScanner) {
    }
   
    openScanner(){
		if(this.platform.is('cordova')){
			console.log('opening scanner');
			this.qrScanner.prepare()
            .then((status: QRScannerStatus) => {
                if (status.authorized) {
                // camera permission was granted


                // start scanning
                let scanSub = this.qrScanner.scan().subscribe((text: string) => {
					console.log('Scanned something', text);
					(window.document.querySelector('ion-app') as HTMLElement).classList.remove('cameraView');
                    this.qrScanner.hide(); // hide camera preview
                    scanSub.unsubscribe(); // stop scanning
                });

				// show camera preview
				(window.document.querySelector('ion-app') as HTMLElement).classList.add('cameraView');
				this.qrScanner.resumePreview();
                this.qrScanner.show();

                // wait for user to scan something, then the observable callback will be called

                } else if (status.denied) {
                // camera permission was permanently denied
                // you must use QRScanner.openSettings() method to guide the user to the settings page
                // then they can grant the permission from there
                } else {
                // permission was denied, but not permanently. You can ask for permission again at a later time.
                }
            })
            .catch((e: any) => console.log('Error is', e));
		} else {
			console.log('cordova not running: make sure this is running natively on a phone.')
		}
        
    }

  }