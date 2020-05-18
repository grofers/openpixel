// Open Pixel v1.1.0 | Published By Dockwa | Created By Stuart Yamartino | MIT License
;(function(window, document, pixelFunc, pixelFuncName, pixelEndpoint, versionNumber) {
"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Config = {
  id: '',
  version: versionNumber
};

var Helpers = /*#__PURE__*/function () {
  function Helpers() {
    _classCallCheck(this, Helpers);
  }

  _createClass(Helpers, null, [{
    key: "isPresent",
    value: function isPresent(variable) {
      return typeof variable !== 'undefined' && variable !== null && variable !== '';
    }
  }, {
    key: "now",
    value: function now() {
      return 1 * new Date();
    }
  }, {
    key: "guid",
    value: function guid() {
      return Config.version + '-xxxxxxxx-'.replace(/[x]/g, function (c) {
        var r = Math.random() * 36 | 0,
            v = c == 'x' ? r : r & 0x3 | 0x8;
        return v.toString(36);
      }) + (1 * new Date()).toString(36);
    } // reduces all optional data down to a string

  }, {
    key: "optionalData",
    value: function optionalData(data) {
      if (Helpers.isPresent(data) === false) {
        return '';
      } else if (_typeof(data) === 'object') {
        // runs Helpers.optionalData again to reduce to string in case something else was returned
        return Helpers.optionalData(JSON.stringify(data));
      } else if (typeof data === 'function') {
        // runs the function and calls Helpers.optionalData again to reduce further if it isn't a string
        return Helpers.optionalData(data());
      } else {
        return String(data);
      }
    }
  }]);

  return Helpers;
}();

var Browser = /*#__PURE__*/function () {
  function Browser() {
    _classCallCheck(this, Browser);
  }

  _createClass(Browser, null, [{
    key: "nameAndVersion",
    value: function nameAndVersion() {
      // http://stackoverflow.com/questions/5916900/how-can-you-detect-the-version-of-a-browser
      var ua = navigator.userAgent,
          tem,
          M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];

      if (/trident/i.test(M[1])) {
        tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
        return 'IE ' + (tem[1] || '');
      }

      if (M[1] === 'Chrome') {
        tem = ua.match(/\b(OPR|Edge)\/(\d+)/);
        if (tem != null) return tem.slice(1).join(' ').replace('OPR', 'Opera');
      }

      M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];
      if ((tem = ua.match(/version\/(\d+)/i)) != null) M.splice(1, 1, tem[1]);
      return M.join(' ');
    }
  }, {
    key: "isMobile",
    value: function isMobile() {
      return 'ontouchstart' in document;
    }
  }, {
    key: "userAgent",
    value: function userAgent() {
      return window.navigator.userAgent;
    }
  }]);

  return Browser;
}(); //http://www.w3schools.com/js/js_cookies.asp


