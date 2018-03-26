define('app',['exports', 'aurelia-framework', 'aurelia-event-aggregator', 'aurelia-dialog', 'views/modal/modal', 'bootstrap'], function (exports, _aureliaFramework, _aureliaEventAggregator, _aureliaDialog, _modal) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.App = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _class;

  var App = exports.App = (_dec = (0, _aureliaFramework.inject)(_aureliaEventAggregator.EventAggregator, _aureliaDialog.DialogService), _dec(_class = function () {
    function App(EventAggregator, DialogService, Aurelia) {
      var _this = this;

      _classCallCheck(this, App);

      this.eventAggregator = EventAggregator;
      this.dialogService = DialogService;
      this.Aurelia = Aurelia;
      this.display = 'none';
      this.subscribeOpenModal = this.eventAggregator.subscribe('handleModal', function (response) {
        _this.handleModal(response);
      });
    }

    App.prototype.clickSair = function clickSair() {
      this.dialogService.open({ viewModel: _modal.Prompt, model: { "tipo": "sair" } }).whenClosed(function (response) {
        if (!response.wasCancelled) {
          localStorage.removeItem('usuario');
          location.reload();
        }
      });
    };

    App.prototype.handleModal = function handleModal(response) {
      if (response.options.aberto == true) {
        this.display = '';
      } else {
        this.display = 'none';
      }
    };

    App.prototype.configureRouter = function configureRouter(config, router) {
      console.log("APP");
      this.router = router;
      config.title = 'Elaine KIDS';
      config.map([{ route: '', redirect: 'home' }, { route: 'crianca', name: 'crianca', moduleId: './views/crianca/crianca', nav: true, title: 'Crianças' }, { route: 'listCrianca', name: 'listCrianca', moduleId: './views/crianca/listCrianca', nav: true }, { route: 'foto', name: 'foto', moduleId: './views/fotos/foto', nav: true, title: 'Foto' }, { route: 'usuario', name: 'usuario', moduleId: './views/usuario/usuario', nav: true, title: 'Usuário' }, { route: 'home', name: 'home', moduleId: './views/home/home', nav: true, title: 'Home' }]);

      config.mapUnknownRoutes(function (instruction) {
        return { moduleId: 'navigation-error' };
      });
    };

    return App;
  }()) || _class);
});
define('environment',["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    debug: true,
    testing: true
  };
});
define('login',['exports', 'aurelia-fetch-client', 'aurelia-framework', 'aurelia-event-aggregator', 'api/Servico'], function (exports, _aureliaFetchClient, _aureliaFramework, _aureliaEventAggregator, _Servico) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.Login = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _class;

  var Login = exports.Login = (_dec = (0, _aureliaFramework.inject)(_aureliaFramework.Aurelia, _Servico.Servico), _dec(_class = function () {
    function Login(aurelia, Servico) {
      _classCallCheck(this, Login);

      this.servico = Servico;
      this.aurelia = aurelia;
      this.mensagemAlert = '';
      this.visibilityAlert = 'hidden';
      this.statusAlert = '';
    }

    Login.prototype.clickLogin = function clickLogin() {
      var _this = this;

      this.servico.realizarLogin(this.login, this.senha).then(function (data) {
        if (data.erro == true) {
          _this.visibilityAlert = 'visible';
          _this.statusAlert = 'danger';
          _this.mensagemAlert = data.mensagem;
        } else {
          var valor = JSON.stringify(data.value.login);

          localStorage.setItem("usuario", valor);
          _this.aurelia.setRoot('app');
        }
      }).catch(function (error) {});
    };

    return Login;
  }()) || _class);
});
define('main',['exports', './environment'], function (exports, _environment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.configure = configure;

  var _environment2 = _interopRequireDefault(_environment);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function configure(aurelia) {
    aurelia.use.standardConfiguration().feature('resources').plugin('aurelia-dialog');

    if (_environment2.default.debug) {
      aurelia.use.developmentLogging();
    }

    if (_environment2.default.testing) {
      aurelia.use.plugin('aurelia-testing');
    }
    aurelia.start().then(function () {
      if (localStorage.getItem('usuario') != null) {
        aurelia.setRoot('app');
      } else {
        aurelia.setRoot('login');
      }
    });
  }
});
define('api/BasicAPI',['exports', 'aurelia-framework', 'environment'], function (exports, _aureliaFramework, _environment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.BasicAPI = undefined;

  var _environment2 = _interopRequireDefault(_environment);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _class;

  var BasicAPI = exports.BasicAPI = (_dec = (0, _aureliaFramework.transient)(), _dec(_class = function () {
    function BasicAPI(eventAggregator) {
      _classCallCheck(this, BasicAPI);

      this.eventAggregator = eventAggregator;
      this.baseAddress = _environment2.default.endPoint;
    }

    BasicAPI.prototype.configureHttp = function configureHttp(http) {
      var _this = this;

      http.configure(function (config) {
        config.useStandardConfiguration().withInterceptor({
          request: function request(_request) {
            return _request;
          },
          response: function response(_response) {
            return _response;
          }
        }).withDefaults({
          credentials: 'include',
          headers: {
            'Content-type': 'application/json'
          }
        }).withBaseUrl(_this.baseAddress);
      });
      return http;
    };

    BasicAPI.prototype.getResponse = function getResponse(response, property) {
      if (response && response != null && response.status && (response.status.code == 0 || response.status && response.status == 200)) {
        return property ? response[property] : response;
      } else {
        this.trowError(response);
      }
    };

    BasicAPI.prototype.trowError = function trowError(error) {
      if (error.status && error.status != null && error.status.code != null) {
        var code = error.status.code;
        var message = error.status.message && error.status.message != '' ? error.status.message : null;
        if (code == 2) this.eventAggregator.publish('usuario_desconectado');
        throw { code: code, message: message };
      } else {
        throw { code: 3, message: 'Uncaught error' };
      }
    };

    BasicAPI.prototype.translateError = function translateError(error) {
      if (error.body && error.status && error.status == 500) {
        console.log('server error : ', error);
        return { code: 3, message: 'serverError' };
      }

      if (error.code && error.code > 0) {

        if (error.code == 3) {
          error.message = 'erroInesperado';
        }
      }
      return error;
    };

    return BasicAPI;
  }()) || _class);
});
define('api/RestAPI',['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var RestAPI = exports.RestAPI = function () {
    function RestAPI(eventAggregator) {
      _classCallCheck(this, RestAPI);

      this.eventAggregator = eventAggregator;
      this.url = 'http://192.168.0.106:8080/elainekidsAPI/rest';
    }

    RestAPI.prototype.configureHttpBasicUrl = function configureHttpBasicUrl(http) {
      var _this2 = this;

      var _this = this;
      http.configure(function (config) {
        config.withBaseUrl(_this2.url).withDefaults({
          headers: {
            'Accept': 'application/json',
            'Content-type': 'application/json',
            'Accept-Encoding': 'gzip'
          }
        }).withInterceptor({
          request: function request(_request) {

            _this.eventAggregator.publish('handleModal', { options: { aberto: true, mensagem: 'Carregando' } });

            return _request;
          },
          response: function response(_response) {

            _this.eventAggregator.publish('handleModal', { options: { aberto: false, mensagem: 'Carregando' } });

            return _response;
          },
          requestError: function requestError(response) {

            _this.eventAggregator.publish('handleModal', { options: { aberto: false, mensagem: 'Carregando' } });
            console.log('requestError');
            return response;
          },
          responseError: function responseError(response) {
            _this.eventAggregator.publish('handleModal', { options: { aberto: false, mensagem: 'Carregando' } });
            console.log('responseError');
            return response;
          }
        });
      });
      return http;
    };

    return RestAPI;
  }();
});
define('api/Servico',['exports', 'aurelia-fetch-client', 'aurelia-framework', 'aurelia-event-aggregator', 'api/RestAPI'], function (exports, _aureliaFetchClient, _aureliaFramework, _aureliaEventAggregator, _RestAPI2) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.Servico = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _possibleConstructorReturn(self, call) {
    if (!self) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return call && (typeof call === "object" || typeof call === "function") ? call : self;
  }

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
  }

  var _dec, _class;

  var Servico = exports.Servico = (_dec = (0, _aureliaFramework.inject)(_aureliaFetchClient.HttpClient, _aureliaEventAggregator.EventAggregator), _dec(_class = function (_RestAPI) {
    _inherits(Servico, _RestAPI);

    function Servico(http, eventAggregator) {
      _classCallCheck(this, Servico);

      var _this = _possibleConstructorReturn(this, _RestAPI.call(this, eventAggregator));

      _this.http = _this.configureHttpBasicUrl(http);
      return _this;
    }

    Servico.prototype.realizarLogin = function realizarLogin(login, senha) {
      var usuario = { "login": login, "senha": senha };
      return this.http.fetch('/login/efetuarLogin', {
        method: 'POST',
        body: JSON.stringify(usuario)
      }).then(function (response) {
        return response.json();
      });
    };

    Servico.prototype.listarCriancas = function listarCriancas() {
      return this.http.fetch('/crianca/listar').then(function (response) {
        return response.json();
      });
    };

    Servico.prototype.countCrianca = function countCrianca() {
      return this.http.fetch('/home/inicial').then(function (response) {
        return response.json();
      });
    };

    Servico.prototype.searchChild = function searchChild(name) {
      var pesquisa = { "nome": name };
      return this.http.fetch('/crianca/pesquisar', {
        method: 'POST',
        body: JSON.stringify(pesquisa)
      }).then(function (response) {
        return response.json();
      });
    };

    Servico.prototype.excluirCrianca = function excluirCrianca(id) {
      this.id = id;
      return this.http.fetch('/crianca/excluir/' + this.id).then(function (response) {
        return response.json();
      });
    };

    Servico.prototype.buscarCrianca = function buscarCrianca(id) {
      this.id = id;
      return this.http.fetch('/crianca/buscar/' + this.id).then(function (response) {
        return response.json();
      });
    };

    Servico.prototype.salvarCrianca = function salvarCrianca(crianca) {
      return this.http.fetch('/crianca/salvar', {
        method: 'POST',
        body: JSON.stringify(crianca)
      }).then(function (response) {
        return response.json();
      });
    };

    return Servico;
  }(_RestAPI2.RestAPI)) || _class);
});
define('components/cabecalho',["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var cabecalho = exports.cabecalho = function () {
    function cabecalho() {
      _classCallCheck(this, cabecalho);
    }

    cabecalho.prototype.clickSair = function clickSair() {
      storage.removeItem(usuario);
    };

    return cabecalho;
  }();
});
define('resources/index',["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.configure = configure;
  function configure(config) {}
});
define('views/crianca/crianca',['exports', 'aurelia-fetch-client', 'aurelia-framework', 'api/Servico', 'aurelia-router'], function (exports, _aureliaFetchClient, _aureliaFramework, _Servico, _aureliaRouter) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.Crianca = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _class;

  var Crianca = exports.Crianca = (_dec = (0, _aureliaFramework.inject)(_aureliaRouter.Router, _aureliaFramework.Aurelia, _Servico.Servico), _dec(_class = function () {
    function Crianca(Router, Aurelia, Servico, eventAggregator) {
      _classCallCheck(this, Crianca);

      this.router = Router;
      this.aurelia = Aurelia;
      this.servico = Servico;
      this.visibilityAlert = 'hidden';
      this.modoInclusao = false;
    }

    Crianca.prototype.activate = function activate(idCrianca) {
      var _this = this;

      this.modoInclusao = idCrianca.id != undefined ? true : false;
      this.id = idCrianca.id;
      if (this.id != undefined) {
        this.servico.buscarCrianca(this.id).then(function (data) {
          if (data.erro == true) {
            _this.visibilityAlert = 'visible';
            _this.statusAlert = 'danger';
            _this.mensagemAlert = data.mensagem;
          } else {
            _this.id = data.value.id;
            _this.nomeCriaca = data.value.nome;
            _this.nomeMae = data.value.nomeMae;
            _this.nomePai = data.value.nomePai;
            _this.endereco = data.value.endereco;
            _this.idade = data.value.idade;
            _this.sexo = data.value.sexo;
            _this.dtCriacao = data.value.dtCriacao;
          }
        }).catch(function (error) {
          var alert = { alert: true, statusAlert: 'sanger', mensagemAlert: 'Ops, algo deu errado :(' };
          _this.openAlert(alert);
          console.log(error);
        });
      }
    };

    Crianca.prototype.closeAlert = function closeAlert() {
      this.mensagemAlert = '';
      this.visibilityAlert = 'hidden';
      this.statusAlert = '';
    };

    Crianca.prototype.openAlert = function openAlert(alert) {
      var _this2 = this;

      if (alert.alert == "true" || alert.alert == true) {
        this.mensagemAlert = alert.mensagemAlert;
        this.visibilityAlert = '';
        this.statusAlert = alert.statusAlert;
        new Promise(function (resolve, reject) {
          setTimeout(function (_) {
            return resolve(_this2.closeAlert());
          }, 5000);
        });
      }
    };

    Crianca.prototype.clickCadCrianca = function clickCadCrianca() {
      var _this3 = this;

      var crianca = {
        "id": this.id,
        "nome": this.nomeCriaca,
        "nomeMae": this.nomeMae,
        "nomePai": this.nomePai,
        "endereco": this.endereco,
        "idade": this.idade,
        "sexo": this.sexo,
        "dtCriacao": this.dtCriacao
      };

      this.servico.salvarCrianca(crianca).then(function (data) {
        if (data.erro == true) {
          _this3.visibilityAlert = 'visible';
          _this3.statusAlert = 'danger';
          _this3.mensagemAlert = data.mensagem;
        } else {
          var alert = { alert: true, statusAlert: 'success', mensagemAlert: data.value };
          _this3.openAlert(alert);

          _this3.nomeCriaca = '';
          _this3.nomeMae = '';
          _this3.nomePai = '';
          _this3.endereco = '';
          _this3.idade = '';
          _this3.sexo = '';
          _this3.dtCriacao = '';

          if (_this3.modoInclusao == true) {
            _this3.router.navigateToRoute('listCrianca', { alert: true, statusAlert: 'success', mensagemAlert: data.value }, { replace: false });
          }
        }
      }).catch(function (error) {
        _this3.visibilityAlert = 'visible';
        _this3.statusAlert = 'danger';
        _this3.mensagemAlert = 'Ops, algo deu errado :(';
        console.log(error);
      });
    };

    return Crianca;
  }()) || _class);
});
define('views/crianca/listCrianca',['exports', 'aurelia-fetch-client', 'aurelia-framework', 'aurelia-event-aggregator', 'aurelia-router', 'api/Servico', 'aurelia-dialog', 'views/modal/modal'], function (exports, _aureliaFetchClient, _aureliaFramework, _aureliaEventAggregator, _aureliaRouter, _Servico, _aureliaDialog, _modal) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.listCrianca = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _class;

  var listCrianca = exports.listCrianca = (_dec = (0, _aureliaFramework.inject)(_aureliaRouter.Router, _aureliaFramework.Aurelia, _Servico.Servico, _aureliaDialog.DialogService, _aureliaEventAggregator.EventAggregator), _dec(_class = function () {
    function listCrianca(Router, Aurelia, Servico, DialogService, EventAggregator) {
      _classCallCheck(this, listCrianca);

      this.eventAggregator = EventAggregator;
      this.router = Router;
      this.servico = Servico;
      this.aurelia = Aurelia;
      this.dialogService = DialogService;
      this.visibilityAlert = 'hidden';
    }

    listCrianca.prototype.activate = function activate(alert) {
      this.openAlert(alert);
    };

    listCrianca.prototype.attached = function attached() {
      this.pesquisa();
    };

    listCrianca.prototype.closeAlert = function closeAlert() {
      this.mensagemAlert = '';
      this.visibilityAlert = 'hidden';
      this.statusAlert = '';
    };

    listCrianca.prototype.openAlert = function openAlert(alert) {
      var _this = this;

      if (alert.alert == "true" || alert.alert == true) {
        this.mensagemAlert = alert.mensagemAlert;
        this.visibilityAlert = '';
        this.statusAlert = alert.statusAlert;
        new Promise(function (resolve, reject) {
          setTimeout(function (_) {
            return resolve(_this.closeAlert());
          }, 5000);
        });
      }
    };

    listCrianca.prototype.pesquisa = function pesquisa() {
      var _this2 = this;

      this.servico.listarCriancas().then(function (data) {
        if (data.erro == true) {
          _this2.visibilityAlert = 'visible';
          _this2.statusAlert = 'danger';
          _this2.mensagemAlert = data.mensagem;
        } else {
          if (data.value.length == 0) {
            var _alert = { alert: true, statusAlert: 'danger', mensagemAlert: 'Nem um criança cadastrada!' };
            _this2.openAlert(_alert);
          }
          _this2.listCrianca = data.value;
        }
      });
    };

    listCrianca.prototype.searchChild = function searchChild() {
      var _this3 = this;

      this.servico.searchChild(this.search).then(function (data) {
        if (data.erro == true) {
          _this3.visibilityAlert = 'visible';
          _this3.statusAlert = 'danger';
          _this3.mensagemAlert = data.mensagem;
        } else {
          _this3.listCrianca = data.value;
        }
      });
    };

    listCrianca.prototype.excluir = function excluir(id, nome) {
      var _this4 = this;

      this.id = id;
      this.nome = nome;
      this.dialogService.open({ viewModel: _modal.Prompt, model: { "tipo": "excluir", "nome": this.nome } }).whenClosed(function (response) {
        if (!response.wasCancelled) {
          _this4.servico.excluirCrianca(_this4.id).then(function (data) {
            if (data.erro == true) {
              alert(data.error);
            } else {
              for (var i = 0; _this4.listCrianca.length; i++) {
                if (_this4.listCrianca[i].id === _this4.id) {
                  _this4.listCrianca.splice(i, 1);
                  break;
                }
              };
              var _alert2 = { alert: true, statusAlert: 'danger', mensagemAlert: data.value };
              _this4.openAlert(_alert2);
            }
          });
        }
      });
    };

    listCrianca.prototype.editar = function editar(crianca) {
      this.router.navigateToRoute('crianca', { id: crianca.id }, { replace: false });
    };

    listCrianca.prototype.exibir = function exibir(crianca) {
      this.dialogService.open({ viewModel: _modal.Prompt, model: { "tipo": "exibir", "crianca": crianca } });
    };

    return listCrianca;
  }()) || _class);
});
define('views/fotos/foto',["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var foto = exports.foto = function foto() {
    _classCallCheck(this, foto);
  };
});
define('views/home/home',['exports', 'aurelia-framework', 'api/Servico'], function (exports, _aureliaFramework, _Servico) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.Home = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _class;

  var Home = exports.Home = (_dec = (0, _aureliaFramework.inject)(_Servico.Servico), _dec(_class = function () {
    function Home(Servico) {
      _classCallCheck(this, Home);

      this.servico = Servico;
      this.countCrianca = null;
    }

    Home.prototype.attached = function attached() {
      var _this = this;

      this.servico.countCrianca().then(function (data) {
        if (data.erro == true) {
          _this.visibilityAlert = 'visible';
          _this.statusAlert = 'danger';
          _this.mensagemAlert = data.mensagem;
        } else {
          _this.countCrianca = data.value;
        }
      });
    };

    Home.prototype.countCrianca = function countCrianca() {
      var _this2 = this;

      this.servico.countCrianca().then(function (data) {
        if (data.erro == true) {
          _this2.visibilityAlert = 'visible';
          _this2.statusAlert = 'danger';
          _this2.mensagemAlert = data.mensagem;
        } else {
          _this2.countCrianca = data.countCrianca;
        }
      });
    };

    return Home;
  }()) || _class);
});
define('views/modal/modal',['exports', 'aurelia-framework', 'aurelia-dialog'], function (exports, _aureliaFramework, _aureliaDialog) {
   'use strict';

   Object.defineProperty(exports, "__esModule", {
      value: true
   });
   exports.Prompt = undefined;

   function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor)) {
         throw new TypeError("Cannot call a class as a function");
      }
   }

   var _dec, _class;

   var Prompt = exports.Prompt = (_dec = (0, _aureliaFramework.inject)(_aureliaDialog.DialogController), _dec(_class = function () {
      function Prompt(controller) {
         _classCallCheck(this, Prompt);

         this.controller = controller;
         this.answer = null;
         this.controller.settings.lock = true;
         controller.settings.centerHorizontalOnly = true;
      }

      Prompt.prototype.activate = function activate(modal) {
         switch (modal.tipo) {
            case "sair":
               this.header = "Sair";
               this.message = "Deseja realmente sair?";
               break;
            case "excluir":
               this.header = "Excluir Criança";
               this.message = "Deseja realmente Escluir";
               this.nome = modal.nome + "?";
               break;
            case "exibir":
               this.header = "Criança Cadastrada";
               this.nome = "Nome: " + modal.crianca.nome;
               this.nomeMae = "Nome da Mãe: " + modal.crianca.nomeMae;
               this.nomePai = "Nome do Pai: " + modal.crianca.nomePai;
               this.idade = "Idade: " + modal.crianca.idade;
               this.sexo = "Sexo: " + modal.crianca.sexo;
               this.endereco = "Endereço: " + modal.crianca.endereco;

               this.controller.settings.lock = false;
               this.visibilityBtn = "none";
               break;
            default:
               this.message = "Modal indefinido!";
         }
      };

      return Prompt;
   }()) || _class);
});
define('views/usuario/usuario',["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var usuario = exports.usuario = function usuario() {
    _classCallCheck(this, usuario);
  };
});
define('text!app.html', ['module'], function(module) { module.exports = "<template><require from=\"bootstrap/css/bootstrap.css\"></require><require from=\"styles/app.css\"></require><require from=\"styles/menu-lateral.css\"></require><require from=\"styles/home.css\"></require><require from=\"styles/modal.css\"></require><require from=\"styles/listCrianca.css\"></require><require from=\"components/menu-lateral.html\"></require><require from=\"components/loading.html\"></require><require from=\"styles/loading.css\"></require><loading class=\"loading\" css=\" display: ${display}\"></loading><nav class=\"navbar navbar-light\" style=\"background-color:#6495ed\"><a class=\"navbar-brand mb-0 h1 text-white font-weight-bold\" href=\"#\">Elaine Kids</a><form class=\"form-inline\"><button class=\"btn btn-outline-light my-2 my-sm-0\" type=\"button\" data-toggle=\"collapse\" data-target=\"#navbarSupportedContent\" aria-controls=\"navbarSupportedContent\" aria-expanded=\"false\" aria-label=\"Toggle navigation\" click.delegate=\"clickSair()\">Sair</button></form></nav><div class=\"container-fluid\"><div class=\"row\"><div class=\"col-sm-1 col-menulateral\" id=\"menu-laretal\"><menu-lateral class=\"menu-lateral\"></menu-lateral></div><div class=\"col-sm-11\" id=\"conteudo\"><div class=\"row justify-content-center\"><router-view class=\"col-sm-11\"></router-view></div></div></div></div></template>"; });
define('text!styles/app.css', ['module'], function(module) { module.exports = "*{\r\n  margin: 0;\r\n  padding: 0;\r\n}\r\n\r\n.margin-message{\r\n  margin: 11px 1px 0 1px;\r\n}\r\n.col-menulateral{\r\n  padding: 0;\r\n}\r\n"; });
define('text!login.html', ['module'], function(module) { module.exports = "<template><require from=\"bootstrap/css/bootstrap.css\"></require><require from=\"styles/app.css\"></require><require from=\"components/alert.html\"></require><div class=\"container py-5\"><div class=\"row\"><div class=\"col-md-12\"><h2 class=\"text-center text-white mb-4\">Elaine Kids</h2><div class=\"row\"><div class=\"col-md-6 mx-auto\"><div class=\"alert alert-${statusAlert}\" role=\"alert\" css=\"visibility:${visibilityAlert}\"> ${mensagemAlert} </div><div class=\"card rounded-0\"><div class=\"card-header\" style=\"background-color:#6495ed\"><h3 class=\"mb-0 text-white font-weight-bold\">Login</h3></div><div class=\"card-body\"><form class=\"form\" role=\"form\" autocomplete=\"off\" id=\"formLogin\" submit.trigger=\"clickLogin()\"><div class=\"form-group\"><label for=\"login\">Login</label><input type=\"text\" class=\"form-control form-control-lg rounded-0\" name=\"login\" id=\"login\" required=\"\" value.bind=\"login\"></div><div class=\"form-group\"><label>Senha</label><input type=\"password\" class=\"form-control form-control-lg rounded-0\" id=\"senha\" required=\"\" autocomplete=\"new-password\" value.bind=\"senha\"></div><button type=\"submit\" class=\"btn btn-secondary btn-lg btn-block rounded-0\">Logar</button></form></div></div></div></div></div></div></div></template>"; });
define('text!styles/home.css', ['module'], function(module) { module.exports = ".margin-row{\r\n  margin: 20px 20px 0 20px;\r\n  padding: 20px 20px 20px 20px;\r\n}\r\n.border-solid-right{\r\n  border-right: 1px solid black;\r\n}\r\n"; });
define('text!components/alert.html', ['module'], function(module) { module.exports = "<template><div class=\"alert alert-${statusAlert}\" role=\"alert\" css=\"visibility:${visibilityAlert}\"> ${mensagemAlert} </div></template>"; });
define('text!styles/listCrianca.css', ['module'], function(module) { module.exports = ".format-table{\r\n  border-collapse:collapse;\r\n}\r\n.format-table td {\r\n\tmax-width: 20px;\r\n\tmax-height: 20px;\r\n\tpadding:10px;\r\n}\r\n.format-table th {\r\n\tmax-width: 20px;\r\n\tmax-height: 20px;\r\n\tpadding:10px;\r\n}\r\n.format-table tr{\r\n  cursor: pointer;\r\n}\r\n.table-hover tbody tr:hover{\r\n  background-color: #6495ED;\r\n  color: #FFFFFF;\r\n}\r\n.aling-left{\r\n  text-align: left;\r\n}\r\n.aling-right{\r\n  text-align: right;\r\n}\r\n"; });
define('text!components/cabecalho.html', ['module'], function(module) { module.exports = "<template><nav class=\"navbar navbar-light\" style=\"background-color:#6495ed\"><a class=\"navbar-brand mb-0 h1 text-white font-weight-bold\" href=\"#\">Elaine Kids</a><form class=\"form-inline\"><button class=\"btn btn-outline-light my-2 my-sm-0\" type=\"button\" data-toggle=\"collapse\" data-target=\"#navbarSupportedContent\" aria-controls=\"navbarSupportedContent\" aria-expanded=\"false\" aria-label=\"Toggle navigation\" click.delegate=\"clickSair()\">Sair</button></form></nav></template>"; });
define('text!styles/loading.css', ['module'], function(module) { module.exports = ".loading{\r\n\twidth:100vw;\r\n\theight:100vh;\r\n  position:absolute;\r\n  z-index:100;\r\n  top:auto;\r\n  left:auto;\r\n\t/*background-color: rgba(255, 255, 255, 0.8);*/\r\n\tbackground-color: black;\r\n\topacity: .5;\r\n}\r\n\r\n.kart-loader *, .kart-loader *:after, .kart-loader *:before {\r\n\tbox-sizing: border-box;\r\n\t\t-o-box-sizing: border-box;\r\n\t\t-ms-box-sizing: border-box;\r\n\t\t-webkit-box-sizing: border-box;\r\n\t\t-moz-box-sizing: border-box;\r\n}\r\n\r\n\r\n.kart-loader {\r\n\tposition: relative;\r\n\tmargin: 225px auto;\r\n\tdisplay:block;\r\n\twidth:113px;\r\n}\r\n\r\n.sheath {\r\n\tposition: absolute;\r\n\ttransform-origin: 50% 50%;\r\n\t\t-o-transform-origin: 50% 50%;\r\n\t\t-ms-transform-origin: 50% 50%;\r\n\t\t-webkit-transform-origin: 50% 50%;\r\n\t\t-moz-transform-origin: 50% 50%;\r\n}\r\n\r\n.segment {\r\n\tbackground-color: rgb(56,118,224);\r\n\tborder-radius: 63px;\r\n\theight: 14px;\r\n\ttransform-origin: 0% 0%;\r\n\t\t-o-transform-origin: 0% 0%;\r\n\t\t-ms-transform-origin: 0% 0%;\r\n\t\t-webkit-transform-origin: 0% 0%;\r\n\t\t-moz-transform-origin: 0% 0%;\r\n\twidth: 41px;\r\n}\r\n\r\n\r\n\r\n.sheath:nth-child(1) {\r\n\tanimation: segment-orbit-1 3150ms infinite linear, segment-opacity-1 1968.75ms infinite linear;\r\n\t\t-o-animation: segment-orbit-1 3150ms infinite linear, segment-opacity-1 1968.75ms infinite linear;\r\n\t\t-ms-animation: segment-orbit-1 3150ms infinite linear, segment-opacity-1 1968.75ms infinite linear;\r\n\t\t-webkit-animation: segment-orbit-1 3150ms infinite linear, segment-opacity-1 1968.75ms infinite linear;\r\n\t\t-moz-animation: segment-orbit-1 3150ms infinite linear, segment-opacity-1 1968.75ms infinite linear;\r\n\ttransform: rotate(-30deg) translate(54px);\r\n\t\t-o-transform: rotate(-30deg) translate(54px);\r\n\t\t-ms-transform: rotate(-30deg) translate(54px);\r\n\t\t-webkit-transform: rotate(-30deg) translate(54px);\r\n\t\t-moz-transform: rotate(-30deg) translate(54px);\r\n}\r\n.sheath:nth-child(1) .segment {\r\n\tanimation: segment-scale-1 1968.75ms infinite linear;\r\n\t\t-o-animation: segment-scale-1 1968.75ms infinite linear;\r\n\t\t-ms-animation: segment-scale-1 1968.75ms infinite linear;\r\n\t\t-webkit-animation: segment-scale-1 1968.75ms infinite linear;\r\n\t\t-moz-animation: segment-scale-1 1968.75ms infinite linear;\r\n}\r\n\r\n\r\n\r\n.sheath:nth-child(2) {\r\n\tanimation: segment-orbit-2 3150ms infinite linear, segment-opacity-2 1968.75ms infinite linear;\r\n\t\t-o-animation: segment-orbit-2 3150ms infinite linear, segment-opacity-2 1968.75ms infinite linear;\r\n\t\t-ms-animation: segment-orbit-2 3150ms infinite linear, segment-opacity-2 1968.75ms infinite linear;\r\n\t\t-webkit-animation: segment-orbit-2 3150ms infinite linear, segment-opacity-2 1968.75ms infinite linear;\r\n\t\t-moz-animation: segment-orbit-2 3150ms infinite linear, segment-opacity-2 1968.75ms infinite linear;\r\n\ttransform: rotate(-60deg) translate(54px);\r\n\t\t-o-transform: rotate(-60deg) translate(54px);\r\n\t\t-ms-transform: rotate(-60deg) translate(54px);\r\n\t\t-webkit-transform: rotate(-60deg) translate(54px);\r\n\t\t-moz-transform: rotate(-60deg) translate(54px);\r\n}\r\n.sheath:nth-child(2) .segment {\r\n\tanimation: segment-scale-2 1968.75ms infinite linear;\r\n\t\t-o-animation: segment-scale-2 1968.75ms infinite linear;\r\n\t\t-ms-animation: segment-scale-2 1968.75ms infinite linear;\r\n\t\t-webkit-animation: segment-scale-2 1968.75ms infinite linear;\r\n\t\t-moz-animation: segment-scale-2 1968.75ms infinite linear;\r\n}\r\n\r\n\r\n\r\n.sheath:nth-child(3) {\r\n\tanimation: segment-orbit-3 3150ms infinite linear, segment-opacity-3 1968.75ms infinite linear;\r\n\t\t-o-animation: segment-orbit-3 3150ms infinite linear, segment-opacity-3 1968.75ms infinite linear;\r\n\t\t-ms-animation: segment-orbit-3 3150ms infinite linear, segment-opacity-3 1968.75ms infinite linear;\r\n\t\t-webkit-animation: segment-orbit-3 3150ms infinite linear, segment-opacity-3 1968.75ms infinite linear;\r\n\t\t-moz-animation: segment-orbit-3 3150ms infinite linear, segment-opacity-3 1968.75ms infinite linear;\r\n\ttransform: rotate(-90deg) translate(54px);\r\n\t\t-o-transform: rotate(-90deg) translate(54px);\r\n\t\t-ms-transform: rotate(-90deg) translate(54px);\r\n\t\t-webkit-transform: rotate(-90deg) translate(54px);\r\n\t\t-moz-transform: rotate(-90deg) translate(54px);\r\n}\r\n.sheath:nth-child(3) .segment {\r\n\tanimation: segment-scale-3 1968.75ms infinite linear;\r\n\t\t-o-animation: segment-scale-3 1968.75ms infinite linear;\r\n\t\t-ms-animation: segment-scale-3 1968.75ms infinite linear;\r\n\t\t-webkit-animation: segment-scale-3 1968.75ms infinite linear;\r\n\t\t-moz-animation: segment-scale-3 1968.75ms infinite linear;\r\n}\r\n\r\n\r\n\r\n.sheath:nth-child(4) {\r\n\tanimation: segment-orbit-4 3150ms infinite linear, segment-opacity-4 1968.75ms infinite linear;\r\n\t\t-o-animation: segment-orbit-4 3150ms infinite linear, segment-opacity-4 1968.75ms infinite linear;\r\n\t\t-ms-animation: segment-orbit-4 3150ms infinite linear, segment-opacity-4 1968.75ms infinite linear;\r\n\t\t-webkit-animation: segment-orbit-4 3150ms infinite linear, segment-opacity-4 1968.75ms infinite linear;\r\n\t\t-moz-animation: segment-orbit-4 3150ms infinite linear, segment-opacity-4 1968.75ms infinite linear;\r\n\ttransform: rotate(-120deg) translate(54px);\r\n\t\t-o-transform: rotate(-120deg) translate(54px);\r\n\t\t-ms-transform: rotate(-120deg) translate(54px);\r\n\t\t-webkit-transform: rotate(-120deg) translate(54px);\r\n\t\t-moz-transform: rotate(-120deg) translate(54px);\r\n}\r\n.sheath:nth-child(4) .segment {\r\n\tanimation: segment-scale-4 1968.75ms infinite linear;\r\n\t\t-o-animation: segment-scale-4 1968.75ms infinite linear;\r\n\t\t-ms-animation: segment-scale-4 1968.75ms infinite linear;\r\n\t\t-webkit-animation: segment-scale-4 1968.75ms infinite linear;\r\n\t\t-moz-animation: segment-scale-4 1968.75ms infinite linear;\r\n}\r\n\r\n\r\n\r\n.sheath:nth-child(5) {\r\n\tanimation: segment-orbit-5 3150ms infinite linear, segment-opacity-5 1968.75ms infinite linear;\r\n\t\t-o-animation: segment-orbit-5 3150ms infinite linear, segment-opacity-5 1968.75ms infinite linear;\r\n\t\t-ms-animation: segment-orbit-5 3150ms infinite linear, segment-opacity-5 1968.75ms infinite linear;\r\n\t\t-webkit-animation: segment-orbit-5 3150ms infinite linear, segment-opacity-5 1968.75ms infinite linear;\r\n\t\t-moz-animation: segment-orbit-5 3150ms infinite linear, segment-opacity-5 1968.75ms infinite linear;\r\n\ttransform: rotate(-150deg) translate(54px);\r\n\t\t-o-transform: rotate(-150deg) translate(54px);\r\n\t\t-ms-transform: rotate(-150deg) translate(54px);\r\n\t\t-webkit-transform: rotate(-150deg) translate(54px);\r\n\t\t-moz-transform: rotate(-150deg) translate(54px);\r\n}\r\n.sheath:nth-child(5) .segment {\r\n\tanimation: segment-scale-5 1968.75ms infinite linear;\r\n\t\t-o-animation: segment-scale-5 1968.75ms infinite linear;\r\n\t\t-ms-animation: segment-scale-5 1968.75ms infinite linear;\r\n\t\t-webkit-animation: segment-scale-5 1968.75ms infinite linear;\r\n\t\t-moz-animation: segment-scale-5 1968.75ms infinite linear;\r\n}\r\n\r\n\r\n\r\n.sheath:nth-child(6) {\r\n\tanimation: segment-orbit-6 3150ms infinite linear, segment-opacity-6 1968.75ms infinite linear;\r\n\t\t-o-animation: segment-orbit-6 3150ms infinite linear, segment-opacity-6 1968.75ms infinite linear;\r\n\t\t-ms-animation: segment-orbit-6 3150ms infinite linear, segment-opacity-6 1968.75ms infinite linear;\r\n\t\t-webkit-animation: segment-orbit-6 3150ms infinite linear, segment-opacity-6 1968.75ms infinite linear;\r\n\t\t-moz-animation: segment-orbit-6 3150ms infinite linear, segment-opacity-6 1968.75ms infinite linear;\r\n\ttransform: rotate(-180deg) translate(54px);\r\n\t\t-o-transform: rotate(-180deg) translate(54px);\r\n\t\t-ms-transform: rotate(-180deg) translate(54px);\r\n\t\t-webkit-transform: rotate(-180deg) translate(54px);\r\n\t\t-moz-transform: rotate(-180deg) translate(54px);\r\n}\r\n.sheath:nth-child(6) .segment {\r\n\tanimation: segment-scale-6 1968.75ms infinite linear;\r\n\t\t-o-animation: segment-scale-6 1968.75ms infinite linear;\r\n\t\t-ms-animation: segment-scale-6 1968.75ms infinite linear;\r\n\t\t-webkit-animation: segment-scale-6 1968.75ms infinite linear;\r\n\t\t-moz-animation: segment-scale-6 1968.75ms infinite linear;\r\n}\r\n\r\n\r\n\r\n.sheath:nth-child(7) {\r\n\tanimation: segment-orbit-7 3150ms infinite linear, segment-opacity-7 1968.75ms infinite linear;\r\n\t\t-o-animation: segment-orbit-7 3150ms infinite linear, segment-opacity-7 1968.75ms infinite linear;\r\n\t\t-ms-animation: segment-orbit-7 3150ms infinite linear, segment-opacity-7 1968.75ms infinite linear;\r\n\t\t-webkit-animation: segment-orbit-7 3150ms infinite linear, segment-opacity-7 1968.75ms infinite linear;\r\n\t\t-moz-animation: segment-orbit-7 3150ms infinite linear, segment-opacity-7 1968.75ms infinite linear;\r\n\ttransform: rotate(-210deg) translate(54px);\r\n\t\t-o-transform: rotate(-210deg) translate(54px);\r\n\t\t-ms-transform: rotate(-210deg) translate(54px);\r\n\t\t-webkit-transform: rotate(-210deg) translate(54px);\r\n\t\t-moz-transform: rotate(-210deg) translate(54px);\r\n}\r\n.sheath:nth-child(7) .segment {\r\n\tanimation: segment-scale-7 1968.75ms infinite linear;\r\n\t\t-o-animation: segment-scale-7 1968.75ms infinite linear;\r\n\t\t-ms-animation: segment-scale-7 1968.75ms infinite linear;\r\n\t\t-webkit-animation: segment-scale-7 1968.75ms infinite linear;\r\n\t\t-moz-animation: segment-scale-7 1968.75ms infinite linear;\r\n}\r\n\r\n\r\n\r\n.sheath:nth-child(8) {\r\n\tanimation: segment-orbit-8 3150ms infinite linear, segment-opacity-8 1968.75ms infinite linear;\r\n\t\t-o-animation: segment-orbit-8 3150ms infinite linear, segment-opacity-8 1968.75ms infinite linear;\r\n\t\t-ms-animation: segment-orbit-8 3150ms infinite linear, segment-opacity-8 1968.75ms infinite linear;\r\n\t\t-webkit-animation: segment-orbit-8 3150ms infinite linear, segment-opacity-8 1968.75ms infinite linear;\r\n\t\t-moz-animation: segment-orbit-8 3150ms infinite linear, segment-opacity-8 1968.75ms infinite linear;\r\n\ttransform: rotate(-240deg) translate(54px);\r\n\t\t-o-transform: rotate(-240deg) translate(54px);\r\n\t\t-ms-transform: rotate(-240deg) translate(54px);\r\n\t\t-webkit-transform: rotate(-240deg) translate(54px);\r\n\t\t-moz-transform: rotate(-240deg) translate(54px);\r\n}\r\n.sheath:nth-child(8) .segment {\r\n\tanimation: segment-scale-8 1968.75ms infinite linear;\r\n\t\t-o-animation: segment-scale-8 1968.75ms infinite linear;\r\n\t\t-ms-animation: segment-scale-8 1968.75ms infinite linear;\r\n\t\t-webkit-animation: segment-scale-8 1968.75ms infinite linear;\r\n\t\t-moz-animation: segment-scale-8 1968.75ms infinite linear;\r\n}\r\n\r\n\r\n\r\n.sheath:nth-child(9) {\r\n\tanimation: segment-orbit-9 3150ms infinite linear, segment-opacity-9 1968.75ms infinite linear;\r\n\t\t-o-animation: segment-orbit-9 3150ms infinite linear, segment-opacity-9 1968.75ms infinite linear;\r\n\t\t-ms-animation: segment-orbit-9 3150ms infinite linear, segment-opacity-9 1968.75ms infinite linear;\r\n\t\t-webkit-animation: segment-orbit-9 3150ms infinite linear, segment-opacity-9 1968.75ms infinite linear;\r\n\t\t-moz-animation: segment-orbit-9 3150ms infinite linear, segment-opacity-9 1968.75ms infinite linear;\r\n\ttransform: rotate(-270deg) translate(54px);\r\n\t\t-o-transform: rotate(-270deg) translate(54px);\r\n\t\t-ms-transform: rotate(-270deg) translate(54px);\r\n\t\t-webkit-transform: rotate(-270deg) translate(54px);\r\n\t\t-moz-transform: rotate(-270deg) translate(54px);\r\n}\r\n.sheath:nth-child(9) .segment {\r\n\tanimation: segment-scale-9 1968.75ms infinite linear;\r\n\t\t-o-animation: segment-scale-9 1968.75ms infinite linear;\r\n\t\t-ms-animation: segment-scale-9 1968.75ms infinite linear;\r\n\t\t-webkit-animation: segment-scale-9 1968.75ms infinite linear;\r\n\t\t-moz-animation: segment-scale-9 1968.75ms infinite linear;\r\n}\r\n\r\n\r\n\r\n.sheath:nth-child(10) {\r\n\tanimation: segment-orbit-10 3150ms infinite linear, segment-opacity-10 1968.75ms infinite linear;\r\n\t\t-o-animation: segment-orbit-10 3150ms infinite linear, segment-opacity-10 1968.75ms infinite linear;\r\n\t\t-ms-animation: segment-orbit-10 3150ms infinite linear, segment-opacity-10 1968.75ms infinite linear;\r\n\t\t-webkit-animation: segment-orbit-10 3150ms infinite linear, segment-opacity-10 1968.75ms infinite linear;\r\n\t\t-moz-animation: segment-orbit-10 3150ms infinite linear, segment-opacity-10 1968.75ms infinite linear;\r\n\ttransform: rotate(-300deg) translate(54px);\r\n\t\t-o-transform: rotate(-300deg) translate(54px);\r\n\t\t-ms-transform: rotate(-300deg) translate(54px);\r\n\t\t-webkit-transform: rotate(-300deg) translate(54px);\r\n\t\t-moz-transform: rotate(-300deg) translate(54px);\r\n}\r\n.sheath:nth-child(10) .segment {\r\n\tanimation: segment-scale-10 1968.75ms infinite linear;\r\n\t\t-o-animation: segment-scale-10 1968.75ms infinite linear;\r\n\t\t-ms-animation: segment-scale-10 1968.75ms infinite linear;\r\n\t\t-webkit-animation: segment-scale-10 1968.75ms infinite linear;\r\n\t\t-moz-animation: segment-scale-10 1968.75ms infinite linear;\r\n}\r\n\r\n\r\n\r\n.sheath:nth-child(11) {\r\n\tanimation: segment-orbit-11 3150ms infinite linear, segment-opacity-11 1968.75ms infinite linear;\r\n\t\t-o-animation: segment-orbit-11 3150ms infinite linear, segment-opacity-11 1968.75ms infinite linear;\r\n\t\t-ms-animation: segment-orbit-11 3150ms infinite linear, segment-opacity-11 1968.75ms infinite linear;\r\n\t\t-webkit-animation: segment-orbit-11 3150ms infinite linear, segment-opacity-11 1968.75ms infinite linear;\r\n\t\t-moz-animation: segment-orbit-11 3150ms infinite linear, segment-opacity-11 1968.75ms infinite linear;\r\n\ttransform: rotate(-330deg) translate(54px);\r\n\t\t-o-transform: rotate(-330deg) translate(54px);\r\n\t\t-ms-transform: rotate(-330deg) translate(54px);\r\n\t\t-webkit-transform: rotate(-330deg) translate(54px);\r\n\t\t-moz-transform: rotate(-330deg) translate(54px);\r\n}\r\n\r\n.sheath:nth-child(11) .segment {\r\n\tanimation: segment-scale-11 1968.75ms infinite linear;\r\n\t\t-o-animation: segment-scale-11 1968.75ms infinite linear;\r\n\t\t-ms-animation: segment-scale-11 1968.75ms infinite linear;\r\n\t\t-webkit-animation: segment-scale-11 1968.75ms infinite linear;\r\n\t\t-moz-animation: segment-scale-11 1968.75ms infinite linear;\r\n}\r\n\r\n\r\n\r\n.sheath:nth-child(12) {\r\n\tanimation: segment-orbit-12 3150ms infinite linear, segment-opacity-12 1968.75ms infinite linear;\r\n\t\t-o-animation: segment-orbit-12 3150ms infinite linear, segment-opacity-12 1968.75ms infinite linear;\r\n\t\t-ms-animation: segment-orbit-12 3150ms infinite linear, segment-opacity-12 1968.75ms infinite linear;\r\n\t\t-webkit-animation: segment-orbit-12 3150ms infinite linear, segment-opacity-12 1968.75ms infinite linear;\r\n\t\t-moz-animation: segment-orbit-12 3150ms infinite linear, segment-opacity-12 1968.75ms infinite linear;\r\n\ttransform: rotate(-360deg) translate(54px);\r\n\t\t-o-transform: rotate(-360deg) translate(54px);\r\n\t\t-ms-transform: rotate(-360deg) translate(54px);\r\n\t\t-webkit-transform: rotate(-360deg) translate(54px);\r\n\t\t-moz-transform: rotate(-360deg) translate(54px);\r\n}\r\n\r\n.sheath:nth-child(12) .segment {\r\n\tanimation: segment-scale-12 1968.75ms infinite linear;\r\n\t\t-o-animation: segment-scale-12 1968.75ms infinite linear;\r\n\t\t-ms-animation: segment-scale-12 1968.75ms infinite linear;\r\n\t\t-webkit-animation: segment-scale-12 1968.75ms infinite linear;\r\n\t\t-moz-animation: segment-scale-12 1968.75ms infinite linear;\r\n}\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n@keyframes segment-orbit-1 {\r\n\tfrom {\r\n\t\ttransform: rotate(30deg) translate(54px);\r\n\t}\r\n\t50% {\r\n\t\ttransform: rotate(210deg) translate(65px);\r\n\t}\r\n\tto {\r\n\t\ttransform: rotate(390deg) translate(54px);\r\n\t}\r\n}\r\n\r\n@-o-keyframes segment-orbit-1 {\r\n\tfrom {\r\n\t\t-o-transform: rotate(30deg) translate(54px);\r\n\t}\r\n\t50% {\r\n\t\t-o-transform: rotate(210deg) translate(65px);\r\n\t}\r\n\tto {\r\n\t\t-o-transform: rotate(390deg) translate(54px);\r\n\t}\r\n}\r\n\r\n@-ms-keyframes segment-orbit-1 {\r\n\tfrom {\r\n\t\t-ms-transform: rotate(30deg) translate(54px);\r\n\t}\r\n\t50% {\r\n\t\t-ms-transform: rotate(210deg) translate(65px);\r\n\t}\r\n\tto {\r\n\t\t-ms-transform: rotate(390deg) translate(54px);\r\n\t}\r\n}\r\n\r\n@-webkit-keyframes segment-orbit-1 {\r\n\tfrom {\r\n\t\t-webkit-transform: rotate(30deg) translate(54px);\r\n\t}\r\n\t50% {\r\n\t\t-webkit-transform: rotate(210deg) translate(65px);\r\n\t}\r\n\tto {\r\n\t\t-webkit-transform: rotate(390deg) translate(54px);\r\n\t}\r\n}\r\n\r\n@-moz-keyframes segment-orbit-1 {\r\n\tfrom {\r\n\t\t-moz-transform: rotate(30deg) translate(54px);\r\n\t}\r\n\t50% {\r\n\t\t-moz-transform: rotate(210deg) translate(65px);\r\n\t}\r\n\tto {\r\n\t\t-moz-transform: rotate(390deg) translate(54px);\r\n\t}\r\n}\r\n\r\n@keyframes segment-orbit-2 {\r\n\tfrom {\r\n\t\ttransform: rotate(60deg) translate(54px);\r\n\t}\r\n\t50% {\r\n\t\ttransform: rotate(240deg) translate(65px);\r\n\t}\r\n\tto {\r\n\t\ttransform: rotate(420deg) translate(54px);\r\n\t}\r\n}\r\n\r\n@-o-keyframes segment-orbit-2 {\r\n\tfrom {\r\n\t\t-o-transform: rotate(60deg) translate(54px);\r\n\t}\r\n\t50% {\r\n\t\t-o-transform: rotate(240deg) translate(65px);\r\n\t}\r\n\tto {\r\n\t\t-o-transform: rotate(420deg) translate(54px);\r\n\t}\r\n}\r\n\r\n@-ms-keyframes segment-orbit-2 {\r\n\tfrom {\r\n\t\t-ms-transform: rotate(60deg) translate(54px);\r\n\t}\r\n\t50% {\r\n\t\t-ms-transform: rotate(240deg) translate(65px);\r\n\t}\r\n\tto {\r\n\t\t-ms-transform: rotate(420deg) translate(54px);\r\n\t}\r\n}\r\n\r\n@-webkit-keyframes segment-orbit-2 {\r\n\tfrom {\r\n\t\t-webkit-transform: rotate(60deg) translate(54px);\r\n\t}\r\n\t50% {\r\n\t\t-webkit-transform: rotate(240deg) translate(65px);\r\n\t}\r\n\tto {\r\n\t\t-webkit-transform: rotate(420deg) translate(54px);\r\n\t}\r\n}\r\n\r\n@-moz-keyframes segment-orbit-2 {\r\n\tfrom {\r\n\t\t-moz-transform: rotate(60deg) translate(54px);\r\n\t}\r\n\t50% {\r\n\t\t-moz-transform: rotate(240deg) translate(65px);\r\n\t}\r\n\tto {\r\n\t\t-moz-transform: rotate(420deg) translate(54px);\r\n\t}\r\n}\r\n\r\n@keyframes segment-orbit-3 {\r\n\tfrom {\r\n\t\ttransform: rotate(90deg) translate(54px);\r\n\t}\r\n\t50% {\r\n\t\ttransform: rotate(270deg) translate(65px);\r\n\t}\r\n\tto {\r\n\t\ttransform: rotate(450deg) translate(54px);\r\n\t}\r\n}\r\n\r\n@-o-keyframes segment-orbit-3 {\r\n\tfrom {\r\n\t\t-o-transform: rotate(90deg) translate(54px);\r\n\t}\r\n\t50% {\r\n\t\t-o-transform: rotate(270deg) translate(65px);\r\n\t}\r\n\tto {\r\n\t\t-o-transform: rotate(450deg) translate(54px);\r\n\t}\r\n}\r\n\r\n@-ms-keyframes segment-orbit-3 {\r\n\tfrom {\r\n\t\t-ms-transform: rotate(90deg) translate(54px);\r\n\t}\r\n\t50% {\r\n\t\t-ms-transform: rotate(270deg) translate(65px);\r\n\t}\r\n\tto {\r\n\t\t-ms-transform: rotate(450deg) translate(54px);\r\n\t}\r\n}\r\n\r\n@-webkit-keyframes segment-orbit-3 {\r\n\tfrom {\r\n\t\t-webkit-transform: rotate(90deg) translate(54px);\r\n\t}\r\n\t50% {\r\n\t\t-webkit-transform: rotate(270deg) translate(65px);\r\n\t}\r\n\tto {\r\n\t\t-webkit-transform: rotate(450deg) translate(54px);\r\n\t}\r\n}\r\n\r\n@-moz-keyframes segment-orbit-3 {\r\n\tfrom {\r\n\t\t-moz-transform: rotate(90deg) translate(54px);\r\n\t}\r\n\t50% {\r\n\t\t-moz-transform: rotate(270deg) translate(65px);\r\n\t}\r\n\tto {\r\n\t\t-moz-transform: rotate(450deg) translate(54px);\r\n\t}\r\n}\r\n\r\n@keyframes segment-orbit-4 {\r\n\tfrom {\r\n\t\ttransform: rotate(120deg) translate(54px);\r\n\t}\r\n\t50% {\r\n\t\ttransform: rotate(300deg) translate(65px);\r\n\t}\r\n\tto {\r\n\t\ttransform: rotate(480deg) translate(54px);\r\n\t}\r\n}\r\n\r\n@-o-keyframes segment-orbit-4 {\r\n\tfrom {\r\n\t\t-o-transform: rotate(120deg) translate(54px);\r\n\t}\r\n\t50% {\r\n\t\t-o-transform: rotate(300deg) translate(65px);\r\n\t}\r\n\tto {\r\n\t\t-o-transform: rotate(480deg) translate(54px);\r\n\t}\r\n}\r\n\r\n@-ms-keyframes segment-orbit-4 {\r\n\tfrom {\r\n\t\t-ms-transform: rotate(120deg) translate(54px);\r\n\t}\r\n\t50% {\r\n\t\t-ms-transform: rotate(300deg) translate(65px);\r\n\t}\r\n\tto {\r\n\t\t-ms-transform: rotate(480deg) translate(54px);\r\n\t}\r\n}\r\n\r\n@-webkit-keyframes segment-orbit-4 {\r\n\tfrom {\r\n\t\t-webkit-transform: rotate(120deg) translate(54px);\r\n\t}\r\n\t50% {\r\n\t\t-webkit-transform: rotate(300deg) translate(65px);\r\n\t}\r\n\tto {\r\n\t\t-webkit-transform: rotate(480deg) translate(54px);\r\n\t}\r\n}\r\n\r\n@-moz-keyframes segment-orbit-4 {\r\n\tfrom {\r\n\t\t-moz-transform: rotate(120deg) translate(54px);\r\n\t}\r\n\t50% {\r\n\t\t-moz-transform: rotate(300deg) translate(65px);\r\n\t}\r\n\tto {\r\n\t\t-moz-transform: rotate(480deg) translate(54px);\r\n\t}\r\n}\r\n\r\n@keyframes segment-orbit-5 {\r\n\tfrom {\r\n\t\ttransform: rotate(150deg) translate(54px);\r\n\t}\r\n\t50% {\r\n\t\ttransform: rotate(330deg) translate(65px);\r\n\t}\r\n\tto {\r\n\t\ttransform: rotate(510deg) translate(54px);\r\n\t}\r\n}\r\n\r\n@-o-keyframes segment-orbit-5 {\r\n\tfrom {\r\n\t\t-o-transform: rotate(150deg) translate(54px);\r\n\t}\r\n\t50% {\r\n\t\t-o-transform: rotate(330deg) translate(65px);\r\n\t}\r\n\tto {\r\n\t\t-o-transform: rotate(510deg) translate(54px);\r\n\t}\r\n}\r\n\r\n@-ms-keyframes segment-orbit-5 {\r\n\tfrom {\r\n\t\t-ms-transform: rotate(150deg) translate(54px);\r\n\t}\r\n\t50% {\r\n\t\t-ms-transform: rotate(330deg) translate(65px);\r\n\t}\r\n\tto {\r\n\t\t-ms-transform: rotate(510deg) translate(54px);\r\n\t}\r\n}\r\n\r\n@-webkit-keyframes segment-orbit-5 {\r\n\tfrom {\r\n\t\t-webkit-transform: rotate(150deg) translate(54px);\r\n\t}\r\n\t50% {\r\n\t\t-webkit-transform: rotate(330deg) translate(65px);\r\n\t}\r\n\tto {\r\n\t\t-webkit-transform: rotate(510deg) translate(54px);\r\n\t}\r\n}\r\n\r\n@-moz-keyframes segment-orbit-5 {\r\n\tfrom {\r\n\t\t-moz-transform: rotate(150deg) translate(54px);\r\n\t}\r\n\t50% {\r\n\t\t-moz-transform: rotate(330deg) translate(65px);\r\n\t}\r\n\tto {\r\n\t\t-moz-transform: rotate(510deg) translate(54px);\r\n\t}\r\n}\r\n\r\n@keyframes segment-orbit-6 {\r\n\tfrom {\r\n\t\ttransform: rotate(180deg) translate(54px);\r\n\t}\r\n\t50% {\r\n\t\ttransform: rotate(360deg) translate(65px);\r\n\t}\r\n\tto {\r\n\t\ttransform: rotate(540deg) translate(54px);\r\n\t}\r\n}\r\n\r\n@-o-keyframes segment-orbit-6 {\r\n\tfrom {\r\n\t\t-o-transform: rotate(180deg) translate(54px);\r\n\t}\r\n\t50% {\r\n\t\t-o-transform: rotate(360deg) translate(65px);\r\n\t}\r\n\tto {\r\n\t\t-o-transform: rotate(540deg) translate(54px);\r\n\t}\r\n}\r\n\r\n@-ms-keyframes segment-orbit-6 {\r\n\tfrom {\r\n\t\t-ms-transform: rotate(180deg) translate(54px);\r\n\t}\r\n\t50% {\r\n\t\t-ms-transform: rotate(360deg) translate(65px);\r\n\t}\r\n\tto {\r\n\t\t-ms-transform: rotate(540deg) translate(54px);\r\n\t}\r\n}\r\n\r\n@-webkit-keyframes segment-orbit-6 {\r\n\tfrom {\r\n\t\t-webkit-transform: rotate(180deg) translate(54px);\r\n\t}\r\n\t50% {\r\n\t\t-webkit-transform: rotate(360deg) translate(65px);\r\n\t}\r\n\tto {\r\n\t\t-webkit-transform: rotate(540deg) translate(54px);\r\n\t}\r\n}\r\n\r\n@-moz-keyframes segment-orbit-6 {\r\n\tfrom {\r\n\t\t-moz-transform: rotate(180deg) translate(54px);\r\n\t}\r\n\t50% {\r\n\t\t-moz-transform: rotate(360deg) translate(65px);\r\n\t}\r\n\tto {\r\n\t\t-moz-transform: rotate(540deg) translate(54px);\r\n\t}\r\n}\r\n\r\n@keyframes segment-orbit-7 {\r\n\tfrom {\r\n\t\ttransform: rotate(210deg) translate(54px);\r\n\t}\r\n\t50% {\r\n\t\ttransform: rotate(390deg) translate(65px);\r\n\t}\r\n\tto {\r\n\t\ttransform: rotate(570deg) translate(54px);\r\n\t}\r\n}\r\n\r\n@-o-keyframes segment-orbit-7 {\r\n\tfrom {\r\n\t\t-o-transform: rotate(210deg) translate(54px);\r\n\t}\r\n\t50% {\r\n\t\t-o-transform: rotate(390deg) translate(65px);\r\n\t}\r\n\tto {\r\n\t\t-o-transform: rotate(570deg) translate(54px);\r\n\t}\r\n}\r\n\r\n@-ms-keyframes segment-orbit-7 {\r\n\tfrom {\r\n\t\t-ms-transform: rotate(210deg) translate(54px);\r\n\t}\r\n\t50% {\r\n\t\t-ms-transform: rotate(390deg) translate(65px);\r\n\t}\r\n\tto {\r\n\t\t-ms-transform: rotate(570deg) translate(54px);\r\n\t}\r\n}\r\n\r\n@-webkit-keyframes segment-orbit-7 {\r\n\tfrom {\r\n\t\t-webkit-transform: rotate(210deg) translate(54px);\r\n\t}\r\n\t50% {\r\n\t\t-webkit-transform: rotate(390deg) translate(65px);\r\n\t}\r\n\tto {\r\n\t\t-webkit-transform: rotate(570deg) translate(54px);\r\n\t}\r\n}\r\n\r\n@-moz-keyframes segment-orbit-7 {\r\n\tfrom {\r\n\t\t-moz-transform: rotate(210deg) translate(54px);\r\n\t}\r\n\t50% {\r\n\t\t-moz-transform: rotate(390deg) translate(65px);\r\n\t}\r\n\tto {\r\n\t\t-moz-transform: rotate(570deg) translate(54px);\r\n\t}\r\n}\r\n\r\n@keyframes segment-orbit-8 {\r\n\tfrom {\r\n\t\ttransform: rotate(240deg) translate(54px);\r\n\t}\r\n\t50% {\r\n\t\ttransform: rotate(420deg) translate(65px);\r\n\t}\r\n\tto {\r\n\t\ttransform: rotate(600deg) translate(54px);\r\n\t}\r\n}\r\n\r\n@-o-keyframes segment-orbit-8 {\r\n\tfrom {\r\n\t\t-o-transform: rotate(240deg) translate(54px);\r\n\t}\r\n\t50% {\r\n\t\t-o-transform: rotate(420deg) translate(65px);\r\n\t}\r\n\tto {\r\n\t\t-o-transform: rotate(600deg) translate(54px);\r\n\t}\r\n}\r\n\r\n@-ms-keyframes segment-orbit-8 {\r\n\tfrom {\r\n\t\t-ms-transform: rotate(240deg) translate(54px);\r\n\t}\r\n\t50% {\r\n\t\t-ms-transform: rotate(420deg) translate(65px);\r\n\t}\r\n\tto {\r\n\t\t-ms-transform: rotate(600deg) translate(54px);\r\n\t}\r\n}\r\n\r\n@-webkit-keyframes segment-orbit-8 {\r\n\tfrom {\r\n\t\t-webkit-transform: rotate(240deg) translate(54px);\r\n\t}\r\n\t50% {\r\n\t\t-webkit-transform: rotate(420deg) translate(65px);\r\n\t}\r\n\tto {\r\n\t\t-webkit-transform: rotate(600deg) translate(54px);\r\n\t}\r\n}\r\n\r\n@-moz-keyframes segment-orbit-8 {\r\n\tfrom {\r\n\t\t-moz-transform: rotate(240deg) translate(54px);\r\n\t}\r\n\t50% {\r\n\t\t-moz-transform: rotate(420deg) translate(65px);\r\n\t}\r\n\tto {\r\n\t\t-moz-transform: rotate(600deg) translate(54px);\r\n\t}\r\n}\r\n\r\n@keyframes segment-orbit-9 {\r\n\tfrom {\r\n\t\ttransform: rotate(270deg) translate(54px);\r\n\t}\r\n\t50% {\r\n\t\ttransform: rotate(450deg) translate(65px);\r\n\t}\r\n\tto {\r\n\t\ttransform: rotate(630deg) translate(54px);\r\n\t}\r\n}\r\n\r\n@-o-keyframes segment-orbit-9 {\r\n\tfrom {\r\n\t\t-o-transform: rotate(270deg) translate(54px);\r\n\t}\r\n\t50% {\r\n\t\t-o-transform: rotate(450deg) translate(65px);\r\n\t}\r\n\tto {\r\n\t\t-o-transform: rotate(630deg) translate(54px);\r\n\t}\r\n}\r\n\r\n@-ms-keyframes segment-orbit-9 {\r\n\tfrom {\r\n\t\t-ms-transform: rotate(270deg) translate(54px);\r\n\t}\r\n\t50% {\r\n\t\t-ms-transform: rotate(450deg) translate(65px);\r\n\t}\r\n\tto {\r\n\t\t-ms-transform: rotate(630deg) translate(54px);\r\n\t}\r\n}\r\n\r\n@-webkit-keyframes segment-orbit-9 {\r\n\tfrom {\r\n\t\t-webkit-transform: rotate(270deg) translate(54px);\r\n\t}\r\n\t50% {\r\n\t\t-webkit-transform: rotate(450deg) translate(65px);\r\n\t}\r\n\tto {\r\n\t\t-webkit-transform: rotate(630deg) translate(54px);\r\n\t}\r\n}\r\n\r\n@-moz-keyframes segment-orbit-9 {\r\n\tfrom {\r\n\t\t-moz-transform: rotate(270deg) translate(54px);\r\n\t}\r\n\t50% {\r\n\t\t-moz-transform: rotate(450deg) translate(65px);\r\n\t}\r\n\tto {\r\n\t\t-moz-transform: rotate(630deg) translate(54px);\r\n\t}\r\n}\r\n\r\n@keyframes segment-orbit-10 {\r\n\tfrom {\r\n\t\ttransform: rotate(300deg) translate(54px);\r\n\t}\r\n\t50% {\r\n\t\ttransform: rotate(480deg) translate(65px);\r\n\t}\r\n\tto {\r\n\t\ttransform: rotate(660deg) translate(54px);\r\n\t}\r\n}\r\n\r\n@-o-keyframes segment-orbit-10 {\r\n\tfrom {\r\n\t\t-o-transform: rotate(300deg) translate(54px);\r\n\t}\r\n\t50% {\r\n\t\t-o-transform: rotate(480deg) translate(65px);\r\n\t}\r\n\tto {\r\n\t\t-o-transform: rotate(660deg) translate(54px);\r\n\t}\r\n}\r\n\r\n@-ms-keyframes segment-orbit-10 {\r\n\tfrom {\r\n\t\t-ms-transform: rotate(300deg) translate(54px);\r\n\t}\r\n\t50% {\r\n\t\t-ms-transform: rotate(480deg) translate(65px);\r\n\t}\r\n\tto {\r\n\t\t-ms-transform: rotate(660deg) translate(54px);\r\n\t}\r\n}\r\n\r\n@-webkit-keyframes segment-orbit-10 {\r\n\tfrom {\r\n\t\t-webkit-transform: rotate(300deg) translate(54px);\r\n\t}\r\n\t50% {\r\n\t\t-webkit-transform: rotate(480deg) translate(65px);\r\n\t}\r\n\tto {\r\n\t\t-webkit-transform: rotate(660deg) translate(54px);\r\n\t}\r\n}\r\n\r\n@-moz-keyframes segment-orbit-10 {\r\n\tfrom {\r\n\t\t-moz-transform: rotate(300deg) translate(54px);\r\n\t}\r\n\t50% {\r\n\t\t-moz-transform: rotate(480deg) translate(65px);\r\n\t}\r\n\tto {\r\n\t\t-moz-transform: rotate(660deg) translate(54px);\r\n\t}\r\n}\r\n\r\n@keyframes segment-orbit-11 {\r\n\tfrom {\r\n\t\ttransform: rotate(330deg) translate(54px);\r\n\t}\r\n\t50% {\r\n\t\ttransform: rotate(510deg) translate(65px);\r\n\t}\r\n\tto {\r\n\t\ttransform: rotate(690deg) translate(54px);\r\n\t}\r\n}\r\n\r\n@-o-keyframes segment-orbit-11 {\r\n\tfrom {\r\n\t\t-o-transform: rotate(330deg) translate(54px);\r\n\t}\r\n\t50% {\r\n\t\t-o-transform: rotate(510deg) translate(65px);\r\n\t}\r\n\tto {\r\n\t\t-o-transform: rotate(690deg) translate(54px);\r\n\t}\r\n}\r\n\r\n@-ms-keyframes segment-orbit-11 {\r\n\tfrom {\r\n\t\t-ms-transform: rotate(330deg) translate(54px);\r\n\t}\r\n\t50% {\r\n\t\t-ms-transform: rotate(510deg) translate(65px);\r\n\t}\r\n\tto {\r\n\t\t-ms-transform: rotate(690deg) translate(54px);\r\n\t}\r\n}\r\n\r\n@-webkit-keyframes segment-orbit-11 {\r\n\tfrom {\r\n\t\t-webkit-transform: rotate(330deg) translate(54px);\r\n\t}\r\n\t50% {\r\n\t\t-webkit-transform: rotate(510deg) translate(65px);\r\n\t}\r\n\tto {\r\n\t\t-webkit-transform: rotate(690deg) translate(54px);\r\n\t}\r\n}\r\n\r\n@-moz-keyframes segment-orbit-11 {\r\n\tfrom {\r\n\t\t-moz-transform: rotate(330deg) translate(54px);\r\n\t}\r\n\t50% {\r\n\t\t-moz-transform: rotate(510deg) translate(65px);\r\n\t}\r\n\tto {\r\n\t\t-moz-transform: rotate(690deg) translate(54px);\r\n\t}\r\n}\r\n\r\n@keyframes segment-orbit-12 {\r\n\tfrom {\r\n\t\ttransform: rotate(360deg) translate(54px);\r\n\t}\r\n\t50% {\r\n\t\ttransform: rotate(540deg) translate(65px);\r\n\t}\r\n\tto {\r\n\t\ttransform: rotate(720deg) translate(54px);\r\n\t}\r\n}\r\n\r\n@-o-keyframes segment-orbit-12 {\r\n\tfrom {\r\n\t\t-o-transform: rotate(360deg) translate(54px);\r\n\t}\r\n\t50% {\r\n\t\t-o-transform: rotate(540deg) translate(65px);\r\n\t}\r\n\tto {\r\n\t\t-o-transform: rotate(720deg) translate(54px);\r\n\t}\r\n}\r\n\r\n@-ms-keyframes segment-orbit-12 {\r\n\tfrom {\r\n\t\t-ms-transform: rotate(360deg) translate(54px);\r\n\t}\r\n\t50% {\r\n\t\t-ms-transform: rotate(540deg) translate(65px);\r\n\t}\r\n\tto {\r\n\t\t-ms-transform: rotate(720deg) translate(54px);\r\n\t}\r\n}\r\n\r\n@-webkit-keyframes segment-orbit-12 {\r\n\tfrom {\r\n\t\t-webkit-transform: rotate(360deg) translate(54px);\r\n\t}\r\n\t50% {\r\n\t\t-webkit-transform: rotate(540deg) translate(65px);\r\n\t}\r\n\tto {\r\n\t\t-webkit-transform: rotate(720deg) translate(54px);\r\n\t}\r\n}\r\n\r\n@-moz-keyframes segment-orbit-12 {\r\n\tfrom {\r\n\t\t-moz-transform: rotate(360deg) translate(54px);\r\n\t}\r\n\t50% {\r\n\t\t-moz-transform: rotate(540deg) translate(65px);\r\n\t}\r\n\tto {\r\n\t\t-moz-transform: rotate(720deg) translate(54px);\r\n\t}\r\n}\r\n\r\n@keyframes segment-scale-12 {\r\n\t0% {\r\n\t\ttransform: scaleX(1);\r\n\t}\r\n\t8.33333% {\r\n\t\ttransform: scaleX(0.93333);\r\n\t}\r\n\t16.66667% {\r\n\t\ttransform: scaleX(0.86667);\r\n\t}\r\n\t25% {\r\n\t\ttransform: scaleX(0.8);\r\n\t}\r\n\t33.33333% {\r\n\t\ttransform: scaleX(0.73333);\r\n\t}\r\n\t41.66667% {\r\n\t\ttransform: scaleX(0.66667);\r\n\t}\r\n\t50% {\r\n\t\ttransform: scaleX(0.6);\r\n\t}\r\n\t58.33333% {\r\n\t\ttransform: scaleX(0.53333);\r\n\t}\r\n\t66.66667% {\r\n\t\ttransform: scaleX(0.46667);\r\n\t}\r\n\t75% {\r\n\t\ttransform: scaleX(0.4);\r\n\t}\r\n\t83.33333% {\r\n\t\ttransform: scaleX(0.33333);\r\n\t}\r\n\t91.66667% {\r\n\t\ttransform: scaleX(0.26667);\r\n\t}\r\n\t100% {\r\n\t\ttransform: scaleX(1);\r\n\t}\r\n}\r\n\r\n@-o-keyframes segment-scale-12 {\r\n\t0% {\r\n\t\t-o-transform: scaleX(1);\r\n\t}\r\n\t8.33333% {\r\n\t\t-o-transform: scaleX(0.93333);\r\n\t}\r\n\t16.66667% {\r\n\t\t-o-transform: scaleX(0.86667);\r\n\t}\r\n\t25% {\r\n\t\t-o-transform: scaleX(0.8);\r\n\t}\r\n\t33.33333% {\r\n\t\t-o-transform: scaleX(0.73333);\r\n\t}\r\n\t41.66667% {\r\n\t\t-o-transform: scaleX(0.66667);\r\n\t}\r\n\t50% {\r\n\t\t-o-transform: scaleX(0.6);\r\n\t}\r\n\t58.33333% {\r\n\t\t-o-transform: scaleX(0.53333);\r\n\t}\r\n\t66.66667% {\r\n\t\t-o-transform: scaleX(0.46667);\r\n\t}\r\n\t75% {\r\n\t\t-o-transform: scaleX(0.4);\r\n\t}\r\n\t83.33333% {\r\n\t\t-o-transform: scaleX(0.33333);\r\n\t}\r\n\t91.66667% {\r\n\t\t-o-transform: scaleX(0.26667);\r\n\t}\r\n\t100% {\r\n\t\t-o-transform: scaleX(1);\r\n\t}\r\n}\r\n\r\n@-ms-keyframes segment-scale-12 {\r\n\t0% {\r\n\t\t-ms-transform: scaleX(1);\r\n\t}\r\n\t8.33333% {\r\n\t\t-ms-transform: scaleX(0.93333);\r\n\t}\r\n\t16.66667% {\r\n\t\t-ms-transform: scaleX(0.86667);\r\n\t}\r\n\t25% {\r\n\t\t-ms-transform: scaleX(0.8);\r\n\t}\r\n\t33.33333% {\r\n\t\t-ms-transform: scaleX(0.73333);\r\n\t}\r\n\t41.66667% {\r\n\t\t-ms-transform: scaleX(0.66667);\r\n\t}\r\n\t50% {\r\n\t\t-ms-transform: scaleX(0.6);\r\n\t}\r\n\t58.33333% {\r\n\t\t-ms-transform: scaleX(0.53333);\r\n\t}\r\n\t66.66667% {\r\n\t\t-ms-transform: scaleX(0.46667);\r\n\t}\r\n\t75% {\r\n\t\t-ms-transform: scaleX(0.4);\r\n\t}\r\n\t83.33333% {\r\n\t\t-ms-transform: scaleX(0.33333);\r\n\t}\r\n\t91.66667% {\r\n\t\t-ms-transform: scaleX(0.26667);\r\n\t}\r\n\t100% {\r\n\t\t-ms-transform: scaleX(1);\r\n\t}\r\n}\r\n\r\n@-webkit-keyframes segment-scale-12 {\r\n\t0% {\r\n\t\t-webkit-transform: scaleX(1);\r\n\t}\r\n\t8.33333% {\r\n\t\t-webkit-transform: scaleX(0.93333);\r\n\t}\r\n\t16.66667% {\r\n\t\t-webkit-transform: scaleX(0.86667);\r\n\t}\r\n\t25% {\r\n\t\t-webkit-transform: scaleX(0.8);\r\n\t}\r\n\t33.33333% {\r\n\t\t-webkit-transform: scaleX(0.73333);\r\n\t}\r\n\t41.66667% {\r\n\t\t-webkit-transform: scaleX(0.66667);\r\n\t}\r\n\t50% {\r\n\t\t-webkit-transform: scaleX(0.6);\r\n\t}\r\n\t58.33333% {\r\n\t\t-webkit-transform: scaleX(0.53333);\r\n\t}\r\n\t66.66667% {\r\n\t\t-webkit-transform: scaleX(0.46667);\r\n\t}\r\n\t75% {\r\n\t\t-webkit-transform: scaleX(0.4);\r\n\t}\r\n\t83.33333% {\r\n\t\t-webkit-transform: scaleX(0.33333);\r\n\t}\r\n\t91.66667% {\r\n\t\t-webkit-transform: scaleX(0.26667);\r\n\t}\r\n\t100% {\r\n\t\t-webkit-transform: scaleX(1);\r\n\t}\r\n}\r\n\r\n@-moz-keyframes segment-scale-12 {\r\n\t0% {\r\n\t\t-moz-transform: scaleX(1);\r\n\t}\r\n\t8.33333% {\r\n\t\t-moz-transform: scaleX(0.93333);\r\n\t}\r\n\t16.66667% {\r\n\t\t-moz-transform: scaleX(0.86667);\r\n\t}\r\n\t25% {\r\n\t\t-moz-transform: scaleX(0.8);\r\n\t}\r\n\t33.33333% {\r\n\t\t-moz-transform: scaleX(0.73333);\r\n\t}\r\n\t41.66667% {\r\n\t\t-moz-transform: scaleX(0.66667);\r\n\t}\r\n\t50% {\r\n\t\t-moz-transform: scaleX(0.6);\r\n\t}\r\n\t58.33333% {\r\n\t\t-moz-transform: scaleX(0.53333);\r\n\t}\r\n\t66.66667% {\r\n\t\t-moz-transform: scaleX(0.46667);\r\n\t}\r\n\t75% {\r\n\t\t-moz-transform: scaleX(0.4);\r\n\t}\r\n\t83.33333% {\r\n\t\t-moz-transform: scaleX(0.33333);\r\n\t}\r\n\t91.66667% {\r\n\t\t-moz-transform: scaleX(0.26667);\r\n\t}\r\n\t100% {\r\n\t\t-moz-transform: scaleX(1);\r\n\t}\r\n}\r\n\r\n@keyframes segment-scale-11 {\r\n\t0% {\r\n\t\ttransform: scaleX(0.93333);\r\n\t}\r\n\t8.33333% {\r\n\t\ttransform: scaleX(0.86667);\r\n\t}\r\n\t16.66667% {\r\n\t\ttransform: scaleX(0.8);\r\n\t}\r\n\t25% {\r\n\t\ttransform: scaleX(0.73333);\r\n\t}\r\n\t33.33333% {\r\n\t\ttransform: scaleX(0.66667);\r\n\t}\r\n\t41.66667% {\r\n\t\ttransform: scaleX(0.6);\r\n\t}\r\n\t50% {\r\n\t\ttransform: scaleX(0.53333);\r\n\t}\r\n\t58.33333% {\r\n\t\ttransform: scaleX(0.46667);\r\n\t}\r\n\t66.66667% {\r\n\t\ttransform: scaleX(0.4);\r\n\t}\r\n\t75% {\r\n\t\ttransform: scaleX(0.33333);\r\n\t}\r\n\t83.33333% {\r\n\t\ttransform: scaleX(0.26667);\r\n\t}\r\n\t91.66667% {\r\n\t\ttransform: scaleX(1);\r\n\t}\r\n\t100% {\r\n\t\ttransform: scaleX(0.93333);\r\n\t}\r\n}\r\n\r\n@-o-keyframes segment-scale-11 {\r\n\t0% {\r\n\t\t-o-transform: scaleX(0.93333);\r\n\t}\r\n\t8.33333% {\r\n\t\t-o-transform: scaleX(0.86667);\r\n\t}\r\n\t16.66667% {\r\n\t\t-o-transform: scaleX(0.8);\r\n\t}\r\n\t25% {\r\n\t\t-o-transform: scaleX(0.73333);\r\n\t}\r\n\t33.33333% {\r\n\t\t-o-transform: scaleX(0.66667);\r\n\t}\r\n\t41.66667% {\r\n\t\t-o-transform: scaleX(0.6);\r\n\t}\r\n\t50% {\r\n\t\t-o-transform: scaleX(0.53333);\r\n\t}\r\n\t58.33333% {\r\n\t\t-o-transform: scaleX(0.46667);\r\n\t}\r\n\t66.66667% {\r\n\t\t-o-transform: scaleX(0.4);\r\n\t}\r\n\t75% {\r\n\t\t-o-transform: scaleX(0.33333);\r\n\t}\r\n\t83.33333% {\r\n\t\t-o-transform: scaleX(0.26667);\r\n\t}\r\n\t91.66667% {\r\n\t\t-o-transform: scaleX(1);\r\n\t}\r\n\t100% {\r\n\t\t-o-transform: scaleX(0.93333);\r\n\t}\r\n}\r\n\r\n@-ms-keyframes segment-scale-11 {\r\n\t0% {\r\n\t\t-ms-transform: scaleX(0.93333);\r\n\t}\r\n\t8.33333% {\r\n\t\t-ms-transform: scaleX(0.86667);\r\n\t}\r\n\t16.66667% {\r\n\t\t-ms-transform: scaleX(0.8);\r\n\t}\r\n\t25% {\r\n\t\t-ms-transform: scaleX(0.73333);\r\n\t}\r\n\t33.33333% {\r\n\t\t-ms-transform: scaleX(0.66667);\r\n\t}\r\n\t41.66667% {\r\n\t\t-ms-transform: scaleX(0.6);\r\n\t}\r\n\t50% {\r\n\t\t-ms-transform: scaleX(0.53333);\r\n\t}\r\n\t58.33333% {\r\n\t\t-ms-transform: scaleX(0.46667);\r\n\t}\r\n\t66.66667% {\r\n\t\t-ms-transform: scaleX(0.4);\r\n\t}\r\n\t75% {\r\n\t\t-ms-transform: scaleX(0.33333);\r\n\t}\r\n\t83.33333% {\r\n\t\t-ms-transform: scaleX(0.26667);\r\n\t}\r\n\t91.66667% {\r\n\t\t-ms-transform: scaleX(1);\r\n\t}\r\n\t100% {\r\n\t\t-ms-transform: scaleX(0.93333);\r\n\t}\r\n}\r\n\r\n@-webkit-keyframes segment-scale-11 {\r\n\t0% {\r\n\t\t-webkit-transform: scaleX(0.93333);\r\n\t}\r\n\t8.33333% {\r\n\t\t-webkit-transform: scaleX(0.86667);\r\n\t}\r\n\t16.66667% {\r\n\t\t-webkit-transform: scaleX(0.8);\r\n\t}\r\n\t25% {\r\n\t\t-webkit-transform: scaleX(0.73333);\r\n\t}\r\n\t33.33333% {\r\n\t\t-webkit-transform: scaleX(0.66667);\r\n\t}\r\n\t41.66667% {\r\n\t\t-webkit-transform: scaleX(0.6);\r\n\t}\r\n\t50% {\r\n\t\t-webkit-transform: scaleX(0.53333);\r\n\t}\r\n\t58.33333% {\r\n\t\t-webkit-transform: scaleX(0.46667);\r\n\t}\r\n\t66.66667% {\r\n\t\t-webkit-transform: scaleX(0.4);\r\n\t}\r\n\t75% {\r\n\t\t-webkit-transform: scaleX(0.33333);\r\n\t}\r\n\t83.33333% {\r\n\t\t-webkit-transform: scaleX(0.26667);\r\n\t}\r\n\t91.66667% {\r\n\t\t-webkit-transform: scaleX(1);\r\n\t}\r\n\t100% {\r\n\t\t-webkit-transform: scaleX(0.93333);\r\n\t}\r\n}\r\n\r\n@-moz-keyframes segment-scale-11 {\r\n\t0% {\r\n\t\t-moz-transform: scaleX(0.93333);\r\n\t}\r\n\t8.33333% {\r\n\t\t-moz-transform: scaleX(0.86667);\r\n\t}\r\n\t16.66667% {\r\n\t\t-moz-transform: scaleX(0.8);\r\n\t}\r\n\t25% {\r\n\t\t-moz-transform: scaleX(0.73333);\r\n\t}\r\n\t33.33333% {\r\n\t\t-moz-transform: scaleX(0.66667);\r\n\t}\r\n\t41.66667% {\r\n\t\t-moz-transform: scaleX(0.6);\r\n\t}\r\n\t50% {\r\n\t\t-moz-transform: scaleX(0.53333);\r\n\t}\r\n\t58.33333% {\r\n\t\t-moz-transform: scaleX(0.46667);\r\n\t}\r\n\t66.66667% {\r\n\t\t-moz-transform: scaleX(0.4);\r\n\t}\r\n\t75% {\r\n\t\t-moz-transform: scaleX(0.33333);\r\n\t}\r\n\t83.33333% {\r\n\t\t-moz-transform: scaleX(0.26667);\r\n\t}\r\n\t91.66667% {\r\n\t\t-moz-transform: scaleX(1);\r\n\t}\r\n\t100% {\r\n\t\t-moz-transform: scaleX(0.93333);\r\n\t}\r\n}\r\n\r\n@keyframes segment-scale-10 {\r\n\t0% {\r\n\t\ttransform: scaleX(0.86667);\r\n\t}\r\n\t8.33333% {\r\n\t\ttransform: scaleX(0.8);\r\n\t}\r\n\t16.66667% {\r\n\t\ttransform: scaleX(0.73333);\r\n\t}\r\n\t25% {\r\n\t\ttransform: scaleX(0.66667);\r\n\t}\r\n\t33.33333% {\r\n\t\ttransform: scaleX(0.6);\r\n\t}\r\n\t41.66667% {\r\n\t\ttransform: scaleX(0.53333);\r\n\t}\r\n\t50% {\r\n\t\ttransform: scaleX(0.46667);\r\n\t}\r\n\t58.33333% {\r\n\t\ttransform: scaleX(0.4);\r\n\t}\r\n\t66.66667% {\r\n\t\ttransform: scaleX(0.33333);\r\n\t}\r\n\t75% {\r\n\t\ttransform: scaleX(0.26667);\r\n\t}\r\n\t83.33333% {\r\n\t\ttransform: scaleX(1);\r\n\t}\r\n\t91.66667% {\r\n\t\ttransform: scaleX(0.93333);\r\n\t}\r\n\t100% {\r\n\t\ttransform: scaleX(0.86667);\r\n\t}\r\n}\r\n\r\n@-o-keyframes segment-scale-10 {\r\n\t0% {\r\n\t\t-o-transform: scaleX(0.86667);\r\n\t}\r\n\t8.33333% {\r\n\t\t-o-transform: scaleX(0.8);\r\n\t}\r\n\t16.66667% {\r\n\t\t-o-transform: scaleX(0.73333);\r\n\t}\r\n\t25% {\r\n\t\t-o-transform: scaleX(0.66667);\r\n\t}\r\n\t33.33333% {\r\n\t\t-o-transform: scaleX(0.6);\r\n\t}\r\n\t41.66667% {\r\n\t\t-o-transform: scaleX(0.53333);\r\n\t}\r\n\t50% {\r\n\t\t-o-transform: scaleX(0.46667);\r\n\t}\r\n\t58.33333% {\r\n\t\t-o-transform: scaleX(0.4);\r\n\t}\r\n\t66.66667% {\r\n\t\t-o-transform: scaleX(0.33333);\r\n\t}\r\n\t75% {\r\n\t\t-o-transform: scaleX(0.26667);\r\n\t}\r\n\t83.33333% {\r\n\t\t-o-transform: scaleX(1);\r\n\t}\r\n\t91.66667% {\r\n\t\t-o-transform: scaleX(0.93333);\r\n\t}\r\n\t100% {\r\n\t\t-o-transform: scaleX(0.86667);\r\n\t}\r\n}\r\n\r\n@-ms-keyframes segment-scale-10 {\r\n\t0% {\r\n\t\t-ms-transform: scaleX(0.86667);\r\n\t}\r\n\t8.33333% {\r\n\t\t-ms-transform: scaleX(0.8);\r\n\t}\r\n\t16.66667% {\r\n\t\t-ms-transform: scaleX(0.73333);\r\n\t}\r\n\t25% {\r\n\t\t-ms-transform: scaleX(0.66667);\r\n\t}\r\n\t33.33333% {\r\n\t\t-ms-transform: scaleX(0.6);\r\n\t}\r\n\t41.66667% {\r\n\t\t-ms-transform: scaleX(0.53333);\r\n\t}\r\n\t50% {\r\n\t\t-ms-transform: scaleX(0.46667);\r\n\t}\r\n\t58.33333% {\r\n\t\t-ms-transform: scaleX(0.4);\r\n\t}\r\n\t66.66667% {\r\n\t\t-ms-transform: scaleX(0.33333);\r\n\t}\r\n\t75% {\r\n\t\t-ms-transform: scaleX(0.26667);\r\n\t}\r\n\t83.33333% {\r\n\t\t-ms-transform: scaleX(1);\r\n\t}\r\n\t91.66667% {\r\n\t\t-ms-transform: scaleX(0.93333);\r\n\t}\r\n\t100% {\r\n\t\t-ms-transform: scaleX(0.86667);\r\n\t}\r\n}\r\n\r\n@-webkit-keyframes segment-scale-10 {\r\n\t0% {\r\n\t\t-webkit-transform: scaleX(0.86667);\r\n\t}\r\n\t8.33333% {\r\n\t\t-webkit-transform: scaleX(0.8);\r\n\t}\r\n\t16.66667% {\r\n\t\t-webkit-transform: scaleX(0.73333);\r\n\t}\r\n\t25% {\r\n\t\t-webkit-transform: scaleX(0.66667);\r\n\t}\r\n\t33.33333% {\r\n\t\t-webkit-transform: scaleX(0.6);\r\n\t}\r\n\t41.66667% {\r\n\t\t-webkit-transform: scaleX(0.53333);\r\n\t}\r\n\t50% {\r\n\t\t-webkit-transform: scaleX(0.46667);\r\n\t}\r\n\t58.33333% {\r\n\t\t-webkit-transform: scaleX(0.4);\r\n\t}\r\n\t66.66667% {\r\n\t\t-webkit-transform: scaleX(0.33333);\r\n\t}\r\n\t75% {\r\n\t\t-webkit-transform: scaleX(0.26667);\r\n\t}\r\n\t83.33333% {\r\n\t\t-webkit-transform: scaleX(1);\r\n\t}\r\n\t91.66667% {\r\n\t\t-webkit-transform: scaleX(0.93333);\r\n\t}\r\n\t100% {\r\n\t\t-webkit-transform: scaleX(0.86667);\r\n\t}\r\n}\r\n\r\n@-moz-keyframes segment-scale-10 {\r\n\t0% {\r\n\t\t-moz-transform: scaleX(0.86667);\r\n\t}\r\n\t8.33333% {\r\n\t\t-moz-transform: scaleX(0.8);\r\n\t}\r\n\t16.66667% {\r\n\t\t-moz-transform: scaleX(0.73333);\r\n\t}\r\n\t25% {\r\n\t\t-moz-transform: scaleX(0.66667);\r\n\t}\r\n\t33.33333% {\r\n\t\t-moz-transform: scaleX(0.6);\r\n\t}\r\n\t41.66667% {\r\n\t\t-moz-transform: scaleX(0.53333);\r\n\t}\r\n\t50% {\r\n\t\t-moz-transform: scaleX(0.46667);\r\n\t}\r\n\t58.33333% {\r\n\t\t-moz-transform: scaleX(0.4);\r\n\t}\r\n\t66.66667% {\r\n\t\t-moz-transform: scaleX(0.33333);\r\n\t}\r\n\t75% {\r\n\t\t-moz-transform: scaleX(0.26667);\r\n\t}\r\n\t83.33333% {\r\n\t\t-moz-transform: scaleX(1);\r\n\t}\r\n\t91.66667% {\r\n\t\t-moz-transform: scaleX(0.93333);\r\n\t}\r\n\t100% {\r\n\t\t-moz-transform: scaleX(0.86667);\r\n\t}\r\n}\r\n\r\n@keyframes segment-scale-9 {\r\n\t0% {\r\n\t\ttransform: scaleX(0.8);\r\n\t}\r\n\t8.33333% {\r\n\t\ttransform: scaleX(0.73333);\r\n\t}\r\n\t16.66667% {\r\n\t\ttransform: scaleX(0.66667);\r\n\t}\r\n\t25% {\r\n\t\ttransform: scaleX(0.6);\r\n\t}\r\n\t33.33333% {\r\n\t\ttransform: scaleX(0.53333);\r\n\t}\r\n\t41.66667% {\r\n\t\ttransform: scaleX(0.46667);\r\n\t}\r\n\t50% {\r\n\t\ttransform: scaleX(0.4);\r\n\t}\r\n\t58.33333% {\r\n\t\ttransform: scaleX(0.33333);\r\n\t}\r\n\t66.66667% {\r\n\t\ttransform: scaleX(0.26667);\r\n\t}\r\n\t75% {\r\n\t\ttransform: scaleX(1);\r\n\t}\r\n\t83.33333% {\r\n\t\ttransform: scaleX(0.93333);\r\n\t}\r\n\t91.66667% {\r\n\t\ttransform: scaleX(0.86667);\r\n\t}\r\n\t100% {\r\n\t\ttransform: scaleX(0.8);\r\n\t}\r\n}\r\n\r\n@-o-keyframes segment-scale-9 {\r\n\t0% {\r\n\t\t-o-transform: scaleX(0.8);\r\n\t}\r\n\t8.33333% {\r\n\t\t-o-transform: scaleX(0.73333);\r\n\t}\r\n\t16.66667% {\r\n\t\t-o-transform: scaleX(0.66667);\r\n\t}\r\n\t25% {\r\n\t\t-o-transform: scaleX(0.6);\r\n\t}\r\n\t33.33333% {\r\n\t\t-o-transform: scaleX(0.53333);\r\n\t}\r\n\t41.66667% {\r\n\t\t-o-transform: scaleX(0.46667);\r\n\t}\r\n\t50% {\r\n\t\t-o-transform: scaleX(0.4);\r\n\t}\r\n\t58.33333% {\r\n\t\t-o-transform: scaleX(0.33333);\r\n\t}\r\n\t66.66667% {\r\n\t\t-o-transform: scaleX(0.26667);\r\n\t}\r\n\t75% {\r\n\t\t-o-transform: scaleX(1);\r\n\t}\r\n\t83.33333% {\r\n\t\t-o-transform: scaleX(0.93333);\r\n\t}\r\n\t91.66667% {\r\n\t\t-o-transform: scaleX(0.86667);\r\n\t}\r\n\t100% {\r\n\t\t-o-transform: scaleX(0.8);\r\n\t}\r\n}\r\n\r\n@-ms-keyframes segment-scale-9 {\r\n\t0% {\r\n\t\t-ms-transform: scaleX(0.8);\r\n\t}\r\n\t8.33333% {\r\n\t\t-ms-transform: scaleX(0.73333);\r\n\t}\r\n\t16.66667% {\r\n\t\t-ms-transform: scaleX(0.66667);\r\n\t}\r\n\t25% {\r\n\t\t-ms-transform: scaleX(0.6);\r\n\t}\r\n\t33.33333% {\r\n\t\t-ms-transform: scaleX(0.53333);\r\n\t}\r\n\t41.66667% {\r\n\t\t-ms-transform: scaleX(0.46667);\r\n\t}\r\n\t50% {\r\n\t\t-ms-transform: scaleX(0.4);\r\n\t}\r\n\t58.33333% {\r\n\t\t-ms-transform: scaleX(0.33333);\r\n\t}\r\n\t66.66667% {\r\n\t\t-ms-transform: scaleX(0.26667);\r\n\t}\r\n\t75% {\r\n\t\t-ms-transform: scaleX(1);\r\n\t}\r\n\t83.33333% {\r\n\t\t-ms-transform: scaleX(0.93333);\r\n\t}\r\n\t91.66667% {\r\n\t\t-ms-transform: scaleX(0.86667);\r\n\t}\r\n\t100% {\r\n\t\t-ms-transform: scaleX(0.8);\r\n\t}\r\n}\r\n\r\n@-webkit-keyframes segment-scale-9 {\r\n\t0% {\r\n\t\t-webkit-transform: scaleX(0.8);\r\n\t}\r\n\t8.33333% {\r\n\t\t-webkit-transform: scaleX(0.73333);\r\n\t}\r\n\t16.66667% {\r\n\t\t-webkit-transform: scaleX(0.66667);\r\n\t}\r\n\t25% {\r\n\t\t-webkit-transform: scaleX(0.6);\r\n\t}\r\n\t33.33333% {\r\n\t\t-webkit-transform: scaleX(0.53333);\r\n\t}\r\n\t41.66667% {\r\n\t\t-webkit-transform: scaleX(0.46667);\r\n\t}\r\n\t50% {\r\n\t\t-webkit-transform: scaleX(0.4);\r\n\t}\r\n\t58.33333% {\r\n\t\t-webkit-transform: scaleX(0.33333);\r\n\t}\r\n\t66.66667% {\r\n\t\t-webkit-transform: scaleX(0.26667);\r\n\t}\r\n\t75% {\r\n\t\t-webkit-transform: scaleX(1);\r\n\t}\r\n\t83.33333% {\r\n\t\t-webkit-transform: scaleX(0.93333);\r\n\t}\r\n\t91.66667% {\r\n\t\t-webkit-transform: scaleX(0.86667);\r\n\t}\r\n\t100% {\r\n\t\t-webkit-transform: scaleX(0.8);\r\n\t}\r\n}\r\n\r\n@-moz-keyframes segment-scale-9 {\r\n\t0% {\r\n\t\t-moz-transform: scaleX(0.8);\r\n\t}\r\n\t8.33333% {\r\n\t\t-moz-transform: scaleX(0.73333);\r\n\t}\r\n\t16.66667% {\r\n\t\t-moz-transform: scaleX(0.66667);\r\n\t}\r\n\t25% {\r\n\t\t-moz-transform: scaleX(0.6);\r\n\t}\r\n\t33.33333% {\r\n\t\t-moz-transform: scaleX(0.53333);\r\n\t}\r\n\t41.66667% {\r\n\t\t-moz-transform: scaleX(0.46667);\r\n\t}\r\n\t50% {\r\n\t\t-moz-transform: scaleX(0.4);\r\n\t}\r\n\t58.33333% {\r\n\t\t-moz-transform: scaleX(0.33333);\r\n\t}\r\n\t66.66667% {\r\n\t\t-moz-transform: scaleX(0.26667);\r\n\t}\r\n\t75% {\r\n\t\t-moz-transform: scaleX(1);\r\n\t}\r\n\t83.33333% {\r\n\t\t-moz-transform: scaleX(0.93333);\r\n\t}\r\n\t91.66667% {\r\n\t\t-moz-transform: scaleX(0.86667);\r\n\t}\r\n\t100% {\r\n\t\t-moz-transform: scaleX(0.8);\r\n\t}\r\n}\r\n\r\n@keyframes segment-scale-8 {\r\n\t0% {\r\n\t\ttransform: scaleX(0.73333);\r\n\t}\r\n\t8.33333% {\r\n\t\ttransform: scaleX(0.66667);\r\n\t}\r\n\t16.66667% {\r\n\t\ttransform: scaleX(0.6);\r\n\t}\r\n\t25% {\r\n\t\ttransform: scaleX(0.53333);\r\n\t}\r\n\t33.33333% {\r\n\t\ttransform: scaleX(0.46667);\r\n\t}\r\n\t41.66667% {\r\n\t\ttransform: scaleX(0.4);\r\n\t}\r\n\t50% {\r\n\t\ttransform: scaleX(0.33333);\r\n\t}\r\n\t58.33333% {\r\n\t\ttransform: scaleX(0.26667);\r\n\t}\r\n\t66.66667% {\r\n\t\ttransform: scaleX(1);\r\n\t}\r\n\t75% {\r\n\t\ttransform: scaleX(0.93333);\r\n\t}\r\n\t83.33333% {\r\n\t\ttransform: scaleX(0.86667);\r\n\t}\r\n\t91.66667% {\r\n\t\ttransform: scaleX(0.8);\r\n\t}\r\n\t100% {\r\n\t\ttransform: scaleX(0.73333);\r\n\t}\r\n}\r\n\r\n@-o-keyframes segment-scale-8 {\r\n\t0% {\r\n\t\t-o-transform: scaleX(0.73333);\r\n\t}\r\n\t8.33333% {\r\n\t\t-o-transform: scaleX(0.66667);\r\n\t}\r\n\t16.66667% {\r\n\t\t-o-transform: scaleX(0.6);\r\n\t}\r\n\t25% {\r\n\t\t-o-transform: scaleX(0.53333);\r\n\t}\r\n\t33.33333% {\r\n\t\t-o-transform: scaleX(0.46667);\r\n\t}\r\n\t41.66667% {\r\n\t\t-o-transform: scaleX(0.4);\r\n\t}\r\n\t50% {\r\n\t\t-o-transform: scaleX(0.33333);\r\n\t}\r\n\t58.33333% {\r\n\t\t-o-transform: scaleX(0.26667);\r\n\t}\r\n\t66.66667% {\r\n\t\t-o-transform: scaleX(1);\r\n\t}\r\n\t75% {\r\n\t\t-o-transform: scaleX(0.93333);\r\n\t}\r\n\t83.33333% {\r\n\t\t-o-transform: scaleX(0.86667);\r\n\t}\r\n\t91.66667% {\r\n\t\t-o-transform: scaleX(0.8);\r\n\t}\r\n\t100% {\r\n\t\t-o-transform: scaleX(0.73333);\r\n\t}\r\n}\r\n\r\n@-ms-keyframes segment-scale-8 {\r\n\t0% {\r\n\t\t-ms-transform: scaleX(0.73333);\r\n\t}\r\n\t8.33333% {\r\n\t\t-ms-transform: scaleX(0.66667);\r\n\t}\r\n\t16.66667% {\r\n\t\t-ms-transform: scaleX(0.6);\r\n\t}\r\n\t25% {\r\n\t\t-ms-transform: scaleX(0.53333);\r\n\t}\r\n\t33.33333% {\r\n\t\t-ms-transform: scaleX(0.46667);\r\n\t}\r\n\t41.66667% {\r\n\t\t-ms-transform: scaleX(0.4);\r\n\t}\r\n\t50% {\r\n\t\t-ms-transform: scaleX(0.33333);\r\n\t}\r\n\t58.33333% {\r\n\t\t-ms-transform: scaleX(0.26667);\r\n\t}\r\n\t66.66667% {\r\n\t\t-ms-transform: scaleX(1);\r\n\t}\r\n\t75% {\r\n\t\t-ms-transform: scaleX(0.93333);\r\n\t}\r\n\t83.33333% {\r\n\t\t-ms-transform: scaleX(0.86667);\r\n\t}\r\n\t91.66667% {\r\n\t\t-ms-transform: scaleX(0.8);\r\n\t}\r\n\t100% {\r\n\t\t-ms-transform: scaleX(0.73333);\r\n\t}\r\n}\r\n\r\n@-webkit-keyframes segment-scale-8 {\r\n\t0% {\r\n\t\t-webkit-transform: scaleX(0.73333);\r\n\t}\r\n\t8.33333% {\r\n\t\t-webkit-transform: scaleX(0.66667);\r\n\t}\r\n\t16.66667% {\r\n\t\t-webkit-transform: scaleX(0.6);\r\n\t}\r\n\t25% {\r\n\t\t-webkit-transform: scaleX(0.53333);\r\n\t}\r\n\t33.33333% {\r\n\t\t-webkit-transform: scaleX(0.46667);\r\n\t}\r\n\t41.66667% {\r\n\t\t-webkit-transform: scaleX(0.4);\r\n\t}\r\n\t50% {\r\n\t\t-webkit-transform: scaleX(0.33333);\r\n\t}\r\n\t58.33333% {\r\n\t\t-webkit-transform: scaleX(0.26667);\r\n\t}\r\n\t66.66667% {\r\n\t\t-webkit-transform: scaleX(1);\r\n\t}\r\n\t75% {\r\n\t\t-webkit-transform: scaleX(0.93333);\r\n\t}\r\n\t83.33333% {\r\n\t\t-webkit-transform: scaleX(0.86667);\r\n\t}\r\n\t91.66667% {\r\n\t\t-webkit-transform: scaleX(0.8);\r\n\t}\r\n\t100% {\r\n\t\t-webkit-transform: scaleX(0.73333);\r\n\t}\r\n}\r\n\r\n@-moz-keyframes segment-scale-8 {\r\n\t0% {\r\n\t\t-moz-transform: scaleX(0.73333);\r\n\t}\r\n\t8.33333% {\r\n\t\t-moz-transform: scaleX(0.66667);\r\n\t}\r\n\t16.66667% {\r\n\t\t-moz-transform: scaleX(0.6);\r\n\t}\r\n\t25% {\r\n\t\t-moz-transform: scaleX(0.53333);\r\n\t}\r\n\t33.33333% {\r\n\t\t-moz-transform: scaleX(0.46667);\r\n\t}\r\n\t41.66667% {\r\n\t\t-moz-transform: scaleX(0.4);\r\n\t}\r\n\t50% {\r\n\t\t-moz-transform: scaleX(0.33333);\r\n\t}\r\n\t58.33333% {\r\n\t\t-moz-transform: scaleX(0.26667);\r\n\t}\r\n\t66.66667% {\r\n\t\t-moz-transform: scaleX(1);\r\n\t}\r\n\t75% {\r\n\t\t-moz-transform: scaleX(0.93333);\r\n\t}\r\n\t83.33333% {\r\n\t\t-moz-transform: scaleX(0.86667);\r\n\t}\r\n\t91.66667% {\r\n\t\t-moz-transform: scaleX(0.8);\r\n\t}\r\n\t100% {\r\n\t\t-moz-transform: scaleX(0.73333);\r\n\t}\r\n}\r\n\r\n@keyframes segment-scale-7 {\r\n\t0% {\r\n\t\ttransform: scaleX(0.66667);\r\n\t}\r\n\t8.33333% {\r\n\t\ttransform: scaleX(0.6);\r\n\t}\r\n\t16.66667% {\r\n\t\ttransform: scaleX(0.53333);\r\n\t}\r\n\t25% {\r\n\t\ttransform: scaleX(0.46667);\r\n\t}\r\n\t33.33333% {\r\n\t\ttransform: scaleX(0.4);\r\n\t}\r\n\t41.66667% {\r\n\t\ttransform: scaleX(0.33333);\r\n\t}\r\n\t50% {\r\n\t\ttransform: scaleX(0.26667);\r\n\t}\r\n\t58.33333% {\r\n\t\ttransform: scaleX(1);\r\n\t}\r\n\t66.66667% {\r\n\t\ttransform: scaleX(0.93333);\r\n\t}\r\n\t75% {\r\n\t\ttransform: scaleX(0.86667);\r\n\t}\r\n\t83.33333% {\r\n\t\ttransform: scaleX(0.8);\r\n\t}\r\n\t91.66667% {\r\n\t\ttransform: scaleX(0.73333);\r\n\t}\r\n\t100% {\r\n\t\ttransform: scaleX(0.66667);\r\n\t}\r\n}\r\n\r\n@-o-keyframes segment-scale-7 {\r\n\t0% {\r\n\t\t-o-transform: scaleX(0.66667);\r\n\t}\r\n\t8.33333% {\r\n\t\t-o-transform: scaleX(0.6);\r\n\t}\r\n\t16.66667% {\r\n\t\t-o-transform: scaleX(0.53333);\r\n\t}\r\n\t25% {\r\n\t\t-o-transform: scaleX(0.46667);\r\n\t}\r\n\t33.33333% {\r\n\t\t-o-transform: scaleX(0.4);\r\n\t}\r\n\t41.66667% {\r\n\t\t-o-transform: scaleX(0.33333);\r\n\t}\r\n\t50% {\r\n\t\t-o-transform: scaleX(0.26667);\r\n\t}\r\n\t58.33333% {\r\n\t\t-o-transform: scaleX(1);\r\n\t}\r\n\t66.66667% {\r\n\t\t-o-transform: scaleX(0.93333);\r\n\t}\r\n\t75% {\r\n\t\t-o-transform: scaleX(0.86667);\r\n\t}\r\n\t83.33333% {\r\n\t\t-o-transform: scaleX(0.8);\r\n\t}\r\n\t91.66667% {\r\n\t\t-o-transform: scaleX(0.73333);\r\n\t}\r\n\t100% {\r\n\t\t-o-transform: scaleX(0.66667);\r\n\t}\r\n}\r\n\r\n@-ms-keyframes segment-scale-7 {\r\n\t0% {\r\n\t\t-ms-transform: scaleX(0.66667);\r\n\t}\r\n\t8.33333% {\r\n\t\t-ms-transform: scaleX(0.6);\r\n\t}\r\n\t16.66667% {\r\n\t\t-ms-transform: scaleX(0.53333);\r\n\t}\r\n\t25% {\r\n\t\t-ms-transform: scaleX(0.46667);\r\n\t}\r\n\t33.33333% {\r\n\t\t-ms-transform: scaleX(0.4);\r\n\t}\r\n\t41.66667% {\r\n\t\t-ms-transform: scaleX(0.33333);\r\n\t}\r\n\t50% {\r\n\t\t-ms-transform: scaleX(0.26667);\r\n\t}\r\n\t58.33333% {\r\n\t\t-ms-transform: scaleX(1);\r\n\t}\r\n\t66.66667% {\r\n\t\t-ms-transform: scaleX(0.93333);\r\n\t}\r\n\t75% {\r\n\t\t-ms-transform: scaleX(0.86667);\r\n\t}\r\n\t83.33333% {\r\n\t\t-ms-transform: scaleX(0.8);\r\n\t}\r\n\t91.66667% {\r\n\t\t-ms-transform: scaleX(0.73333);\r\n\t}\r\n\t100% {\r\n\t\t-ms-transform: scaleX(0.66667);\r\n\t}\r\n}\r\n\r\n@-webkit-keyframes segment-scale-7 {\r\n\t0% {\r\n\t\t-webkit-transform: scaleX(0.66667);\r\n\t}\r\n\t8.33333% {\r\n\t\t-webkit-transform: scaleX(0.6);\r\n\t}\r\n\t16.66667% {\r\n\t\t-webkit-transform: scaleX(0.53333);\r\n\t}\r\n\t25% {\r\n\t\t-webkit-transform: scaleX(0.46667);\r\n\t}\r\n\t33.33333% {\r\n\t\t-webkit-transform: scaleX(0.4);\r\n\t}\r\n\t41.66667% {\r\n\t\t-webkit-transform: scaleX(0.33333);\r\n\t}\r\n\t50% {\r\n\t\t-webkit-transform: scaleX(0.26667);\r\n\t}\r\n\t58.33333% {\r\n\t\t-webkit-transform: scaleX(1);\r\n\t}\r\n\t66.66667% {\r\n\t\t-webkit-transform: scaleX(0.93333);\r\n\t}\r\n\t75% {\r\n\t\t-webkit-transform: scaleX(0.86667);\r\n\t}\r\n\t83.33333% {\r\n\t\t-webkit-transform: scaleX(0.8);\r\n\t}\r\n\t91.66667% {\r\n\t\t-webkit-transform: scaleX(0.73333);\r\n\t}\r\n\t100% {\r\n\t\t-webkit-transform: scaleX(0.66667);\r\n\t}\r\n}\r\n\r\n@-moz-keyframes segment-scale-7 {\r\n\t0% {\r\n\t\t-moz-transform: scaleX(0.66667);\r\n\t}\r\n\t8.33333% {\r\n\t\t-moz-transform: scaleX(0.6);\r\n\t}\r\n\t16.66667% {\r\n\t\t-moz-transform: scaleX(0.53333);\r\n\t}\r\n\t25% {\r\n\t\t-moz-transform: scaleX(0.46667);\r\n\t}\r\n\t33.33333% {\r\n\t\t-moz-transform: scaleX(0.4);\r\n\t}\r\n\t41.66667% {\r\n\t\t-moz-transform: scaleX(0.33333);\r\n\t}\r\n\t50% {\r\n\t\t-moz-transform: scaleX(0.26667);\r\n\t}\r\n\t58.33333% {\r\n\t\t-moz-transform: scaleX(1);\r\n\t}\r\n\t66.66667% {\r\n\t\t-moz-transform: scaleX(0.93333);\r\n\t}\r\n\t75% {\r\n\t\t-moz-transform: scaleX(0.86667);\r\n\t}\r\n\t83.33333% {\r\n\t\t-moz-transform: scaleX(0.8);\r\n\t}\r\n\t91.66667% {\r\n\t\t-moz-transform: scaleX(0.73333);\r\n\t}\r\n\t100% {\r\n\t\t-moz-transform: scaleX(0.66667);\r\n\t}\r\n}\r\n\r\n@keyframes segment-scale-6 {\r\n\t0% {\r\n\t\ttransform: scaleX(0.6);\r\n\t}\r\n\t8.33333% {\r\n\t\ttransform: scaleX(0.53333);\r\n\t}\r\n\t16.66667% {\r\n\t\ttransform: scaleX(0.46667);\r\n\t}\r\n\t25% {\r\n\t\ttransform: scaleX(0.4);\r\n\t}\r\n\t33.33333% {\r\n\t\ttransform: scaleX(0.33333);\r\n\t}\r\n\t41.66667% {\r\n\t\ttransform: scaleX(0.26667);\r\n\t}\r\n\t50% {\r\n\t\ttransform: scaleX(1);\r\n\t}\r\n\t58.33333% {\r\n\t\ttransform: scaleX(0.93333);\r\n\t}\r\n\t66.66667% {\r\n\t\ttransform: scaleX(0.86667);\r\n\t}\r\n\t75% {\r\n\t\ttransform: scaleX(0.8);\r\n\t}\r\n\t83.33333% {\r\n\t\ttransform: scaleX(0.73333);\r\n\t}\r\n\t91.66667% {\r\n\t\ttransform: scaleX(0.66667);\r\n\t}\r\n\t100% {\r\n\t\ttransform: scaleX(0.6);\r\n\t}\r\n}\r\n\r\n@-o-keyframes segment-scale-6 {\r\n\t0% {\r\n\t\t-o-transform: scaleX(0.6);\r\n\t}\r\n\t8.33333% {\r\n\t\t-o-transform: scaleX(0.53333);\r\n\t}\r\n\t16.66667% {\r\n\t\t-o-transform: scaleX(0.46667);\r\n\t}\r\n\t25% {\r\n\t\t-o-transform: scaleX(0.4);\r\n\t}\r\n\t33.33333% {\r\n\t\t-o-transform: scaleX(0.33333);\r\n\t}\r\n\t41.66667% {\r\n\t\t-o-transform: scaleX(0.26667);\r\n\t}\r\n\t50% {\r\n\t\t-o-transform: scaleX(1);\r\n\t}\r\n\t58.33333% {\r\n\t\t-o-transform: scaleX(0.93333);\r\n\t}\r\n\t66.66667% {\r\n\t\t-o-transform: scaleX(0.86667);\r\n\t}\r\n\t75% {\r\n\t\t-o-transform: scaleX(0.8);\r\n\t}\r\n\t83.33333% {\r\n\t\t-o-transform: scaleX(0.73333);\r\n\t}\r\n\t91.66667% {\r\n\t\t-o-transform: scaleX(0.66667);\r\n\t}\r\n\t100% {\r\n\t\t-o-transform: scaleX(0.6);\r\n\t}\r\n}\r\n\r\n@-ms-keyframes segment-scale-6 {\r\n\t0% {\r\n\t\t-ms-transform: scaleX(0.6);\r\n\t}\r\n\t8.33333% {\r\n\t\t-ms-transform: scaleX(0.53333);\r\n\t}\r\n\t16.66667% {\r\n\t\t-ms-transform: scaleX(0.46667);\r\n\t}\r\n\t25% {\r\n\t\t-ms-transform: scaleX(0.4);\r\n\t}\r\n\t33.33333% {\r\n\t\t-ms-transform: scaleX(0.33333);\r\n\t}\r\n\t41.66667% {\r\n\t\t-ms-transform: scaleX(0.26667);\r\n\t}\r\n\t50% {\r\n\t\t-ms-transform: scaleX(1);\r\n\t}\r\n\t58.33333% {\r\n\t\t-ms-transform: scaleX(0.93333);\r\n\t}\r\n\t66.66667% {\r\n\t\t-ms-transform: scaleX(0.86667);\r\n\t}\r\n\t75% {\r\n\t\t-ms-transform: scaleX(0.8);\r\n\t}\r\n\t83.33333% {\r\n\t\t-ms-transform: scaleX(0.73333);\r\n\t}\r\n\t91.66667% {\r\n\t\t-ms-transform: scaleX(0.66667);\r\n\t}\r\n\t100% {\r\n\t\t-ms-transform: scaleX(0.6);\r\n\t}\r\n}\r\n\r\n@-webkit-keyframes segment-scale-6 {\r\n\t0% {\r\n\t\t-webkit-transform: scaleX(0.6);\r\n\t}\r\n\t8.33333% {\r\n\t\t-webkit-transform: scaleX(0.53333);\r\n\t}\r\n\t16.66667% {\r\n\t\t-webkit-transform: scaleX(0.46667);\r\n\t}\r\n\t25% {\r\n\t\t-webkit-transform: scaleX(0.4);\r\n\t}\r\n\t33.33333% {\r\n\t\t-webkit-transform: scaleX(0.33333);\r\n\t}\r\n\t41.66667% {\r\n\t\t-webkit-transform: scaleX(0.26667);\r\n\t}\r\n\t50% {\r\n\t\t-webkit-transform: scaleX(1);\r\n\t}\r\n\t58.33333% {\r\n\t\t-webkit-transform: scaleX(0.93333);\r\n\t}\r\n\t66.66667% {\r\n\t\t-webkit-transform: scaleX(0.86667);\r\n\t}\r\n\t75% {\r\n\t\t-webkit-transform: scaleX(0.8);\r\n\t}\r\n\t83.33333% {\r\n\t\t-webkit-transform: scaleX(0.73333);\r\n\t}\r\n\t91.66667% {\r\n\t\t-webkit-transform: scaleX(0.66667);\r\n\t}\r\n\t100% {\r\n\t\t-webkit-transform: scaleX(0.6);\r\n\t}\r\n}\r\n\r\n@-moz-keyframes segment-scale-6 {\r\n\t0% {\r\n\t\t-moz-transform: scaleX(0.6);\r\n\t}\r\n\t8.33333% {\r\n\t\t-moz-transform: scaleX(0.53333);\r\n\t}\r\n\t16.66667% {\r\n\t\t-moz-transform: scaleX(0.46667);\r\n\t}\r\n\t25% {\r\n\t\t-moz-transform: scaleX(0.4);\r\n\t}\r\n\t33.33333% {\r\n\t\t-moz-transform: scaleX(0.33333);\r\n\t}\r\n\t41.66667% {\r\n\t\t-moz-transform: scaleX(0.26667);\r\n\t}\r\n\t50% {\r\n\t\t-moz-transform: scaleX(1);\r\n\t}\r\n\t58.33333% {\r\n\t\t-moz-transform: scaleX(0.93333);\r\n\t}\r\n\t66.66667% {\r\n\t\t-moz-transform: scaleX(0.86667);\r\n\t}\r\n\t75% {\r\n\t\t-moz-transform: scaleX(0.8);\r\n\t}\r\n\t83.33333% {\r\n\t\t-moz-transform: scaleX(0.73333);\r\n\t}\r\n\t91.66667% {\r\n\t\t-moz-transform: scaleX(0.66667);\r\n\t}\r\n\t100% {\r\n\t\t-moz-transform: scaleX(0.6);\r\n\t}\r\n}\r\n\r\n@keyframes segment-scale-5 {\r\n\t0% {\r\n\t\ttransform: scaleX(0.53333);\r\n\t}\r\n\t8.33333% {\r\n\t\ttransform: scaleX(0.46667);\r\n\t}\r\n\t16.66667% {\r\n\t\ttransform: scaleX(0.4);\r\n\t}\r\n\t25% {\r\n\t\ttransform: scaleX(0.33333);\r\n\t}\r\n\t33.33333% {\r\n\t\ttransform: scaleX(0.26667);\r\n\t}\r\n\t41.66667% {\r\n\t\ttransform: scaleX(1);\r\n\t}\r\n\t50% {\r\n\t\ttransform: scaleX(0.93333);\r\n\t}\r\n\t58.33333% {\r\n\t\ttransform: scaleX(0.86667);\r\n\t}\r\n\t66.66667% {\r\n\t\ttransform: scaleX(0.8);\r\n\t}\r\n\t75% {\r\n\t\ttransform: scaleX(0.73333);\r\n\t}\r\n\t83.33333% {\r\n\t\ttransform: scaleX(0.66667);\r\n\t}\r\n\t91.66667% {\r\n\t\ttransform: scaleX(0.6);\r\n\t}\r\n\t100% {\r\n\t\ttransform: scaleX(0.53333);\r\n\t}\r\n}\r\n\r\n@-o-keyframes segment-scale-5 {\r\n\t0% {\r\n\t\t-o-transform: scaleX(0.53333);\r\n\t}\r\n\t8.33333% {\r\n\t\t-o-transform: scaleX(0.46667);\r\n\t}\r\n\t16.66667% {\r\n\t\t-o-transform: scaleX(0.4);\r\n\t}\r\n\t25% {\r\n\t\t-o-transform: scaleX(0.33333);\r\n\t}\r\n\t33.33333% {\r\n\t\t-o-transform: scaleX(0.26667);\r\n\t}\r\n\t41.66667% {\r\n\t\t-o-transform: scaleX(1);\r\n\t}\r\n\t50% {\r\n\t\t-o-transform: scaleX(0.93333);\r\n\t}\r\n\t58.33333% {\r\n\t\t-o-transform: scaleX(0.86667);\r\n\t}\r\n\t66.66667% {\r\n\t\t-o-transform: scaleX(0.8);\r\n\t}\r\n\t75% {\r\n\t\t-o-transform: scaleX(0.73333);\r\n\t}\r\n\t83.33333% {\r\n\t\t-o-transform: scaleX(0.66667);\r\n\t}\r\n\t91.66667% {\r\n\t\t-o-transform: scaleX(0.6);\r\n\t}\r\n\t100% {\r\n\t\t-o-transform: scaleX(0.53333);\r\n\t}\r\n}\r\n\r\n@-ms-keyframes segment-scale-5 {\r\n\t0% {\r\n\t\t-ms-transform: scaleX(0.53333);\r\n\t}\r\n\t8.33333% {\r\n\t\t-ms-transform: scaleX(0.46667);\r\n\t}\r\n\t16.66667% {\r\n\t\t-ms-transform: scaleX(0.4);\r\n\t}\r\n\t25% {\r\n\t\t-ms-transform: scaleX(0.33333);\r\n\t}\r\n\t33.33333% {\r\n\t\t-ms-transform: scaleX(0.26667);\r\n\t}\r\n\t41.66667% {\r\n\t\t-ms-transform: scaleX(1);\r\n\t}\r\n\t50% {\r\n\t\t-ms-transform: scaleX(0.93333);\r\n\t}\r\n\t58.33333% {\r\n\t\t-ms-transform: scaleX(0.86667);\r\n\t}\r\n\t66.66667% {\r\n\t\t-ms-transform: scaleX(0.8);\r\n\t}\r\n\t75% {\r\n\t\t-ms-transform: scaleX(0.73333);\r\n\t}\r\n\t83.33333% {\r\n\t\t-ms-transform: scaleX(0.66667);\r\n\t}\r\n\t91.66667% {\r\n\t\t-ms-transform: scaleX(0.6);\r\n\t}\r\n\t100% {\r\n\t\t-ms-transform: scaleX(0.53333);\r\n\t}\r\n}\r\n\r\n@-webkit-keyframes segment-scale-5 {\r\n\t0% {\r\n\t\t-webkit-transform: scaleX(0.53333);\r\n\t}\r\n\t8.33333% {\r\n\t\t-webkit-transform: scaleX(0.46667);\r\n\t}\r\n\t16.66667% {\r\n\t\t-webkit-transform: scaleX(0.4);\r\n\t}\r\n\t25% {\r\n\t\t-webkit-transform: scaleX(0.33333);\r\n\t}\r\n\t33.33333% {\r\n\t\t-webkit-transform: scaleX(0.26667);\r\n\t}\r\n\t41.66667% {\r\n\t\t-webkit-transform: scaleX(1);\r\n\t}\r\n\t50% {\r\n\t\t-webkit-transform: scaleX(0.93333);\r\n\t}\r\n\t58.33333% {\r\n\t\t-webkit-transform: scaleX(0.86667);\r\n\t}\r\n\t66.66667% {\r\n\t\t-webkit-transform: scaleX(0.8);\r\n\t}\r\n\t75% {\r\n\t\t-webkit-transform: scaleX(0.73333);\r\n\t}\r\n\t83.33333% {\r\n\t\t-webkit-transform: scaleX(0.66667);\r\n\t}\r\n\t91.66667% {\r\n\t\t-webkit-transform: scaleX(0.6);\r\n\t}\r\n\t100% {\r\n\t\t-webkit-transform: scaleX(0.53333);\r\n\t}\r\n}\r\n\r\n@-moz-keyframes segment-scale-5 {\r\n\t0% {\r\n\t\t-moz-transform: scaleX(0.53333);\r\n\t}\r\n\t8.33333% {\r\n\t\t-moz-transform: scaleX(0.46667);\r\n\t}\r\n\t16.66667% {\r\n\t\t-moz-transform: scaleX(0.4);\r\n\t}\r\n\t25% {\r\n\t\t-moz-transform: scaleX(0.33333);\r\n\t}\r\n\t33.33333% {\r\n\t\t-moz-transform: scaleX(0.26667);\r\n\t}\r\n\t41.66667% {\r\n\t\t-moz-transform: scaleX(1);\r\n\t}\r\n\t50% {\r\n\t\t-moz-transform: scaleX(0.93333);\r\n\t}\r\n\t58.33333% {\r\n\t\t-moz-transform: scaleX(0.86667);\r\n\t}\r\n\t66.66667% {\r\n\t\t-moz-transform: scaleX(0.8);\r\n\t}\r\n\t75% {\r\n\t\t-moz-transform: scaleX(0.73333);\r\n\t}\r\n\t83.33333% {\r\n\t\t-moz-transform: scaleX(0.66667);\r\n\t}\r\n\t91.66667% {\r\n\t\t-moz-transform: scaleX(0.6);\r\n\t}\r\n\t100% {\r\n\t\t-moz-transform: scaleX(0.53333);\r\n\t}\r\n}\r\n\r\n@keyframes segment-scale-4 {\r\n\t0% {\r\n\t\ttransform: scaleX(0.46667);\r\n\t}\r\n\t8.33333% {\r\n\t\ttransform: scaleX(0.4);\r\n\t}\r\n\t16.66667% {\r\n\t\ttransform: scaleX(0.33333);\r\n\t}\r\n\t25% {\r\n\t\ttransform: scaleX(0.26667);\r\n\t}\r\n\t33.33333% {\r\n\t\ttransform: scaleX(1);\r\n\t}\r\n\t41.66667% {\r\n\t\ttransform: scaleX(0.93333);\r\n\t}\r\n\t50% {\r\n\t\ttransform: scaleX(0.86667);\r\n\t}\r\n\t58.33333% {\r\n\t\ttransform: scaleX(0.8);\r\n\t}\r\n\t66.66667% {\r\n\t\ttransform: scaleX(0.73333);\r\n\t}\r\n\t75% {\r\n\t\ttransform: scaleX(0.66667);\r\n\t}\r\n\t83.33333% {\r\n\t\ttransform: scaleX(0.6);\r\n\t}\r\n\t91.66667% {\r\n\t\ttransform: scaleX(0.53333);\r\n\t}\r\n\t100% {\r\n\t\ttransform: scaleX(0.46667);\r\n\t}\r\n}\r\n\r\n@-o-keyframes segment-scale-4 {\r\n\t0% {\r\n\t\t-o-transform: scaleX(0.46667);\r\n\t}\r\n\t8.33333% {\r\n\t\t-o-transform: scaleX(0.4);\r\n\t}\r\n\t16.66667% {\r\n\t\t-o-transform: scaleX(0.33333);\r\n\t}\r\n\t25% {\r\n\t\t-o-transform: scaleX(0.26667);\r\n\t}\r\n\t33.33333% {\r\n\t\t-o-transform: scaleX(1);\r\n\t}\r\n\t41.66667% {\r\n\t\t-o-transform: scaleX(0.93333);\r\n\t}\r\n\t50% {\r\n\t\t-o-transform: scaleX(0.86667);\r\n\t}\r\n\t58.33333% {\r\n\t\t-o-transform: scaleX(0.8);\r\n\t}\r\n\t66.66667% {\r\n\t\t-o-transform: scaleX(0.73333);\r\n\t}\r\n\t75% {\r\n\t\t-o-transform: scaleX(0.66667);\r\n\t}\r\n\t83.33333% {\r\n\t\t-o-transform: scaleX(0.6);\r\n\t}\r\n\t91.66667% {\r\n\t\t-o-transform: scaleX(0.53333);\r\n\t}\r\n\t100% {\r\n\t\t-o-transform: scaleX(0.46667);\r\n\t}\r\n}\r\n\r\n@-ms-keyframes segment-scale-4 {\r\n\t0% {\r\n\t\t-ms-transform: scaleX(0.46667);\r\n\t}\r\n\t8.33333% {\r\n\t\t-ms-transform: scaleX(0.4);\r\n\t}\r\n\t16.66667% {\r\n\t\t-ms-transform: scaleX(0.33333);\r\n\t}\r\n\t25% {\r\n\t\t-ms-transform: scaleX(0.26667);\r\n\t}\r\n\t33.33333% {\r\n\t\t-ms-transform: scaleX(1);\r\n\t}\r\n\t41.66667% {\r\n\t\t-ms-transform: scaleX(0.93333);\r\n\t}\r\n\t50% {\r\n\t\t-ms-transform: scaleX(0.86667);\r\n\t}\r\n\t58.33333% {\r\n\t\t-ms-transform: scaleX(0.8);\r\n\t}\r\n\t66.66667% {\r\n\t\t-ms-transform: scaleX(0.73333);\r\n\t}\r\n\t75% {\r\n\t\t-ms-transform: scaleX(0.66667);\r\n\t}\r\n\t83.33333% {\r\n\t\t-ms-transform: scaleX(0.6);\r\n\t}\r\n\t91.66667% {\r\n\t\t-ms-transform: scaleX(0.53333);\r\n\t}\r\n\t100% {\r\n\t\t-ms-transform: scaleX(0.46667);\r\n\t}\r\n}\r\n\r\n@-webkit-keyframes segment-scale-4 {\r\n\t0% {\r\n\t\t-webkit-transform: scaleX(0.46667);\r\n\t}\r\n\t8.33333% {\r\n\t\t-webkit-transform: scaleX(0.4);\r\n\t}\r\n\t16.66667% {\r\n\t\t-webkit-transform: scaleX(0.33333);\r\n\t}\r\n\t25% {\r\n\t\t-webkit-transform: scaleX(0.26667);\r\n\t}\r\n\t33.33333% {\r\n\t\t-webkit-transform: scaleX(1);\r\n\t}\r\n\t41.66667% {\r\n\t\t-webkit-transform: scaleX(0.93333);\r\n\t}\r\n\t50% {\r\n\t\t-webkit-transform: scaleX(0.86667);\r\n\t}\r\n\t58.33333% {\r\n\t\t-webkit-transform: scaleX(0.8);\r\n\t}\r\n\t66.66667% {\r\n\t\t-webkit-transform: scaleX(0.73333);\r\n\t}\r\n\t75% {\r\n\t\t-webkit-transform: scaleX(0.66667);\r\n\t}\r\n\t83.33333% {\r\n\t\t-webkit-transform: scaleX(0.6);\r\n\t}\r\n\t91.66667% {\r\n\t\t-webkit-transform: scaleX(0.53333);\r\n\t}\r\n\t100% {\r\n\t\t-webkit-transform: scaleX(0.46667);\r\n\t}\r\n}\r\n\r\n@-moz-keyframes segment-scale-4 {\r\n\t0% {\r\n\t\t-moz-transform: scaleX(0.46667);\r\n\t}\r\n\t8.33333% {\r\n\t\t-moz-transform: scaleX(0.4);\r\n\t}\r\n\t16.66667% {\r\n\t\t-moz-transform: scaleX(0.33333);\r\n\t}\r\n\t25% {\r\n\t\t-moz-transform: scaleX(0.26667);\r\n\t}\r\n\t33.33333% {\r\n\t\t-moz-transform: scaleX(1);\r\n\t}\r\n\t41.66667% {\r\n\t\t-moz-transform: scaleX(0.93333);\r\n\t}\r\n\t50% {\r\n\t\t-moz-transform: scaleX(0.86667);\r\n\t}\r\n\t58.33333% {\r\n\t\t-moz-transform: scaleX(0.8);\r\n\t}\r\n\t66.66667% {\r\n\t\t-moz-transform: scaleX(0.73333);\r\n\t}\r\n\t75% {\r\n\t\t-moz-transform: scaleX(0.66667);\r\n\t}\r\n\t83.33333% {\r\n\t\t-moz-transform: scaleX(0.6);\r\n\t}\r\n\t91.66667% {\r\n\t\t-moz-transform: scaleX(0.53333);\r\n\t}\r\n\t100% {\r\n\t\t-moz-transform: scaleX(0.46667);\r\n\t}\r\n}\r\n\r\n@keyframes segment-scale-3 {\r\n\t0% {\r\n\t\ttransform: scaleX(0.4);\r\n\t}\r\n\t8.33333% {\r\n\t\ttransform: scaleX(0.33333);\r\n\t}\r\n\t16.66667% {\r\n\t\ttransform: scaleX(0.26667);\r\n\t}\r\n\t25% {\r\n\t\ttransform: scaleX(1);\r\n\t}\r\n\t33.33333% {\r\n\t\ttransform: scaleX(0.93333);\r\n\t}\r\n\t41.66667% {\r\n\t\ttransform: scaleX(0.86667);\r\n\t}\r\n\t50% {\r\n\t\ttransform: scaleX(0.8);\r\n\t}\r\n\t58.33333% {\r\n\t\ttransform: scaleX(0.73333);\r\n\t}\r\n\t66.66667% {\r\n\t\ttransform: scaleX(0.66667);\r\n\t}\r\n\t75% {\r\n\t\ttransform: scaleX(0.6);\r\n\t}\r\n\t83.33333% {\r\n\t\ttransform: scaleX(0.53333);\r\n\t}\r\n\t91.66667% {\r\n\t\ttransform: scaleX(0.46667);\r\n\t}\r\n\t100% {\r\n\t\ttransform: scaleX(0.4);\r\n\t}\r\n}\r\n\r\n@-o-keyframes segment-scale-3 {\r\n\t0% {\r\n\t\t-o-transform: scaleX(0.4);\r\n\t}\r\n\t8.33333% {\r\n\t\t-o-transform: scaleX(0.33333);\r\n\t}\r\n\t16.66667% {\r\n\t\t-o-transform: scaleX(0.26667);\r\n\t}\r\n\t25% {\r\n\t\t-o-transform: scaleX(1);\r\n\t}\r\n\t33.33333% {\r\n\t\t-o-transform: scaleX(0.93333);\r\n\t}\r\n\t41.66667% {\r\n\t\t-o-transform: scaleX(0.86667);\r\n\t}\r\n\t50% {\r\n\t\t-o-transform: scaleX(0.8);\r\n\t}\r\n\t58.33333% {\r\n\t\t-o-transform: scaleX(0.73333);\r\n\t}\r\n\t66.66667% {\r\n\t\t-o-transform: scaleX(0.66667);\r\n\t}\r\n\t75% {\r\n\t\t-o-transform: scaleX(0.6);\r\n\t}\r\n\t83.33333% {\r\n\t\t-o-transform: scaleX(0.53333);\r\n\t}\r\n\t91.66667% {\r\n\t\t-o-transform: scaleX(0.46667);\r\n\t}\r\n\t100% {\r\n\t\t-o-transform: scaleX(0.4);\r\n\t}\r\n}\r\n\r\n@-ms-keyframes segment-scale-3 {\r\n\t0% {\r\n\t\t-ms-transform: scaleX(0.4);\r\n\t}\r\n\t8.33333% {\r\n\t\t-ms-transform: scaleX(0.33333);\r\n\t}\r\n\t16.66667% {\r\n\t\t-ms-transform: scaleX(0.26667);\r\n\t}\r\n\t25% {\r\n\t\t-ms-transform: scaleX(1);\r\n\t}\r\n\t33.33333% {\r\n\t\t-ms-transform: scaleX(0.93333);\r\n\t}\r\n\t41.66667% {\r\n\t\t-ms-transform: scaleX(0.86667);\r\n\t}\r\n\t50% {\r\n\t\t-ms-transform: scaleX(0.8);\r\n\t}\r\n\t58.33333% {\r\n\t\t-ms-transform: scaleX(0.73333);\r\n\t}\r\n\t66.66667% {\r\n\t\t-ms-transform: scaleX(0.66667);\r\n\t}\r\n\t75% {\r\n\t\t-ms-transform: scaleX(0.6);\r\n\t}\r\n\t83.33333% {\r\n\t\t-ms-transform: scaleX(0.53333);\r\n\t}\r\n\t91.66667% {\r\n\t\t-ms-transform: scaleX(0.46667);\r\n\t}\r\n\t100% {\r\n\t\t-ms-transform: scaleX(0.4);\r\n\t}\r\n}\r\n\r\n@-webkit-keyframes segment-scale-3 {\r\n\t0% {\r\n\t\t-webkit-transform: scaleX(0.4);\r\n\t}\r\n\t8.33333% {\r\n\t\t-webkit-transform: scaleX(0.33333);\r\n\t}\r\n\t16.66667% {\r\n\t\t-webkit-transform: scaleX(0.26667);\r\n\t}\r\n\t25% {\r\n\t\t-webkit-transform: scaleX(1);\r\n\t}\r\n\t33.33333% {\r\n\t\t-webkit-transform: scaleX(0.93333);\r\n\t}\r\n\t41.66667% {\r\n\t\t-webkit-transform: scaleX(0.86667);\r\n\t}\r\n\t50% {\r\n\t\t-webkit-transform: scaleX(0.8);\r\n\t}\r\n\t58.33333% {\r\n\t\t-webkit-transform: scaleX(0.73333);\r\n\t}\r\n\t66.66667% {\r\n\t\t-webkit-transform: scaleX(0.66667);\r\n\t}\r\n\t75% {\r\n\t\t-webkit-transform: scaleX(0.6);\r\n\t}\r\n\t83.33333% {\r\n\t\t-webkit-transform: scaleX(0.53333);\r\n\t}\r\n\t91.66667% {\r\n\t\t-webkit-transform: scaleX(0.46667);\r\n\t}\r\n\t100% {\r\n\t\t-webkit-transform: scaleX(0.4);\r\n\t}\r\n}\r\n\r\n@-moz-keyframes segment-scale-3 {\r\n\t0% {\r\n\t\t-moz-transform: scaleX(0.4);\r\n\t}\r\n\t8.33333% {\r\n\t\t-moz-transform: scaleX(0.33333);\r\n\t}\r\n\t16.66667% {\r\n\t\t-moz-transform: scaleX(0.26667);\r\n\t}\r\n\t25% {\r\n\t\t-moz-transform: scaleX(1);\r\n\t}\r\n\t33.33333% {\r\n\t\t-moz-transform: scaleX(0.93333);\r\n\t}\r\n\t41.66667% {\r\n\t\t-moz-transform: scaleX(0.86667);\r\n\t}\r\n\t50% {\r\n\t\t-moz-transform: scaleX(0.8);\r\n\t}\r\n\t58.33333% {\r\n\t\t-moz-transform: scaleX(0.73333);\r\n\t}\r\n\t66.66667% {\r\n\t\t-moz-transform: scaleX(0.66667);\r\n\t}\r\n\t75% {\r\n\t\t-moz-transform: scaleX(0.6);\r\n\t}\r\n\t83.33333% {\r\n\t\t-moz-transform: scaleX(0.53333);\r\n\t}\r\n\t91.66667% {\r\n\t\t-moz-transform: scaleX(0.46667);\r\n\t}\r\n\t100% {\r\n\t\t-moz-transform: scaleX(0.4);\r\n\t}\r\n}\r\n\r\n@keyframes segment-scale-2 {\r\n\t0% {\r\n\t\ttransform: scaleX(0.33333);\r\n\t}\r\n\t8.33333% {\r\n\t\ttransform: scaleX(0.26667);\r\n\t}\r\n\t16.66667% {\r\n\t\ttransform: scaleX(1);\r\n\t}\r\n\t25% {\r\n\t\ttransform: scaleX(0.93333);\r\n\t}\r\n\t33.33333% {\r\n\t\ttransform: scaleX(0.86667);\r\n\t}\r\n\t41.66667% {\r\n\t\ttransform: scaleX(0.8);\r\n\t}\r\n\t50% {\r\n\t\ttransform: scaleX(0.73333);\r\n\t}\r\n\t58.33333% {\r\n\t\ttransform: scaleX(0.66667);\r\n\t}\r\n\t66.66667% {\r\n\t\ttransform: scaleX(0.6);\r\n\t}\r\n\t75% {\r\n\t\ttransform: scaleX(0.53333);\r\n\t}\r\n\t83.33333% {\r\n\t\ttransform: scaleX(0.46667);\r\n\t}\r\n\t91.66667% {\r\n\t\ttransform: scaleX(0.4);\r\n\t}\r\n\t100% {\r\n\t\ttransform: scaleX(0.33333);\r\n\t}\r\n}\r\n\r\n@-o-keyframes segment-scale-2 {\r\n\t0% {\r\n\t\t-o-transform: scaleX(0.33333);\r\n\t}\r\n\t8.33333% {\r\n\t\t-o-transform: scaleX(0.26667);\r\n\t}\r\n\t16.66667% {\r\n\t\t-o-transform: scaleX(1);\r\n\t}\r\n\t25% {\r\n\t\t-o-transform: scaleX(0.93333);\r\n\t}\r\n\t33.33333% {\r\n\t\t-o-transform: scaleX(0.86667);\r\n\t}\r\n\t41.66667% {\r\n\t\t-o-transform: scaleX(0.8);\r\n\t}\r\n\t50% {\r\n\t\t-o-transform: scaleX(0.73333);\r\n\t}\r\n\t58.33333% {\r\n\t\t-o-transform: scaleX(0.66667);\r\n\t}\r\n\t66.66667% {\r\n\t\t-o-transform: scaleX(0.6);\r\n\t}\r\n\t75% {\r\n\t\t-o-transform: scaleX(0.53333);\r\n\t}\r\n\t83.33333% {\r\n\t\t-o-transform: scaleX(0.46667);\r\n\t}\r\n\t91.66667% {\r\n\t\t-o-transform: scaleX(0.4);\r\n\t}\r\n\t100% {\r\n\t\t-o-transform: scaleX(0.33333);\r\n\t}\r\n}\r\n\r\n@-ms-keyframes segment-scale-2 {\r\n\t0% {\r\n\t\t-ms-transform: scaleX(0.33333);\r\n\t}\r\n\t8.33333% {\r\n\t\t-ms-transform: scaleX(0.26667);\r\n\t}\r\n\t16.66667% {\r\n\t\t-ms-transform: scaleX(1);\r\n\t}\r\n\t25% {\r\n\t\t-ms-transform: scaleX(0.93333);\r\n\t}\r\n\t33.33333% {\r\n\t\t-ms-transform: scaleX(0.86667);\r\n\t}\r\n\t41.66667% {\r\n\t\t-ms-transform: scaleX(0.8);\r\n\t}\r\n\t50% {\r\n\t\t-ms-transform: scaleX(0.73333);\r\n\t}\r\n\t58.33333% {\r\n\t\t-ms-transform: scaleX(0.66667);\r\n\t}\r\n\t66.66667% {\r\n\t\t-ms-transform: scaleX(0.6);\r\n\t}\r\n\t75% {\r\n\t\t-ms-transform: scaleX(0.53333);\r\n\t}\r\n\t83.33333% {\r\n\t\t-ms-transform: scaleX(0.46667);\r\n\t}\r\n\t91.66667% {\r\n\t\t-ms-transform: scaleX(0.4);\r\n\t}\r\n\t100% {\r\n\t\t-ms-transform: scaleX(0.33333);\r\n\t}\r\n}\r\n\r\n@-webkit-keyframes segment-scale-2 {\r\n\t0% {\r\n\t\t-webkit-transform: scaleX(0.33333);\r\n\t}\r\n\t8.33333% {\r\n\t\t-webkit-transform: scaleX(0.26667);\r\n\t}\r\n\t16.66667% {\r\n\t\t-webkit-transform: scaleX(1);\r\n\t}\r\n\t25% {\r\n\t\t-webkit-transform: scaleX(0.93333);\r\n\t}\r\n\t33.33333% {\r\n\t\t-webkit-transform: scaleX(0.86667);\r\n\t}\r\n\t41.66667% {\r\n\t\t-webkit-transform: scaleX(0.8);\r\n\t}\r\n\t50% {\r\n\t\t-webkit-transform: scaleX(0.73333);\r\n\t}\r\n\t58.33333% {\r\n\t\t-webkit-transform: scaleX(0.66667);\r\n\t}\r\n\t66.66667% {\r\n\t\t-webkit-transform: scaleX(0.6);\r\n\t}\r\n\t75% {\r\n\t\t-webkit-transform: scaleX(0.53333);\r\n\t}\r\n\t83.33333% {\r\n\t\t-webkit-transform: scaleX(0.46667);\r\n\t}\r\n\t91.66667% {\r\n\t\t-webkit-transform: scaleX(0.4);\r\n\t}\r\n\t100% {\r\n\t\t-webkit-transform: scaleX(0.33333);\r\n\t}\r\n}\r\n\r\n@-moz-keyframes segment-scale-2 {\r\n\t0% {\r\n\t\t-moz-transform: scaleX(0.33333);\r\n\t}\r\n\t8.33333% {\r\n\t\t-moz-transform: scaleX(0.26667);\r\n\t}\r\n\t16.66667% {\r\n\t\t-moz-transform: scaleX(1);\r\n\t}\r\n\t25% {\r\n\t\t-moz-transform: scaleX(0.93333);\r\n\t}\r\n\t33.33333% {\r\n\t\t-moz-transform: scaleX(0.86667);\r\n\t}\r\n\t41.66667% {\r\n\t\t-moz-transform: scaleX(0.8);\r\n\t}\r\n\t50% {\r\n\t\t-moz-transform: scaleX(0.73333);\r\n\t}\r\n\t58.33333% {\r\n\t\t-moz-transform: scaleX(0.66667);\r\n\t}\r\n\t66.66667% {\r\n\t\t-moz-transform: scaleX(0.6);\r\n\t}\r\n\t75% {\r\n\t\t-moz-transform: scaleX(0.53333);\r\n\t}\r\n\t83.33333% {\r\n\t\t-moz-transform: scaleX(0.46667);\r\n\t}\r\n\t91.66667% {\r\n\t\t-moz-transform: scaleX(0.4);\r\n\t}\r\n\t100% {\r\n\t\t-moz-transform: scaleX(0.33333);\r\n\t}\r\n}\r\n\r\n@keyframes segment-scale-1 {\r\n\t0% {\r\n\t\ttransform: scaleX(0.26667);\r\n\t}\r\n\t8.33333% {\r\n\t\ttransform: scaleX(1);\r\n\t}\r\n\t16.66667% {\r\n\t\ttransform: scaleX(0.93333);\r\n\t}\r\n\t25% {\r\n\t\ttransform: scaleX(0.86667);\r\n\t}\r\n\t33.33333% {\r\n\t\ttransform: scaleX(0.8);\r\n\t}\r\n\t41.66667% {\r\n\t\ttransform: scaleX(0.73333);\r\n\t}\r\n\t50% {\r\n\t\ttransform: scaleX(0.66667);\r\n\t}\r\n\t58.33333% {\r\n\t\ttransform: scaleX(0.6);\r\n\t}\r\n\t66.66667% {\r\n\t\ttransform: scaleX(0.53333);\r\n\t}\r\n\t75% {\r\n\t\ttransform: scaleX(0.46667);\r\n\t}\r\n\t83.33333% {\r\n\t\ttransform: scaleX(0.4);\r\n\t}\r\n\t91.66667% {\r\n\t\ttransform: scaleX(0.33333);\r\n\t}\r\n\t100% {\r\n\t\ttransform: scaleX(0.26667);\r\n\t}\r\n}\r\n\r\n@-o-keyframes segment-scale-1 {\r\n\t0% {\r\n\t\t-o-transform: scaleX(0.26667);\r\n\t}\r\n\t8.33333% {\r\n\t\t-o-transform: scaleX(1);\r\n\t}\r\n\t16.66667% {\r\n\t\t-o-transform: scaleX(0.93333);\r\n\t}\r\n\t25% {\r\n\t\t-o-transform: scaleX(0.86667);\r\n\t}\r\n\t33.33333% {\r\n\t\t-o-transform: scaleX(0.8);\r\n\t}\r\n\t41.66667% {\r\n\t\t-o-transform: scaleX(0.73333);\r\n\t}\r\n\t50% {\r\n\t\t-o-transform: scaleX(0.66667);\r\n\t}\r\n\t58.33333% {\r\n\t\t-o-transform: scaleX(0.6);\r\n\t}\r\n\t66.66667% {\r\n\t\t-o-transform: scaleX(0.53333);\r\n\t}\r\n\t75% {\r\n\t\t-o-transform: scaleX(0.46667);\r\n\t}\r\n\t83.33333% {\r\n\t\t-o-transform: scaleX(0.4);\r\n\t}\r\n\t91.66667% {\r\n\t\t-o-transform: scaleX(0.33333);\r\n\t}\r\n\t100% {\r\n\t\t-o-transform: scaleX(0.26667);\r\n\t}\r\n}\r\n\r\n@-ms-keyframes segment-scale-1 {\r\n\t0% {\r\n\t\t-ms-transform: scaleX(0.26667);\r\n\t}\r\n\t8.33333% {\r\n\t\t-ms-transform: scaleX(1);\r\n\t}\r\n\t16.66667% {\r\n\t\t-ms-transform: scaleX(0.93333);\r\n\t}\r\n\t25% {\r\n\t\t-ms-transform: scaleX(0.86667);\r\n\t}\r\n\t33.33333% {\r\n\t\t-ms-transform: scaleX(0.8);\r\n\t}\r\n\t41.66667% {\r\n\t\t-ms-transform: scaleX(0.73333);\r\n\t}\r\n\t50% {\r\n\t\t-ms-transform: scaleX(0.66667);\r\n\t}\r\n\t58.33333% {\r\n\t\t-ms-transform: scaleX(0.6);\r\n\t}\r\n\t66.66667% {\r\n\t\t-ms-transform: scaleX(0.53333);\r\n\t}\r\n\t75% {\r\n\t\t-ms-transform: scaleX(0.46667);\r\n\t}\r\n\t83.33333% {\r\n\t\t-ms-transform: scaleX(0.4);\r\n\t}\r\n\t91.66667% {\r\n\t\t-ms-transform: scaleX(0.33333);\r\n\t}\r\n\t100% {\r\n\t\t-ms-transform: scaleX(0.26667);\r\n\t}\r\n}\r\n\r\n@-webkit-keyframes segment-scale-1 {\r\n\t0% {\r\n\t\t-webkit-transform: scaleX(0.26667);\r\n\t}\r\n\t8.33333% {\r\n\t\t-webkit-transform: scaleX(1);\r\n\t}\r\n\t16.66667% {\r\n\t\t-webkit-transform: scaleX(0.93333);\r\n\t}\r\n\t25% {\r\n\t\t-webkit-transform: scaleX(0.86667);\r\n\t}\r\n\t33.33333% {\r\n\t\t-webkit-transform: scaleX(0.8);\r\n\t}\r\n\t41.66667% {\r\n\t\t-webkit-transform: scaleX(0.73333);\r\n\t}\r\n\t50% {\r\n\t\t-webkit-transform: scaleX(0.66667);\r\n\t}\r\n\t58.33333% {\r\n\t\t-webkit-transform: scaleX(0.6);\r\n\t}\r\n\t66.66667% {\r\n\t\t-webkit-transform: scaleX(0.53333);\r\n\t}\r\n\t75% {\r\n\t\t-webkit-transform: scaleX(0.46667);\r\n\t}\r\n\t83.33333% {\r\n\t\t-webkit-transform: scaleX(0.4);\r\n\t}\r\n\t91.66667% {\r\n\t\t-webkit-transform: scaleX(0.33333);\r\n\t}\r\n\t100% {\r\n\t\t-webkit-transform: scaleX(0.26667);\r\n\t}\r\n}\r\n\r\n@-moz-keyframes segment-scale-1 {\r\n\t0% {\r\n\t\t-moz-transform: scaleX(0.26667);\r\n\t}\r\n\t8.33333% {\r\n\t\t-moz-transform: scaleX(1);\r\n\t}\r\n\t16.66667% {\r\n\t\t-moz-transform: scaleX(0.93333);\r\n\t}\r\n\t25% {\r\n\t\t-moz-transform: scaleX(0.86667);\r\n\t}\r\n\t33.33333% {\r\n\t\t-moz-transform: scaleX(0.8);\r\n\t}\r\n\t41.66667% {\r\n\t\t-moz-transform: scaleX(0.73333);\r\n\t}\r\n\t50% {\r\n\t\t-moz-transform: scaleX(0.66667);\r\n\t}\r\n\t58.33333% {\r\n\t\t-moz-transform: scaleX(0.6);\r\n\t}\r\n\t66.66667% {\r\n\t\t-moz-transform: scaleX(0.53333);\r\n\t}\r\n\t75% {\r\n\t\t-moz-transform: scaleX(0.46667);\r\n\t}\r\n\t83.33333% {\r\n\t\t-moz-transform: scaleX(0.4);\r\n\t}\r\n\t91.66667% {\r\n\t\t-moz-transform: scaleX(0.33333);\r\n\t}\r\n\t100% {\r\n\t\t-moz-transform: scaleX(0.26667);\r\n\t}\r\n}\r\n\r\n@keyframes segment-opacity-12 {\r\n\t0% {\r\n\t\topacity: 1;\r\n\t}\r\n\t8.33333% {\r\n\t\topacity: 0.93333;\r\n\t}\r\n\t16.66667% {\r\n\t\topacity: 0.86667;\r\n\t}\r\n\t25% {\r\n\t\topacity: 0.8;\r\n\t}\r\n\t33.33333% {\r\n\t\topacity: 0.73333;\r\n\t}\r\n\t41.66667% {\r\n\t\topacity: 0.66667;\r\n\t}\r\n\t50% {\r\n\t\topacity: 0.6;\r\n\t}\r\n\t58.33333% {\r\n\t\topacity: 0.53333;\r\n\t}\r\n\t66.66667% {\r\n\t\topacity: 0.46667;\r\n\t}\r\n\t75% {\r\n\t\topacity: 0.4;\r\n\t}\r\n\t83.33333% {\r\n\t\topacity: 0.33333;\r\n\t}\r\n\t91.66667% {\r\n\t\topacity: 0.26667;\r\n\t}\r\n\t100% {\r\n\t\topacity: 1;\r\n\t}\r\n}\r\n\r\n@-o-keyframes segment-opacity-12 {\r\n\t0% {\r\n\t\topacity: 1;\r\n\t}\r\n\t8.33333% {\r\n\t\topacity: 0.93333;\r\n\t}\r\n\t16.66667% {\r\n\t\topacity: 0.86667;\r\n\t}\r\n\t25% {\r\n\t\topacity: 0.8;\r\n\t}\r\n\t33.33333% {\r\n\t\topacity: 0.73333;\r\n\t}\r\n\t41.66667% {\r\n\t\topacity: 0.66667;\r\n\t}\r\n\t50% {\r\n\t\topacity: 0.6;\r\n\t}\r\n\t58.33333% {\r\n\t\topacity: 0.53333;\r\n\t}\r\n\t66.66667% {\r\n\t\topacity: 0.46667;\r\n\t}\r\n\t75% {\r\n\t\topacity: 0.4;\r\n\t}\r\n\t83.33333% {\r\n\t\topacity: 0.33333;\r\n\t}\r\n\t91.66667% {\r\n\t\topacity: 0.26667;\r\n\t}\r\n\t100% {\r\n\t\topacity: 1;\r\n\t}\r\n}\r\n\r\n@-ms-keyframes segment-opacity-12 {\r\n\t0% {\r\n\t\topacity: 1;\r\n\t}\r\n\t8.33333% {\r\n\t\topacity: 0.93333;\r\n\t}\r\n\t16.66667% {\r\n\t\topacity: 0.86667;\r\n\t}\r\n\t25% {\r\n\t\topacity: 0.8;\r\n\t}\r\n\t33.33333% {\r\n\t\topacity: 0.73333;\r\n\t}\r\n\t41.66667% {\r\n\t\topacity: 0.66667;\r\n\t}\r\n\t50% {\r\n\t\topacity: 0.6;\r\n\t}\r\n\t58.33333% {\r\n\t\topacity: 0.53333;\r\n\t}\r\n\t66.66667% {\r\n\t\topacity: 0.46667;\r\n\t}\r\n\t75% {\r\n\t\topacity: 0.4;\r\n\t}\r\n\t83.33333% {\r\n\t\topacity: 0.33333;\r\n\t}\r\n\t91.66667% {\r\n\t\topacity: 0.26667;\r\n\t}\r\n\t100% {\r\n\t\topacity: 1;\r\n\t}\r\n}\r\n\r\n@-webkit-keyframes segment-opacity-12 {\r\n\t0% {\r\n\t\topacity: 1;\r\n\t}\r\n\t8.33333% {\r\n\t\topacity: 0.93333;\r\n\t}\r\n\t16.66667% {\r\n\t\topacity: 0.86667;\r\n\t}\r\n\t25% {\r\n\t\topacity: 0.8;\r\n\t}\r\n\t33.33333% {\r\n\t\topacity: 0.73333;\r\n\t}\r\n\t41.66667% {\r\n\t\topacity: 0.66667;\r\n\t}\r\n\t50% {\r\n\t\topacity: 0.6;\r\n\t}\r\n\t58.33333% {\r\n\t\topacity: 0.53333;\r\n\t}\r\n\t66.66667% {\r\n\t\topacity: 0.46667;\r\n\t}\r\n\t75% {\r\n\t\topacity: 0.4;\r\n\t}\r\n\t83.33333% {\r\n\t\topacity: 0.33333;\r\n\t}\r\n\t91.66667% {\r\n\t\topacity: 0.26667;\r\n\t}\r\n\t100% {\r\n\t\topacity: 1;\r\n\t}\r\n}\r\n\r\n@-moz-keyframes segment-opacity-12 {\r\n\t0% {\r\n\t\topacity: 1;\r\n\t}\r\n\t8.33333% {\r\n\t\topacity: 0.93333;\r\n\t}\r\n\t16.66667% {\r\n\t\topacity: 0.86667;\r\n\t}\r\n\t25% {\r\n\t\topacity: 0.8;\r\n\t}\r\n\t33.33333% {\r\n\t\topacity: 0.73333;\r\n\t}\r\n\t41.66667% {\r\n\t\topacity: 0.66667;\r\n\t}\r\n\t50% {\r\n\t\topacity: 0.6;\r\n\t}\r\n\t58.33333% {\r\n\t\topacity: 0.53333;\r\n\t}\r\n\t66.66667% {\r\n\t\topacity: 0.46667;\r\n\t}\r\n\t75% {\r\n\t\topacity: 0.4;\r\n\t}\r\n\t83.33333% {\r\n\t\topacity: 0.33333;\r\n\t}\r\n\t91.66667% {\r\n\t\topacity: 0.26667;\r\n\t}\r\n\t100% {\r\n\t\topacity: 1;\r\n\t}\r\n}\r\n\r\n@keyframes segment-opacity-11 {\r\n\t0% {\r\n\t\topacity: 0.93333;\r\n\t}\r\n\t8.33333% {\r\n\t\topacity: 0.86667;\r\n\t}\r\n\t16.66667% {\r\n\t\topacity: 0.8;\r\n\t}\r\n\t25% {\r\n\t\topacity: 0.73333;\r\n\t}\r\n\t33.33333% {\r\n\t\topacity: 0.66667;\r\n\t}\r\n\t41.66667% {\r\n\t\topacity: 0.6;\r\n\t}\r\n\t50% {\r\n\t\topacity: 0.53333;\r\n\t}\r\n\t58.33333% {\r\n\t\topacity: 0.46667;\r\n\t}\r\n\t66.66667% {\r\n\t\topacity: 0.4;\r\n\t}\r\n\t75% {\r\n\t\topacity: 0.33333;\r\n\t}\r\n\t83.33333% {\r\n\t\topacity: 0.26667;\r\n\t}\r\n\t91.66667% {\r\n\t\topacity: 1;\r\n\t}\r\n\t100% {\r\n\t\topacity: 0.93333;\r\n\t}\r\n}\r\n\r\n@-o-keyframes segment-opacity-11 {\r\n\t0% {\r\n\t\topacity: 0.93333;\r\n\t}\r\n\t8.33333% {\r\n\t\topacity: 0.86667;\r\n\t}\r\n\t16.66667% {\r\n\t\topacity: 0.8;\r\n\t}\r\n\t25% {\r\n\t\topacity: 0.73333;\r\n\t}\r\n\t33.33333% {\r\n\t\topacity: 0.66667;\r\n\t}\r\n\t41.66667% {\r\n\t\topacity: 0.6;\r\n\t}\r\n\t50% {\r\n\t\topacity: 0.53333;\r\n\t}\r\n\t58.33333% {\r\n\t\topacity: 0.46667;\r\n\t}\r\n\t66.66667% {\r\n\t\topacity: 0.4;\r\n\t}\r\n\t75% {\r\n\t\topacity: 0.33333;\r\n\t}\r\n\t83.33333% {\r\n\t\topacity: 0.26667;\r\n\t}\r\n\t91.66667% {\r\n\t\topacity: 1;\r\n\t}\r\n\t100% {\r\n\t\topacity: 0.93333;\r\n\t}\r\n}\r\n\r\n@-ms-keyframes segment-opacity-11 {\r\n\t0% {\r\n\t\topacity: 0.93333;\r\n\t}\r\n\t8.33333% {\r\n\t\topacity: 0.86667;\r\n\t}\r\n\t16.66667% {\r\n\t\topacity: 0.8;\r\n\t}\r\n\t25% {\r\n\t\topacity: 0.73333;\r\n\t}\r\n\t33.33333% {\r\n\t\topacity: 0.66667;\r\n\t}\r\n\t41.66667% {\r\n\t\topacity: 0.6;\r\n\t}\r\n\t50% {\r\n\t\topacity: 0.53333;\r\n\t}\r\n\t58.33333% {\r\n\t\topacity: 0.46667;\r\n\t}\r\n\t66.66667% {\r\n\t\topacity: 0.4;\r\n\t}\r\n\t75% {\r\n\t\topacity: 0.33333;\r\n\t}\r\n\t83.33333% {\r\n\t\topacity: 0.26667;\r\n\t}\r\n\t91.66667% {\r\n\t\topacity: 1;\r\n\t}\r\n\t100% {\r\n\t\topacity: 0.93333;\r\n\t}\r\n}\r\n\r\n@-webkit-keyframes segment-opacity-11 {\r\n\t0% {\r\n\t\topacity: 0.93333;\r\n\t}\r\n\t8.33333% {\r\n\t\topacity: 0.86667;\r\n\t}\r\n\t16.66667% {\r\n\t\topacity: 0.8;\r\n\t}\r\n\t25% {\r\n\t\topacity: 0.73333;\r\n\t}\r\n\t33.33333% {\r\n\t\topacity: 0.66667;\r\n\t}\r\n\t41.66667% {\r\n\t\topacity: 0.6;\r\n\t}\r\n\t50% {\r\n\t\topacity: 0.53333;\r\n\t}\r\n\t58.33333% {\r\n\t\topacity: 0.46667;\r\n\t}\r\n\t66.66667% {\r\n\t\topacity: 0.4;\r\n\t}\r\n\t75% {\r\n\t\topacity: 0.33333;\r\n\t}\r\n\t83.33333% {\r\n\t\topacity: 0.26667;\r\n\t}\r\n\t91.66667% {\r\n\t\topacity: 1;\r\n\t}\r\n\t100% {\r\n\t\topacity: 0.93333;\r\n\t}\r\n}\r\n\r\n@-moz-keyframes segment-opacity-11 {\r\n\t0% {\r\n\t\topacity: 0.93333;\r\n\t}\r\n\t8.33333% {\r\n\t\topacity: 0.86667;\r\n\t}\r\n\t16.66667% {\r\n\t\topacity: 0.8;\r\n\t}\r\n\t25% {\r\n\t\topacity: 0.73333;\r\n\t}\r\n\t33.33333% {\r\n\t\topacity: 0.66667;\r\n\t}\r\n\t41.66667% {\r\n\t\topacity: 0.6;\r\n\t}\r\n\t50% {\r\n\t\topacity: 0.53333;\r\n\t}\r\n\t58.33333% {\r\n\t\topacity: 0.46667;\r\n\t}\r\n\t66.66667% {\r\n\t\topacity: 0.4;\r\n\t}\r\n\t75% {\r\n\t\topacity: 0.33333;\r\n\t}\r\n\t83.33333% {\r\n\t\topacity: 0.26667;\r\n\t}\r\n\t91.66667% {\r\n\t\topacity: 1;\r\n\t}\r\n\t100% {\r\n\t\topacity: 0.93333;\r\n\t}\r\n}\r\n\r\n@keyframes segment-opacity-10 {\r\n\t0% {\r\n\t\topacity: 0.86667;\r\n\t}\r\n\t8.33333% {\r\n\t\topacity: 0.8;\r\n\t}\r\n\t16.66667% {\r\n\t\topacity: 0.73333;\r\n\t}\r\n\t25% {\r\n\t\topacity: 0.66667;\r\n\t}\r\n\t33.33333% {\r\n\t\topacity: 0.6;\r\n\t}\r\n\t41.66667% {\r\n\t\topacity: 0.53333;\r\n\t}\r\n\t50% {\r\n\t\topacity: 0.46667;\r\n\t}\r\n\t58.33333% {\r\n\t\topacity: 0.4;\r\n\t}\r\n\t66.66667% {\r\n\t\topacity: 0.33333;\r\n\t}\r\n\t75% {\r\n\t\topacity: 0.26667;\r\n\t}\r\n\t83.33333% {\r\n\t\topacity: 1;\r\n\t}\r\n\t91.66667% {\r\n\t\topacity: 0.93333;\r\n\t}\r\n\t100% {\r\n\t\topacity: 0.86667;\r\n\t}\r\n}\r\n\r\n@-o-keyframes segment-opacity-10 {\r\n\t0% {\r\n\t\topacity: 0.86667;\r\n\t}\r\n\t8.33333% {\r\n\t\topacity: 0.8;\r\n\t}\r\n\t16.66667% {\r\n\t\topacity: 0.73333;\r\n\t}\r\n\t25% {\r\n\t\topacity: 0.66667;\r\n\t}\r\n\t33.33333% {\r\n\t\topacity: 0.6;\r\n\t}\r\n\t41.66667% {\r\n\t\topacity: 0.53333;\r\n\t}\r\n\t50% {\r\n\t\topacity: 0.46667;\r\n\t}\r\n\t58.33333% {\r\n\t\topacity: 0.4;\r\n\t}\r\n\t66.66667% {\r\n\t\topacity: 0.33333;\r\n\t}\r\n\t75% {\r\n\t\topacity: 0.26667;\r\n\t}\r\n\t83.33333% {\r\n\t\topacity: 1;\r\n\t}\r\n\t91.66667% {\r\n\t\topacity: 0.93333;\r\n\t}\r\n\t100% {\r\n\t\topacity: 0.86667;\r\n\t}\r\n}\r\n\r\n@-ms-keyframes segment-opacity-10 {\r\n\t0% {\r\n\t\topacity: 0.86667;\r\n\t}\r\n\t8.33333% {\r\n\t\topacity: 0.8;\r\n\t}\r\n\t16.66667% {\r\n\t\topacity: 0.73333;\r\n\t}\r\n\t25% {\r\n\t\topacity: 0.66667;\r\n\t}\r\n\t33.33333% {\r\n\t\topacity: 0.6;\r\n\t}\r\n\t41.66667% {\r\n\t\topacity: 0.53333;\r\n\t}\r\n\t50% {\r\n\t\topacity: 0.46667;\r\n\t}\r\n\t58.33333% {\r\n\t\topacity: 0.4;\r\n\t}\r\n\t66.66667% {\r\n\t\topacity: 0.33333;\r\n\t}\r\n\t75% {\r\n\t\topacity: 0.26667;\r\n\t}\r\n\t83.33333% {\r\n\t\topacity: 1;\r\n\t}\r\n\t91.66667% {\r\n\t\topacity: 0.93333;\r\n\t}\r\n\t100% {\r\n\t\topacity: 0.86667;\r\n\t}\r\n}\r\n\r\n@-webkit-keyframes segment-opacity-10 {\r\n\t0% {\r\n\t\topacity: 0.86667;\r\n\t}\r\n\t8.33333% {\r\n\t\topacity: 0.8;\r\n\t}\r\n\t16.66667% {\r\n\t\topacity: 0.73333;\r\n\t}\r\n\t25% {\r\n\t\topacity: 0.66667;\r\n\t}\r\n\t33.33333% {\r\n\t\topacity: 0.6;\r\n\t}\r\n\t41.66667% {\r\n\t\topacity: 0.53333;\r\n\t}\r\n\t50% {\r\n\t\topacity: 0.46667;\r\n\t}\r\n\t58.33333% {\r\n\t\topacity: 0.4;\r\n\t}\r\n\t66.66667% {\r\n\t\topacity: 0.33333;\r\n\t}\r\n\t75% {\r\n\t\topacity: 0.26667;\r\n\t}\r\n\t83.33333% {\r\n\t\topacity: 1;\r\n\t}\r\n\t91.66667% {\r\n\t\topacity: 0.93333;\r\n\t}\r\n\t100% {\r\n\t\topacity: 0.86667;\r\n\t}\r\n}\r\n\r\n@-moz-keyframes segment-opacity-10 {\r\n\t0% {\r\n\t\topacity: 0.86667;\r\n\t}\r\n\t8.33333% {\r\n\t\topacity: 0.8;\r\n\t}\r\n\t16.66667% {\r\n\t\topacity: 0.73333;\r\n\t}\r\n\t25% {\r\n\t\topacity: 0.66667;\r\n\t}\r\n\t33.33333% {\r\n\t\topacity: 0.6;\r\n\t}\r\n\t41.66667% {\r\n\t\topacity: 0.53333;\r\n\t}\r\n\t50% {\r\n\t\topacity: 0.46667;\r\n\t}\r\n\t58.33333% {\r\n\t\topacity: 0.4;\r\n\t}\r\n\t66.66667% {\r\n\t\topacity: 0.33333;\r\n\t}\r\n\t75% {\r\n\t\topacity: 0.26667;\r\n\t}\r\n\t83.33333% {\r\n\t\topacity: 1;\r\n\t}\r\n\t91.66667% {\r\n\t\topacity: 0.93333;\r\n\t}\r\n\t100% {\r\n\t\topacity: 0.86667;\r\n\t}\r\n}\r\n\r\n@keyframes segment-opacity-9 {\r\n\t0% {\r\n\t\topacity: 0.8;\r\n\t}\r\n\t8.33333% {\r\n\t\topacity: 0.73333;\r\n\t}\r\n\t16.66667% {\r\n\t\topacity: 0.66667;\r\n\t}\r\n\t25% {\r\n\t\topacity: 0.6;\r\n\t}\r\n\t33.33333% {\r\n\t\topacity: 0.53333;\r\n\t}\r\n\t41.66667% {\r\n\t\topacity: 0.46667;\r\n\t}\r\n\t50% {\r\n\t\topacity: 0.4;\r\n\t}\r\n\t58.33333% {\r\n\t\topacity: 0.33333;\r\n\t}\r\n\t66.66667% {\r\n\t\topacity: 0.26667;\r\n\t}\r\n\t75% {\r\n\t\topacity: 1;\r\n\t}\r\n\t83.33333% {\r\n\t\topacity: 0.933333;\r\n\t}\r\n\t91.66667% {\r\n\t\topacity: 0.86667;\r\n\t}\r\n\t100% {\r\n\t\topacity: 0.8;\r\n\t}\r\n}\r\n\r\n@-o-keyframes segment-opacity-9 {\r\n\t0% {\r\n\t\topacity: 0.8;\r\n\t}\r\n\t8.33333% {\r\n\t\topacity: 0.73333;\r\n\t}\r\n\t16.66667% {\r\n\t\topacity: 0.66667;\r\n\t}\r\n\t25% {\r\n\t\topacity: 0.6;\r\n\t}\r\n\t33.33333% {\r\n\t\topacity: 0.53333;\r\n\t}\r\n\t41.66667% {\r\n\t\topacity: 0.46667;\r\n\t}\r\n\t50% {\r\n\t\topacity: 0.4;\r\n\t}\r\n\t58.33333% {\r\n\t\topacity: 0.33333;\r\n\t}\r\n\t66.66667% {\r\n\t\topacity: 0.26667;\r\n\t}\r\n\t75% {\r\n\t\topacity: 1;\r\n\t}\r\n\t83.33333% {\r\n\t\topacity: 0.933333;\r\n\t}\r\n\t91.66667% {\r\n\t\topacity: 0.86667;\r\n\t}\r\n\t100% {\r\n\t\topacity: 0.8;\r\n\t}\r\n}\r\n\r\n@-ms-keyframes segment-opacity-9 {\r\n\t0% {\r\n\t\topacity: 0.8;\r\n\t}\r\n\t8.33333% {\r\n\t\topacity: 0.73333;\r\n\t}\r\n\t16.66667% {\r\n\t\topacity: 0.66667;\r\n\t}\r\n\t25% {\r\n\t\topacity: 0.6;\r\n\t}\r\n\t33.33333% {\r\n\t\topacity: 0.53333;\r\n\t}\r\n\t41.66667% {\r\n\t\topacity: 0.46667;\r\n\t}\r\n\t50% {\r\n\t\topacity: 0.4;\r\n\t}\r\n\t58.33333% {\r\n\t\topacity: 0.33333;\r\n\t}\r\n\t66.66667% {\r\n\t\topacity: 0.26667;\r\n\t}\r\n\t75% {\r\n\t\topacity: 1;\r\n\t}\r\n\t83.33333% {\r\n\t\topacity: 0.933333;\r\n\t}\r\n\t91.66667% {\r\n\t\topacity: 0.86667;\r\n\t}\r\n\t100% {\r\n\t\topacity: 0.8;\r\n\t}\r\n}\r\n\r\n@-webkit-keyframes segment-opacity-9 {\r\n\t0% {\r\n\t\topacity: 0.8;\r\n\t}\r\n\t8.33333% {\r\n\t\topacity: 0.73333;\r\n\t}\r\n\t16.66667% {\r\n\t\topacity: 0.66667;\r\n\t}\r\n\t25% {\r\n\t\topacity: 0.6;\r\n\t}\r\n\t33.33333% {\r\n\t\topacity: 0.53333;\r\n\t}\r\n\t41.66667% {\r\n\t\topacity: 0.46667;\r\n\t}\r\n\t50% {\r\n\t\topacity: 0.4;\r\n\t}\r\n\t58.33333% {\r\n\t\topacity: 0.33333;\r\n\t}\r\n\t66.66667% {\r\n\t\topacity: 0.26667;\r\n\t}\r\n\t75% {\r\n\t\topacity: 1;\r\n\t}\r\n\t83.33333% {\r\n\t\topacity: 0.933333;\r\n\t}\r\n\t91.66667% {\r\n\t\topacity: 0.86667;\r\n\t}\r\n\t100% {\r\n\t\topacity: 0.8;\r\n\t}\r\n}\r\n\r\n@-moz-keyframes segment-opacity-9 {\r\n\t0% {\r\n\t\topacity: 0.8;\r\n\t}\r\n\t8.33333% {\r\n\t\topacity: 0.73333;\r\n\t}\r\n\t16.66667% {\r\n\t\topacity: 0.66667;\r\n\t}\r\n\t25% {\r\n\t\topacity: 0.6;\r\n\t}\r\n\t33.33333% {\r\n\t\topacity: 0.53333;\r\n\t}\r\n\t41.66667% {\r\n\t\topacity: 0.46667;\r\n\t}\r\n\t50% {\r\n\t\topacity: 0.4;\r\n\t}\r\n\t58.33333% {\r\n\t\topacity: 0.33333;\r\n\t}\r\n\t66.66667% {\r\n\t\topacity: 0.26667;\r\n\t}\r\n\t75% {\r\n\t\topacity: 1;\r\n\t}\r\n\t83.33333% {\r\n\t\topacity: 0.933333;\r\n\t}\r\n\t91.66667% {\r\n\t\topacity: 0.86667;\r\n\t}\r\n\t100% {\r\n\t\topacity: 0.8;\r\n\t}\r\n}\r\n\r\n@keyframes segment-opacity-8 {\r\n\t0% {\r\n\t\topacity: 0.73333;\r\n\t}\r\n\t8.33333% {\r\n\t\topacity: 0.66667;\r\n\t}\r\n\t16.66667% {\r\n\t\topacity: 0.6;\r\n\t}\r\n\t25% {\r\n\t\topacity: 0.53333;\r\n\t}\r\n\t33.33333% {\r\n\t\topacity: 0.46667;\r\n\t}\r\n\t41.66667% {\r\n\t\topacity: 0.4;\r\n\t}\r\n\t50% {\r\n\t\topacity: 0.33333;\r\n\t}\r\n\t58.33333% {\r\n\t\topacity: 0.26667;\r\n\t}\r\n\t66.66667% {\r\n\t\topacity: 1;\r\n\t}\r\n\t75% {\r\n\t\topacity: 0.93333;\r\n\t}\r\n\t83.33333% {\r\n\t\topacity: 0.86667;\r\n\t}\r\n\t91.66667% {\r\n\t\topacity: 0.8;\r\n\t}\r\n\t100% {\r\n\t\topacity: 0.73333;\r\n\t}\r\n}\r\n\r\n@-o-keyframes segment-opacity-8 {\r\n\t0% {\r\n\t\topacity: 0.73333;\r\n\t}\r\n\t8.33333% {\r\n\t\topacity: 0.66667;\r\n\t}\r\n\t16.66667% {\r\n\t\topacity: 0.6;\r\n\t}\r\n\t25% {\r\n\t\topacity: 0.53333;\r\n\t}\r\n\t33.33333% {\r\n\t\topacity: 0.46667;\r\n\t}\r\n\t41.66667% {\r\n\t\topacity: 0.4;\r\n\t}\r\n\t50% {\r\n\t\topacity: 0.33333;\r\n\t}\r\n\t58.33333% {\r\n\t\topacity: 0.26667;\r\n\t}\r\n\t66.66667% {\r\n\t\topacity: 1;\r\n\t}\r\n\t75% {\r\n\t\topacity: 0.93333;\r\n\t}\r\n\t83.33333% {\r\n\t\topacity: 0.86667;\r\n\t}\r\n\t91.66667% {\r\n\t\topacity: 0.8;\r\n\t}\r\n\t100% {\r\n\t\topacity: 0.73333;\r\n\t}\r\n}\r\n\r\n@-ms-keyframes segment-opacity-8 {\r\n\t0% {\r\n\t\topacity: 0.73333;\r\n\t}\r\n\t8.33333% {\r\n\t\topacity: 0.66667;\r\n\t}\r\n\t16.66667% {\r\n\t\topacity: 0.6;\r\n\t}\r\n\t25% {\r\n\t\topacity: 0.53333;\r\n\t}\r\n\t33.33333% {\r\n\t\topacity: 0.46667;\r\n\t}\r\n\t41.66667% {\r\n\t\topacity: 0.4;\r\n\t}\r\n\t50% {\r\n\t\topacity: 0.33333;\r\n\t}\r\n\t58.33333% {\r\n\t\topacity: 0.26667;\r\n\t}\r\n\t66.66667% {\r\n\t\topacity: 1;\r\n\t}\r\n\t75% {\r\n\t\topacity: 0.93333;\r\n\t}\r\n\t83.33333% {\r\n\t\topacity: 0.86667;\r\n\t}\r\n\t91.66667% {\r\n\t\topacity: 0.8;\r\n\t}\r\n\t100% {\r\n\t\topacity: 0.73333;\r\n\t}\r\n}\r\n\r\n@-webkit-keyframes segment-opacity-8 {\r\n\t0% {\r\n\t\topacity: 0.73333;\r\n\t}\r\n\t8.33333% {\r\n\t\topacity: 0.66667;\r\n\t}\r\n\t16.66667% {\r\n\t\topacity: 0.6;\r\n\t}\r\n\t25% {\r\n\t\topacity: 0.53333;\r\n\t}\r\n\t33.33333% {\r\n\t\topacity: 0.46667;\r\n\t}\r\n\t41.66667% {\r\n\t\topacity: 0.4;\r\n\t}\r\n\t50% {\r\n\t\topacity: 0.33333;\r\n\t}\r\n\t58.33333% {\r\n\t\topacity: 0.26667;\r\n\t}\r\n\t66.66667% {\r\n\t\topacity: 1;\r\n\t}\r\n\t75% {\r\n\t\topacity: 0.93333;\r\n\t}\r\n\t83.33333% {\r\n\t\topacity: 0.86667;\r\n\t}\r\n\t91.66667% {\r\n\t\topacity: 0.8;\r\n\t}\r\n\t100% {\r\n\t\topacity: 0.73333;\r\n\t}\r\n}\r\n\r\n@-moz-keyframes segment-opacity-8 {\r\n\t0% {\r\n\t\topacity: 0.73333;\r\n\t}\r\n\t8.33333% {\r\n\t\topacity: 0.66667;\r\n\t}\r\n\t16.66667% {\r\n\t\topacity: 0.6;\r\n\t}\r\n\t25% {\r\n\t\topacity: 0.53333;\r\n\t}\r\n\t33.33333% {\r\n\t\topacity: 0.46667;\r\n\t}\r\n\t41.66667% {\r\n\t\topacity: 0.4;\r\n\t}\r\n\t50% {\r\n\t\topacity: 0.33333;\r\n\t}\r\n\t58.33333% {\r\n\t\topacity: 0.26667;\r\n\t}\r\n\t66.66667% {\r\n\t\topacity: 1;\r\n\t}\r\n\t75% {\r\n\t\topacity: 0.93333;\r\n\t}\r\n\t83.33333% {\r\n\t\topacity: 0.86667;\r\n\t}\r\n\t91.66667% {\r\n\t\topacity: 0.8;\r\n\t}\r\n\t100% {\r\n\t\topacity: 0.73333;\r\n\t}\r\n}\r\n\r\n@keyframes segment-opacity-7 {\r\n\t0% {\r\n\t\topacity: 0.66667;\r\n\t}\r\n\t8.33333% {\r\n\t\topacity: 0.6;\r\n\t}\r\n\t16.66667% {\r\n\t\topacity: 0.53333;\r\n\t}\r\n\t25% {\r\n\t\topacity: 0.46667;\r\n\t}\r\n\t33.33333% {\r\n\t\topacity: 0.4;\r\n\t}\r\n\t41.66667% {\r\n\t\topacity: 0.33333;\r\n\t}\r\n\t50% {\r\n\t\topacity: 0.26667;\r\n\t}\r\n\t58.33333% {\r\n\t\topacity: 1;\r\n\t}\r\n\t66.66667% {\r\n\t\topacity: 0.93333;\r\n\t}\r\n\t75% {\r\n\t\topacity: 0.86667;\r\n\t}\r\n\t83.33333% {\r\n\t\topacity: 0.8;\r\n\t}\r\n\t91.66667% {\r\n\t\topacity: 0.73333;\r\n\t}\r\n\t100% {\r\n\t\topacity: 0.66667;\r\n\t}\r\n}\r\n\r\n@-o-keyframes segment-opacity-7 {\r\n\t0% {\r\n\t\topacity: 0.66667;\r\n\t}\r\n\t8.33333% {\r\n\t\topacity: 0.6;\r\n\t}\r\n\t16.66667% {\r\n\t\topacity: 0.53333;\r\n\t}\r\n\t25% {\r\n\t\topacity: 0.46667;\r\n\t}\r\n\t33.33333% {\r\n\t\topacity: 0.4;\r\n\t}\r\n\t41.66667% {\r\n\t\topacity: 0.33333;\r\n\t}\r\n\t50% {\r\n\t\topacity: 0.26667;\r\n\t}\r\n\t58.33333% {\r\n\t\topacity: 1;\r\n\t}\r\n\t66.66667% {\r\n\t\topacity: 0.93333;\r\n\t}\r\n\t75% {\r\n\t\topacity: 0.86667;\r\n\t}\r\n\t83.33333% {\r\n\t\topacity: 0.8;\r\n\t}\r\n\t91.66667% {\r\n\t\topacity: 0.73333;\r\n\t}\r\n\t100% {\r\n\t\topacity: 0.66667;\r\n\t}\r\n}\r\n\r\n@-ms-keyframes segment-opacity-7 {\r\n\t0% {\r\n\t\topacity: 0.66667;\r\n\t}\r\n\t8.33333% {\r\n\t\topacity: 0.6;\r\n\t}\r\n\t16.66667% {\r\n\t\topacity: 0.53333;\r\n\t}\r\n\t25% {\r\n\t\topacity: 0.46667;\r\n\t}\r\n\t33.33333% {\r\n\t\topacity: 0.4;\r\n\t}\r\n\t41.66667% {\r\n\t\topacity: 0.33333;\r\n\t}\r\n\t50% {\r\n\t\topacity: 0.26667;\r\n\t}\r\n\t58.33333% {\r\n\t\topacity: 1;\r\n\t}\r\n\t66.66667% {\r\n\t\topacity: 0.93333;\r\n\t}\r\n\t75% {\r\n\t\topacity: 0.86667;\r\n\t}\r\n\t83.33333% {\r\n\t\topacity: 0.8;\r\n\t}\r\n\t91.66667% {\r\n\t\topacity: 0.73333;\r\n\t}\r\n\t100% {\r\n\t\topacity: 0.66667;\r\n\t}\r\n}\r\n\r\n@-webkit-keyframes segment-opacity-7 {\r\n\t0% {\r\n\t\topacity: 0.66667;\r\n\t}\r\n\t8.33333% {\r\n\t\topacity: 0.6;\r\n\t}\r\n\t16.66667% {\r\n\t\topacity: 0.53333;\r\n\t}\r\n\t25% {\r\n\t\topacity: 0.46667;\r\n\t}\r\n\t33.33333% {\r\n\t\topacity: 0.4;\r\n\t}\r\n\t41.66667% {\r\n\t\topacity: 0.33333;\r\n\t}\r\n\t50% {\r\n\t\topacity: 0.26667;\r\n\t}\r\n\t58.33333% {\r\n\t\topacity: 1;\r\n\t}\r\n\t66.66667% {\r\n\t\topacity: 0.93333;\r\n\t}\r\n\t75% {\r\n\t\topacity: 0.86667;\r\n\t}\r\n\t83.33333% {\r\n\t\topacity: 0.8;\r\n\t}\r\n\t91.66667% {\r\n\t\topacity: 0.73333;\r\n\t}\r\n\t100% {\r\n\t\topacity: 0.66667;\r\n\t}\r\n}\r\n\r\n@-moz-keyframes segment-opacity-7 {\r\n\t0% {\r\n\t\topacity: 0.66667;\r\n\t}\r\n\t8.33333% {\r\n\t\topacity: 0.6;\r\n\t}\r\n\t16.66667% {\r\n\t\topacity: 0.53333;\r\n\t}\r\n\t25% {\r\n\t\topacity: 0.46667;\r\n\t}\r\n\t33.33333% {\r\n\t\topacity: 0.4;\r\n\t}\r\n\t41.66667% {\r\n\t\topacity: 0.33333;\r\n\t}\r\n\t50% {\r\n\t\topacity: 0.26667;\r\n\t}\r\n\t58.33333% {\r\n\t\topacity: 1;\r\n\t}\r\n\t66.66667% {\r\n\t\topacity: 0.93333;\r\n\t}\r\n\t75% {\r\n\t\topacity: 0.86667;\r\n\t}\r\n\t83.33333% {\r\n\t\topacity: 0.8;\r\n\t}\r\n\t91.66667% {\r\n\t\topacity: 0.73333;\r\n\t}\r\n\t100% {\r\n\t\topacity: 0.66667;\r\n\t}\r\n}\r\n\r\n@keyframes segment-opacity-6 {\r\n\t0% {\r\n\t\topacity: 0.6;\r\n\t}\r\n\t8.33333% {\r\n\t\topacity: 0.53333;\r\n\t}\r\n\t16.66667% {\r\n\t\topacity: 0.46667;\r\n\t}\r\n\t25% {\r\n\t\topacity: 0.4;\r\n\t}\r\n\t33.33333% {\r\n\t\topacity: 0.33333;\r\n\t}\r\n\t41.66667% {\r\n\t\topacity: 0.26667;\r\n\t}\r\n\t50% {\r\n\t\topacity: 1;\r\n\t}\r\n\t58.33333% {\r\n\t\topacity: 0.93333;\r\n\t}\r\n\t66.66667% {\r\n\t\topacity: 0.86667;\r\n\t}\r\n\t75% {\r\n\t\topacity: 0.8;\r\n\t}\r\n\t83.33333% {\r\n\t\topacity: 0.73333;\r\n\t}\r\n\t91.66667% {\r\n\t\tacity: 0.66667;\r\n\t}\r\n\t100% {\r\n\t\topacity: 0.6;\r\n\t}\r\n}\r\n\r\n@-o-keyframes segment-opacity-6 {\r\n\t0% {\r\n\t\topacity: 0.6;\r\n\t}\r\n\t8.33333% {\r\n\t\topacity: 0.53333;\r\n\t}\r\n\t16.66667% {\r\n\t\topacity: 0.46667;\r\n\t}\r\n\t25% {\r\n\t\topacity: 0.4;\r\n\t}\r\n\t33.33333% {\r\n\t\topacity: 0.33333;\r\n\t}\r\n\t41.66667% {\r\n\t\topacity: 0.26667;\r\n\t}\r\n\t50% {\r\n\t\topacity: 1;\r\n\t}\r\n\t58.33333% {\r\n\t\topacity: 0.93333;\r\n\t}\r\n\t66.66667% {\r\n\t\topacity: 0.86667;\r\n\t}\r\n\t75% {\r\n\t\topacity: 0.8;\r\n\t}\r\n\t83.33333% {\r\n\t\topacity: 0.73333;\r\n\t}\r\n\t91.66667% {\r\n\t\tacity: 0.66667;\r\n\t}\r\n\t100% {\r\n\t\topacity: 0.6;\r\n\t}\r\n}\r\n\r\n@-ms-keyframes segment-opacity-6 {\r\n\t0% {\r\n\t\topacity: 0.6;\r\n\t}\r\n\t8.33333% {\r\n\t\topacity: 0.53333;\r\n\t}\r\n\t16.66667% {\r\n\t\topacity: 0.46667;\r\n\t}\r\n\t25% {\r\n\t\topacity: 0.4;\r\n\t}\r\n\t33.33333% {\r\n\t\topacity: 0.33333;\r\n\t}\r\n\t41.66667% {\r\n\t\topacity: 0.26667;\r\n\t}\r\n\t50% {\r\n\t\topacity: 1;\r\n\t}\r\n\t58.33333% {\r\n\t\topacity: 0.93333;\r\n\t}\r\n\t66.66667% {\r\n\t\topacity: 0.86667;\r\n\t}\r\n\t75% {\r\n\t\topacity: 0.8;\r\n\t}\r\n\t83.33333% {\r\n\t\topacity: 0.73333;\r\n\t}\r\n\t91.66667% {\r\n\t\tacity: 0.66667;\r\n\t}\r\n\t100% {\r\n\t\topacity: 0.6;\r\n\t}\r\n}\r\n\r\n@-webkit-keyframes segment-opacity-6 {\r\n\t0% {\r\n\t\topacity: 0.6;\r\n\t}\r\n\t8.33333% {\r\n\t\topacity: 0.53333;\r\n\t}\r\n\t16.66667% {\r\n\t\topacity: 0.46667;\r\n\t}\r\n\t25% {\r\n\t\topacity: 0.4;\r\n\t}\r\n\t33.33333% {\r\n\t\topacity: 0.33333;\r\n\t}\r\n\t41.66667% {\r\n\t\topacity: 0.26667;\r\n\t}\r\n\t50% {\r\n\t\topacity: 1;\r\n\t}\r\n\t58.33333% {\r\n\t\topacity: 0.93333;\r\n\t}\r\n\t66.66667% {\r\n\t\topacity: 0.86667;\r\n\t}\r\n\t75% {\r\n\t\topacity: 0.8;\r\n\t}\r\n\t83.33333% {\r\n\t\topacity: 0.73333;\r\n\t}\r\n\t91.66667% {\r\n\t\tacity: 0.66667;\r\n\t}\r\n\t100% {\r\n\t\topacity: 0.6;\r\n\t}\r\n}\r\n\r\n@-moz-keyframes segment-opacity-6 {\r\n\t0% {\r\n\t\topacity: 0.6;\r\n\t}\r\n\t8.33333% {\r\n\t\topacity: 0.53333;\r\n\t}\r\n\t16.66667% {\r\n\t\topacity: 0.46667;\r\n\t}\r\n\t25% {\r\n\t\topacity: 0.4;\r\n\t}\r\n\t33.33333% {\r\n\t\topacity: 0.33333;\r\n\t}\r\n\t41.66667% {\r\n\t\topacity: 0.26667;\r\n\t}\r\n\t50% {\r\n\t\topacity: 1;\r\n\t}\r\n\t58.33333% {\r\n\t\topacity: 0.93333;\r\n\t}\r\n\t66.66667% {\r\n\t\topacity: 0.86667;\r\n\t}\r\n\t75% {\r\n\t\topacity: 0.8;\r\n\t}\r\n\t83.33333% {\r\n\t\topacity: 0.73333;\r\n\t}\r\n\t91.66667% {\r\n\t\tacity: 0.66667;\r\n\t}\r\n\t100% {\r\n\t\topacity: 0.6;\r\n\t}\r\n}\r\n\r\n@keyframes segment-opacity-5 {\r\n\t0% {\r\n\t\topacity: 0.53333;\r\n\t}\r\n\t8.33333% {\r\n\t\topacity: 0.46667;\r\n\t}\r\n\t16.66667% {\r\n\t\topacity: 0.4;\r\n\t}\r\n\t25% {\r\n\t\topacity: 0.33333;\r\n\t}\r\n\t33.33333% {\r\n\t\topacity: 0.26667;\r\n\t}\r\n\t41.66667% {\r\n\t\topacity: 1;\r\n\t}\r\n\t50% {\r\n\t\topacity: 0.93333;\r\n\t}\r\n\t58.33333% {\r\n\t\topacity: 0.86667;\r\n\t}\r\n\t66.66667% {\r\n\t\topacity: 0.8;\r\n\t}\r\n\t75% {\r\n\t\topacity: 0.73333;\r\n\t}\r\n\t83.33333% {\r\n\t\topacity: 0.66667;\r\n\t}\r\n\t91.66667% {\r\n\t\topacity: 0.6;\r\n\t}\r\n\t100% {\r\n\t\topacity: 0.53333;\r\n\t}\r\n}\r\n\r\n@-o-keyframes segment-opacity-5 {\r\n\t0% {\r\n\t\topacity: 0.53333;\r\n\t}\r\n\t8.33333% {\r\n\t\topacity: 0.46667;\r\n\t}\r\n\t16.66667% {\r\n\t\topacity: 0.4;\r\n\t}\r\n\t25% {\r\n\t\topacity: 0.33333;\r\n\t}\r\n\t33.33333% {\r\n\t\topacity: 0.26667;\r\n\t}\r\n\t41.66667% {\r\n\t\topacity: 1;\r\n\t}\r\n\t50% {\r\n\t\topacity: 0.93333;\r\n\t}\r\n\t58.33333% {\r\n\t\topacity: 0.86667;\r\n\t}\r\n\t66.66667% {\r\n\t\topacity: 0.8;\r\n\t}\r\n\t75% {\r\n\t\topacity: 0.73333;\r\n\t}\r\n\t83.33333% {\r\n\t\topacity: 0.66667;\r\n\t}\r\n\t91.66667% {\r\n\t\topacity: 0.6;\r\n\t}\r\n\t100% {\r\n\t\topacity: 0.53333;\r\n\t}\r\n}\r\n\r\n@-ms-keyframes segment-opacity-5 {\r\n\t0% {\r\n\t\topacity: 0.53333;\r\n\t}\r\n\t8.33333% {\r\n\t\topacity: 0.46667;\r\n\t}\r\n\t16.66667% {\r\n\t\topacity: 0.4;\r\n\t}\r\n\t25% {\r\n\t\topacity: 0.33333;\r\n\t}\r\n\t33.33333% {\r\n\t\topacity: 0.26667;\r\n\t}\r\n\t41.66667% {\r\n\t\topacity: 1;\r\n\t}\r\n\t50% {\r\n\t\topacity: 0.93333;\r\n\t}\r\n\t58.33333% {\r\n\t\topacity: 0.86667;\r\n\t}\r\n\t66.66667% {\r\n\t\topacity: 0.8;\r\n\t}\r\n\t75% {\r\n\t\topacity: 0.73333;\r\n\t}\r\n\t83.33333% {\r\n\t\topacity: 0.66667;\r\n\t}\r\n\t91.66667% {\r\n\t\topacity: 0.6;\r\n\t}\r\n\t100% {\r\n\t\topacity: 0.53333;\r\n\t}\r\n}\r\n\r\n@-webkit-keyframes segment-opacity-5 {\r\n\t0% {\r\n\t\topacity: 0.53333;\r\n\t}\r\n\t8.33333% {\r\n\t\topacity: 0.46667;\r\n\t}\r\n\t16.66667% {\r\n\t\topacity: 0.4;\r\n\t}\r\n\t25% {\r\n\t\topacity: 0.33333;\r\n\t}\r\n\t33.33333% {\r\n\t\topacity: 0.26667;\r\n\t}\r\n\t41.66667% {\r\n\t\topacity: 1;\r\n\t}\r\n\t50% {\r\n\t\topacity: 0.93333;\r\n\t}\r\n\t58.33333% {\r\n\t\topacity: 0.86667;\r\n\t}\r\n\t66.66667% {\r\n\t\topacity: 0.8;\r\n\t}\r\n\t75% {\r\n\t\topacity: 0.73333;\r\n\t}\r\n\t83.33333% {\r\n\t\topacity: 0.66667;\r\n\t}\r\n\t91.66667% {\r\n\t\topacity: 0.6;\r\n\t}\r\n\t100% {\r\n\t\topacity: 0.53333;\r\n\t}\r\n}\r\n\r\n@-moz-keyframes segment-opacity-5 {\r\n\t0% {\r\n\t\topacity: 0.53333;\r\n\t}\r\n\t8.33333% {\r\n\t\topacity: 0.46667;\r\n\t}\r\n\t16.66667% {\r\n\t\topacity: 0.4;\r\n\t}\r\n\t25% {\r\n\t\topacity: 0.33333;\r\n\t}\r\n\t33.33333% {\r\n\t\topacity: 0.26667;\r\n\t}\r\n\t41.66667% {\r\n\t\topacity: 1;\r\n\t}\r\n\t50% {\r\n\t\topacity: 0.93333;\r\n\t}\r\n\t58.33333% {\r\n\t\topacity: 0.86667;\r\n\t}\r\n\t66.66667% {\r\n\t\topacity: 0.8;\r\n\t}\r\n\t75% {\r\n\t\topacity: 0.73333;\r\n\t}\r\n\t83.33333% {\r\n\t\topacity: 0.66667;\r\n\t}\r\n\t91.66667% {\r\n\t\topacity: 0.6;\r\n\t}\r\n\t100% {\r\n\t\topacity: 0.53333;\r\n\t}\r\n}\r\n\r\n@keyframes segment-opacity-4 {\r\n\t0% {\r\n\t\topacity: 0.46667;\r\n\t}\r\n\t8.33333% {\r\n\t\topacity: 0.4;\r\n\t}\r\n\t16.66667% {\r\n\t\topacity: 0.33333;\r\n\t}\r\n\t25% {\r\n\t\topacity: 0.26667;\r\n\t}\r\n\t33.33333% {\r\n\t\topacity: 1;\r\n\t}\r\n\t41.66667% {\r\n\t\topacity: 0.93333;\r\n\t}\r\n\t50% {\r\n\t\topacity: 0.86667;\r\n\t}\r\n\t58.33333% {\r\n\t\topacity: 0.8;\r\n\t}\r\n\t66.66667% {\r\n\t\topacity: 0.73333;\r\n\t}\r\n\t75% {\r\n\t\topacity: 0.66667;\r\n\t}\r\n\t83.33333% {\r\n\t\topacity: 0.6;\r\n\t}\r\n\t91.66667% {\r\n\t\topacity: 0.53333;\r\n\t}\r\n\t100% {\r\n\t\topacity: 0.46667;\r\n\t}\r\n}\r\n\r\n@-o-keyframes segment-opacity-4 {\r\n\t0% {\r\n\t\topacity: 0.46667;\r\n\t}\r\n\t8.33333% {\r\n\t\topacity: 0.4;\r\n\t}\r\n\t16.66667% {\r\n\t\topacity: 0.33333;\r\n\t}\r\n\t25% {\r\n\t\topacity: 0.26667;\r\n\t}\r\n\t33.33333% {\r\n\t\topacity: 1;\r\n\t}\r\n\t41.66667% {\r\n\t\topacity: 0.93333;\r\n\t}\r\n\t50% {\r\n\t\topacity: 0.86667;\r\n\t}\r\n\t58.33333% {\r\n\t\topacity: 0.8;\r\n\t}\r\n\t66.66667% {\r\n\t\topacity: 0.73333;\r\n\t}\r\n\t75% {\r\n\t\topacity: 0.66667;\r\n\t}\r\n\t83.33333% {\r\n\t\topacity: 0.6;\r\n\t}\r\n\t91.66667% {\r\n\t\topacity: 0.53333;\r\n\t}\r\n\t100% {\r\n\t\topacity: 0.46667;\r\n\t}\r\n}\r\n\r\n@-ms-keyframes segment-opacity-4 {\r\n\t0% {\r\n\t\topacity: 0.46667;\r\n\t}\r\n\t8.33333% {\r\n\t\topacity: 0.4;\r\n\t}\r\n\t16.66667% {\r\n\t\topacity: 0.33333;\r\n\t}\r\n\t25% {\r\n\t\topacity: 0.26667;\r\n\t}\r\n\t33.33333% {\r\n\t\topacity: 1;\r\n\t}\r\n\t41.66667% {\r\n\t\topacity: 0.93333;\r\n\t}\r\n\t50% {\r\n\t\topacity: 0.86667;\r\n\t}\r\n\t58.33333% {\r\n\t\topacity: 0.8;\r\n\t}\r\n\t66.66667% {\r\n\t\topacity: 0.73333;\r\n\t}\r\n\t75% {\r\n\t\topacity: 0.66667;\r\n\t}\r\n\t83.33333% {\r\n\t\topacity: 0.6;\r\n\t}\r\n\t91.66667% {\r\n\t\topacity: 0.53333;\r\n\t}\r\n\t100% {\r\n\t\topacity: 0.46667;\r\n\t}\r\n}\r\n\r\n@-webkit-keyframes segment-opacity-4 {\r\n\t0% {\r\n\t\topacity: 0.46667;\r\n\t}\r\n\t8.33333% {\r\n\t\topacity: 0.4;\r\n\t}\r\n\t16.66667% {\r\n\t\topacity: 0.33333;\r\n\t}\r\n\t25% {\r\n\t\topacity: 0.26667;\r\n\t}\r\n\t33.33333% {\r\n\t\topacity: 1;\r\n\t}\r\n\t41.66667% {\r\n\t\topacity: 0.93333;\r\n\t}\r\n\t50% {\r\n\t\topacity: 0.86667;\r\n\t}\r\n\t58.33333% {\r\n\t\topacity: 0.8;\r\n\t}\r\n\t66.66667% {\r\n\t\topacity: 0.73333;\r\n\t}\r\n\t75% {\r\n\t\topacity: 0.66667;\r\n\t}\r\n\t83.33333% {\r\n\t\topacity: 0.6;\r\n\t}\r\n\t91.66667% {\r\n\t\topacity: 0.53333;\r\n\t}\r\n\t100% {\r\n\t\topacity: 0.46667;\r\n\t}\r\n}\r\n\r\n@-moz-keyframes segment-opacity-4 {\r\n\t0% {\r\n\t\topacity: 0.46667;\r\n\t}\r\n\t8.33333% {\r\n\t\topacity: 0.4;\r\n\t}\r\n\t16.66667% {\r\n\t\topacity: 0.33333;\r\n\t}\r\n\t25% {\r\n\t\topacity: 0.26667;\r\n\t}\r\n\t33.33333% {\r\n\t\topacity: 1;\r\n\t}\r\n\t41.66667% {\r\n\t\topacity: 0.93333;\r\n\t}\r\n\t50% {\r\n\t\topacity: 0.86667;\r\n\t}\r\n\t58.33333% {\r\n\t\topacity: 0.8;\r\n\t}\r\n\t66.66667% {\r\n\t\topacity: 0.73333;\r\n\t}\r\n\t75% {\r\n\t\topacity: 0.66667;\r\n\t}\r\n\t83.33333% {\r\n\t\topacity: 0.6;\r\n\t}\r\n\t91.66667% {\r\n\t\topacity: 0.53333;\r\n\t}\r\n\t100% {\r\n\t\topacity: 0.46667;\r\n\t}\r\n}\r\n\r\n@keyframes segment-opacity-3 {\r\n\t0% {\r\n\t\topacity: 0.4;\r\n\t}\r\n\t8.33333% {\r\n\t\topacity: 0.33333;\r\n\t}\r\n\t16.66667% {\r\n\t\topacity: 0.26667;\r\n\t}\r\n\t25% {\r\n\t\topacity: 1;\r\n\t}\r\n\t33.33333% {\r\n\t\topacity: 0.93333;\r\n\t}\r\n\t41.66667% {\r\n\t\topacity: 0.86667;\r\n\t}\r\n\t50% {\r\n\t\topacity: 0.8;\r\n\t}\r\n\t58.33333% {\r\n\t\topacity: 0.73333;\r\n\t}\r\n\t66.66667% {\r\n\t\topacity: 0.66667;\r\n\t}\r\n\t75% {\r\n\t\topacity: 0.6;\r\n\t}\r\n\t83.33333% {\r\n\t\topacity: 0.53333;\r\n\t}\r\n\t91.66667% {\r\n\t\topacity: 0.46667;\r\n\t}\r\n\t100% {\r\n\t\topacity: 0.4;\r\n\t}\r\n}\r\n\r\n@-o-keyframes segment-opacity-3 {\r\n\t0% {\r\n\t\topacity: 0.4;\r\n\t}\r\n\t8.33333% {\r\n\t\topacity: 0.33333;\r\n\t}\r\n\t16.66667% {\r\n\t\topacity: 0.26667;\r\n\t}\r\n\t25% {\r\n\t\topacity: 1;\r\n\t}\r\n\t33.33333% {\r\n\t\topacity: 0.93333;\r\n\t}\r\n\t41.66667% {\r\n\t\topacity: 0.86667;\r\n\t}\r\n\t50% {\r\n\t\topacity: 0.8;\r\n\t}\r\n\t58.33333% {\r\n\t\topacity: 0.73333;\r\n\t}\r\n\t66.66667% {\r\n\t\topacity: 0.66667;\r\n\t}\r\n\t75% {\r\n\t\topacity: 0.6;\r\n\t}\r\n\t83.33333% {\r\n\t\topacity: 0.53333;\r\n\t}\r\n\t91.66667% {\r\n\t\topacity: 0.46667;\r\n\t}\r\n\t100% {\r\n\t\topacity: 0.4;\r\n\t}\r\n}\r\n\r\n@-ms-keyframes segment-opacity-3 {\r\n\t0% {\r\n\t\topacity: 0.4;\r\n\t}\r\n\t8.33333% {\r\n\t\topacity: 0.33333;\r\n\t}\r\n\t16.66667% {\r\n\t\topacity: 0.26667;\r\n\t}\r\n\t25% {\r\n\t\topacity: 1;\r\n\t}\r\n\t33.33333% {\r\n\t\topacity: 0.93333;\r\n\t}\r\n\t41.66667% {\r\n\t\topacity: 0.86667;\r\n\t}\r\n\t50% {\r\n\t\topacity: 0.8;\r\n\t}\r\n\t58.33333% {\r\n\t\topacity: 0.73333;\r\n\t}\r\n\t66.66667% {\r\n\t\topacity: 0.66667;\r\n\t}\r\n\t75% {\r\n\t\topacity: 0.6;\r\n\t}\r\n\t83.33333% {\r\n\t\topacity: 0.53333;\r\n\t}\r\n\t91.66667% {\r\n\t\topacity: 0.46667;\r\n\t}\r\n\t100% {\r\n\t\topacity: 0.4;\r\n\t}\r\n}\r\n\r\n@-webkit-keyframes segment-opacity-3 {\r\n\t0% {\r\n\t\topacity: 0.4;\r\n\t}\r\n\t8.33333% {\r\n\t\topacity: 0.33333;\r\n\t}\r\n\t16.66667% {\r\n\t\topacity: 0.26667;\r\n\t}\r\n\t25% {\r\n\t\topacity: 1;\r\n\t}\r\n\t33.33333% {\r\n\t\topacity: 0.93333;\r\n\t}\r\n\t41.66667% {\r\n\t\topacity: 0.86667;\r\n\t}\r\n\t50% {\r\n\t\topacity: 0.8;\r\n\t}\r\n\t58.33333% {\r\n\t\topacity: 0.73333;\r\n\t}\r\n\t66.66667% {\r\n\t\topacity: 0.66667;\r\n\t}\r\n\t75% {\r\n\t\topacity: 0.6;\r\n\t}\r\n\t83.33333% {\r\n\t\topacity: 0.53333;\r\n\t}\r\n\t91.66667% {\r\n\t\topacity: 0.46667;\r\n\t}\r\n\t100% {\r\n\t\topacity: 0.4;\r\n\t}\r\n}\r\n\r\n@-moz-keyframes segment-opacity-3 {\r\n\t0% {\r\n\t\topacity: 0.4;\r\n\t}\r\n\t8.33333% {\r\n\t\topacity: 0.33333;\r\n\t}\r\n\t16.66667% {\r\n\t\topacity: 0.26667;\r\n\t}\r\n\t25% {\r\n\t\topacity: 1;\r\n\t}\r\n\t33.33333% {\r\n\t\topacity: 0.93333;\r\n\t}\r\n\t41.66667% {\r\n\t\topacity: 0.86667;\r\n\t}\r\n\t50% {\r\n\t\topacity: 0.8;\r\n\t}\r\n\t58.33333% {\r\n\t\topacity: 0.73333;\r\n\t}\r\n\t66.66667% {\r\n\t\topacity: 0.66667;\r\n\t}\r\n\t75% {\r\n\t\topacity: 0.6;\r\n\t}\r\n\t83.33333% {\r\n\t\topacity: 0.53333;\r\n\t}\r\n\t91.66667% {\r\n\t\topacity: 0.46667;\r\n\t}\r\n\t100% {\r\n\t\topacity: 0.4;\r\n\t}\r\n}\r\n\r\n@keyframes segment-opacity-2 {\r\n\t0% {\r\n\t\topacity: 0.33333;\r\n\t}\r\n\t8.33333% {\r\n\t\topacity: 0.26667;\r\n\t}\r\n\t16.66667% {\r\n\t\topacity: 1;\r\n\t}\r\n\t25% {\r\n\t\topacity: 0.93333;\r\n\t}\r\n\t33.33333% {\r\n\t\topacity: 0.86667;\r\n\t}\r\n\t41.66667% {\r\n\t\topacity: 0.8;\r\n\t}\r\n\t50% {\r\n\t\topacity: 0.73333;\r\n\t}\r\n\t58.33333% {\r\n\t\topacity: 0.66667;\r\n\t}\r\n\t66.66667% {\r\n\t\topacity: 0.6;\r\n\t}\r\n\t75% {\r\n\t\topacity: 0.53333;\r\n\t}\r\n\t83.33333% {\r\n\t\topacity: 0.46667;\r\n\t}\r\n\t91.66667% {\r\n\t\topacity: 0.4;\r\n\t}\r\n\t100% {\r\n\t\topacity: 0.33333;\r\n\t}\r\n}\r\n\r\n@-o-keyframes segment-opacity-2 {\r\n\t0% {\r\n\t\topacity: 0.33333;\r\n\t}\r\n\t8.33333% {\r\n\t\topacity: 0.26667;\r\n\t}\r\n\t16.66667% {\r\n\t\topacity: 1;\r\n\t}\r\n\t25% {\r\n\t\topacity: 0.93333;\r\n\t}\r\n\t33.33333% {\r\n\t\topacity: 0.86667;\r\n\t}\r\n\t41.66667% {\r\n\t\topacity: 0.8;\r\n\t}\r\n\t50% {\r\n\t\topacity: 0.73333;\r\n\t}\r\n\t58.33333% {\r\n\t\topacity: 0.66667;\r\n\t}\r\n\t66.66667% {\r\n\t\topacity: 0.6;\r\n\t}\r\n\t75% {\r\n\t\topacity: 0.53333;\r\n\t}\r\n\t83.33333% {\r\n\t\topacity: 0.46667;\r\n\t}\r\n\t91.66667% {\r\n\t\topacity: 0.4;\r\n\t}\r\n\t100% {\r\n\t\topacity: 0.33333;\r\n\t}\r\n}\r\n\r\n@-ms-keyframes segment-opacity-2 {\r\n\t0% {\r\n\t\topacity: 0.33333;\r\n\t}\r\n\t8.33333% {\r\n\t\topacity: 0.26667;\r\n\t}\r\n\t16.66667% {\r\n\t\topacity: 1;\r\n\t}\r\n\t25% {\r\n\t\topacity: 0.93333;\r\n\t}\r\n\t33.33333% {\r\n\t\topacity: 0.86667;\r\n\t}\r\n\t41.66667% {\r\n\t\topacity: 0.8;\r\n\t}\r\n\t50% {\r\n\t\topacity: 0.73333;\r\n\t}\r\n\t58.33333% {\r\n\t\topacity: 0.66667;\r\n\t}\r\n\t66.66667% {\r\n\t\topacity: 0.6;\r\n\t}\r\n\t75% {\r\n\t\topacity: 0.53333;\r\n\t}\r\n\t83.33333% {\r\n\t\topacity: 0.46667;\r\n\t}\r\n\t91.66667% {\r\n\t\topacity: 0.4;\r\n\t}\r\n\t100% {\r\n\t\topacity: 0.33333;\r\n\t}\r\n}\r\n\r\n@-webkit-keyframes segment-opacity-2 {\r\n\t0% {\r\n\t\topacity: 0.33333;\r\n\t}\r\n\t8.33333% {\r\n\t\topacity: 0.26667;\r\n\t}\r\n\t16.66667% {\r\n\t\topacity: 1;\r\n\t}\r\n\t25% {\r\n\t\topacity: 0.93333;\r\n\t}\r\n\t33.33333% {\r\n\t\topacity: 0.86667;\r\n\t}\r\n\t41.66667% {\r\n\t\topacity: 0.8;\r\n\t}\r\n\t50% {\r\n\t\topacity: 0.73333;\r\n\t}\r\n\t58.33333% {\r\n\t\topacity: 0.66667;\r\n\t}\r\n\t66.66667% {\r\n\t\topacity: 0.6;\r\n\t}\r\n\t75% {\r\n\t\topacity: 0.53333;\r\n\t}\r\n\t83.33333% {\r\n\t\topacity: 0.46667;\r\n\t}\r\n\t91.66667% {\r\n\t\topacity: 0.4;\r\n\t}\r\n\t100% {\r\n\t\topacity: 0.33333;\r\n\t}\r\n}\r\n\r\n@-moz-keyframes segment-opacity-2 {\r\n\t0% {\r\n\t\topacity: 0.33333;\r\n\t}\r\n\t8.33333% {\r\n\t\topacity: 0.26667;\r\n\t}\r\n\t16.66667% {\r\n\t\topacity: 1;\r\n\t}\r\n\t25% {\r\n\t\topacity: 0.93333;\r\n\t}\r\n\t33.33333% {\r\n\t\topacity: 0.86667;\r\n\t}\r\n\t41.66667% {\r\n\t\topacity: 0.8;\r\n\t}\r\n\t50% {\r\n\t\topacity: 0.73333;\r\n\t}\r\n\t58.33333% {\r\n\t\topacity: 0.66667;\r\n\t}\r\n\t66.66667% {\r\n\t\topacity: 0.6;\r\n\t}\r\n\t75% {\r\n\t\topacity: 0.53333;\r\n\t}\r\n\t83.33333% {\r\n\t\topacity: 0.46667;\r\n\t}\r\n\t91.66667% {\r\n\t\topacity: 0.4;\r\n\t}\r\n\t100% {\r\n\t\topacity: 0.33333;\r\n\t}\r\n}\r\n\r\n@keyframes segment-opacity-1 {\r\n\t0% {\r\n\t\topacity: 0.26667;\r\n\t}\r\n\t8.33333% {\r\n\t\topacity: 1;\r\n\t}\r\n\t16.66667% {\r\n\t\topacity: 0.93333;\r\n\t}\r\n\t25% {\r\n\t\topacity: 0.86667;\r\n\t}\r\n\t33.33333% {\r\n\t\topacity: 0.8;\r\n\t}\r\n\t41.66667% {\r\n\t\topacity: 0.73333;\r\n\t}\r\n\t50% {\r\n\t\topacity: 0.66667;\r\n\t}\r\n\t58.33333% {\r\n\t\topacity: 0.6;\r\n\t}\r\n\t66.66667% {\r\n\t\topacity: 0.53333;\r\n\t}\r\n\t75% {\r\n\t\topacity: 0.46667;\r\n\t}\r\n\t83.33333% {\r\n\t\topacity: 0.4;\r\n\t}\r\n\t91.66667% {\r\n\t\topacity: 0.33333;\r\n\t}\r\n\t100% {\r\n\t\topacity: 0.26667;\r\n\t}\r\n}\r\n\r\n@-o-keyframes segment-opacity-1 {\r\n\t0% {\r\n\t\topacity: 0.26667;\r\n\t}\r\n\t8.33333% {\r\n\t\topacity: 1;\r\n\t}\r\n\t16.66667% {\r\n\t\topacity: 0.93333;\r\n\t}\r\n\t25% {\r\n\t\topacity: 0.86667;\r\n\t}\r\n\t33.33333% {\r\n\t\topacity: 0.8;\r\n\t}\r\n\t41.66667% {\r\n\t\topacity: 0.73333;\r\n\t}\r\n\t50% {\r\n\t\topacity: 0.66667;\r\n\t}\r\n\t58.33333% {\r\n\t\topacity: 0.6;\r\n\t}\r\n\t66.66667% {\r\n\t\topacity: 0.53333;\r\n\t}\r\n\t75% {\r\n\t\topacity: 0.46667;\r\n\t}\r\n\t83.33333% {\r\n\t\topacity: 0.4;\r\n\t}\r\n\t91.66667% {\r\n\t\topacity: 0.33333;\r\n\t}\r\n\t100% {\r\n\t\topacity: 0.26667;\r\n\t}\r\n}\r\n\r\n@-ms-keyframes segment-opacity-1 {\r\n\t0% {\r\n\t\topacity: 0.26667;\r\n\t}\r\n\t8.33333% {\r\n\t\topacity: 1;\r\n\t}\r\n\t16.66667% {\r\n\t\topacity: 0.93333;\r\n\t}\r\n\t25% {\r\n\t\topacity: 0.86667;\r\n\t}\r\n\t33.33333% {\r\n\t\topacity: 0.8;\r\n\t}\r\n\t41.66667% {\r\n\t\topacity: 0.73333;\r\n\t}\r\n\t50% {\r\n\t\topacity: 0.66667;\r\n\t}\r\n\t58.33333% {\r\n\t\topacity: 0.6;\r\n\t}\r\n\t66.66667% {\r\n\t\topacity: 0.53333;\r\n\t}\r\n\t75% {\r\n\t\topacity: 0.46667;\r\n\t}\r\n\t83.33333% {\r\n\t\topacity: 0.4;\r\n\t}\r\n\t91.66667% {\r\n\t\topacity: 0.33333;\r\n\t}\r\n\t100% {\r\n\t\topacity: 0.26667;\r\n\t}\r\n}\r\n\r\n@-webkit-keyframes segment-opacity-1 {\r\n\t0% {\r\n\t\topacity: 0.26667;\r\n\t}\r\n\t8.33333% {\r\n\t\topacity: 1;\r\n\t}\r\n\t16.66667% {\r\n\t\topacity: 0.93333;\r\n\t}\r\n\t25% {\r\n\t\topacity: 0.86667;\r\n\t}\r\n\t33.33333% {\r\n\t\topacity: 0.8;\r\n\t}\r\n\t41.66667% {\r\n\t\topacity: 0.73333;\r\n\t}\r\n\t50% {\r\n\t\topacity: 0.66667;\r\n\t}\r\n\t58.33333% {\r\n\t\topacity: 0.6;\r\n\t}\r\n\t66.66667% {\r\n\t\topacity: 0.53333;\r\n\t}\r\n\t75% {\r\n\t\topacity: 0.46667;\r\n\t}\r\n\t83.33333% {\r\n\t\topacity: 0.4;\r\n\t}\r\n\t91.66667% {\r\n\t\topacity: 0.33333;\r\n\t}\r\n\t100% {\r\n\t\topacity: 0.26667;\r\n\t}\r\n}\r\n\r\n@-moz-keyframes segment-opacity-1 {\r\n\t0% {\r\n\t\topacity: 0.26667;\r\n\t}\r\n\t8.33333% {\r\n\t\topacity: 1;\r\n\t}\r\n\t16.66667% {\r\n\t\topacity: 0.93333;\r\n\t}\r\n\t25% {\r\n\t\topacity: 0.86667;\r\n\t}\r\n\t33.33333% {\r\n\t\topacity: 0.8;\r\n\t}\r\n\t41.66667% {\r\n\t\topacity: 0.73333;\r\n\t}\r\n\t50% {\r\n\t\topacity: 0.66667;\r\n\t}\r\n\t58.33333% {\r\n\t\topacity: 0.6;\r\n\t}\r\n\t66.66667% {\r\n\t\topacity: 0.53333;\r\n\t}\r\n\t75% {\r\n\t\topacity: 0.46667;\r\n\t}\r\n\t83.33333% {\r\n\t\topacity: 0.4;\r\n\t}\r\n\t91.66667% {\r\n\t\topacity: 0.33333;\r\n\t}\r\n\t100% {\r\n\t\topacity: 0.26667;\r\n\t}\r\n}\r\n"; });
define('text!components/loading.html', ['module'], function(module) { module.exports = "<template><div class=\"kart-loader\"><div class=\"sheath\"><div class=\"segment\"></div></div><div class=\"sheath\"><div class=\"segment\"></div></div><div class=\"sheath\"><div class=\"segment\"></div></div><div class=\"sheath\"><div class=\"segment\"></div></div><div class=\"sheath\"><div class=\"segment\"></div></div><div class=\"sheath\"><div class=\"segment\"></div></div><div class=\"sheath\"><div class=\"segment\"></div></div><div class=\"sheath\"><div class=\"segment\"></div></div><div class=\"sheath\"><div class=\"segment\"></div></div><div class=\"sheath\"><div class=\"segment\"></div></div><div class=\"sheath\"><div class=\"segment\"></div></div><div class=\"sheath\"><div class=\"segment\"></div></div></div></template>"; });
define('text!styles/login.css', ['module'], function(module) { module.exports = ""; });
define('text!components/menu-lateral.html', ['module'], function(module) { module.exports = "<template><ul class=\"nav flex-column\"><li class=\"nav-item drop\"><a class=\"nav-link active\" href=\"#/home\">Home</a></li><li class=\"nav-item drop\"><a class=\"nav-link active\" href=\"#/listCrianca\">Criança</a></li></ul></template>"; });
define('text!styles/menu-lateral.css', ['module'], function(module) { module.exports = ".menu-lateral li a{\r\n  margin-left: 15px;\r\n}\r\n\r\n.menu-lateral li:hover{\r\n  background-color: #6495ED;\r\n  width: 100%;\r\n}\r\n.menu-lateral li a:hover{\r\n  color: #FFFFFF;\r\n}\r\n"; });
define('text!views/crianca/crianca.html', ['module'], function(module) { module.exports = "<template><div class=\"row row margin-message\"><div class=\"col-sm-12 col-md-12 alert alert-${statusAlert}\" role=\"alert\" css=\"visibility:${visibilityAlert}\"> ${mensagemAlert} <button type=\"button\" class=\"close\" click.delegate=\"closeAlert()\" aria-label=\"Close\"><span aria-hidden=\"true\">&times;</span></button></div></div><div class=\"row\"><div class=\"col\"><div class=\"card cad-crianca rounded-0\"><div class=\"card-header\" style=\"background-color:#6495ed\"><div class=\"row\"><div class=\"col\"><h5 class=\"mb-0 text-white font-weight-bold\">Cadastro Criança</h5></div><div class=\"col\"><a class=\"btn btn-outline-light my-2 my-sm-0 float-right rounded-0\" href=\"#/listCrianca\">Voltar</a></div></div></div><div class=\"card-body\"><form submit.trigger=\"clickCadCrianca()\"><div class=\"form-group\"><label for=\"nomeCriaca\">Nome da Criança:</label><input type=\"text\" class=\"form-control rounded-0\" id=\"nomeCriaca\" placeholder=\"Preencha o nome da criança.\" required=\"\" value.bind=\"nomeCriaca\" maxlength=\"70\" minlength=\"3\" required=\"\" title=\"O campo não pode conter números\"></div><div class=\"form-group\"><label for=\"nomeMae\">Nome da Mãe:</label><input type=\"text\" class=\"form-control rounded-0\" id=\"nomeMae\" placeholder=\"Preencha o nome da mãe.\" required=\"\" value.bind=\"nomeMae\" maxlength=\"70\" minlength=\"3\" required=\"\" title=\"O campo não pode conter números\"></div><div class=\"form-group\"><label for=\"nomePai\">Nome do Pai:</label><input type=\"text\" class=\"form-control rounded-0\" id=\"nomePai\" placeholder=\"Preencha o nome do pai.\" required=\"\" value.bind=\"nomePai\" maxlength=\"70\" minlength=\"3\" required=\"\" title=\"O campo não pode conter números\"></div><div class=\"form-group\"><label for=\"endereco\">Endereço:</label><input type=\"text\" class=\"form-control rounded-0\" id=\"endereco\" placeholder=\"Preencha o endereço.\" required=\"\" value.bind=\"endereco\" maxlength=\"180\" minlength=\"3\" required=\"\" title=\"Endereço\"></div><div class=\"row\"><div class=\"col\"><div class=\"form-group\"><label for=\"idade\">Idade:</label><input type=\"text\" class=\"form-control rounded-0\" id=\"idade\" placeholder=\"Preencha a idade.\" required=\"\" value.bind=\"idade\" maxlength=\"2\" required=\"\" pattern=\"[0-9]+$\" title=\"Idade da criança\"></div></div><div class=\"col\"><div class=\"form-group rounded-0\"><label for=\"sexo\">Sexo:</label><select class=\"custom-select rounded-0\" value.bind=\"sexo\" required=\"\"><option selected=\"selected\"></option><option value=\"1\">Masculino</option><option value=\"2\">Feminino</option></select></div></div></div><input type=\"hidden\" id=\"id\" value.bind=\"id\"> <input type=\"hidden\" id=\"dtCriacao\" value.bind=\"dtCriacao\"> <button type=\"submit\" class=\"btn btn-secondary btn-lg rounded-0\">Salvar</button></form></div></div></div></div></template>"; });
define('text!styles/open-iconic-bootstrap.css', ['module'], function(module) { module.exports = "/* Bootstrap */\n\n@font-face {\n  font-family: 'Icons';\n  src: url('/fonts/open-iconic.eot');\n  src: url('/fonts/open-iconic.eot?#iconic-sm') format('embedded-opentype'), url('/fonts/open-iconic.woff') format('woff'), url('/fonts/open-iconic.ttf') format('truetype'), url('/fonts/open-iconic.otf') format('opentype'), url('/fonts/open-iconic.svg#iconic-sm') format('svg');\n  font-weight: normal;\n  font-style: normal;\n}\n\n.oi {\n  position: relative;\n  top: 1px;\n  display: inline-block;\n  speak:none;\n  font-family: 'Icons';\n  font-style: normal;\n  font-weight: normal;\n  line-height: 1;\n  -webkit-font-smoothing: antialiased;\n  -moz-osx-font-smoothing: grayscale;\n}\n\n.oi:empty:before {\n  width: 1em;\n  text-align: center;\n  box-sizing: content-box;\n}\n\n.oi.oi-align-center:before {\n  text-align: center;\n}\n\n.oi.oi-align-left:before {\n  text-align: left;\n}\n\n.oi.oi-align-right:before {\n  text-align: right;\n}\n\n\n.oi.oi-flip-horizontal:before {\n  -webkit-transform: scale(-1, 1);\n  -ms-transform: scale(-1, 1);\n  transform: scale(-1, 1);\n}\n\n.oi.oi-flip-vertical:before {\n  -webkit-transform: scale(1, -1);\n  -ms-transform: scale(-1, 1);\n  transform: scale(1, -1);\n}\n\n.oi.oi-flip-horizontal-vertical:before {\n  -webkit-transform: scale(-1, -1);\n  -ms-transform: scale(-1, 1);\n  transform: scale(-1, -1);\n}\n\n\n.oi-account-login:before {\n  content:'\\e000';\n}\n\n.oi-account-logout:before {\n  content:'\\e001';\n}\n\n.oi-action-redo:before {\n  content:'\\e002';\n}\n\n.oi-action-undo:before {\n  content:'\\e003';\n}\n\n.oi-align-center:before {\n  content:'\\e004';\n}\n\n.oi-align-left:before {\n  content:'\\e005';\n}\n\n.oi-align-right:before {\n  content:'\\e006';\n}\n\n.oi-aperture:before {\n  content:'\\e007';\n}\n\n.oi-arrow-bottom:before {\n  content:'\\e008';\n}\n\n.oi-arrow-circle-bottom:before {\n  content:'\\e009';\n}\n\n.oi-arrow-circle-left:before {\n  content:'\\e00a';\n}\n\n.oi-arrow-circle-right:before {\n  content:'\\e00b';\n}\n\n.oi-arrow-circle-top:before {\n  content:'\\e00c';\n}\n\n.oi-arrow-left:before {\n  content:'\\e00d';\n}\n\n.oi-arrow-right:before {\n  content:'\\e00e';\n}\n\n.oi-arrow-thick-bottom:before {\n  content:'\\e00f';\n}\n\n.oi-arrow-thick-left:before {\n  content:'\\e010';\n}\n\n.oi-arrow-thick-right:before {\n  content:'\\e011';\n}\n\n.oi-arrow-thick-top:before {\n  content:'\\e012';\n}\n\n.oi-arrow-top:before {\n  content:'\\e013';\n}\n\n.oi-audio-spectrum:before {\n  content:'\\e014';\n}\n\n.oi-audio:before {\n  content:'\\e015';\n}\n\n.oi-badge:before {\n  content:'\\e016';\n}\n\n.oi-ban:before {\n  content:'\\e017';\n}\n\n.oi-bar-chart:before {\n  content:'\\e018';\n}\n\n.oi-basket:before {\n  content:'\\e019';\n}\n\n.oi-battery-empty:before {\n  content:'\\e01a';\n}\n\n.oi-battery-full:before {\n  content:'\\e01b';\n}\n\n.oi-beaker:before {\n  content:'\\e01c';\n}\n\n.oi-bell:before {\n  content:'\\e01d';\n}\n\n.oi-bluetooth:before {\n  content:'\\e01e';\n}\n\n.oi-bold:before {\n  content:'\\e01f';\n}\n\n.oi-bolt:before {\n  content:'\\e020';\n}\n\n.oi-book:before {\n  content:'\\e021';\n}\n\n.oi-bookmark:before {\n  content:'\\e022';\n}\n\n.oi-box:before {\n  content:'\\e023';\n}\n\n.oi-briefcase:before {\n  content:'\\e024';\n}\n\n.oi-british-pound:before {\n  content:'\\e025';\n}\n\n.oi-browser:before {\n  content:'\\e026';\n}\n\n.oi-brush:before {\n  content:'\\e027';\n}\n\n.oi-bug:before {\n  content:'\\e028';\n}\n\n.oi-bullhorn:before {\n  content:'\\e029';\n}\n\n.oi-calculator:before {\n  content:'\\e02a';\n}\n\n.oi-calendar:before {\n  content:'\\e02b';\n}\n\n.oi-camera-slr:before {\n  content:'\\e02c';\n}\n\n.oi-caret-bottom:before {\n  content:'\\e02d';\n}\n\n.oi-caret-left:before {\n  content:'\\e02e';\n}\n\n.oi-caret-right:before {\n  content:'\\e02f';\n}\n\n.oi-caret-top:before {\n  content:'\\e030';\n}\n\n.oi-cart:before {\n  content:'\\e031';\n}\n\n.oi-chat:before {\n  content:'\\e032';\n}\n\n.oi-check:before {\n  content:'\\e033';\n}\n\n.oi-chevron-bottom:before {\n  content:'\\e034';\n}\n\n.oi-chevron-left:before {\n  content:'\\e035';\n}\n\n.oi-chevron-right:before {\n  content:'\\e036';\n}\n\n.oi-chevron-top:before {\n  content:'\\e037';\n}\n\n.oi-circle-check:before {\n  content:'\\e038';\n}\n\n.oi-circle-x:before {\n  content:'\\e039';\n}\n\n.oi-clipboard:before {\n  content:'\\e03a';\n}\n\n.oi-clock:before {\n  content:'\\e03b';\n}\n\n.oi-cloud-download:before {\n  content:'\\e03c';\n}\n\n.oi-cloud-upload:before {\n  content:'\\e03d';\n}\n\n.oi-cloud:before {\n  content:'\\e03e';\n}\n\n.oi-cloudy:before {\n  content:'\\e03f';\n}\n\n.oi-code:before {\n  content:'\\e040';\n}\n\n.oi-cog:before {\n  content:'\\e041';\n}\n\n.oi-collapse-down:before {\n  content:'\\e042';\n}\n\n.oi-collapse-left:before {\n  content:'\\e043';\n}\n\n.oi-collapse-right:before {\n  content:'\\e044';\n}\n\n.oi-collapse-up:before {\n  content:'\\e045';\n}\n\n.oi-command:before {\n  content:'\\e046';\n}\n\n.oi-comment-square:before {\n  content:'\\e047';\n}\n\n.oi-compass:before {\n  content:'\\e048';\n}\n\n.oi-contrast:before {\n  content:'\\e049';\n}\n\n.oi-copywriting:before {\n  content:'\\e04a';\n}\n\n.oi-credit-card:before {\n  content:'\\e04b';\n}\n\n.oi-crop:before {\n  content:'\\e04c';\n}\n\n.oi-dashboard:before {\n  content:'\\e04d';\n}\n\n.oi-data-transfer-download:before {\n  content:'\\e04e';\n}\n\n.oi-data-transfer-upload:before {\n  content:'\\e04f';\n}\n\n.oi-delete:before {\n  content:'\\e050';\n}\n\n.oi-dial:before {\n  content:'\\e051';\n}\n\n.oi-document:before {\n  content:'\\e052';\n}\n\n.oi-dollar:before {\n  content:'\\e053';\n}\n\n.oi-double-quote-sans-left:before {\n  content:'\\e054';\n}\n\n.oi-double-quote-sans-right:before {\n  content:'\\e055';\n}\n\n.oi-double-quote-serif-left:before {\n  content:'\\e056';\n}\n\n.oi-double-quote-serif-right:before {\n  content:'\\e057';\n}\n\n.oi-droplet:before {\n  content:'\\e058';\n}\n\n.oi-eject:before {\n  content:'\\e059';\n}\n\n.oi-elevator:before {\n  content:'\\e05a';\n}\n\n.oi-ellipses:before {\n  content:'\\e05b';\n}\n\n.oi-envelope-closed:before {\n  content:'\\e05c';\n}\n\n.oi-envelope-open:before {\n  content:'\\e05d';\n}\n\n.oi-euro:before {\n  content:'\\e05e';\n}\n\n.oi-excerpt:before {\n  content:'\\e05f';\n}\n\n.oi-expand-down:before {\n  content:'\\e060';\n}\n\n.oi-expand-left:before {\n  content:'\\e061';\n}\n\n.oi-expand-right:before {\n  content:'\\e062';\n}\n\n.oi-expand-up:before {\n  content:'\\e063';\n}\n\n.oi-external-link:before {\n  content:'\\e064';\n}\n\n.oi-eye:before {\n  content:'\\e065';\n}\n\n.oi-eyedropper:before {\n  content:'\\e066';\n}\n\n.oi-file:before {\n  content:'\\e067';\n}\n\n.oi-fire:before {\n  content:'\\e068';\n}\n\n.oi-flag:before {\n  content:'\\e069';\n}\n\n.oi-flash:before {\n  content:'\\e06a';\n}\n\n.oi-folder:before {\n  content:'\\e06b';\n}\n\n.oi-fork:before {\n  content:'\\e06c';\n}\n\n.oi-fullscreen-enter:before {\n  content:'\\e06d';\n}\n\n.oi-fullscreen-exit:before {\n  content:'\\e06e';\n}\n\n.oi-globe:before {\n  content:'\\e06f';\n}\n\n.oi-graph:before {\n  content:'\\e070';\n}\n\n.oi-grid-four-up:before {\n  content:'\\e071';\n}\n\n.oi-grid-three-up:before {\n  content:'\\e072';\n}\n\n.oi-grid-two-up:before {\n  content:'\\e073';\n}\n\n.oi-hard-drive:before {\n  content:'\\e074';\n}\n\n.oi-header:before {\n  content:'\\e075';\n}\n\n.oi-headphones:before {\n  content:'\\e076';\n}\n\n.oi-heart:before {\n  content:'\\e077';\n}\n\n.oi-home:before {\n  content:'\\e078';\n}\n\n.oi-image:before {\n  content:'\\e079';\n}\n\n.oi-inbox:before {\n  content:'\\e07a';\n}\n\n.oi-infinity:before {\n  content:'\\e07b';\n}\n\n.oi-info:before {\n  content:'\\e07c';\n}\n\n.oi-italic:before {\n  content:'\\e07d';\n}\n\n.oi-justify-center:before {\n  content:'\\e07e';\n}\n\n.oi-justify-left:before {\n  content:'\\e07f';\n}\n\n.oi-justify-right:before {\n  content:'\\e080';\n}\n\n.oi-key:before {\n  content:'\\e081';\n}\n\n.oi-laptop:before {\n  content:'\\e082';\n}\n\n.oi-layers:before {\n  content:'\\e083';\n}\n\n.oi-lightbulb:before {\n  content:'\\e084';\n}\n\n.oi-link-broken:before {\n  content:'\\e085';\n}\n\n.oi-link-intact:before {\n  content:'\\e086';\n}\n\n.oi-list-rich:before {\n  content:'\\e087';\n}\n\n.oi-list:before {\n  content:'\\e088';\n}\n\n.oi-location:before {\n  content:'\\e089';\n}\n\n.oi-lock-locked:before {\n  content:'\\e08a';\n}\n\n.oi-lock-unlocked:before {\n  content:'\\e08b';\n}\n\n.oi-loop-circular:before {\n  content:'\\e08c';\n}\n\n.oi-loop-square:before {\n  content:'\\e08d';\n}\n\n.oi-loop:before {\n  content:'\\e08e';\n}\n\n.oi-magnifying-glass:before {\n  content:'\\e08f';\n}\n\n.oi-map-marker:before {\n  content:'\\e090';\n}\n\n.oi-map:before {\n  content:'\\e091';\n}\n\n.oi-media-pause:before {\n  content:'\\e092';\n}\n\n.oi-media-play:before {\n  content:'\\e093';\n}\n\n.oi-media-record:before {\n  content:'\\e094';\n}\n\n.oi-media-skip-backward:before {\n  content:'\\e095';\n}\n\n.oi-media-skip-forward:before {\n  content:'\\e096';\n}\n\n.oi-media-step-backward:before {\n  content:'\\e097';\n}\n\n.oi-media-step-forward:before {\n  content:'\\e098';\n}\n\n.oi-media-stop:before {\n  content:'\\e099';\n}\n\n.oi-medical-cross:before {\n  content:'\\e09a';\n}\n\n.oi-menu:before {\n  content:'\\e09b';\n}\n\n.oi-microphone:before {\n  content:'\\e09c';\n}\n\n.oi-minus:before {\n  content:'\\e09d';\n}\n\n.oi-monitor:before {\n  content:'\\e09e';\n}\n\n.oi-moon:before {\n  content:'\\e09f';\n}\n\n.oi-move:before {\n  content:'\\e0a0';\n}\n\n.oi-musical-note:before {\n  content:'\\e0a1';\n}\n\n.oi-paperclip:before {\n  content:'\\e0a2';\n}\n\n.oi-pencil:before {\n  content:'\\e0a3';\n}\n\n.oi-people:before {\n  content:'\\e0a4';\n}\n\n.oi-person:before {\n  content:'\\e0a5';\n}\n\n.oi-phone:before {\n  content:'\\e0a6';\n}\n\n.oi-pie-chart:before {\n  content:'\\e0a7';\n}\n\n.oi-pin:before {\n  content:'\\e0a8';\n}\n\n.oi-play-circle:before {\n  content:'\\e0a9';\n}\n\n.oi-plus:before {\n  content:'\\e0aa';\n}\n\n.oi-power-standby:before {\n  content:'\\e0ab';\n}\n\n.oi-print:before {\n  content:'\\e0ac';\n}\n\n.oi-project:before {\n  content:'\\e0ad';\n}\n\n.oi-pulse:before {\n  content:'\\e0ae';\n}\n\n.oi-puzzle-piece:before {\n  content:'\\e0af';\n}\n\n.oi-question-mark:before {\n  content:'\\e0b0';\n}\n\n.oi-rain:before {\n  content:'\\e0b1';\n}\n\n.oi-random:before {\n  content:'\\e0b2';\n}\n\n.oi-reload:before {\n  content:'\\e0b3';\n}\n\n.oi-resize-both:before {\n  content:'\\e0b4';\n}\n\n.oi-resize-height:before {\n  content:'\\e0b5';\n}\n\n.oi-resize-width:before {\n  content:'\\e0b6';\n}\n\n.oi-rss-alt:before {\n  content:'\\e0b7';\n}\n\n.oi-rss:before {\n  content:'\\e0b8';\n}\n\n.oi-script:before {\n  content:'\\e0b9';\n}\n\n.oi-share-boxed:before {\n  content:'\\e0ba';\n}\n\n.oi-share:before {\n  content:'\\e0bb';\n}\n\n.oi-shield:before {\n  content:'\\e0bc';\n}\n\n.oi-signal:before {\n  content:'\\e0bd';\n}\n\n.oi-signpost:before {\n  content:'\\e0be';\n}\n\n.oi-sort-ascending:before {\n  content:'\\e0bf';\n}\n\n.oi-sort-descending:before {\n  content:'\\e0c0';\n}\n\n.oi-spreadsheet:before {\n  content:'\\e0c1';\n}\n\n.oi-star:before {\n  content:'\\e0c2';\n}\n\n.oi-sun:before {\n  content:'\\e0c3';\n}\n\n.oi-tablet:before {\n  content:'\\e0c4';\n}\n\n.oi-tag:before {\n  content:'\\e0c5';\n}\n\n.oi-tags:before {\n  content:'\\e0c6';\n}\n\n.oi-target:before {\n  content:'\\e0c7';\n}\n\n.oi-task:before {\n  content:'\\e0c8';\n}\n\n.oi-terminal:before {\n  content:'\\e0c9';\n}\n\n.oi-text:before {\n  content:'\\e0ca';\n}\n\n.oi-thumb-down:before {\n  content:'\\e0cb';\n}\n\n.oi-thumb-up:before {\n  content:'\\e0cc';\n}\n\n.oi-timer:before {\n  content:'\\e0cd';\n}\n\n.oi-transfer:before {\n  content:'\\e0ce';\n}\n\n.oi-trash:before {\n  content:'\\e0cf';\n}\n\n.oi-underline:before {\n  content:'\\e0d0';\n}\n\n.oi-vertical-align-bottom:before {\n  content:'\\e0d1';\n}\n\n.oi-vertical-align-center:before {\n  content:'\\e0d2';\n}\n\n.oi-vertical-align-top:before {\n  content:'\\e0d3';\n}\n\n.oi-video:before {\n  content:'\\e0d4';\n}\n\n.oi-volume-high:before {\n  content:'\\e0d5';\n}\n\n.oi-volume-low:before {\n  content:'\\e0d6';\n}\n\n.oi-volume-off:before {\n  content:'\\e0d7';\n}\n\n.oi-warning:before {\n  content:'\\e0d8';\n}\n\n.oi-wifi:before {\n  content:'\\e0d9';\n}\n\n.oi-wrench:before {\n  content:'\\e0da';\n}\n\n.oi-x:before {\n  content:'\\e0db';\n}\n\n.oi-yen:before {\n  content:'\\e0dc';\n}\n\n.oi-zoom-in:before {\n  content:'\\e0dd';\n}\n\n.oi-zoom-out:before {\n  content:'\\e0de';\n}\n"; });
define('text!views/crianca/listCrianca.html', ['module'], function(module) { module.exports = "<template><div class=\"row margin-message\"><div class=\"col-sm-12 col-md-12 alert alert-${statusAlert}\" role=\"alert\" css=\"visibility:${visibilityAlert}\"> ${mensagemAlert} <button type=\"button\" class=\"close\" click.delegate=\"closeAlert()\" aria-label=\"Close\"><span aria-hidden=\"true\">&times;</span></button></div></div><div class=\"row\"><div class=\"col-sm-6 col-md-6\"><div class=\"input-group mb-3\"><input type=\"text\" class=\"form-control rounded-0 border border-primary\" placeholder=\"Pesquisar criança\" aria-label=\"Recipient's username\" aria-describedby=\"basic-addon2\" value.bind=\"search\" maxlength=\"200\"><div class=\"input-group-append\"><button class=\"btn btn-outline-primary rounded-0\" type=\"button\" click.delegate=\"searchChild()\">Pesquisar</button></div></div></div><div class=\"col\"><a class=\"btn btn-outline-primary my-2 my-sm-0 float-right rounded-0\" href=\"#/crianca\">Cadastrar</a></div></div><div class=\"table-responsive\"><table class=\"table table-striped table-hover rounded-0 format-table\"><thead class=\"p-3 mb-2 bg-secondary text-white\"><tr><th scope=\"col\">Nome</th><th scope=\"col\">Nome da mãe</th><th scope=\"col\">Nome do pai</th><th scope=\"col\">Idade</th><th scope=\"col\"></th></tr></thead><tbody><tr repeat.for=\"crianca of listCrianca\"><td click.delegate=\"exibir(crianca)\">${crianca.nome}</td><td click.delegate=\"exibir(crianca)\">${crianca.nomeMae}</td><td click.delegate=\"exibir(crianca)\">${crianca.nomePai}</td><td click.delegate=\"exibir(crianca)\">${crianca.idade}</td><td class=\"aling-right\"><button type=\"button\" class=\"btn btn-danger btn-sm rounded-0 border\" click.delegate=\"excluir(crianca.id, crianca.nome)\">Excluir</button> | <button type=\"button\" class=\"btn btn-primary btn-sm rounded-0 border\" click.delegate=\"editar(crianca)\">Editar</button></td></tr></tbody></table></div></template>"; });
define('text!views/fotos/foto.html', ['module'], function(module) { module.exports = "<template>FOTOOOOOO</template>"; });
define('text!views/home/home.html', ['module'], function(module) { module.exports = "<template><div class=\"row margin-row\"><div class=\"col-sm-3\"><div class=\"card text-center\"><div class=\"card-body\"><h5 class=\"card-title\">Crianças Cadastradas</h5><h2 class=\"card-title\">${countCrianca}</h2></div></div></div></div></template>"; });
define('text!views/modal/modal.html', ['module'], function(module) { module.exports = "<template><ux-dialog class=\"rounded-0 modal-basic\"><ux-dialog-header><h3>${header}</h3></ux-dialog-header><ux-dialog-body><h3>${message}</h3><h5>${nome}</h5><h5>${nomeMae}</h5><h5>${nomePai}</h5><h5>${idade}</h5><h5>${sexo}</h5><h5>${endereco}</h5></ux-dialog-body><ux-dialog-footer><div class=\"row\"><div class=\"col\"><button class=\"btn btn-lg btn-block btn-outline-primary rounded-0 border\" css=\"display:${visibilityBtn}\" click.trigger=\"controller.cancel()\">Cancelar</button></div><div class=\"col\"><button class=\"btn btn-lg btn-block btn-danger rounded-0 border\" css=\"display:${visibilityBtn}\" click.trigger=\"controller.ok(message)\">Sim</button></div></div></ux-dialog-footer></ux-dialog></template>"; });
define('text!views/usuario/usuario.html', ['module'], function(module) { module.exports = "<template>Teste usuário</template>"; });
define('text!styles/modal.css', ['module'], function(module) { module.exports = "ux-dialog{\r\n  padding: 0;\r\n}\r\nux-dialog > ux-dialog-header{\r\n  text-align: center;\r\n  color: #FFFFFF;\r\n  border-bottom: 0;\r\n  background-color: #1E90FF;\r\n  margin: 0;\r\n}\r\nux-dialog > ux-dialog-body{\r\n  color: #1E90FF;\r\n}\r\nux-dialog > ux-dialog-footer{\r\n  padding: 0 15px 0 15px;\r\n  border-top: 0;\r\n}\r\nux-dialog-overlay.active {\r\n      background-color: black;\r\n      opacity: .5;\r\n    }\r\n"; });
//# sourceMappingURL=app-bundle.js.map