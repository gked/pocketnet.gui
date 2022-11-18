var pSDK = function({app, api, actions}){
    var self = this

    var storage = {}
    var objects = {}
    var temp = {}
    var dbstorages = {}
    var dbversion = 1;

    var dbmeta = {

        userInfoFull : {
            time : 600
        },

        userInfoFullFB : {
            time : 0
        },

        userInfoLight : {
            time : 3000
        },

        userState : {
            time : 600
        },

        userStateFB : {
            time : 0
        }
    }

    var getDBStorage = function ({name, time}) {

		if (!dbstorages[name]) {
			return pdbstorage(name, dbversion, time).then(storage => {
				dbstorages[name] = storage

				return Promise.resolve(storage)
			})
		}

		return Promise.resolve(dbstorages[name])
	}

    var prepareStorage = function(key){
        if(!storage[key]) storage[key] = {}
        if(!temp[key]) temp[key] = {}
        if(!objects[key]) objects[key] = {}
    }

    var loadone = function(key, index, executor, p){
        return loadList(key, [index], executor, p)
    }

    var settodb = function(dbname, result){
        if(!dbname) return Promise.resolve()

        return getDBStorage({name : dbname, ...dbmeta[dbname]}).then((db) => {
            return Promise.all(_.map(result, ({key, data}) => {
                return db.set(key, data).catch(e => {})
            }))

        })
    }

    var clearfromdb = function(dbname, ids){

        return getDBStorage({name : dbname, ...dbmeta[dbname]}).then(() => {
            return db.clearItems(ids)
        }).catch(e => {

        })
        
    }

    var getfromdb = function(dbname, ids){

        if(!_.isArray(ids)) ids = [ids]

        if(!dbname) return Promise.resolve([])

        return getDBStorage({name : dbname, ...dbmeta[dbname]}).then((db) => {
            var result = []

            return Promise.all(_.map(ids, id => {

                return db.get(id).then(data => {

                    result.push({
                        key : id,
                        data : data
                    })
    
                }).catch(e => {})

            })).then(() => {
                return result
            })
            
        })

    }

    var loadList = function(key, keys, executor, p = {
        update : false, 
        fallbackIndexedDB : null, 
        indexedDb : null,
        alternativeGetStorage : null,
        transform : null
    }){

        if(!key) return Promise.reject('missing:key')
        if(!keys) return Promise.reject('missing:keys')

        if(!_.isArray(keys)) keys = [keys]

        keys = _.uniq(keys)

        var loading = {}
        var loaded = {}
        var load = []

        _.each(keys, (k) => {

            if (p.alternativeGetStorage){

                if (temp[p.alternativeGetStorage][k]){
                    loading[k] = temp[p.alternativeGetStorage][k]
    
                    return
                }

                if(!p.update && storage[p.alternativeGetStorage][k]){
                    loaded[k] = storage[p.alternativeGetStorage][k]
    
                    return
                }

            }

            if (temp[key][k]){
                loading[k] = temp[key][k]

                return
            }
            

            if(!p.update && storage[key][k]){
                loaded[k] = storage[key][k]

                return
            }

            load.push(k)
        })


        var promise = !load.length ? Promise.resolve([]) : new Promise((resolve, reject) => {

            getfromdb(p.indexedDb, load).then(dbr => {


                load = _.filter(load, (k) => {

                    return !_.find(dbr, ({key}) => {
                        return key == k
                    })

                })

                if(!load.length){
                    resolve(dbr)

                    return
                }

                executor(load).then((result) => {

                    settodb(p.indexedDb, result)
                    settodb(p.fallbackIndexedDB, result)

                    return resolve(result.concat(dbr))

                }).catch(reject)
            })


        }).catch(e => {

            if(p.fallbackIndexedDB){
                return getfromdb(p.fallbackIndexedDB, load)
            }

            return Promise.reject(e)

        }).then(result => {

            var filtered = []

            _.each(result, (r) => {

                if (r && r.key && r.data){
                    storage[key][r.key] = r.data
                    filtered.push(r)
                }

                if (p.transform){
                    var object = p.transform(r)

                    if (object)
                        objects[key][r.key] = object
                }

            })

            return filtered

        }).finally(() => {

            _.each(load, (k) => {
                delete temp[key][k]
            })

        })

        _.each(load, (k) => {
            temp[key][k] = promise
        })

        return Promise.all(_.map([promise].concat(_.toArray(loading)))).catch(e => {

            return null
        }).then((rpack) => {

            _.each(rpack, (result) => {
                if(result){
                    _.each(result, (r) => {
                        loaded[r.key] = r.data
                    })  
                }
            })

        }).then(() => {
            return loaded
        })
    }

    self.userInfo = {
        keys : ['userInfoFull', 'userInfoLight'],
        
        load : function(addresses, light, update){
            return loadList(light ? 'userInfoLight' : 'userInfoFull', addresses, (addresses) => {

                var parameters = [addresses]; 

                if (light) { parameters.push('1') }

                return api.rpc('getuserprofile', parameters).then((data) => {
                    

                    return _.map(addresses, (address) => {
                        return {
                            key : address,
                            data : _.find(data, (info) => {return info.address == address})
                        }
                    })
                   
                })

            }, {
                update, 
                indexedDb : light ? 'userInfoLight' : 'userInfoFull',
                fallbackIndexedDB : !light ? 'userInfoFullFB' : null,
                alternativeGetStorage : light ? 'userInfoFull' : null,
                transform : this.transform
            })
        },

        transform : function({key, data}){

            var u = null
            
            if (data){
                u = new pUserInfo()
                u._import(data)
            }

            var account = actions.getCurrentAccount()

            if (account.address == key){
                var object = account.getTempUserInfo() //edit or create

                if (object) u = object
            }

            if(!u) return null

            /*
            
                _.each(temp.blocking, function (block) {
                    u.addRelation(block.vsaddress, 'blocking')
                })

                _.each(temp.unblocking, function (block) {
                    u.removeRelation(block.vsaddress, 'blocking')
                })

                _.each(temp.subscribe, function (s) {

                    u.removeRelation({
                        adddress: s.vsaddress
                    })

                    u.addRelation({
                        adddress: s.vsaddress,
                        private: false
                    })
                })

                _.each(temp.subscribePrivate, function (s) {

                    u.removeRelation({
                        adddress: s.vsaddress
                    })

                    u.addRelation({
                        adddress: s.vsaddress,
                        private: true
                    })
                })

                _.each(temp.unsubscribe, function (s) {

                    u.removeRelation({
                        adddress: s.vsaddress
                    })

                })
            
            */

            return u
        },

        getmy : function(){
            return app.user.address.value ? this.get(app.user.address.value) : null
        },

        get : function(address){
            return objects['userInfoFull'][address] || objects['userInfoLight'][address]
        },

        getclear : function(address){
            return storage['userInfoFull'][address] || storage['userInfoLight'][address]
        },

        findlocal : function(finder){
            return _.find(_.toArray(objects['userInfoFull'][address]).concat(objects['userInfoLight'][address]), finder)
        },

        clearStorage : function(address){
            delete storage['userInfoFull'][address]
            delete storage['userInfoLight'][address]

            delete objects['userInfoFull'][address]
            delete objects['userInfoLight'][address]
        },

        cleardb : function(address){

            clearfromdb('userInfoFullFB', [address])
            clearfromdb('userInfoFull', [address])
        },

        clearAll : function(address){
            this.clearStorage(address)
            this.cleardb(address)
        }
    }

    self.userState = {
        keys : ['userState'],
        
        load : function(addresses, update){

            return loadList('userState', addresses, (addresses) => {

                return api.rpc('getuserstate', [(addresses).join(',')]).then((d) => {
                    if (d && !_.isArray(d)) d = [d] /// check responce

                    return _.map(d || [], (info) => {
                        return { 
                            key : info.address,
                            data : info
                        }
                    })

                }).catch(e => {

                    if(e && e.code == -5){
                        ///// userstate hack
                        return Promise.resolve(_.map(addresses, (address) => {
                            return {
                                key : address,
                                data : null //{}
                            }
                        }))
                    }

                    return Promise.reject(e)
                })

            }, { 
                update,
                indexedDb : 'userState',
                fallbackIndexedDB : 'userStateFB',
            })

        },

        get : function(address){
            return storage['userState'][address]
        },

        getmy : function(){
            return app.user.address.value ? this.get(app.user.address.value) : null
        },

        clearStorage : function(address){
            delete storage['userState'][address]
        },

        cleardb : function(address){
            clearfromdb('userStateFB', [address])
            clearfromdb('userState', [address])
        },

        clearAll : function(address){
            this.clearStorage(address)
            this.cleardb(address)
        }
    }
    
    self.transaction = {
        keys : ['transaction'],
        load : function(id){

            return loadone('transaction', id, (ids) => {
                return api.rpc('getrawtransaction', [ids[0], 1]).then(d => {

                    if(!d.confirmations) {
                        d.confirmations = 0

                        if(d.height) {
                            app.platform.currentBlock ? (d.confirmations = Math.max(app.platform.currentBlock - d.height, 0)) : null
                        } else {
                            app.platform.currentBlock ? (d.height = app.platform.currentBlock) : null
                        }
                    }

                    return [{
                        key : ids[0],
                        data : d
                    }]

                })
            })

            
        }
    }


    _.each(self, (v) => {
        if(v && _.isObject(v) && v.keys){
            _.each(v.keys, (i) => {
                prepareStorage(i)
            })
        }
    })


    self.prepareDb = function(){

    }


    return self
}

if(typeof module != "undefined"){ module.exports = {pSDK}; } 
else { window.pSDK = pSDK;}