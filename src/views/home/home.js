import {Aurelia, inject}    from 'aurelia-framework';
import {Servico}  from 'api/Servico';

@inject(Servico)
export class Home {
  constructor(Servico) {
    this.servico = Servico;
    this.countCrianca = null;
  }
  attached(){
    this.servico.countCrianca()
    .then(data => {
      if(data.erro == true){
        this.visibilityAlert = 'visible';
        this.statusAlert = 'danger';
        this.mensagemAlert = data.mensagem;
      }else {
        this.countCrianca = data.value;
      }
    });
  }

  countCrianca(){
    this.servico.countCrianca()
    .then(data => {
      if(data.erro == true){
        this.visibilityAlert = 'visible';
        this.statusAlert = 'danger';
        this.mensagemAlert = data.mensagem;
      }else {
        this.countCrianca = data.countCrianca;
      }
    });
  }
}
