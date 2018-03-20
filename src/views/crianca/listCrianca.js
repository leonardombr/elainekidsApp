import {HttpClient, json} from 'aurelia-fetch-client';
import {Aurelia, inject}    from 'aurelia-framework';
import {EventAggregator}  from 'aurelia-event-aggregator';
import {Router} from 'aurelia-router';
import {Servico}  from 'api/Servico';
import {DialogService} from 'aurelia-dialog';
import {Prompt} from 'views/modal/modal';


@inject(Router, Aurelia, Servico, DialogService, EventAggregator)
export class listCrianca {
  constructor(Router, Aurelia, Servico, DialogService, EventAggregator) {
    this.eventAggregator = EventAggregator;
    this.router = Router;
    this.servico = Servico;
    this.aurelia = Aurelia;
    this.dialogService = DialogService;
    this.visibilityAlert = 'hidden';
  }
  activate(alert){
    this.openAlert(alert);
  }

  attached(){
    this.pesquisa();
  }

  closeAlert(){
    this.mensagemAlert = '';
    this.visibilityAlert = 'hidden';
    this.statusAlert = '';
  }

  openAlert(alert){
    if(alert.alert == "true" || alert.alert == true){
      this.mensagemAlert = alert.mensagemAlert;
      this.visibilityAlert = '';
      this.statusAlert = alert.statusAlert;
      new Promise((resolve, reject)=>{ setTimeout(_=>resolve(this.closeAlert()), 5000); });
    }
  }

  pesquisa(){
    this.servico.listarCriancas()
    .then(data => {
      if(data.erro == true){
        this.visibilityAlert = 'visible';
        this.statusAlert = 'danger';
        this.mensagemAlert = data.mensagem;
      }else {
        if(data.value.length == 0){
          let alert = {alert:true, statusAlert:'danger', mensagemAlert:'Nem um criança cadastrada!'}
          this.openAlert(alert);
        }
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
        this.listCrianca = data.value;
      }
    });
  }

  excluir(id, nome){
    this.id = id;
    this.nome = nome;
    this.dialogService.open( {viewModel: Prompt, model:{"cabecalho":'Deseja ralmente excluir',"corpo":this.nome}}).whenClosed(response => {
         if (!response.wasCancelled) {
           this.servico.excluirCrianca(this.id)
           .then(data => {
             if(data.erro == true){
               alert(data.error);
             }else {
               for(var i = 0; this.listCrianca.length; i++){
                 if(this.listCrianca[i].id === this.id){
                   this.listCrianca.splice(i,1);
                   break;
                 }
               };
               let alert = {alert:true, statusAlert:'danger', mensagemAlert:data.value}
               this.openAlert(alert);
             }
           });
         }
      });
  }

  editar(crianca){
     this.router.navigateToRoute('crianca', { id:crianca.id }, {replace: false});
  }
}
