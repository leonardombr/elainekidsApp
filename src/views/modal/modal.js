import {inject} from 'aurelia-framework';
import {DialogController} from 'aurelia-dialog';

@inject(DialogController)

export class Prompt {

   constructor(controller) {
      this.controller = controller;
      this.answer = null;

      controller.settings.centerHorizontalOnly = true;
   }

   activate(message) {
     if(message.cabecalho == false){
        this.message = ' ';
      }else{
        console.log(message.cabecalho);
        this.message = message.cabecalho;
      }
      this.nome = message.corpo+'?';
   }
}
