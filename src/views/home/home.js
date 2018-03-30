import {Aurelia, inject}    from 'aurelia-framework';
import {criancaService} from 'api/services/criancaService';

@inject(criancaService)
export class Home {
  constructor(criancaService) {
    this.criancaService = criancaService;
  }

  attached(){
    this.countCrianca();
  }

  countCrianca(){
    this.criancaService.countCrianca()
    .then(data => {
      if(data.erro == true){
        this.visibilityAlert = 'visible';
        this.statusAlert = 'danger';
        this.mensagemAlert = data.mensagem;
      }else {
        this.numberCrianca = data.value;
      }
    })
  }
}
