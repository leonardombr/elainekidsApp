import {HttpClient, json} from 'aurelia-fetch-client';
import {Aurelia, inject}    from 'aurelia-framework';
import {Router} from 'aurelia-router';
import {criancaService} from 'api/services/criancaService'

@inject(Router, Aurelia, criancaService)
export class Crianca {
  constructor(Router, Aurelia, criancaService) {
    this.router = Router;
    this.aurelia = Aurelia;
    this.criancaService = criancaService;
    this.visibilityAlert = 'hidden';
    this.modoInclusao = false;
  }

  activate(idCrianca){
    this.modoInclusao = idCrianca.id != undefined ? true : false;
    this.id = idCrianca.id;
    if(this.id != undefined){
      this.criancaService.buscarCrianca(this.id)
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
        let alert = {alert:true, statusAlert:'sanger', mensagemAlert:'Ops, algo deu errado :('};
        this.openAlert(alert);
        console.log(error);
      });
    }
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

  resetForm(){
    this.nomeCriaca = null;
    this.nomeMae = null;
    this.nomePai = null;
    this.endereco = null;
    this.idade = null;
    this.sexo = null;
    this.dtCriacao = null;
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

    this.criancaService.salvarCrianca(crianca)
    .then(data =>{
      if(data.erro == true){
          this.visibilityAlert = 'visible';
          this.statusAlert = 'danger'
          this.mensagemAlert = data.mensagem;
      }else {
          let alert = {alert:true, statusAlert:'success', mensagemAlert:data.value};
          this.openAlert(alert);
          this.resetForm();
          if(this.modoInclusao == true){
            this.router.navigateToRoute('listCrianca', {alert:true, statusAlert:'success', mensagemAlert:data.value}, {replace: false});
        }
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
