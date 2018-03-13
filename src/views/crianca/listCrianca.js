import {HttpClient, json} from 'aurelia-fetch-client';
import {Aurelia, inject}    from 'aurelia-framework';
import {Router} from 'aurelia-router';
import {Servico}  from 'api/Servico';
import {DialogService} from 'aurelia-dialog';
import {Prompt} from 'views/modal/modal';


@inject(Router, Aurelia, Servico, DialogService)
export class listCrianca {
  constructor(Router, Aurelia, Servico, DialogService) {
    this.router = Router;
    this.servico = Servico;
    this.aurelia = Aurelia;
    this.dialogService = DialogService;
  }

  activate(){
    this.servico.listarCriancas()
    .then(data => {
      if(data.erro == true){
        this.visibilityAlert = 'visible';
        this.statusAlert = 'danger';
        this.mensagemAlert = data.mensagem;
      }else {
        this.listCrianca =[];
        this.listCrianca = data.value;
      }
    });
  }

  searchChild(){
    this.servico.searchChild(this.search)
    .then(data => {
      if(data.erro == true){
        this.visibilityAlert = 'visible';
        this.statusAlert = 'danger';
        this.mensagemAlert = data.mensagem;
      }else {
        this.listCrianca =[];
        this.listCrianca = data.value;
      }
    });
  }

  excluir(id, nome){
    this.id = id;
    this.nome = nome;
    this.dialogService.open( {viewModel: Prompt, model: this.nome}).whenClosed(response => {
         if (!response.wasCancelled) {
           this.servico.excluirCrianca(this.id)
           .then(data => {
             if(data.erro == true){
               alert(data.error);
             }else {
               location.reload();
             }
           });
         }
      });
  }

  editar(crianca){
     this.router.navigateToRoute('crianca', { id:crianca.id }, {replace: false});
  }
}
