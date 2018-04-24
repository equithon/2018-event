import { Component } from '@angular/core';
import { Platform, Events as EventControl } from 'ionic-angular';
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner';
import { Observable } from 'rxjs';

import { Meteor } from 'meteor/meteor';
import { UserRole, Event, TimeIntervals } from './../../../api/server/models';
import { Events } from './../../../api/server/collections/events';
import { AuthProvider } from './../../providers/auth/auth';
import { DetailProvider } from './../../providers/detail/detail';
import { DataProvider } from './../../providers/data/data';

@Component({
	templateUrl: 'scanner.html'
})
export class ScannerPage {

	users: any[];
	queryId: string;
	eventOptions: Event[];
	eventChosen: string;

	constructor(public platform: Platform,
							public qrScanner: QRScanner,
							public detail: DetailProvider,
							public auth: AuthProvider,
							public data: DataProvider,
							public eventCtrl: EventControl) {
		this.eventOptions = Events.find({}).fetch();
		/*this.eventOptions = Events.find({}).fetch().filter((evnt) => {
			evnt.time_start - TimeIntervals.hour <= Date.now() && Date.now() <= evnt.time_end + TimeIntervals.hour
		}); */ // TODO: UNCOMMENT THIS FOR ACCURATE EVENT SELECTIONS
	}

	ionViewDidLoad(){
		if (Meteor.user() && ((Meteor.user() as any).role === UserRole.ORGANIZER || (Meteor.user() as any).role === UserRole.VOLUNTEER)) {
			console.log('should be displaying event selector')
			this.eventChosen = (Meteor.user() as any).specificInfo.atEvent;
			document.getElementById('eventSelector').style.display = 'inline';
		} else {
			document.getElementById('eventSelector').style.display = 'none';
		}
	}

	openScanner() {
		if (this.platform.is('cordova')) {
			console.log('opening scanner');
			this.qrScanner.prepare()
				.then((status: QRScannerStatus) => {
					if (status.authorized) {
						// camera permission was granted


						// start scanning
						let scanSub = this.qrScanner.scan().subscribe((scanned: string) => {
							console.log('contents of scanned: ', scanned);
							(window.document.querySelector('ion-app') as HTMLElement).classList.remove('cameraView');
							this.qrScanner.hide(); // hide camera preview
							scanSub.unsubscribe(); // stop scanning
							this.queryId = scanned;
							this.checkUserIn()
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

	checkUserIn(): void {

		Meteor.call('scanner.checkIn', {
			userId: this.queryId
		}, 
		(err, res: string) => {

			if (err) {
				console.log('check-in could not be completed, error was:');
				console.log(err);
			} else {
				console.log('check in result was:');
				console.log(res);
				this.handleCheckIn(res);
				this.eventCtrl.publish('user:update', Date.now());
			}

		});


	}


	handleCheckIn(res: string): void {
		if(res === 'miscError') {
			this.detail.showDetail({ type: 'error', view: null });
		} else {
			let displayView: string = res + 'View';
			console.log('showing view ' + displayView);
			this.detail.showDetail({ type: 'user', view: displayView});

		}

		

	}



}