import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner';
import { Observable } from 'rxjs';
import { DetailProvider } from './../../providers/detail/detail';
import { Meteor } from 'meteor/meteor';


@Component({
  templateUrl: 'scanner.html'
})
export class ScannerPage {

    users;
    query_id: string;

	constructor(public platform: Platform,
                public qrScanner: QRScanner,
                public detail: DetailProvider) {
    }
   
    openScanner(){
		if(this.platform.is('cordova')){
			console.log('opening scanner');
			this.qrScanner.prepare()
            .then((status: QRScannerStatus) => {
                if (status.authorized) {
                // camera permission was granted


                // start scanning
                let scanSub = this.qrScanner.scan().subscribe((scanned: string) => {
					console.log('Scanned something', scanned);
					(window.document.querySelector('ion-app') as HTMLElement).classList.remove('cameraView');
                    this.qrScanner.hide(); // hide camera preview
                    scanSub.unsubscribe(); // stop scanning
                    this.query_id = scanned;
                    this.showScanned();
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

    showScanned() {
        let queried_user: any = Meteor.users.findOne({_id: this.query_id}) || null;
        let detail_type = queried_user ? 'user' : 'error';
        this.detail.showDetail({type: detail_type, info: queried_user});
    }

  }