import { Injectable } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { Registro } from '../models/registro.model';

import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';

import { File } from '@awesome-cordova-plugins/file/ngx';
import { EmailComposer } from '@awesome-cordova-plugins/email-composer/ngx';

@Injectable({
  providedIn: 'root'
})
export class DataLocalService {


  guardados:Registro[]=[];

  private _storage: Storage | null = null;
  constructor(private storage: Storage, private navController:NavController,
     private iab: InAppBrowser, private file:File,private emailComposer: EmailComposer) { 
    this.init();
    this.cargarStorage();
  }




  async init() {
    // If using, define drivers here: await this.storage.defineDriver(/*...*/);
    const storage = await this.storage.create();
    this._storage = storage;
  }




 async guardarRegistro(format:string, text:string){

    await this.cargarStorage();

    const nuevoRegistro=new Registro(format, text);
    this.guardados.unshift(nuevoRegistro);
    console.log(this.guardados);

    //registros
   this.storage.set('registros',this.guardados)

   this.abrirRegistro(nuevoRegistro);

  }

 async cargarStorage(){
    const obtenerRegistros= await this.storage.get('registros');
    this.guardados=obtenerRegistros||[]
    return this.guardados;


  }

  abrirRegistro(registro:Registro){
      this.navController.navigateForward('/tabs/tab2');
      switch(registro.type){
        case 'http':
          this.iab.create(registro.text, '_system');
        break;

        case 'geo':
          this.navController.navigateForward(`/tabs/tab2/mapa/${registro.text}`);
        break;
      }
  }


  enviarCorreo(){
    

    const arrTemp=[];
    const titulos='Tipo, Formato, Creado en, Texto\n';
    arrTemp.push(titulos);

    this.guardados.forEach(registro=>{
      const linea=`${registro.type}, ${registro.format}, ${registro.create}, ${registro.text.replace(',', ' ')}\n`;
      
      arrTemp.push(linea);
   
    });

    console.log(arrTemp.join(''));
    this.crearArchivoFisico(arrTemp.join(''));

   

  }

  crearArchivoFisico(text:string){
      this.file.checkFile(this.file.dataDirectory, 'registro.cvs').then(existe=>{
        console.log('Exite archivo?', existe);

        return this.escribirEnArchivo(text);
      }).catch(err=>{
          return this.file.createFile(this.file.dataDirectory,'registro.cvs', false)
            .then(creado=>this.escribirEnArchivo(text))
            .catch(err2=>console.log('No se pudo crear el archivo', err2))
      })
  }

 async escribirEnArchivo(text:string){

     await this.file.writeExistingFile(this.file.dataDirectory, 'registros.csv', text);

     const archivo=`${this.file.dataDirectory}/registros.csv`
 

     const email = {
      to: 'rojasalmariojhoandvid@gmail.com',
      //cc: 'erika@mustermann.de',
      //bcc: ['john@doe.com', 'jane@doe.com'],
      attachments: [
        archivo
      ],
      subject: 'Backup de scans',
      body: 'Información de todos los scan realizados - <strong>ScanApp</strong>',
      isHtml: true
    }
    
    // Send a text message using default options
    this.emailComposer.open(email);
    }

}
