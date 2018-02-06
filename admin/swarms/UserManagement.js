var userManagement =
{
	currentLoggedIn: function(){
		console.log("Getting id for profile: ");
		this.id = this.getUserId();
		console.log(this.id);
		this.swarm("getUserData");
	},
	getUserData:{
		node: "UsersManager",
		code: function () {
			var self = this;
			getUserInfo(self.id, S(function(err,result) {
				if(err){
					self.err = err.message;
					self.home('failed');
				}else{
					if(result){
						delete(result.__meta);
						delete(result.salt);
						delete(result.password);
						self.result = result;
						self.home('gotLoggedInDataDone');
					}else{
						self.err = "Null data from swarms";
						self.home('failed');
					}
				}
			}))
		}
	},
	
	getUsersWZones : function () {
		this.swarm("getAllUsers");
	},

	getAllUsers:{
		node:"UsersManager",
		code: function () {
			var self = this;
			//Apelarea functiei din cadrul adaptorului UsersManager.js.
			//Acesta va oferi o lista a utilizatorilor in caz de success sau un mesaj de eroare corespunzator altfel.
			getUsers(S(function (err, result) {
				if(err){
					self.error = err.message;
					self.home('failed');
				}else{
					self.result = result;
					self.home('gotFilteredUsers');
				}
			}))
		}
	},

	filterUsers:function(filter){
		console.log("Fetching users matching filter :",filter);
		this['filter'] = filter;
		this.swarm("filter");
	},
	filter:{
		node:"UsersManager",
		code: function(){
			var self  = this;
			filterUsers(this['filter'],S(function(err,result){
				if(err){
					self.error = err.message;
					self.home('failed');
				}else{
					delete result.password;
					delete result.salt;
					self.result = result;
					self.home('gotFilteredUsers');
				}
			}))
		}
	},

	getAvatar: function(){
		this.id = this.getUserId();
		this.swarm("getUserAvatar");
	},
	getUserAvatar:{
		node:"UsersManager",
		code: function(){
			var self  = this;
			getUserInfo(self.id, S(function(err,result) {
				if(err){
					self.err = "Error occured while getting your avatar.";
					self.home('failed');
				}else{
					if(result){
						self.result = {
							name : result.lastName + ' ' + result.firstName,
							role : result.organisationId,
							avatar : result.avatar,
							userId : result.userId
						};
						self.home('gotAvatarDone');
					}else{
						self.err = "Null data from swarms";
						self.home('failed');
					}
				}
			}))
		}
	},

    createUser: function (userData) {
        console.log("Creating user with data:", userData);
        this.userData = userData;
        this.swarm("create")
    },
    create: {
        node: "UsersManager",
        code: function () {
            var self = this;
            //apelarea functiei de creare a utilizatorului din cadrul adaptorului UsersManager.js
            createUser(this.userData, S(function (err, result) {
                if (err) {
                    self.error = err.message;
                    self.home('failed');
                } else {
                    self.result = result;
                    self.home('userCreated');
                }
            }))
        }
    },

    editUser: function (userData) {
        this.userData = userData;
        this.swarm("edit")
    },
    edit: {
        node: "UsersManager",
        code: function () {
            var self = this;
	        //apelarea functiei de preluarea a informatiilor despre un utilizator cerut.
	        getUserInfo(self['userData'].userId, S(function (err, result) {
                if (err) {
                    self.error = err.message;
                    self.home('failed');
                } else {
                    var oldZones = result.zone && result.zone !== "" ? result.zone : "ALL_USERS";

	                //apelarea functiei de editare a utilizatorului din cadrul adaptorului UsersManager.js
	                updateUser(self['userData'], S(function (err, result) {
		                console.log("result>>>>>",self['userData']);

                        if (err) {
                            self.error = err.message;
                            self.home('failed');
                        } else {
                            self.result = result;
							updateUserZone(self.userData.mappingId,self.userData.zoneName,function (err, res) {
								if(err){
									self.error = err.message;
									self.home('failed');
								}else{
									self.result.zoneName = self.userData.zoneName;
									self.result.mappingId = self.userData.mappingId;

									self.home('userEdited');
								}
							});
                        }
                    }))
                }
            }))
        }
    },

    changePassword: function (user) {
        this.user = user;
        this.swarm("setNewPassword");
    },
    setNewPassword: {
        node: "UsersManager",
        code: function () {
            var self = this;
            getUserInfo(self.user.userId, S(function (err, result) {
                if (err) {
                    self.error = err.message;
                    self.home('failed');
                } else {
                    changeUserPassword(self.user.userId, self.user.current_password, self.user.new_password, S(function (err, result) {
                        if (err) {
                            self.error = err.message;
                            self.home('failed');
                        } else {
                            self.result = result;
                            self.home('userEdited');
                        }
                    }))
                }
            }))
        }
    }
};
userManagement;