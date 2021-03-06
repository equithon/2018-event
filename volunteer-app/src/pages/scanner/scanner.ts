import { StatusBar } from '@ionic-native/status-bar';
import { Component } from '@angular/core';
import { Platform, Events as EventControl, ModalController, Modal } from 'ionic-angular';
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner';

import { Meteor } from 'meteor/meteor';
import { UserRole, Event } from './../../../api/server/models';
import { AuthProvider } from './../../providers/auth/auth';
import { ResultPage } from '../result/result';


@Component({
	selector: 'page-scanner',
	templateUrl: 'scanner.html'
})
export class ScannerPage {

	eventOptions: Event[] = [];
	eventChosen: string = 'Registration';
	scanSub: any;
	_eventSelectSub: () => void;

	constructor(public platform: Platform,
				public qrScanner: QRScanner,
				public auth: AuthProvider,
				public eventCtrl: EventControl,
				public modalCtrl: ModalController,
				public statusBar: StatusBar) {


		this._eventSelectSub = () => {
			this.toggleEventSelector();
		}

		// updates event selector with the events currently happening
		Meteor.call('volunteer.getEvents', {}, 
		(err, res) => {

			if (err) {
				console.log('couldn\'t get events, error was:');
				console.log(err);
			} else {
				this.eventOptions = res;
			}
		});
		
	}

	ionViewDidEnter() {
		
		this.statusBar.styleDefault();
		this.listenToViewEvents();
		this.toggleEventSelector();
		if (this.platform.is('cordova')) {
			console.log('opening scanner');
			this.qrScanner.prepare()
				.then((status: QRScannerStatus) => {
					if (status.authorized) {
						// camera permission was granted, show the scanner
						this.showScanner();
						// wait for user to scan something, then the observable callback will be called

					}
				})
				.catch((e: any) => console.log('Error is', e));
		} else {
			console.log('cordova not running: make sure this is running natively on a phone.');
			this.auth.alertUser('Scanning not available on this device.');
		}
	}

	ionViewWillLeave() {
		console.log('closing scanner');
		this.eventCtrl.unsubscribe('user:login', this._eventSelectSub);
		this.eventCtrl.unsubscribe('user:logout', this._eventSelectSub);
		this.hideScanner();
		this.stopScanning();
	}


	listenToViewEvents() {

		this.eventCtrl.subscribe('scanner:focus', () => {
			this.showScanner();
		});

		this.eventCtrl.subscribe('scanner:unfocus', () => {
			console.log('listened')
			this.hideScanner();
			this.stopScanning();
		});

		this.eventCtrl.subscribe('user:login', this._eventSelectSub);
		this.eventCtrl.subscribe('user:logout', this._eventSelectSub);

	}

	toggleEventSelector() {
		
		try {
			if (Meteor.user() && ((Meteor.user() as any).role === UserRole.ORGANIZER || (Meteor.user() as any).role === UserRole.VOLUNTEER)) {
				this.eventChosen = (Meteor.user() as any).atEvent;
				document.getElementById('eventSelector').style.display = 'inline';
			} else {
				document.getElementById('eventSelector').style.display = 'none';
			};
		} catch(err) {
			console.log(err);
		}
	}

	startScanning() {
		// start scanning
		if (this.platform.is('cordova')) {
			try {
				document.getElementById('start-scanner').style.display = 'none';
				document.getElementById('stop-scanner').style.display = 'inline';
			} catch(err) {
				console.log(err);
			}
			this.scanSub = this.qrScanner.scan().subscribe((scannedId: string) => {
				console.log('contents of scanned: ', scannedId);
				this.hideScanner();
				this.stopScanning();
				this.scanSub.unsubscribe(); // stop scanning
				this.checkUserIn(scannedId);
			});
		} else {
			console.log('cordova not running: make sure this is running natively on a phone.')
			this.auth.alertUser('Scanning not available on this device.');
		}
		
	}

	stopScanning() {
		try {
			document.getElementById('start-scanner').style.display = 'inline';
			document.getElementById('stop-scanner').style.display = 'none';
			this.scanSub.unsubscribe();
		} catch(err) {
			console.log(err);
		}
	}

	showScanner() {
		(window.document.querySelector('ion-app') as HTMLElement).classList.add('cameraView');
		this.qrScanner.show();
		
	}

	hideScanner() {
		(window.document.querySelector('ion-app') as HTMLElement).classList.remove('cameraView');
		this.qrScanner.hide(); // hide camera preview
	}

	checkUserIn(scannedId): void {

		Meteor.call('scanner.checkIn', {
			userId: scannedId
		}, 
		(err, res) => {

			if (err) {
				console.log('check-in could not be completed, error was:');
				console.log(err);
			} else {
				console.log('check in result was:');
				console.log(res);
				this.handleCheckIn(res);
			}

		});


	}


	handleCheckIn(res): void {
		let detailModal: Modal;
		console.log('showing view ' + res.code + 'View');
		detailModal = this.modalCtrl.create(ResultPage, res);

		detailModal.onDidDismiss( () => {
			this.showScanner();
		});

		detailModal.present();

	}



}