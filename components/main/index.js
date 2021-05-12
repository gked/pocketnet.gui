var main = (function(){

	var self = new nModule();

	var essenses = {};

	var Essense = function(p){

		var primary = deep(p, 'history');

		var el;

		var roller = null, lenta = null, share = null, panel,leftpanel, uptimer = null;

		var videomain = false

		var upbutton = null, upbackbutton = null, plissing = null, searchvalue = '', searchtags = null, result, fixedBlock, openedpost = null;

		var currentMode = 'common', hsready = false;

		var lastscroll = 0, savedScroll = 0

		var mobilemodes = [{
			mode : 'leftshow',
			icon : 'fas fa-hashtag'
		},{
			mode : 'mainshow',
			icon : 'fas fa-home'
		},{
			mode : 'rightshow',
			icon : 'fas fa-arrow-right'
		}]

		var swiper;

		var mobilemode = 'mainshow'

		var helpers = {
			
		}
		
		var actions = {
			refreshSticky : function(){

				// if (hsready){
				// 	el.panel.hcSticky('refresh');
				// 	el.leftpanel.hcSticky('refresh');
					
				// }
					
			},
			addbutton : function(){

				self.app.platform.ui.share()

				/*globalpreloader(true, true)

				setTimeout(function(){
					self.nav.api.load({

						open : true,
						id : 'share',
						inWnd : true,
	
						eid : 'postin',
						
						clbk : function(e, p){
							globalpreloader(false)
						},
	
						essenseData : {
							close : function(){
	
								share.make()
	
							},
							post : function(){
								share.make()
	
	
								if (plissing)
									plissing.destroy()
								
							},	
							absolute : true
						}
	
					})
				}, 50)*/
				
				
			},
			addbuttonscroll  : function(){
				let scroll = $(window).scrollTop(), wWidth = window.innerWidth;
				if(scroll > 400){
					el.addbutton.addClass('scrollactive')
				}
				else{
					el.addbutton.removeClass('scrollactive')
				}
				// If desktop screen size, update both panels
				if (wWidth > 1280) {
					actions.updatePanelPosition(el.leftPanelSlide);
					actions.updatePanelPosition(el.rightPanelSlide);
				}
				// If medium screen size, update only the left panel, set the other one to default CSS
				else if (wWidth > 768) {
					actions.updatePanelPosition(el.leftPanelSlide);
					actions.updatePanelPosition(el.rightPanelSlide, true);
				}
				// Else, mobile screen size, set both panels to default CSS
				else {
					actions.updatePanelPosition(el.leftPanelSlide, true);
					actions.updatePanelPosition(el.rightPanelSlide, true);
				}
				// Update our variable for the next call
				savedScroll = scroll
			},
			updatePanelPosition : function(panel, removeLocalCss) {
				// Check panel
				if (!(panel && panel.length > 0 && panel[0].offsetTop != undefined && panel.height))
					return;
				// If we simply need the local CSS rules
				if (removeLocalCss === true) {
					panel[0].style.removeProperty('position');
					panel[0].style.removeProperty('top');
					return;
				}
				// Current top position of the panel
				let savedOffsetTop = panel[0].offsetTop, topNavbarHeight = 65,
					wHeight = window.innerHeight, scroll = $(window).scrollTop(),
					panelHeight = panel.height();
				// Determine if we are scrolling up or down
				if ((savedScroll - scroll) < 0) {
					// We are scrolling down
					// If we need to make the panel sticky to keep it in the view
					if ((scroll) > (savedOffsetTop + (panelHeight - wHeight + topNavbarHeight))) {
						panel.css('position', 'sticky');
						panel.css('top', -(panelHeight - wHeight));
					} else {
						panel.css('position', 'relative');
						panel.css('top', savedOffsetTop);
					}
				} else {
					// We are scrolling up
					// If we need to make the panel sticky to keep it in the view
					if ((scroll) < savedOffsetTop + topNavbarHeight) {
						panel.css('position', 'sticky');
						panel.css('top', topNavbarHeight);
					} else {
						panel.css('position', 'relative');
						panel.css('top', savedOffsetTop);
					}
				}
			},
			panelTopPosition : function(){

				return

				if(!isMobile()){
					var s = $(window).scrollTop();

					if (s > 45){
						el.panel.closest('.fxd').addClass('dfxd')
					}
					else
					{
						el.panel.closest('.fxd').removeClass('dfxd')
					}

					actions.panelPosition()
				}

			},
			panelPosition : function(){

				return

				var cnt = el.panel.closest('.fxd');
				var mwork = el.panel.closest('.mwork');
				var width = $(window).width();

				if(!cnt.hasClass('dfxd')){

					cnt.removeAttr('style')


					/*cnt.css('right', "0px")
					cnt.css('left', "0px")*/

					return
				}



				var maxWidth = 1280;

				var paddingR = 0;
				var paddingL = 0;

				var over = (width - maxWidth) / 2;

				if (over < 0) over = 0;

				var right = width - (mwork.offset().left + mwork.width()) + paddingR;

				var left = width - right - 350 + paddingL + paddingR


				cnt.css('right', right + "px")
				cnt.css('left', left + "px")
			},

			currentMode : function(){

				if(currentMode == 'recommended'){

					self.nav.api.history.addParameters({
						r : 'recommended'
					})

				}
				else{

					if(currentMode == 'sub'){

						self.nav.api.history.addParameters({
							r : 'sub'
						})

					}
					else{
						self.nav.api.history.removeParameters(['r'])
					}
				}

				renders.lentawithsearch()

				makeShare()

				renders.smallpanel()
			},

			backtolenta : function(){
				self.nav.api.history.removeParameters(['v'])

				el.c.removeClass('opensvishowed')

				renders.post(null)

				_scrollTop(lastscroll, null, 5)

				setTimeout(function(){

					renders.upbutton()
					
					actions.refreshSticky()

				}, 500)

				
			}
		}

		var events = {
			currentMode : function(){
				currentMode = $(this).attr('lenta')

				actions.currentMode()
			},
			panelPosition : function(){

				actions.panelPosition()
			},

			up : function(){
				_scrollTop(0, null, 5)
			}

		}

		var makenext = function(type, start, count, clbk){

			var l = result[type].data.length;
			var L = result[type].count

			if(start + count <= l){
				return
			}

			if (start < l){
				var d = l - start;

				start = l;
				count = count - d;
			}
			
			if(start + count > L) count = L - start

			if(count <= 0) return

			load[type](function(data){

				if(clbk)
				{
					clbk(data)
				}

				else
				{
					renders[type](data)
				}

			}, start, count)	

		}

		var load = {
			posts : function(clbk, start, count){
				self.app.platform.sdk.search.get(searchvalue, 'posts', start, count, fixedBlock, function(r){

					clbk(r.data);

				})
			},
		}

		var renders = {

			addpanel : function(){

				self.app.user.isState(function(state){
					if(state){

						if(state && !isMobile()){
							el.addbutton.addClass('active')
						}
						else
						{
							el.addbutton.removeClass('active')
						}

					}
				})
			},

			smallpanel : function(){
				el.smallpanel.find('.item').removeClass('active')
				el.smallpanel.find('.item[lenta="'+currentMode+'"]').addClass('active')
			},
			share : function(){

				if(!isMobile() && !videomain && !searchvalue && !searchtags){

					el.c.removeClass('wshar')

					self.nav.api.load({

						open : true,
						id : 'share',
						el : el.share,
						animation : false,
						
						clbk : function(e, p){

							share = p

							actions.refreshSticky()

						},
						essenseData : {
							post : function(){

								if (plissing)
									plissing.destroy()
							}
						}

					})
				}else{
					el.c.addClass('wshar')
				}
			},

			leftpanel: function(){

				self.nav.api.load({

					open : true,
					id : 'leftpanel',
					el : el.leftpanel,
					animation : false,

					essenseData : {
					
						renderclbk : function(){
							actions.refreshSticky()
						},

						changed : function(){
							renders.lentawithsearch()
						}
					},
					clbk : function(e, p){

						leftpanel = p;

					}

				})
			},

			panel : function(){

				if(videomain) return

				self.nav.api.load({

					open : true,
					id : 'panel',
					el : el.panel,
					animation : false,

					essenseData : {
					
						renderclbk : function(){
							actions.refreshSticky()
	
						}
					},
					clbk : function(e, p){

						panel = p;
						
					}

				})
			},
			lentawithsearch : function(clbk, p){

				if(searchvalue){

					var value = searchvalue.replace('tag:', "#");

					var c = deep(self, 'app.modules.menu.module.showsearch')

					if (c)
						c(value)

					self.app.platform.sdk.search.get(searchvalue, 'posts', 0, 10, null, function(r, block){

						if (r.count){
							self.app.platform.sdk.activity.addsearch(searchvalue)
						}

						fixedBlock = block

						result = {
							posts : r
						};

						console.log('result11', result)

						renders.lenta(clbk, p)
					})

				}
				else{
					result = {}
					fixedBlock = null

					var c = deep(self, 'app.modules.menu.module.showsearch')

					if (c){

						if(searchtags){
							var val = _.map(searchtags, function(w){return '#' + w}).join(' ')

							c(val)

							console.log('addtagsearch', val)

							self.app.platform.sdk.activity.addtagsearch(val)

						}
						else{
							c('')
						}

						


					}
					

					renders.lenta(clbk, p)
				}
			},
			lenta : function(clbk, p){

				if(!p) p = {};

				var loader = null
				var fp = false

				renders.addpanel();

				if(searchvalue){
					loader = function(clbk){
						var _clbk = function(data){
							var shares = self.app.platform.sdk.node.shares.transform(data) 

							if (clbk)
								clbk(shares, null, {
									count : 10
								})
						}

						if(!fp){

							console.log('result', result)

							fp = true

							_clbk(result.posts.data)

						}

						else
						{
							makenext('posts', result.posts.data.length, 10, function(data){
								_clbk(data)
							})
						}
					}
				}
				
				self.nav.api.load({
					open : true,
					id : 'lenta',
					el : el.lenta,
					animation : false,

					mid : 'main',

					essenseData : {
						hr : 'index?',
						goback : p.goback,
						searchValue : searchvalue || null,
						search : searchvalue ? true : false,
						tags : searchtags,
						video : videomain,

						opensvi : function(id){

							lastscroll = $(window).scrollTop()

							el.c.addClass('opensvishowed')

							if (upbutton) upbutton.destroy()
							
							if (upbackbutton) upbackbutton.destroy()

								upbackbutton = self.app.platform.api.upbutton(el.upbackbutton, {
									top : function(){
										return '65px'
									},
									rightEl : el.c.find('.lentacellsvi'),
									scrollTop : 0,
									click : function(a){
										actions.backtolenta()
									},

									icon : '<i class="fas fa-chevron-left"></i>',
									class : 'bright',
									text : 'Back'
								})	
								
							setTimeout(function(){
								upbackbutton.apply()
							},300)

							renders.post(id)

							self.nav.api.history.addParameters({
								v : id
							})

							events.up()
						},

						renderclbk : function(){
						},
						loader : loader
					},
					clbk : function(e, p){

							renders.upbutton()

							lenta = p

						if (clbk)
							clbk()

					}

				})

			},

			upbutton : function(){
				if(upbutton) upbutton.destroy()

				upbutton = self.app.platform.api.upbutton(el.up, {
					top : function(){
						return '65px'
					},
					rightEl : el.c.find('.leftpanelcell')
				})	
			},

			post : function(id){

				if (!id){

					console.log('openedpostdestory', openedpost)

					if (openedpost){
						
						openedpost.destroy()
						openedpost = null
					}

					el.c.find('.renderposthere').html('')

				}

				else{
					self.app.platform.papi.post(id, el.c.find('.renderposthere'), function(e, p){
						openedpost = p
					}, {
						video : true,
						autoplay : true
					})
				}

				
			},

			mobilemode : function(mode){

				if (mode){

					if (mobilemode == 'mainshow'){
						lastscroll = $(window).scrollTop()
						_scrollTop(0, null, 0)
					}

					mobilemode = mode
				}

				el.c.attr('mobilemode', mobilemode)

				renders.columnnavigation()

				if (mobilemode == 'mainshow' && lastscroll){
					_scrollTop(lastscroll, null, 0)
				}
			},

			columnnavigation : function(){


				self.shell({
					name :  'columnnavigation',
					el : el.columnnavigationWrapper,
					data : {
						mobilemode : mobilemode,
						mobilemodes : mobilemodes
					},

				}, function(_p){

					_p.el.find('.columnnavigation').on('click', function(){
						var mode = $(this).attr('mode')

						renders.mobilemode(mode)
						
					})

				})
			}
		}

		var state = {
			save : function(){

			},
			load : function(){
				
			}
		}

		var initEvents = function(){
			
			window.addEventListener('scroll', actions.addbuttonscroll)
			window.addEventListener('resize', actions.addbuttonscroll)

			el.smallpanel.find('.item').on('click', events.currentMode)

			el.c.find('.backtolenta').on('click', actions.backtolenta)

			el.addbutton.on('click', actions.addbutton)

			// if(!isMobile()){

			// 	el.leftpanel.hcSticky({
			// 		stickTo: '#main',
			// 		top : 64,
			// 		bottom : 122
			// 	});

			// 	el.panel.hcSticky({
			// 		stickTo: '#main',
			// 		top : 76,
			// 		bottom : 122
			// 	});

			// }

			hsready = true

		}

		var makePanel = function(){
			self.app.user.isState(function(state){
				//if(state){

					renders.panel();
					renders.leftpanel();
					renders.addpanel();
				//}
			})
		}

		var makeShare = function(){

			self.app.user.isState(function(state){
				if(state){

					if(!isMobile()){

						if (currentMode == 'common')
						{
							renders.share()

							el.c.find('.bgCaption').removeClass('hidden')
						}
						else
						{
							el.share.html('')

							el.c.find('.bgCaption').addClass('hidden')
						}

					}
				}

			})
			
			
		}

		var make = function(clbk, p){

			localStorage['lentakey'] = parameters().r || 'index'

			renders.lentawithsearch(clbk, p)

			makeShare()

			makePanel()

			renders.smallpanel()


			/*
			if(!isMobile()){

				self.app.platform.sdk.user.get(function(u){

					if(u.postcnt < 10){
						setTimeout(function(){

							if (el.c)

								plissing = self.app.platform.api.plissing({
									el : el.c.find('.addbutton'),
									text : "Post something & earn Pocketcoin",
									left : true,
									white : true
								})

						}, 7000)
					}

					

				})
			}*/
				
		}


		
		return {
			primary : primary,

			parametersHandler : function(clbk){

				var ncurrentMode = currentMode

				localStorage['lentakey'] = parameters().r || 'index'

				if (parameters().r){
					ncurrentMode = parameters().r
				}
				else{
					ncurrentMode = 'common'
				}
				
				if (currentMode != ncurrentMode){

					currentMode = ncurrentMode

					
				}

				var _vm = parameters().video ? true : false


				if(_vm != videomain){
					videomain = _vm

					if(videomain){
						el.c.addClass('videomain')

						if(!parameters().v){
							actions.backtolenta()
							makePanel()
						}
					}
					else{
						el.c.removeClass('videomain')
						actions.backtolenta()
						makePanel()
					}
				}
				

				if(lenta) lenta.destroy()

				renders.lentawithsearch()

				renders.leftpanel()


				makeShare()

				if (clbk)
					clbk()

			},

			authclbk : function(){

				if(typeof el != 'undefined' && el.c){

					el.c.find('.bgCaption').removeClass('hidden')

					makeShare()

					

					actions.refreshSticky()
				}
				
			},

			getdata : function(clbk, p){

				hsready = false;

				var _s = parameters()
				if (_s.r){
					currentMode = _s.r
				}
				else{
					currentMode = 'common'
				}

				beginmaterial = _s.s || _s.i || _s.v || null;


				if(self.app.curation()){
					self.nav.api.load({
						open : true,
						href : 'userpage',
						history : true
					})

					return
				}

				if(p.state && primary && !self.app.user.validate()){

					self.nav.api.load({
						open : true,
						href : 'userpage?id=test',
						history : true
					})

					return
				}
				
				var data = {};
			
		
				clbk(data);
				

			},

			destroy : function(){

				renders.post(null)

				hsready = false

				//searchvalue = '', searchtags = null

				if (plissing)
					plissing.destroy()

				if (upbutton)
					upbutton.destroy()

					upbutton = null

				if (upbackbutton)
					upbackbutton.destroy()

					upbackbutton = null
				
				if (roller)
					roller.destroy()


				if (lenta){
					lenta.destroy()
				}

				if (share){
					share.destroy()
				}

				if (panel){
					panel.destroy()
				}

				if (leftpanel){
					leftpanel.destroy()
				}

				lastscroll = 0
				mobilemode = 'mainshow'
				leftpanel = null
				panel = null
				roller = null
				lenta = null
				videomain = false

				if (swiper && swiper.destroy)
					swiper.destroy();
			},
			
			init : function(p){

				roller = null
				lenta = null

				state.load();

				el = {};
				el.c = p.el.find('#' + self.map.id);
				el.share = el.c.find('.share');
				el.lenta = el.c.find('.lentaWrapper');
				el.panel = el.c.find('.panel'); //00
				el.leftpanel = el.c.find('.leftpanel');
				el.leftPanelSlide = el.c.find('#leftPanelSlide');
				el.rightPanelSlide = el.c.find('#rightPanelSlide');
				el.up = el.c.find('.upbuttonwrapper')
				el.upbackbutton = el.c.find('.upbackbuttonwrapper')
				el.smallpanel = el.c.find('.smallpanell')
				el.addbutton = el.c.find('.addbutton')
				el.columnnavigationWrapper = el.c.find('.columnnavigationWrapper')

				el.w = $(window)

				var wordsRegExp = /[,.!?;:() \n\r]/g

				initEvents();

				swiper = new Swiper('#mainSwiper', {
					slidesPerView: 1,
					slidesPerGroup: 1,
					initialSlide: 1,
					spaceBetween: 1,
					threshold: 10,
					resistance : true,
					resistanceRatio: 0,
					// Responsive breakpoints
					breakpoints: {
						// when window width is >= 769px
						769: {
							slidesPerView: 'auto',
							slidesPerGroup: 2,
							// pagination: {
							// 	renderBullet: function (index, className) {
							// 		switch (index) {
							// 			case 0:
							// 				return '<span class="' + className + '">' + self.app.localization.e('Categories') + "</span>";
							// 			case 1:
							// 				return '<span class="' + className + '">' + self.app.localization.e('e13122') + "</span>";
							// 			default:
							// 				return '';
							// 		}
							// 	}
							// }
						},
						// when window width is >= 1281px
						1281: {
							slidesPerView: 3,
							slidesPerGroup: 3,
							// pagination: false
						}
					},
					// Pagination for when window width <= 768px
					// pagination: {
					// 	el: "#mainSwiperPagination",
					// 	clickable: true,
					// 	renderBullet: function (index, className) {
					// 		switch (index) {
					// 			case 0:
					// 				return '<span class="' + className + '">' + self.app.localization.e('Categories') + "</span>";
					// 			case 1:
					// 				return '<span class="' + className + '">' + self.app.localization.e('posts') + "</span>";
					// 			case 2:
					// 				return '<span class="' + className + '">' + self.app.localization.e('e13122') + "</span>";
					// 			default:
					// 				return '';
					// 		}
					// 	},
					// },
					pagination: false
				});

				// Update the panels height
				actions.addbuttonscroll();

				if(!p.goback){
					searchvalue = parameters().ss || ''

					var tgsi = decodeURI(parameters().sst || '')

					var words = _.uniq(_.filter(tgsi.split(wordsRegExp), function(r){
						return r
					}));

					searchtags = words.length? words  :null

					console.log('searchtags', searchtags)

					fixedBlock = null
					result = {}
				}

				videomain = parameters().video ? true : false

				if(videomain){
					el.c.addClass('videomain')
				}

				renders.mobilemode()

				make(function(){
					p.clbk(null, p);
				}, p)
				
			}
		}
	};



	self.run = function(p){

		var essense = self.addEssense(essenses, Essense, p);

		self.init(essense, p);

	};

	self.stop = function(){

		var d = null;

		_.each(essenses, function(essense){

			var _d = essense.destroy();

			if (_d) d = _d;

		})

		return d;

	}

	self.authclbk = function(){
		_.each(essenses, function(e){
			e.authclbk()
		})
	} 

	return self;
})();


if(typeof module != "undefined")
{
	module.exports = main;
}
else{

	app.modules.main = {};
	app.modules.main.module = main;

}