import 'bootstrap';
import {Aurelia, inject}  from 'aurelia-framework';
import {EventAggregator}  from 'aurelia-event-aggregator';


@inject(EventAggregator)
export class App {
  constructor(EventAggregator) {
    this.eventAggregator = EventAggregator;
    this.display = 'none';
    this.subscribeOpenModal = this.eventAggregator.subscribe('handleModal', response =>{
      this.handleModal(response);
    });
  }

  clickSair(){
    localStorage.removeItem('usuario');
    location.reload();
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