var Cookie = /*#__PURE__*/function () {
  function Cookie() {
    _classCallCheck(this, Cookie);
  }

  _createClass(Cookie, null, [{
    key: "prefix",
    value: function prefix() {
      return '__' + pixelFuncName + '_';
    }
  }, {
    key: "set",
    value: function set(name, value, minutes) {
      var path = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : "/";
      var expires = "";

      if (Helpers.isPresent(minutes)) {
        var date = new Date();
        date.setTime(date.getTime() + minutes * 60 * 1000);
        expires = "; expires=" + date.toGMTString();
      }

      document.cookie = this.prefix() + name + "=" + value + expires + "; path=" + path + "; SameSite=Lax";
    }
  }, {
    key: "get",
    value: function get(name) {
      var name = this.prefix() + name + "=";
      var ca = document.cookie.split(';');

      for (var i = 0; i < ca.length; i++) {
        var c = ca[i];

        while (c.charAt(0) == ' ') {
          c = c.substring(1);
        }

        if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
      }

      return;
    }
  }, {
    key: "delete",
    value: function _delete(name) {
      this.set(name, "", -100);
    }
  }, {
    key: "exists",
    value: function exists(name) {
      return Helpers.isPresent(this.get(name));
    } // set a cookie that expires in 10 minutes to throttle analytics requests from that page
    // throttle(name){
    //   this.set(name, 1, 10, window.location.pathname);
    // },

  }, {
    key: "setUtms",
    value: function setUtms() {
      var utmArray = ['utm_source', 'utm_medium', 'utm_term', 'utm_content', 'utm_campaign'];
      var exists = false;

      for (var i = 0, l = utmArray.length; i < l; i++) {
        if (Helpers.isPresent(Url.getParameterByName(utmArray[i]))) {
          exists = true;
          break;
        }
      }

      if (exists) {
        var val,
            save = {};

        for (var i = 0, l = utmArray.length; i < l; i++) {
          val = Url.getParameterByName(utmArray[i]);

          if (Helpers.isPresent(val)) {
            save[utmArray[i]] = val;
          }
        }

        this.set('utm', JSON.stringify(save));
      }
    }
  }, {
    key: "getUtm",
    value: function getUtm(name) {
      if (this.exists('utm')) {
        var utms = JSON.parse(this.get('utm'));
        return name in utms ? utms[name] : "";
      }
    }
  }]);

  return Cookie;
}();

var Url = /*#__PURE__*/function () {
  function Url() {
    _classCallCheck(this, Url);
  }

  _createClass(Url, null, [{
    key: "getParameterByName",
    // http://stackoverflow.com/a/901144/1231563
    value: function getParameterByName(name, url) {
      if (!url) url = window.location.href;
      name = name.replace(/[\[\]]/g, "\\$&");
      var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)", "i"),
          results = regex.exec(url);
      if (!results) return null;
      if (!results[2]) return '';
      return decodeURIComponent(results[2].replace(/\+/g, " "));
    }
  }, {
    key: "externalHost",
    value: function externalHost(link) {
      return link.hostname != location.hostname && link.protocol.indexOf('http') === 0;
    }
  }]);

  return Url;
}();

