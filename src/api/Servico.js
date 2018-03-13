import {HttpClient, json}   from 'aurelia-fetch-client';
import {inject}             from 'aurelia-framework';
import {EventAggregator}    from 'aurelia-event-aggregator';
import {RestAPI}            from 'api/RestAPI';

@inject(HttpClient, EventAggregator)
export class Servico  extends RestAPI {

  constructor(http, eventAggregator) {
      super(eventAggregator);
      this.http = this.configureHttpBasicUrl(http);
  }
realizarLogin(login, senha){
   let usuario = {"login":login, "senha":senha};
    return this.http.fetch('/login/efetuarLogin', {
          method: 'POST',
          body: JSON.stringify(usuario)
        }).then(response => response.json());
	}

  listarCriancas(){
    return this.http.fetch('/crianca/listar')
    .then(response => response.json());
  }

  searchChild(name){
    let pesquisa = {"nome":name}
    return this.http.fetch('/crianca/pesquisar',{
      method: 'POST',
      body: JSON.stringify(pesquisa)
    }).then(response => response.json());
  }

  excluirCrianca(id){
    this.id = id;
    return this.http.fetch('/crianca/excluir/'+this.id)
    .then(response => response.json());
  }

  buscarCrianca(id){
    this.id = id;
    return this.http.fetch('/crianca/buscar/'+this.id)
    .then(response => response.json());
  }

  salvarCrianca(crianca){
    return this.http.fetch('/crianca/salvar', {
      method: 'POST',
      body: JSON.stringify(crianca)
    }).then(response => response.json());
  }
}
