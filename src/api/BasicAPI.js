import {transient, inject} from 'aurelia-framework';
import environment from 'environment';

@transient()
export class BasicAPI{

  constructor(eventAggregator){
    this.eventAggregator = eventAggregator;
    this.baseAddress = environment.endPoint;
  }

  configureHttp(http) {
    http.configure((config) => {
      config
        .useStandardConfiguration()
        .withInterceptor({
          request(request) {
            return request;
          },
          response(response) {
            return response;
          }
        })
        .withDefaults({
          credentials: 'include',
          headers: {
            'Content-type' : 'application/json'
          }
        })
        .withBaseUrl(this.baseAddress);
    });
    return http;
  }

  getResponse(response, property) {
    if (response && response != null && response.status && (response.status.code == 0 || (response.status && response.status == 200))) {
      return property ? response[property] : response;
    } else {
      this.trowError(response);
    }
  }

  trowError(error) {
    //para entrar aqui tem que ser um erro conhecido
    if (error.status && error.status != null && error.status.code != null) {
      let code = error.status.code;
      let message = (error.status.message && error.status.message != '')?error.status.message : null;
      if (code == 2)
        this.eventAggregator.publish('usuario_desconectado');
      throw {code:code, message:message};
    } else {
      throw {code:3, message:'Uncaught error'}
    }
  }

  translateError(error){
    //erro de requisição
    if (error.body && error.status && error.status == 500) {
      console.log('server error : ', error);
      return {code:3, message:'serverError'};
    }

    if (error.code && error.code > 0){

      if (error.code == 3) {
        error.message = 'erroInesperado';
      }
    }
    return error;
  }
}
