import 'bootstrap';
import {Aurelia, inject}  from 'aurelia-framework';
import {EventAggregator}  from 'aurelia-event-aggregator';
import {DialogService} from 'aurelia-dialog';
import {Prompt} from 'views/modal/modal';


@inject(EventAggregator, DialogService)
export class App {
  constructor(EventAggregator, DialogService, Aurelia) {
    this.eventAggregator = EventAggregator;
    this.dialogService = DialogService;
    this.Aurelia = Aurelia;
    this.display = 'none';
    this.usuario = JSON.parse(localStorage.getItem('usuario'));
    this.subscribeOpenModal = this.eventAggregator.subscribe('handleModal', response =>{
      this.handleModal(response);
    });
  }

  clickSair(){
    this.dialogService.open({viewModel: Prompt, model:{"tipo":"sair"}})
    .whenClosed(response =>{
      if(!response.wasCancelled){
        localStorage.removeItem('usuario');
        location.reload();
      }
    });
  }

  clickMeusDados(){
    this.dialogService.open({viewModel: Prompt, model:{"tipo":"meusDados"}});
  }

  handleModal(response){
    //modal.mensamge=  response.options.mensagem;
    if (response.options.aberto == true) {
      // abre o modal
      this.display = '';
    }else{
      // fecha o  o modal
      this.display = 'none';
    }
  }

  configureRouter(config, router) {
    console.log("APP");
    this.router = router;
    config.title = 'Elaine KIDS';
    config.map([
      {route: '', redirect:'home'},
      {route: 'crianca', name: 'crianca', moduleId: './views/crianca/crianca', nav: true, title:'Crianças'},
      {route: 'listCrianca', name: 'listCrianca', moduleId: './views/crianca/listCrianca', nav: true},
      {route: 'foto', name: 'foto', moduleId: './views/fotos/foto', nav: true, title:'Foto'},
      {route: 'usuario', name: 'usuario', moduleId: './views/usuario/usuario', nav: true, title:'Usuário'},
      {route: 'home', name: 'home', moduleId: './views/home/home', nav: true, title:'Home'},
    ]);

    config.mapUnknownRoutes(instruction => {
      return { moduleId:  'navigation-error'};
    });
  }
}
