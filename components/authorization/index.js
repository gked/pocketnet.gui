var authorization = (function(){

	var self = new nModule();

	var essenses = {};

	//var essense = null;

	var Essense = function(p){

		var primary = deep(p, 'history');

		var id = 'secondary';

		if (primary) id = 'primary';
		if (p.inWnd) id = 'window';

		//////////////////////////////

		var el,
			essenseData,
			initialParameters;

		//var codeReader = new ZXing.BrowserQRCodeReader();

		var stayH = function(){

			console.log('stayH')

			localStorage['stay'] = '0';
			localStorage['mnemonic'] || '';

			self.app.user.stay = 0;

		}



		var stay = new Parameter({

			type : "BOOLEAN",
			name : "stay",
			id : 'stay',
			name : "Stay Signed",

			_onChange : function(v){

				if(v){

					/*dialog({
						html : self.app.localization.e('staysafe'),

						btn1text : self.app.localization.e('dyes'),
						btn2text : self.app.localization.e('dno'),

						fail : function(){
							stay.value = 0
							stay.el.removeAttr('checked')

							stayH();
						},

						class : 'yesnodialog'
					})*/

				}
				else
				{
					stayH()
				}
			}
		})

		var validation = function(m){
			return bitcoin.bip39.validateMnemonic(m)
		};

		var events = {


		
			login : function(){

				
				var p = {};

				var mnemonicKey = trim(el.login.val());

				//if(!validation(mnemonicKey)) return;

				localStorage['stay'] = boolToNumber(stay.value).toString()

				self.user.stay = stay.value

				self.user.signin(mnemonicKey, function(state){

					if(!state){

						sitemessage("You entered not valid private key")

						/*dialog({
							class : "one",
							header : self.app.localization.e('id98'),
							html : self.app.localization.e('id99'),
							btn1text : self.app.localization.e('daccept'),
							btn2text : self.app.localization.e('dcancel'),
						})*/

						return;
					}
				
					var _p = {};

					_p.href = essenseData.successHref;

					if(!_p.href && primary)

						_p.href = function(){

							if(self.app.user.validate()){
								return 'index';
							}
							else
							{

								if (self.app.errors.connection()){
									return 'userpage?id=test'
								}

								else{
									return 'filluser'
								}

								
							}

						}
					

						_p.nav = essenseData.nav;							

						_p.clbk = function(){
							topPreloader(100);

							var close = deep(initialParameters, 'container.close')

							if (close)
								close();

							if (essenseData.signInClbk)
								essenseData.signInClbk();
						}


					if(deep(essenseData, 'successHref') == '_this'){

						self.app.reloadModules(function(){

							if(self.app.user.validate()){
								var close = deep(initialParameters, 'container.close')

								if (close)
									close();

								if (essenseData.signInClbk)
									essenseData.signInClbk();
							}
							else
							{
								self.nav.api.loadSameThis('filluser', p)
							}
								
							
						});

					}
					else
					{
						self.app.reload(_p);
					}

					

				})
				

			},

		}

		var initEvents = function(p){
			
			el.enter.on('click', events.login);
	        

	        el.toRegistration.on('click', function(){


	        	self.nav.api.loadSameThis('registration', p)

	        })

	        initUpload({
				el : el.c.find('.uploadFile'),
	
				ext : ['txt', 'png', 'jpeg', 'jpg'],

				notexif : true,

				dropZone : el.c,

				action : function(file, clbk){

			
					if(file.ext == 'png' || file.ext == 'jpeg' || file.ext == 'jpg'){
						
						

						grayscaleImage(file.base64, function(image){
							
							/*var i = new Image()

								i.src = image

								i.onload = function(){
									try {
							            
							            codeReader.decodeFromImage(i).then(function(result){
							            	console.log('result', result)
							            });

							            

							        } catch (err) {
							            console.error(err);
							        }


							        
								}


							return	*/


							qrscanner.q.debug = true

							qrscanner.q.callback = function(data){

								console.log(data)

								if(data == 'error decoding QR Code'){
									sitemessage(self.app.localization.e('filedamaged'))
								}
								else
								{
									el.login.val(trim(data))

									events.login();
								}
							}

							qrscanner.q.decode(image)
						})

						
					
						
					}
					else
					{
						var b = file.base64.split(",")[1]

						var data = b64_to_utf8(b)

						var ds = data.split("/")


						if (ds[1]) {


							el.login.val(trim(ds[1]))

							events.login();
							
						}
						else
						{
							sitemessage(self.app.localization.e('filedamaged'))
						}
					}

					
					
				}
			})

			el.c.find('.loginValue').on('focus', function(){
		    	el.c.find('.inputTable').addClass('typeactive')
		    })

		    el.c.find('.loginValue').on('blur', function(){
		    	el.c.find('.inputTable').removeClass('typeactive')
		    })
	       
		}

		var make = function(){
			var p = parameters();

			ParametersLive([stay], el.c)

			if(p.restore){
				events.forgotPassword();
			}
		}

		return {

			primary : primary,

			id : id,

			getdata : function(clbk, p){

				if(p.state && primary)
				{

					self.nav.api.load({
						open : true,
						href : 'index',
						history : true
					})
					
				}
				else
				{

					stay.value = numberToBool(self.app.user.stay)

					var mnemonic = localStorage['mnemonic'] || '';

					/*if(!stay.value) */mnemonic = ''

					var data = {
						stay : stay,
						mnemonic : mnemonic
					};

					clbk(data);
				}

			},

			destroy : function(){
				el = {};
			},
			
			init : function(p){

				el = {};
				el.c = p.el.find('#' + self.map.id)

				el.login = el.c.find(".loginValue");
				el.pwd = el.c.find(".pwdValue");
				el.enter = el.c.find('.enter');
				el.toRegistration = el.c.find('.toRegistration');
				el.forgotPassword = el.c.find('.forgotPassword');

				essenseData = p.essenseData || {};
				initialParameters = p;

				initEvents(p);

				make();

				/*dialog({
					html : "<p>Pocketnet.app is still under development.</p><p>You may experience outages due to development work. <b>Beta test starts on Jan 23, 2019</b>.</p>",
					id : 'betasign',

					class : 'betasign',

					btn2text : "Okay"
				})*/

				p.clbk(null, p);

			},

			tooltip : {
				options : {
					position : 'left',
					functionPosition: function(instance, helper, position){
				        position.coord.top = 10;
				        position.coord.left += 10;

				        return position;
				    }
				},
				event : 'mouseenter'
				
			},

			wnd : {
				class : 'withoutButtons allscreen'
			}
		}
	};

	self.run = function(p){

		var essense = self.addEssense(essenses, Essense, p);

		self.init(essense, p);

	};

	self.stop = function(){

		_.each(essenses, function(essense){

			essense.destroy();

		})

	}

	return self;
})();


if(typeof module != "undefined")
{
	module.exports = authorization;
}
else{

	app.modules.authorization = {};
	app.modules.authorization.module = authorization;

}