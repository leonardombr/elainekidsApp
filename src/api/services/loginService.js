import {HttpClient, json}   from 'aurelia-fetch-client';
import {inject}             from 'aurelia-framework';
import {EventAggregator}    from 'aurelia-event-aggregator';
import {RestAPI}            from 'api/RestAPI';

@inject(HttpClient, EventAggregator)
export class loginService extends RestAPI {
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

}
