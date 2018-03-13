export class RestAPI {

    constructor(eventAggregator) {
        this.eventAggregator = eventAggregator;
        this.url = 'http://192.168.0.106:8080/elainekidsAPI/rest';
    }

    configureHttpBasicUrl(http) {
      var _this = this;
      http.configure(config => {
       config
       .withBaseUrl(this.url)
       .withDefaults({
         headers: {
           'Accept': 'application/json',
           'Content-type': 'application/json',
           'Accept-Encoding': 'gzip'
         }
       }).withInterceptor({
           request(request) {

             _this.eventAggregator.publish('handleModal', {options:{aberto:true,mensagem:'Carregando'} });

               return request;
           },
           response(response) {

            _this.eventAggregator.publish('handleModal', {options:{aberto:false,mensagem:'Carregando'} });
           console.log('REspoNSE');

               return response;
           },
           requestError(response) {

              _this.eventAggregator.publish('handleModal', {options:{aberto:false,mensagem:'Carregando'} });
             console.log('requestError');
               return response;
           },
           responseError(response) {
              _this.eventAggregator.publish('handleModal', {options:{aberto:false,mensagem:'Carregando'} });
             console.log('responseError');
               return response;
           }
       });
     })
      return http;
    }
}
