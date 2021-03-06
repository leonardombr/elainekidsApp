import {HttpClient, json}   from 'aurelia-fetch-client';
import {inject}             from 'aurelia-framework';
import {EventAggregator}    from 'aurelia-event-aggregator';
import {RestAPI}            from 'api/RestAPI';

@inject(HttpClient, EventAggregator)
export class criancaService extends RestAPI {
  constructor(http, EventAggregator) {
    super(EventAggregator);
    this.http = this.configureHttpBasicUrl(http);
  }

  listarCriancas(){
    return this.http.fetch('/crianca/listar')
    .then(response => response.json());
  }

  countCrianca(){
    return this.http.fetch('/home/inicial')
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
