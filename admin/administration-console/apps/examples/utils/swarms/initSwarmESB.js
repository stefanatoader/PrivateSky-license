/**
 * Created by ciprian on 06.12.2016.
 */


//TO DO: verify first that the users are not already created!!!!

var initSwarmESB = {
    meta: {
        name: "initSwarmESB.js"
    },
    init:function(){
        console.log("Initialising SwarmESB");
        this.swarm("createDefaultOrganisations");
    },
    createDefaultOrganisations:{
        node:"UsersManager",
        code:function(){
            var self = this;

            function createDefaultOrganisations(callback) {
                var defaultOrganisations = [
                    {
                        organisationId: "SystemAdministrators",
                        displayName: "System Administrators"
                    },
                    {
                        organisationId: "Public",
                        displayName: "PUBLIC"
                    },
                    {
                        organisationId: "Analysts",
                        displayName: "Analysts"
                    }
                ];

                var createdOrganisations = [];
                var errors = [];
                defaultOrganisations.forEach(function (organisation) {
                    createOrganisation(organisation, S(organisationsCallback));
                });

                function organisationsCallback(err, result) {
                    if (err && !err.message.match("already exists")) {
                        errors.push(err)
                    } else {
                        createdOrganisations.push(result);
                    }
                    if (createdOrganisations.length+errors.length === defaultOrganisations.length) {
                        if(errors.length>0){
                            callback(errors);
                        }
                        else {
                            callback(undefined,createdOrganisations);
                        }
                    }
                }
            }

            createDefaultOrganisations(function(err,result){
                if(err){
                    console.log("Could not create the default organisations\nErrors:",err,"\nAborting init swarm...")
                }else{
                    console.log("The default organisations were created");
                    self.swarm("createDefaultZones");
                }
            })
        }
    },
    createDefaultZones:{
        node:"UsersManager",
        code:function(){
            var self = this;
            function createDefaultZones(callback) {
                var defaultZones = [
                         "ALL_USERS",
                         "Analysts",
                         "Admin",
                         "Sponsor",
                         "Organizator"
                ];
                var createdZones = [];
                var errors = [];
                defaultZones.forEach(function (zone) {
                    createZone(zone, S(zoneCallback));
                });

                function zoneCallback(err, result) {
                    if (err && !err.message.match("already exists")) {
                        errors.push(err)
                    } else {
                        createdZones.push(result);
                    }
                    if (createdZones.length+errors.length === defaultZones.length) {
                        if(errors.length>0){
                            callback(errors);
                        }
                        else {
                            callback(undefined,createdZones);
                        }
                    }
                }
            }
            createDefaultZones(function(err,result){
                if(err){
                    console.log("Could not create the default zone\nErrors:",err,"\nAborting init swarm...")
                }else{
                    console.log("The default zones were created");
                    self.swarm("createDefaultUsers");
                }
            })
        }
    },
    createDefaultUsers: {
        node: "UsersManager",
        code: function () {
            var self = this;

            function createDefaultUsers(callback) {
                var uuid = require('node-uuid');
                var users = [
                    {
                        firstName:"Club",
                        lastName:"Admin",
                        username: "Admin",
                        avatar:"http://pipsum.com/700x700.jpg",
                        password: "swarm",
                        email: "admin@swarm.com",
                        organisationId: "SystemAdministrators",
                        zoneName: "Admin"
                    },
                    {
                        firstName:"Club",
                        lastName:"Guest",
                        username: "Guest",
                        avatar:"http://pipsum.com/700x700.jpg",
                        password: "guest",
                        email: "guest@swarm.com",
                        organisationId: "Public",
	                    zoneName: "ALL_USERS"
                    },
                    {
                        firstName:"Club",
                        lastName:"Analyst",
                        username: "Analyst",
                        password: "analyst",
                        avatar:"http://pipsum.com/700x700.jpg",
                        email: "analyst@swarm.com",
                        organisationId: "Analysts",
	                    zoneName: "Analysts"
                    },
                    {
                        firstName:"Club",
                        lastName:"Tester",
                        username: "Test",
                        avatar:"http://pipsum.com/700x700.jpg",
                        password: "test",
                        email: "test@swarm.com",
                        organisationId: "Public",
	                    zoneName: "ALL_USERS"
                    }
                ];

                var createdUsers = [];
                var errors = [];

                users.forEach(function (userData) {
                    createUser(userData, S(usersCallback))
                });

                function usersCallback(err, result) {

                    if (err && (err.message.match("already exists")===null)) {
                        errors.push(err)
                    } else {
                        createdUsers.push(result);
                    }
                    
                    if ((createdUsers.length + errors.length) === users.length){
                        if (errors.length > 0) {
                            callback(errors);
                        }
                        else {
                            callback(undefined, createdUsers);
                        }
                    }
                }
            }


            createDefaultUsers(function (errors, result) {
                if (errors && errors.length>0) {
                    console.log("Could not create the default users\nErrors:",errors,"\nAborting init swarm...")
                } else {
                    console.log("The default users were created");
                    self.home("SwarmESB initialized");
                }
            });
        }
    }
};

initSwarmESB;