var Pixel = /*#__PURE__*/function () {
  function Pixel(event, timestamp, optional) {
    _classCallCheck(this, Pixel);

    this.params = [];
    this.event = event;
    this.timestamp = timestamp;
    this.optional = Helpers.optionalData(optional);
    this.buildParams();
    this.send();
  }

  _createClass(Pixel, [{
    key: "buildParams",
    value: function buildParams() {
      var attr = this.getAttribute();

      for (var index in attr) {
        if (attr.hasOwnProperty(index)) {
          this.setParam(index, attr[index](index));
        }
      }
    }
  }, {
    key: "getAttribute",
    value: function getAttribute() {
      var _this = this;

      return {
        id: function id() {
          return Config.id;
        },
        // website Id
        uid: function uid() {
          return Cookie.get('uid');
        },
        // user Id
        ev: function ev() {
          return _this.event;
        },
        // event being triggered
        ed: function ed() {
          return _this.optional;
        },
        // any event data to pass along
        v: function v() {
          return Config.version;
        },
        // openpixel.js version
        dl: function dl() {
          return window.location.href;
        },
        // document location
        rl: function rl() {
          return document.referrer;
        },
        // referrer location
        ts: function ts() {
          return _this.timestamp;
        },
        // timestamp when event was triggered
        de: function de() {
          return document.characterSet;
        },
        // document encoding
        sr: function sr() {
          return window.screen.width + 'x' + window.screen.height;
        },
        // screen resolution
        vp: function vp() {
          return window.innerWidth + 'x' + window.innerHeight;
        },
        // viewport size
        cd: function cd() {
          return window.screen.colorDepth;
        },
        // color depth
        dt: function dt() {
          return document.title;
        },
        // document title
        bn: function bn() {
          return Browser.nameAndVersion();
        },
        // browser name and version number
        md: function md() {
          return Browser.isMobile();
        },
        // is a mobile device?
        ua: function ua() {
          return Browser.userAgent();
        },
        // user agent
        tz: function tz() {
          return new Date().getTimezoneOffset();
        },
        // timezone
        utm_source: function utm_source(key) {
          return Cookie.getUtm(key);
        },
        // get the utm source
        utm_medium: function utm_medium(key) {
          return Cookie.getUtm(key);
        },
        // get the utm medium
        utm_term: function utm_term(key) {
          return Cookie.getUtm(key);
        },
        // get the utm term
        utm_content: function utm_content(key) {
          return Cookie.getUtm(key);
        },
        // get the utm content
        utm_campaign: function utm_campaign(key) {
          return Cookie.getUtm(key);
        } // get the utm campaign

      };
    }
  }, {
    key: "setParam",
    value: function setParam(key, val) {
      if (Helpers.isPresent(val)) {
        this.params.push("".concat(key, "=").concat(encodeURIComponent(val)));
      } else {
        this.params.push("".concat(key, "="));
      }
    }
  }, {
    key: "send",
    value: function send() {
      window.navigator.sendBeacon ? this.sendBeacon() : this.sendImage();
    }
  }, {
    key: "sendBeacon",
    value: function sendBeacon() {
      window.navigator.sendBeacon(this.getSourceUrl());
    }
  }, {
    key: "sendImage",
    value: function sendImage() {
      this.img = document.createElement('img');
      this.img.src = this.getSourceUrl();
      this.img.style.display = 'none';
      this.img.width = '1';
      this.img.height = '1';
      document.getElementsByTagName('body')[0].appendChild(this.img);
    }
  }, {
    key: "getSourceUrl",
    value: function getSourceUrl() {
      return "".concat(pixelEndpoint, "?").concat(this.params.join('&'));
    }
  }]);

  return Pixel;
}(); // update the cookie if it exists, if it doesn't, create a new one, lasting 2 years


Cookie.exists('uid') ? Cookie.set('uid', Cookie.get('uid'), 2 * 365 * 24 * 60) : Cookie.set('uid', Helpers.guid(), 2 * 365 * 24 * 60); // save any utms through as session cookies

Cookie.setUtms(); // process the queue and future incoming commands

pixelFunc.process = function (method, value, optional) {
  if (method == 'init') {
    Config.id = value;
  } else if (method == 'event') {
    if (value == 'pageload' && !Config.pageLoadOnce) {
      Config.pageLoadOnce = true; // set 10 minutes page load cookie
      // Cookie.throttle('pageload');

      new Pixel(value, pixelFunc.t, optional);
    } else if (value != 'pageload' && value != 'pageclose') {
      new Pixel(value, Helpers.now(), optional);
    }
  }
}; // run the queued calls from the snippet to be processed


for (var i = 0, l = pixelFunc.queue.length; i < l; i++) {
  pixelFunc.process.apply(pixelFunc, pixelFunc.queue[i]);
}

window.addEventListener('beforeunload', function () {
  if (!Config.pageCloseOnce) {
    Config.pageCloseOnce = true; // set 10 minutes page close cookie
    // Cookie.throttle('pageclose');

    new Pixel('pageclose', Helpers.now(), function () {
      // if a link was clicked in the last 5 seconds that goes to an external host, pass it through as event data
      if (Helpers.isPresent(Config.externalHost) && Helpers.now() - Config.externalHost.time < 5 * 1000) {
        return Config.externalHost.link;
      }
    });
  }
});

window.onload = function () {
  var aTags = document.getElementsByTagName('a');

  for (var i = 0, l = aTags.length; i < l; i++) {
    aTags[i].addEventListener('click', function (e) {
      if (Url.externalHost(this)) {
        Config.externalHost = {
          link: this.href,
          time: Helpers.now()
        };
      }
    }.bind(aTags[i]));
  }
};
}(window, document, window["opix"], "opix", "https://tracker.example.com/pixel.gif", 1));
