import {HttpClient, json} from 'aurelia-fetch-client';
import {Aurelia, inject}    from 'aurelia-framework';
import {EventAggregator}    from 'aurelia-event-aggregator';
import {Servico}  from 'api/Servico';

@inject(Aurelia, Servico)
export class Crianca {
  constructor(Aurelia, Servico) {
    this.aurelia = Aurelia;
    this.servico = Servico;
    this.mensagemAlert = '';
    this.visibilityAlert = 'hidden';
    this.statusAlert = '';
  }

  activate(idCrianca){
    var _this = this;
    this.id = idCrianca.id;
    if(this.id != undefined){
      this.servico.buscarCrianca(this.id)
      .then(data =>{
        if(data.erro == true){
            this.visibilityAlert = 'visible';
            this.statusAlert = 'danger'
            this.mensagemAlert = data.mensagem;
        }else {
            this.id = data.value.id
            this.nomeCriaca = data.value.nome;
            this.nomeMae = data.value.nomeMae;
            this.nomePai = data.value.nomePai;
            this.endereco = data.value.endereco;
            this.idade = data.value.idade;
            this.sexo = data.value.sexo;
            this.dtCriacao = data.value.dtCriacao;
        }
      })
      .catch(error => {
        this.visibilityAlert = 'visible';
        this.statusAlert = 'danger';
        this.mensagemAlert = 'Ops, algo deu errado :(';
        console.log(error);
      });
    }else {

    }

  }

  clickCadCrianca(){
    let crianca = {
      "id":this.id,
      "nome": this.nomeCriaca,
      "nomeMae": this.nomeMae,
      "nomePai": this.nomePai,
      "endereco": this.endereco,
      "idade": this.idade,
      "sexo": this.sexo,
      "dtCriacao":this.dtCriacao
    }
    this.servico.salvarCrianca(crianca)
    .then(data =>{
      if(data.erro == true){
          this.visibilityAlert = 'visible';
          this.statusAlert = 'danger'
          this.mensagemAlert = data.mensagem;
      }else {
          this.visibilityAlert = 'visible';
          this.statusAlert = 'success';
          this.mensagemAlert = data.value;


          this.nomeCriaca = 'data.value.nome';
          this.nomeMae = '';
          this.nomePai = '';
          this.endereco = '';
          this.idade = '';
          this.sexo = '';
          this.dtCriacao = '';
      }
    })
    .catch(error => {
      this.visibilityAlert = 'visible';
      this.statusAlert = 'danger';
      this.mensagemAlert = 'Ops, algo deu errado :(';
      console.log(error);
    });
  }

}
