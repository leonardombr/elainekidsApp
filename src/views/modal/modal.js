import {inject} from 'aurelia-framework';
import {DialogController} from 'aurelia-dialog';

@inject(DialogController)

export class Prompt {

   constructor(controller) {
      this.controller = controller;
      this.answer = null;
      this.controller.settings.lock = true;
      controller.settings.centerHorizontalOnly = true;
   }

   activate(modal) {
     switch (modal.tipo) {
       case "sair":
          this.header = "Sair";
          this.message = "Deseja realmente sair?";
          break;
       case "excluir":
          this.header = "Excluir Criança";
          this.message = "Deseja realmente Escluir";
          this.nome = modal.nome + "?";
          break;
       case "exibir":
          this.header = "Criança Cadastrada";
          this.nome = "Nome: " + modal.crianca.nome;
          this.nomeMae = "Nome da Mãe: " + modal.crianca.nomeMae;
          this.nomePai = "Nome do Pai: " + modal.crianca.nomePai;
          this.idade = "Idade: " + modal.crianca.idade;
          this.sexo = "Sexo: " + modal.crianca.sexo;
          this.endereco = "Endereço: " + modal.crianca.endereco;

          this.controller.settings.lock = false;
          this.visibilityBtn = "none";
          break;
       default:
            this.message = "Modal indefinido!";
     }
   }
}
