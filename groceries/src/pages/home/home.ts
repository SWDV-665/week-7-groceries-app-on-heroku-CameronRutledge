import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ToastController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { GroceriesServiceProvider } from '../../providers/groceries-service/groceries-service';
import { SocialSharing } from '@ionic-native/social-sharing';
import { InputDialogServiceProvider } from '../../providers/input-dialog-service/input-dialog-service';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  title = "Grocery List";

  items = [];
  errorMessage: string;

  constructor(public navCtrl: NavController, public toastCtrl: ToastController, public alertCtrl: AlertController,  public dataService: GroceriesServiceProvider, public socialSharing: SocialSharing, public inputDialogService: InputDialogServiceProvider) {
    dataService.dataChanged$.subscribe((dataChanged: boolean) => {
      this.loadItems();
    });
  }

  ionViewDidLoad() {
  this.loadItems();
  }

  loadItems() {
    this.dataService.getItems()
      .subscribe(
        items => this.items = items,
        error => this.errorMessage = <any>error);
  }

  removeItem(id) {
    this.dataService.removeItem(id);
  }

  shareItem(item) {
    console.log("Sharing item - ", item);
    const toast = this.toastCtrl.create({
      message: 'Sharing ' + item.name + "...",
      duration: 3000
    });
    toast.present();

    let message = "Grocery Item - Name: " + item.name + " - Quantity: " + item.quantity;
    let subject = "Shared via Groceries App";

    this.socialSharing.share(message, subject).then(() => {
      // Sharing via email is possible
      console.log("Shared successfully");
    }).catch((error) => {
      console.log(error)
    });
  }

  editItem(item, id) {
    const toast = this.toastCtrl.create({
      message: 'Editing ' + item.name + "...",
      duration: 3000
    });
    toast.present();
    this.inputDialogService.showPrompt(item, id);
  }

  addItem() {
    console.log("Adding item");
    this.inputDialogService.showPrompt();
  }
}