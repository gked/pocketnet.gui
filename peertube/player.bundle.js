!function(e){var t={};function n(i){if(t[i])return t[i].exports;var r=t[i]={i:i,l:!1,exports:{}};return e[i].call(r.exports,r,r.exports,n),r.l=!0,r.exports}n.m=e,n.c=t,n.d=function(e,t,i){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:i})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var i=Object.create(null);if(n.r(i),Object.defineProperty(i,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var r in e)n.d(i,r,function(t){return e[t]}.bind(null,r));return i},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="./peertube/",n(n.s=34)}({1:function(e,t,n){"use strict";n.d(t,"a",(function(){return i}));function i(e,t,n,i){return new(n||(n=Promise))((function(r,o){function s(e){try{c(i.next(e))}catch(e){o(e)}}function a(e){try{c(i.throw(e))}catch(e){o(e)}}function c(e){var t;e.done?r(e.value):(t=e.value,t instanceof n?t:new n((function(e){e(t)}))).then(s,a)}c((i=i.apply(e,t||[])).next())}))}Object.create;Object.create},23:function(e,t,n){e.exports=function(){"use strict";return function(){var e=Math.floor(1000001*Math.random()),t={};function n(e,n,i,r){function o(t){for(var n=0;n<t.length;n++)if(t[n].win===e)return!0;return!1}var s=!1;if("*"===n){for(var a in t)if(t.hasOwnProperty(a)&&"*"!==a&&"object"==typeof t[a][i]&&(s=o(t[a][i])))break}else t["*"]&&t["*"][i]&&(s=o(t["*"][i])),!s&&t[n]&&t[n][i]&&(s=o(t[n][i]));if(s)throw"A channel is already bound to the same window which overlaps with origin '"+n+"' and has scope '"+i+"'";"object"!=typeof t[n]&&(t[n]={}),"object"!=typeof t[n][i]&&(t[n][i]=[]),t[n][i].push({win:e,handler:r})}function i(e,n,i){for(var r=t[n][i],o=0;o<r.length;o++)r[o].win===e&&r.splice(o,1);0===t[n][i].length&&delete t[n][i]}function r(e){return Array.isArray?Array.isArray(e):-1!=e.constructor.toString().indexOf("Array")}var o={},s=function(e){try{var n=JSON.parse(e.data);if("object"!=typeof n||null===n)throw"malformed"}catch(e){return}var i,r,s,a=e.source,c=e.origin;if("string"==typeof n.method){var d=n.method.split("::");2==d.length?(i=d[0],s=d[1]):s=n.method}if(void 0!==n.id&&(r=n.id),"string"==typeof s){var u=!1;if(t[c]&&t[c][i])for(var l=0;l<t[c][i].length;l++)if(t[c][i][l].win===a){t[c][i][l].handler(c,s,n),u=!0;break}if(!u&&t["*"]&&t["*"][i])for(l=0;l<t["*"][i].length;l++)if(t["*"][i][l].win===a){t["*"][i][l].handler(c,s,n);break}}else void 0!==r&&o[r]&&o[r](c,s,n)};return window.addEventListener?window.addEventListener("message",s,!1):window.attachEvent&&window.attachEvent("onmessage",s),{build:function(t){var s=function(e){if(t.debugOutput&&window.console&&window.console.log){try{"string"!=typeof e&&(e=JSON.stringify(e))}catch(e){}window.console.log("["+d+"] "+e)}};if(!window.postMessage)throw"jschannel cannot run this browser, no postMessage";if(!window.JSON||!window.JSON.stringify||!window.JSON.parse)throw"jschannel cannot run this browser, no JSON parsing/serialization";if("object"!=typeof t)throw"Channel build invoked without a proper object argument";if(!t.window||!t.window.postMessage)throw"Channel.build() called without a valid window argument";window===t.window&&s("target window is same as present window -- use at your own risk");var a,c=!1;if("string"==typeof t.origin&&("*"===t.origin?c=!0:null!==(a=t.origin.match(/^https?:\/\/(?:[-a-zA-Z0-9_\.])+(?::\d+)?/))&&(t.origin=a[0].toLowerCase(),c=!0)),!c)throw"Channel.build() called with an invalid origin";if(void 0!==t.scope){if("string"!=typeof t.scope)throw"scope, when specified, must be a string";if(t.scope.split("::").length>1)throw"scope may not contain double colons: '::'"}else t.scope="__default";var d=function(){for(var e="",t="abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",n=0;n<5;n++)e+=t.charAt(Math.floor(Math.random()*t.length));return e}(),u={},l={},h={},f=!1,g=[],p=[],m=function(e,t,n){var i=!1,r=!1;return{origin:t,invoke:function(t,i){if(!h[e])throw"attempting to invoke a callback of a nonexistent transaction: "+e;for(var r=!1,o=0;o<n.length;o++)if(t===n[o]){r=!0;break}if(!r)throw"request supports no such callback '"+t+"'";w({id:e,callback:t,params:i})},error:function(t,n){if(r=!0,!h[e])throw"error called for nonexistent message: "+e;delete h[e],w({id:e,error:t,message:n})},complete:function(t){if(r=!0,!h[e])throw"complete called for nonexistent message: "+e;delete h[e],w({id:e,result:t})},delayReturn:function(e){return"boolean"==typeof e&&(i=!0===e),i},completed:function(){return r}}},b=function(e,t,n){return window.setTimeout((function(){if(l[e]){var i="timeout ("+t+"ms) exceeded on method '"+n+"'";l[e].error&&l[e].error("timeout_error",i),delete l[e],delete o[e]}}),t)},v=function(e,n,i){if("function"==typeof t.gotMessageObserver)try{t.gotMessageObserver(e,i)}catch(e){s("gotMessageObserver() raised an exception: "+e.toString())}if(i.id&&n){h[i.id]={};var a=m(i.id,e,i.callbacks?i.callbacks:[]);if(u[n])try{if(i.callbacks&&r(i.callbacks)&&i.callbacks.length>0)for(var c=0;c<i.callbacks.length;c++){for(var d=i.callbacks[c],f=i.params,g=d.split("/"),p=0;p<g.length-1;p++){var b=g[p];"object"!=typeof f[b]&&(f[b]={}),f=f[b]}f[g[g.length-1]]=function(){var e=d;return function(t){return a.invoke(e,t)}}()}var v=u[n](a,i.params);a.delayReturn()||a.completed()||a.complete(v)}catch(e){var y="runtime_error",w=null;if("string"==typeof e?w=e:"object"==typeof e&&(e instanceof Error?(y=e.constructor.name,w=e.message):e&&r(e)&&2==e.length?(y=e[0],w=e[1]):"string"==typeof e.error&&(y=e.error,e.message?"string"==typeof e.message?w=e.message:e=e.message:w="")),null===w)try{void 0===(w=JSON.stringify(e))&&(w=e.toString())}catch(t){w=e.toString()}a.error(y,w)}else a.error("method_not_found","No method '"+n+"' was (yet) bound by the provider")}else i.id&&i.callback?l[i.id]&&l[i.id].callbacks&&l[i.id].callbacks[i.callback]?l[i.id].callbacks[i.callback](i.params):s("ignoring invalid callback, id:"+i.id+" ("+i.callback+")"):i.id?l[i.id]?(i.error?l[i.id].error&&l[i.id].error(i.error,i.message):void 0!==i.result?l[i.id].success(i.result):l[i.id].success(),delete l[i.id],delete o[i.id]):s("ignoring invalid response: "+i.id):n&&u[n]&&u[n]({origin:e},i.params)};n(t.window,t.origin,t.scope,v);var y=function(e){return[t.scope,e].join("::")},w=function(e,n){if(!e)throw"postMessage called with null message";if(n||f){if("function"==typeof t.postMessageObserver)try{t.postMessageObserver(t.origin,e)}catch(e){s("postMessageObserver() raised an exception: "+e.toString())}s("post message: "+JSON.stringify(e)+" with origin "+t.origin),t.window.postMessage(JSON.stringify(e),t.origin)}else s("queue message: "+JSON.stringify(e)),g.push(e)},O=function(e,n){if(s("ready msg received"),f&&!t.reconnect)throw"received ready message while in ready state.";f=!0,d.length<6&&("publish-request"===n.type?d+="-R":d+="-L"),s("ready msg accepted."),"publish-request"===n.type&&R.notify({method:"__ready",params:{type:"publish-reply",publish:p}});for(var i=0;i<n.publish.length;i++)"bind"===n.publish[i].action?k([n.publish[i].method],R.remote):delete R.remote[n.publish[i].method];for(t.reconnect||R.unbind("__ready",!0);g.length;)w(g.splice(0,1)[0]);p=[],"function"==typeof t.onReady&&t.onReady(R)},k=function(e,t){var n;e=[].concat(e);for(var i=0;i<e.length;i++)t[n=e[i].toString()]=function(e){return function(t,n,i){n?R.call({method:e,params:t,success:n,error:i}):R.notify({method:e,params:t})}}(n)},j=function(e,t){k([t],R.remote)},M=function(e,t){R.remote[t]&&delete R.remote[t]},R={remote:{},unbind:function(e,n){if(u[e]){if(!delete u[e])throw"can't delete method: "+e;return t.publish&&!n&&(f?R.notify({method:"__unbind",params:e}):p.push({action:"unbind",method:e})),!0}return!1},bind:function(e,n,i){if(!e||"string"!=typeof e)throw"'method' argument to bind must be string";if(!n||"function"!=typeof n)throw"callback missing from bind params";if(u[e])throw"method '"+e+"' is already bound!";return u[e]=n,t.publish&&!i&&(f?R.notify({method:"__bind",params:e}):p.push({action:"bind",method:e})),this},call:function(t){if(!t)throw"missing arguments to call function";if(!t.method||"string"!=typeof t.method)throw"'method' argument to call must be string";if(!t.success||"function"!=typeof t.success)throw"'success' callback missing from call";var n={},i=[],r=[],s=function(e,t){if(r.indexOf(t)>=0)throw"params cannot be a recursive data structure";if(t&&r.push(t),"object"==typeof t)for(var o in t)if(t.hasOwnProperty(o)){var a=e+(e.length?"/":"")+o;"function"==typeof t[o]?(n[a]=t[o],i.push(a),delete t[o]):"object"==typeof t[o]&&s(a,t[o])}};s("",t.params);var a={id:e,method:y(t.method),params:t.params};i.length&&(a.callbacks=i),t.timeout&&b(e,t.timeout,y(t.method)),l[e]={callbacks:n,error:t.error,success:t.success},o[e]=v,e++,w(a)},notify:function(e){if(!e)throw"missing arguments to notify function";if(!e.method||"string"!=typeof e.method)throw"'method' argument to notify must be string";w({method:y(e.method),params:e.params})},destroy:function(){i(t.window,t.origin,t.scope),window.removeEventListener?window.removeEventListener("message",v,!1):window.detachEvent&&window.detachEvent("onmessage",v),f=!1,u={},h={},l={},t.origin=null,g=[],s("channel destroyed"),d=""}};return R.bind("__ready",O,!0),R.bind("__bind",j,!0),R.bind("__unbind",M,!0),t.remote&&k(t.remote,R.remote),setTimeout((function(){d.length>0&&w({method:y("__ready"),params:{type:"publish-request",publish:p}},!0)}),0),R}}}()}()},34:function(e,t,n){"use strict";n.r(t),n.d(t,"PeerTubePlayer",(function(){return a}));var i=n(1),r=n(23);class o{constructor(){this.eventRegistrations={}}bindToChannel(e){for(const t of Object.keys(this.eventRegistrations))e.bind(t,((e,n)=>this.fire(t,n)))}registerTypes(e){for(const t of e)this.eventRegistrations[t]={registrations:[]}}fire(e,t){this.eventRegistrations[e].registrations.forEach((e=>e(t)))}addListener(e,t){return this.eventRegistrations[e]?(this.eventRegistrations[e].registrations.push(t),!0):(console.warn(`PeerTube: addEventListener(): The event '${e}' is not supported`),!1)}removeListener(e,t){return!!this.eventRegistrations[e]&&(this.eventRegistrations[e].registrations=this.eventRegistrations[e].registrations.filter((e=>e===t)),!0)}}const s=["pause","play","playbackStatusUpdate","playbackStatusChange","resolutionUpdate","volumeChange"];class a{constructor(e,t){this.embedElement=e,this.scope=t,this.eventRegistrar=new o,this.eventRegistrar.registerTypes(s),this.constructChannel(),this.prepareToBeReady()}destroy(){this.embedElement.remove()}addEventListener(e,t){return this.eventRegistrar.addListener(e,t)}removeEventListener(e,t){return this.eventRegistrar.removeListener(e,t)}get ready(){return this.readyPromise}play(){return Object(i.a)(this,void 0,void 0,(function*(){yield this.sendMessage("play")}))}pause(){return Object(i.a)(this,void 0,void 0,(function*(){yield this.sendMessage("pause")}))}setVolume(e){return Object(i.a)(this,void 0,void 0,(function*(){yield this.sendMessage("setVolume",e)}))}getVolume(){return Object(i.a)(this,void 0,void 0,(function*(){return this.sendMessage("getVolume")}))}setCaption(e){return Object(i.a)(this,void 0,void 0,(function*(){yield this.sendMessage("setCaption",e)}))}getCaptions(){return Object(i.a)(this,void 0,void 0,(function*(){return this.sendMessage("getCaptions")}))}seek(e){return Object(i.a)(this,void 0,void 0,(function*(){yield this.sendMessage("seek",e)}))}setResolution(e){return Object(i.a)(this,void 0,void 0,(function*(){yield this.sendMessage("setResolution",e)}))}getResolutions(){return Object(i.a)(this,void 0,void 0,(function*(){return this.sendMessage("getResolutions")}))}getPlaybackRates(){return Object(i.a)(this,void 0,void 0,(function*(){return this.sendMessage("getPlaybackRates")}))}getPlaybackRate(){return Object(i.a)(this,void 0,void 0,(function*(){return this.sendMessage("getPlaybackRate")}))}setPlaybackRate(e){return Object(i.a)(this,void 0,void 0,(function*(){yield this.sendMessage("setPlaybackRate",e)}))}playNextVideo(){return Object(i.a)(this,void 0,void 0,(function*(){yield this.sendMessage("playNextVideo")}))}playPreviousVideo(){return Object(i.a)(this,void 0,void 0,(function*(){yield this.sendMessage("playPreviousVideo")}))}getCurrentPosition(){return Object(i.a)(this,void 0,void 0,(function*(){return this.sendMessage("getCurrentPosition")}))}constructChannel(){this.channel=r.build({window:this.embedElement.contentWindow,origin:"*",scope:this.scope||"peertube"}),this.eventRegistrar.bindToChannel(this.channel)}prepareToBeReady(){let e,t;this.readyPromise=new Promise(((n,i)=>{e=n,t=i})),this.channel.bind("ready",(n=>n?e():t())),this.channel.call({method:"isReady",success:t=>t?e():null})}sendMessage(e,t){return new Promise(((n,i)=>{this.channel.call({method:e,params:t,success:e=>n(e),error:e=>i(e)})}))}}window.PeerTubePlayer=a}});
//# sourceMappingURL=player.bundle.js.map