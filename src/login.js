import {HttpClient, json}   from 'aurelia-fetch-client';
import {Aurelia, inject}    from 'aurelia-framework';
import {EventAggregator}    from 'aurelia-event-aggregator';
import {Servico}  from 'api/Servico';

@inject(Aurelia, Servico)
export class Login {
  constructor(aurelia, Servico) {
    this.servico = Servico;
    this.aurelia = aurelia;
    this.mensagemAlert = '';
    this.visibilityAlert = 'hidden';
    this.statusAlert = '';
  }

  clickLogin(){
    this.servico.realizarLogin(this.login, this.senha)
    .then(data => {
      if (data.erro == true){
          this.visibilityAlert = 'visible';
          this.statusAlert = 'danger';
          this.mensagemAlert = data.mensagem;
      }else{
        let valor = JSON.stringify(data.value.login);

        localStorage.setItem("usuario", valor);
        this.aurelia.setRoot('app');
		<!--Teste-->
      }
    })
    .catch(error => {

    });
  }

  /*clickLogin(){
    let usuario = {"login": this.login, "senha": this.senha};

    HttpClient.fetch('/rest/login/efetuarLogin',{
      method: 'POST',
      body: json(usuario)
    })
    .then(response => response.json())
    .then(data => {

      if (data.erro == true){
          this.visibilityAlert = 'visible';
          this.statusAlert = 'danger';
          this.mensagemAlert = data.mensagem;
         //this.messageErro = data.mensagem;
      }else{
        let valor = JSON.stringify(data.value.login);

        localStorage.setItem("usuario", valor);
        this.aurelia.setRoot('app');

      }
    })
    .catch(error => {

    });
  }*/
}
