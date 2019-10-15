var notifications = (function(){

	var self = new nModule();

	var essenses = {};

	var Essense = function(p){

		var primary = deep(p, 'history');

		var el, seenTimer, inel, t = '';

		var actions = {
			open : function(id, type){

				self.closeContainer();
			},

			seen : function(){
				var els = el.c.find('.notification:not(.seen)')

				var f = 'offset'


				if(inel) f = 'position'

				if (els.length){


					seenTimer = slowMade(function(){

						self.app.platform.sdk.notifications.seenall()
						
						/*var inv = inView(els, {
							inel : inel,
							offset : 100,
							mode : 'part',
							f : f
						})

						console.log('inv.length', inv.length) */

						if (els.length > 0){

							var ids = [];

							els.addClass('seen')

							/*els.each(function(){

								ids.push($(this).attr('notification'))
							})*/

							//self.app.platform.sdk.notifications.seen(ids)
							
						}


					}, seenTimer, 50)
				}
			}
		}

		var events = {
			open : function(){
				var type = $(this).attr('type')
				var id = $(this).attr('id')

				actions.open(id, type);
			},

			showAll : function(){
				self.nav.api.go({
					href : 'userpage?id=notifications&report=notifications',
					history : true,
					open : true
				})

				self.closeContainer();
			},

			seen : function(){
				actions.seen()
			}
		}

		var renders = {
			
			notifications : function(p, clbk){

				//console.log('self.app.platform.sdk.notifications.storage.notifications', self.app.platform.sdk.notifications.storage.notifications)

				if(!p) p = {};

				var _notifications = p.notifications || self.app.platform.sdk.notifications.storage.notifications;
				var rnow = false;
				

				console.log('_notifications', _notifications)

				p.el = el.new;

				if(!p.el) return

				var time = self.app.platform.currentTime()
				var timedif = 286400

				

				if(p.seenFilter){
					/*_notifications = _.filter(_notifications, function(n){
						if(!n.seen || time - n.seen < timedif){
							return true
						}
					})*/
					
				}

				var watched = - _notifications.length + (p.notifications || self.app.platform.sdk.notifications.storage.notifications).length
					
				
				_notifications = _.sortBy(_notifications, function(n){
					return Number(-n.nblock)
				})

				var currentDate = new Date();

				var grou = group(_notifications, function(n){

					if (p.now) return 'ntnow';

					var d = new Date(n.time * 1000);

					if (d.addMinutes(60) > currentDate) return 'ntlasthour';

					if (dateToStrSmall(d) == dateToStrSmall(currentDate)) return 'nttoday';

					if (d.getFullYear().toString() + (d.getMonth() + 1).toString() == currentDate.getFullYear().toString() + (currentDate.getMonth() + 1).toString()) return 'ntmounth';

					return 'ntearlier';

				})

				if(p.now){

					var ntnow = p.el.find('.group[index="ntnow"]')

					if (ntnow.length) p.el = ntnow.find('.groupContent')

					rnow = true

				}

				console.log('grou', grou)

				self.shell({
					name :  'notifications',
					el :   p.el,
					data : {
						notifications : _notifications,
						ws : self.app.platform.ws,
						now : p.now,
						grou : grou,
						rnow : rnow
					},
					inner : prepend

				}, function(_p){

					renders.loadingAndEmpty()

					if(watched){
						el.c.find('.more').html('('+ watched +')')
					}

					

					_.each(_notifications, function(n){
						var e = self.app.platform.ws.messages[n.msg].fastMessageEvents

						if (e){

							e(n, {
								el : _p.el.find('.notification[notification="'+n.txid+'"]')
							})
						}
					})

					

					self.app.nav.api.links(null, el.c, function(){
						self.closeContainer()
					})


					actions.seen()
					
				})
			},

			loadingAndEmpty : function(){

				if(self.app.errors.connection()){

					el.loader.addClass('hidden')
					el.empty.addClass('hidden')
					

					el.error.removeClass('hidden')

					return
				}

				el.error.addClass('hidden')


				if (self.app.platform.sdk.notifications.loading){
					el.loader.removeClass('hidden')
				}
				else{
					el.loader.addClass('hidden')

					if(el.c.find('.notification').length){
						el.empty.removeClass('hidden')
					}
					else{
						el.loader.addClass('hidden')
					}
				}
			}
		}

		var state = {
			save : function(){

			},
			load : function(){
				
			}
		}

		var initEvents = function(){
			el.c.find('.showAll').on('click', events.showAll)

			inel.addEventListener('scroll', events.seen);


			
			el.c.find('.closecontainer').on('click', function(){
				self.closeContainer()
			})

			self.iclbks.lenta = function(){
				renders.loadingAndEmpty()
			}
		}

		var make = function(){
			renders.notifications({
				seenFilter : p.inTooltip
			});
		}

		var addWSClbk = function(){
			self.app.platform.sdk.notifications.clbks.added['notifications' + t] = function(notifications, now){
				renders.notifications({
					notifications : notifications,
					now : now
				})
			}
		}

		var removeWSClbk = function(){
			delete self.app.platform.sdk.notifications.clbks.added['notifications' + t]
		}

		return {
			primary : primary,

			getdata : function(clbk){

				var data = {};

				clbk(data);

			},

			destroy : function(){
				el = {};

				t = ''

				if (seenTimer)
					clearTimeout(seenTimer)

				seenTimer = null

				inel.removeEventListener('scroll', events.seen);

				removeWSClbk();

				delete self.iclbks.lenta
			},
			
			init : function(p){

				state.load();

				el = {};
				el.c = p.el.find('#' + self.map.id);
				
				el.new = el.c.find('.newWrapper')
				el.loader = el.c.find('.loader')
				el.empty = el.c.find('.empty')
				el.error = el.c.find('.error')

				if(p.insert == 'tooltip'){
					inel = el.c.find('.nabsContentWrapper')[0]

					t = 'tt'
				}
				else
				{
					t = ''
					inel = window
				}

				jinel = $(inel)

				renders.loadingAndEmpty()

				initEvents();

				make(p.insert);

				addWSClbk();

				p.clbk(null, p);
				
			},

			tooltip : {
				options : {
					theme : "lighttooltip notificationTolltip",
					position : 'left',
					zIndex : 50,
					distance : -47,
					functionPosition: function(instance, helper, position){
				        position.coord.top = 0;
						position.coord.left = 0;

				        return position;
					},
					arrow : false,

					trigger : 'custom',
					triggerOpen : {
						click: true
					},
					triggerClose : {
					}
				},
				event : 'click'
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
	module.exports = notifications;
}
else{

	app.modules.notifications = {};
	app.modules.notifications.module = notifications;

}