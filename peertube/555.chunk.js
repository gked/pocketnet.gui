(globalThis.webpackChunkpeertube_client=globalThis.webpackChunkpeertube_client||[]).push([[555],{5308:(e,t,r)=>{"use strict";r.r(t),r.d(t,{WebTorrentPlugin:()=>V});var i=r(3654),n=r.n(i),o=r(3379),a=r(8859),l=r(7012),s=r(7862),u=r(4170),d=r(6546),h=r(6553),c=r(4575),p=r(2286),f=r(2236).Buffer;function y(e,t,r,i,n,o,a){try{var l=e[o](a),s=l.value}catch(u){return void r(u)}l.done?t(s):Promise.resolve(s).then(i,n)}function v(e){return function(){var t=this,r=arguments;return new Promise((function(i,n){var o=e.apply(t,r);function a(e){y(o,i,n,a,l,"next",e)}function l(e){y(o,i,n,a,l,"throw",e)}a(void 0)}))}}function b(e,t){for(var r=0;r<t.length;r++){var i=t[r];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}function k(e,t,r){return t&&b(e.prototype,t),r&&b(e,r),Object.defineProperty(e,"prototype",{writable:!1}),e}function g(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function m(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),Object.defineProperty(e,"prototype",{writable:!1}),t&&T(e,t)}function T(e,t){return T=Object.setPrototypeOf?Object.setPrototypeOf.bind():function(e,t){return e.__proto__=t,e},T(e,t)}function w(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}();return function(){var r,i=E(e);if(t){var n=E(this).constructor;r=Reflect.construct(i,arguments,n)}else r=i.apply(this,arguments);return R(this,r)}}function R(e,t){if(t&&("object"==typeof t||"function"==typeof t))return t;if(void 0!==t)throw new TypeError("Derived constructors may only return object or undefined");return function(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}(e)}function E(e){return E=Object.setPrototypeOf?Object.getPrototypeOf.bind():function(e){return e.__proto__||Object.getPrototypeOf(e)},E(e)}let A=function(e){m(r,e);var t=w(r);function r(e){var i;return g(this,r),(i=t.call(this,e)).version(1).stores({chunks:"id"}),i}return k(r)}(h.ZP),O=function(e){m(r,e);var t=w(r);function r(){var e;return g(this,r),(e=t.call(this,"webtorrent-expiration")).version(1).stores({databases:"name,expiration"}),e}return k(r)}(h.ZP),P=function(e){m(o,e);var t,r,i,n=w(o);function o(e,t){var r,i;if(g(this,o),(r=n.call(this)).pendingPut=[],r.memoryChunks={},r.databaseName="webtorrent-chunks-",t||(t={}),(null===(i=t.torrent)||void 0===i?void 0:i.infoHash)?r.databaseName+=t.torrent.infoHash:r.databaseName+="-default",r.setMaxListeners(100),r.chunkLength=Number(e),!r.chunkLength)throw new Error("First argument must be a chunk length");return r.length=Number(t.length)||1/0,r.length!==1/0&&(r.lastChunkLength=r.length%r.chunkLength||r.chunkLength,r.lastChunkIndex=Math.ceil(r.length/r.chunkLength)-1),r.db=new A(r.databaseName),r.expirationDB=new O,r.runCleaner(),r}return k(o,[{key:"put",value:function(e,t,r){var i=this;let n=e===this.lastChunkIndex;return n&&t.length!==this.lastChunkLength?this.nextTick(r,new Error("Last chunk length must be "+this.lastChunkLength)):n||t.length===this.chunkLength?(this.memoryChunks[e]=!0,this.pendingPut.push({id:e,buf:t,cb:r}),void(this.putBulkTimeout||(this.putBulkTimeout=setTimeout(v((function*(){let e=i.pendingPut;i.pendingPut=[],i.putBulkTimeout=void 0;try{yield i.db.transaction("rw",i.db.chunks,(()=>i.db.chunks.bulkPut(e.map((e=>({id:e.id,buf:e.buf}))))))}catch(t){a.k.info("Cannot bulk insert chunks. Store them in memory.",t),e.forEach((e=>{i.memoryChunks[e.id]=e.buf}))}finally{e.forEach((e=>e.cb()))}})),o.BUFFERING_PUT_MS)))):this.nextTick(r,new Error("Chunk length must be "+this.chunkLength))}},{key:"get",value:function(e,t,r){var i=this;if("function"==typeof t)return this.get(e,null,t);let n=this.memoryChunks[e];if(void 0===n){let e=new Error("Chunk not found");return e.notFound=!0,p.nextTick((()=>r(e)))}if(!0!==n)return r(null,n);this.db.transaction("r",this.db.chunks,v((function*(){let n=yield i.db.chunks.get({id:e});if(void 0===n)return r(null,f.alloc(0));let o=n.buf;if(!t)return i.nextTick(r,null,o);let a=t.offset||0;return r(null,o.slice(a,(t.length||o.length-a)+a))}))).catch((e=>(a.k.error(e),r(e))))}},{key:"close",value:function(e){return this.destroy(e)}},{key:"destroy",value:(i=v((function*(e){try{return this.pendingPut&&(clearTimeout(this.putBulkTimeout),this.pendingPut=null),this.cleanerInterval&&(clearInterval(this.cleanerInterval),this.cleanerInterval=null),this.db&&(this.db.close(),yield this.dropDatabase(this.databaseName)),this.expirationDB&&(this.expirationDB.close(),this.expirationDB=null),e()}catch(t){return a.k.error("Cannot destroy peertube chunk store.",t),e(t)}})),function(e){return i.apply(this,arguments)})},{key:"runCleaner",value:function(){this.checkExpiration(),this.cleanerInterval=setInterval((()=>{this.checkExpiration()}),o.CLEANER_INTERVAL_MS)}},{key:"checkExpiration",value:(r=v((function*(){var e=this;let t=[];try{yield this.expirationDB.transaction("rw",this.expirationDB.databases,v((function*(){yield e.expirationDB.databases.put({name:e.databaseName,expiration:(new Date).getTime()+o.CLEANER_EXPIRATION_MS});let r=(new Date).getTime();t=yield e.expirationDB.databases.where("expiration").below(r).toArray()})))}catch(r){a.k.error("Cannot update expiration of fetch expired databases.",r)}for(let i of t)yield this.dropDatabase(i.name)})),function(){return r.apply(this,arguments)})},{key:"dropDatabase",value:(t=v((function*(e){let t=new A(e);a.k.info(`Destroying IndexDB database ${e}`);try{yield t.delete(),yield this.expirationDB.transaction("rw",this.expirationDB.databases,(()=>this.expirationDB.databases.where({name:e}).delete()))}catch(r){a.k.error(`Cannot delete ${e}.`,r)}})),function(e){return t.apply(this,arguments)})},{key:"nextTick",value:function(e,t,r){p.nextTick((()=>e(t,r)),void 0)}}]),o}(c.EventEmitter);P.BUFFERING_PUT_MS=1e3,P.CLEANER_INTERVAL_MS=6e4,P.CLEANER_EXPIRATION_MS=3e5;var F=r(1301);let S=r(6832),_=r(4634),I=[".m4a",".m4v",".mp4"];function C(e,t,r,i){return function(e){if(null==e)throw new Error("file cannot be null or undefined");if("string"!=typeof e.name)throw new Error("missing or invalid file.name property");if("function"!=typeof e.createReadStream)throw new Error("missing or invalid file.createReadStream property")}(e),function(e,t,r,i){let n,o,l=(0,F.extname)(e.name).toLowerCase(),s=0;try{o=I.includes(l)?(h(),n.addEventListener("error",(function e(t){return n.removeEventListener("error",e),i(t)})),n.addEventListener("loadstart",c),new _(e,n)):u()}catch(p){return i(p)}function u(){let t=L(e.name,arguments.length>0&&void 0!==arguments[0]&&arguments[0]);h(),n.addEventListener("error",(function e(r){return n.removeEventListener("error",e),t.includes("vp8")?d(!0):i(r)})),n.addEventListener("loadstart",c);let r=new S(n),o=r.createWriteStream(t);return e.createReadStream().pipe(o),s&&(n.currentTime=s),r}function d(){let e=arguments.length>0&&void 0!==arguments[0]&&arguments[0];a.k.info(!0===e?"Falling back to media source with VP9 enabled.":"Falling back to media source.."),u(e)}function h(){void 0===n&&(n=t,n.addEventListener("progress",(function(){s=t.currentTime})))}function c(){n.removeEventListener("loadstart",c),r.autoplay&&n.play(),i(null,o)}}(e,t,r,i)}function L(e){let t=arguments.length>1&&void 0!==arguments[1]&&arguments[1],r=(0,F.extname)(e).toLowerCase();return".mp4"===r?'video/mp4; codecs="avc1.640029, mp4a.40.5"':".webm"===r?!0===t?'video/webm; codecs="vp9, opus"':'video/webm; codecs="vp8, vorbis"':void 0}function x(e,t){return x=Object.setPrototypeOf?Object.setPrototypeOf.bind():function(e,t){return e.__proto__=t,e},x(e,t)}function N(e,t){if(t&&("object"==typeof t||"function"==typeof t))return t;if(void 0!==t)throw new TypeError("Derived constructors may only return object or undefined");return function(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}(e)}function D(e){return D=Object.setPrototypeOf?Object.getPrototypeOf.bind():function(e){return e.__proto__||Object.getPrototypeOf(e)},D(e)}let U=r(9432),V=function(e){!function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),Object.defineProperty(e,"prototype",{writable:!1}),t&&x(e,t)}(c,e);var t,r,i,n,h=(i=c,n=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}(),function(){var e,t=D(i);if(n){var r=D(this).constructor;e=Reflect.construct(t,arguments,r)}else e=t.apply(this,arguments);return N(this,e)});function c(e,t){var r;return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,c),(r=h.call(this,e)).autoplay=!1,r.startTime=0,r.CONSTANTS={INFO_SCHEDULER:1e3,AUTO_QUALITY_SCHEDULER:3e3,AUTO_QUALITY_THRESHOLD_PERCENT:30,AUTO_QUALITY_OBSERVATION_TIME:1e4,AUTO_QUALITY_HIGHER_RESOLUTION_DELAY:5e3,BANDWIDTH_AVERAGE_NUMBER_OF_VALUES:5},r.webtorrent=new o({tracker:{rtcConfig:(0,d.gI)()},dht:!1}),r.destroyingFakeRenderer=!1,r.autoResolution=!0,r.autoResolutionPossible=!0,r.isAutoResolutionObservation=!1,r.playerRefusedP2P=!1,r.downloadSpeeds=[],r.startTime=(0,s.h8)(t.startTime),r.autoplay=t.autoplay,r.playerRefusedP2P=t.playerRefusedP2P,r.videoFiles=t.videoFiles,r.videoDuration=t.videoDuration,r.savePlayerSrcFunction=r.player.src,r.playerElement=t.playerElement,r.player.ready((()=>{let e=r.player.options_,i=(0,u.OV)();void 0!==i&&r.player.volume(i);let n=void 0!==e.muted?e.muted:(0,u.W7)();void 0!==n&&r.player.muted(n),console.log("CHANGE DURATION",t.videoDuration),r.player.duration(t.videoDuration),r.initializePlayer(),r.runTorrentInfoScheduler(),r.player.one("play",(()=>{r.runAutoQualitySchedulerTimer=setTimeout((()=>r.runAutoQualityScheduler()),r.CONSTANTS.AUTO_QUALITY_SCHEDULER)}))})),r}return t=c,r=[{key:"dispose",value:function(){clearTimeout(this.addTorrentDelay),clearTimeout(this.qualityObservationTimer),clearTimeout(this.runAutoQualitySchedulerTimer),clearInterval(this.torrentInfoInterval),clearInterval(this.autoQualityInterval),this.flushVideoFile(this.currentVideoFile,!1),this.destroyFakeRenderer()}},{key:"getCurrentResolutionId",value:function(){return this.currentVideoFile?this.currentVideoFile.resolution.id:-1}},{key:"updateVideoFile",value:function(e){let t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},r=arguments.length>2&&void 0!==arguments[2]?arguments[2]:()=>{};if(!e){let t=(0,u.zZ)();e=t?this.getAppropriateFile(t):this.pickAverageVideoFile()}if(!e)throw Error("Can't update video file since videoFile is undefined.");if(void 0!==this.currentVideoFile&&this.currentVideoFile.magnetUri===e.magnetUri)return;this.player.peertube().hideFatalError(),this.player.src=()=>!0;let i=this.player.playbackRate(),n=this.currentVideoFile;if(this.currentVideoFile=e,(0,l.gn)()||this.playerRefusedP2P)return this.fallbackToHttp(t,(()=>(this.player.playbackRate(i),r())));this.addTorrent(this.currentVideoFile.magnetUri,n,t,(()=>(this.player.playbackRate(i),r()))),this.selectAppropriateResolution(!0)}},{key:"updateEngineResolution",value:function(e){let t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0,r=this.player.currentTime(),i=this.player.paused();i||this.player.bigPlayButton.hide(),0===e?(this.player.addClass("vjs-playing-audio-only-content"),this.player.posterImage.show()):(this.player.removeClass("vjs-playing-audio-only-content"),this.player.posterImage.hide());let n=this.videoFiles.find((t=>t.resolution.id===e)),o={forcePlay:!1,delay:t,seek:r+t/1e3};this.updateVideoFile(n,o)}},{key:"flushVideoFile",value:function(e){let t=!(arguments.length>1&&void 0!==arguments[1])||arguments[1];void 0!==e&&this.webtorrent.get(e.magnetUri)&&(!0===t&&this.renderer&&this.renderer.destroy&&this.renderer.destroy(),this.webtorrent.remove(e.magnetUri),a.k.info(`Removed ${e.magnetUri}`))}},{key:"disableAutoResolution",value:function(){this.autoResolution=!1,this.autoResolutionPossible=!1,this.player.peertubeResolutions().disableAutoResolution()}},{key:"isAutoResolutionPossible",value:function(){return this.autoResolutionPossible}},{key:"getTorrent",value:function(){return this.torrent}},{key:"getCurrentVideoFile",value:function(){return this.currentVideoFile}},{key:"changeQuality",value:function(e){-1!==e?(this.autoResolution=!1,this.updateEngineResolution(e),this.selectAppropriateResolution(!1)):!0===this.autoResolutionPossible&&(this.autoResolution=!0,this.selectAppropriateResolution(!1))}},{key:"addTorrent",value:function(e,t,r,i){if(!e)return this.fallbackToHttp(r,i);a.k.info(`Adding ${e}.`);let n=this.torrent;this.torrent=this.webtorrent.add(e,{store:function(e,t){return new U(new P(e,t),{max:100})}},(o=>{a.k.info(`Added ${e}.`),n&&(this.stopTorrent(n),r.delay&&this.renderFileInFakeElement(o.files[0],r.delay)),this.addTorrentDelay=setTimeout((()=>{this.destroyFakeRenderer();let e=this.player.paused();this.flushVideoFile(t),r.seek&&this.player.currentTime(r.seek),C(o.files[0],this.playerElement,{autoplay:!1,controls:!0},((t,n)=>(this.renderer=n,t?this.fallbackToHttp(r,i):this.tryToPlay((t=>t?i(t):(r.seek&&this.seek(r.seek),!1===r.forcePlay&&!0===e&&this.player.pause(),i()))))))}),r.delay||0)})),this.torrent.on("error",(e=>a.k.error(e))),this.torrent.on("warning",(e=>{if(-1===e.message.indexOf("Unsupported tracker protocol"))if(-1===e.message.indexOf("Ice connection failed")){if(-1!==e.message.indexOf("incorrect info hash"))return a.k.error("Incorrect info hash detected, falling back to torrent file."),this.addTorrent(this.torrent.xs,t,{forcePlay:!0,seek:r.seek},i);-1!==e.message.indexOf("from xs param")&&this.handleError(e),a.k.warn(e)}else a.k.info(e)}))}},{key:"tryToPlay",value:function(e){e||(e=function(){});let t=this.player.play();return void 0!==t?t.then((()=>e())).catch((t=>{if(!t.message.includes("The play() request was interrupted by a call to pause()"))return a.k.warn(t),this.player.pause(),this.player.posterImage.show(),this.player.removeClass("vjs-has-autoplay"),this.player.removeClass("vjs-has-big-play-button-clicked"),this.player.removeClass("vjs-playing-audio-only-content"),e()})):e()}},{key:"seek",value:function(e){this.player.currentTime(e),this.player.handleTechSeeked_()}},{key:"getAppropriateFile",value:function(e){if(void 0===this.videoFiles)return;if(1===this.videoFiles.length)return this.videoFiles[0];let t=this.videoFiles.filter((e=>0!==e.resolution.id));if(0===t.length)return;if(this.torrent&&1===this.torrent.progress&&this.player.ended())return this.currentVideoFile;e||(e=this.getAndSaveActualDownloadSpeed());let r=this.playerElement.offsetHeight,i=t[0].resolution.id;for(let o=t.length-1;o>=0;o--){let e=t[o].resolution.id;if(0!==e&&e>=r){i=e;break}}let n=t.filter((e=>e.resolution.id<=i)).filter((t=>{let r=t.size/this.videoDuration,i=r;return(!this.currentVideoFile||t.resolution.id>this.currentVideoFile.resolution.id)&&(i+=r*this.CONSTANTS.AUTO_QUALITY_THRESHOLD_PERCENT/100),e>i}));return 0===n.length?(0,d.FE)(t):(0,d.qx)(n)}},{key:"getAndSaveActualDownloadSpeed",value:function(){let e=Math.max(this.downloadSpeeds.length-this.CONSTANTS.BANDWIDTH_AVERAGE_NUMBER_OF_VALUES,0),t=this.downloadSpeeds.slice(e,this.downloadSpeeds.length);if(0===t.length)return-1;let r=t.reduce(((e,t)=>e+t)),i=Math.round(r/t.length);return(0,u.M_)(i),i}},{key:"initializePlayer",value:function(){if(this.buildQualities(),0===this.videoFiles.length)return void this.player.addClass("disabled");if(this.autoplay)return this.player.posterImage.hide(),this.updateVideoFile(void 0,{forcePlay:!0,seek:this.startTime});let e=this.player.play.bind(this.player);this.player.play=()=>{this.player.addClass("vjs-has-big-play-button-clicked"),this.player.play=e,this.updateVideoFile(void 0,{forcePlay:!0,seek:this.startTime})}}},{key:"runAutoQualityScheduler",value:function(){this.autoQualityInterval=setInterval((()=>{if(null==this.torrent)return;if(!1===this.autoResolution)return;if(!0===this.isAutoResolutionObservation)return;let e=this.getAppropriateFile(),t=!1,r=0;this.isPlayerWaiting()&&e.resolution.id<this.currentVideoFile.resolution.id?(a.k.info(`Downgrading automatically the resolution to: ${e.resolution.label}`),t=!0):e.resolution.id>this.currentVideoFile.resolution.id&&(a.k.info(`Upgrading automatically the resolution to: ${e.resolution.label}`),t=!0,r=this.CONSTANTS.AUTO_QUALITY_HIGHER_RESOLUTION_DELAY),!0===t&&(this.updateEngineResolution(e.resolution.id,r),this.isAutoResolutionObservation=!0,this.qualityObservationTimer=setTimeout((()=>{this.isAutoResolutionObservation=!1}),this.CONSTANTS.AUTO_QUALITY_OBSERVATION_TIME))}),this.CONSTANTS.AUTO_QUALITY_SCHEDULER)}},{key:"isPlayerWaiting",value:function(){var e;return null===(e=this.player)||void 0===e?void 0:e.hasClass("vjs-waiting")}},{key:"runTorrentInfoScheduler",value:function(){this.torrentInfoInterval=setInterval((()=>{if(void 0!==this.torrent)return null===this.torrent?this.player.trigger("p2pInfo",!1):(0!==this.webtorrent.downloadSpeed&&this.downloadSpeeds.push(this.webtorrent.downloadSpeed),this.player.trigger("p2pInfo",{source:"webtorrent",http:{downloadSpeed:0,uploadSpeed:0,downloaded:0,uploaded:0},p2p:{downloadSpeed:this.torrent.downloadSpeed,numPeers:this.torrent.numPeers,uploadSpeed:this.torrent.uploadSpeed,downloaded:this.torrent.downloaded,uploaded:this.torrent.uploaded},bandwidthEstimate:this.webtorrent.downloadSpeed}))}),this.CONSTANTS.INFO_SCHEDULER)}},{key:"fallbackToHttp",value:function(e,t){let r=this.player.paused();this.disableAutoResolution(),this.flushVideoFile(this.currentVideoFile,!0),this.torrent=null,this.player.one("error",(()=>this.player.peertube().displayFatalError()));let i=this.currentVideoFile.fileUrl;return this.player.src=this.savePlayerSrcFunction,this.player.src(i),this.selectAppropriateResolution(!0),this.player.trigger("sourcechange"),this.tryToPlay((i=>i&&t?t(i):(e.seek&&this.seek(e.seek),!1===e.forcePlay&&!0===r&&this.player.pause(),t?t():void 0)))}},{key:"handleError",value:function(e){return this.player.trigger("customError",{err:e})}},{key:"pickAverageVideoFile",value:function(){if(1===this.videoFiles.length)return this.videoFiles[0];let e=this.videoFiles.filter((e=>0!==e.resolution.id));return e[Math.floor(e.length/2)]}},{key:"stopTorrent",value:function(e){e.pause(),e.removePeer(e.ws)}},{key:"renderFileInFakeElement",value:function(e,t){this.destroyingFakeRenderer=!1;let r=document.createElement("video");C(e,r,{autoplay:!1,controls:!1},((e,i)=>{this.fakeRenderer=i,!1===this.destroyingFakeRenderer&&e&&a.k.error("Cannot render new torrent in fake video element.",e),r.currentTime=this.player.currentTime()+(t-2e3)}))}},{key:"destroyFakeRenderer",value:function(){if(this.fakeRenderer){if(this.destroyingFakeRenderer=!0,this.fakeRenderer.destroy)try{this.fakeRenderer.destroy()}catch(e){a.k.info("Cannot destroy correctly fake renderer.",e)}this.fakeRenderer=void 0}}},{key:"buildQualities",value:function(){let e=this.videoFiles.map((e=>({id:e.resolution.id,label:this.buildQualityLabel(e),height:e.resolution.id,selected:!1,selectCallback:()=>this.changeQuality(e.resolution.id)})));e.push({id:-1,label:this.player.localize("Auto"),selected:!0,selectCallback:()=>this.changeQuality(-1)}),this.player.peertubeResolutions().add(e)}},{key:"buildQualityLabel",value:function(e){let t=e.resolution.label;return e.fps&&e.fps>=50&&(t+=e.fps),t}},{key:"selectAppropriateResolution",value:function(e){let t=this.autoResolution?-1:this.getCurrentResolutionId(),r=this.autoResolution?this.getCurrentResolutionId():void 0;this.player.peertubeResolutions().select({id:t,autoResolutionChosenId:r,byEngine:e})}}],r&&function(e,t){for(var r=0;r<t.length;r++){var i=t[r];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}(t.prototype,r),Object.defineProperty(t,"prototype",{writable:!1}),c}(n().getPlugin("plugin"));n().registerPlugin("webtorrent",V)},5295:(e,t,r)=>{"use strict";e.exports=r(4180)},8797:(e,t,r)=>{"use strict";e.exports=r(6096)},743:(e,t,r)=>{"use strict";r.r(t),r.d(t,{NOOP:()=>i});let i=0},3358:(e,t,r)=>{"use strict";e.exports=r(4002)},2528:()=>{},970:()=>{},1982:()=>{},1156:()=>{},1356:()=>{},2378:()=>{},2067:()=>{},6322:()=>{},4854:()=>{},9608:()=>{},8856:()=>{},5688:()=>{},7525:()=>{},7523:()=>{},146:()=>{},2050:()=>{}}]);
//# sourceMappingURL=555.chunk.js.map