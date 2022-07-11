import { Component } from '@angular/core';
import { BarcodeScanner } from '@awesome-cordova-plugins/barcode-scanner/ngx';
import { DataLocalService } from '../../services/data-local.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  swiperOpts={
    allowSlidePrev:false,
    allowSlideNext:false
  };

//Ciclo de vida de ionic
  ionViewDidEnter(){
   // console.log("ionViewDidEnter")
  }

  ionViewDidLeave(){
    //console.log("ionviewDidLeave")
  }

 /*  ionViewDidLoad(){
    console.log("ionViewDidLoad")
  } */

  ionViewWillEnter(){
    this.scan();
  }

  ionViewWillLeave(){
    //console.log(" ionViewWillLeave")
  }

  constructor(private barcodeScanner: BarcodeScanner,
              private dataLocal:DataLocalService) {}



  scan(){
    this.barcodeScanner.scan().then(barcodeData => {
      console.log('Barcode data', barcodeData);
      if(!barcodeData.cancelled){
        this.dataLocal.guardarRegistro(barcodeData.format, barcodeData.text);
  
      }

     }).catch(err => {
         console.log('Error', err);

       // this.dataLocal.guardarRegistro('QRCode', 'https://fernando-herrera.com');
        this.dataLocal.guardarRegistro('QRCode', 'geo:40.73151796986687,-74.06087294062502');
  
     });
  }

}
