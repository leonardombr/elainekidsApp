import {Aurelia, inject}  from 'aurelia-framework';
import {loginService}  from 'api/services/loginService';

@inject(Aurelia, loginService)
export class Login {
  constructor(Aurelia, loginService) {
    this.loginService = loginService;
    this.aurelia = Aurelia;
    this.mensagemAlert = '';
    this.visibilityAlert = 'hidden';
    this.statusAlert = '';
  }

  clickLogin(){
    this.loginService.realizarLogin(this.login, this.senha)
    .then(data => {
      if (data.erro == true){
          this.visibilityAlert = 'visible';
          this.statusAlert = 'danger';
          this.mensagemAlert = data.mensagem;
      }else{
        let valor = JSON.stringify(data.value.nome);
        localStorage.setItem("usuario", valor);
        this.aurelia.setRoot('app');
      }
    })
  }
}
