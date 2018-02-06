var menuCtrl = {
	list: function () {
		this.userId = this.getUserId();
		this.swarm("getList");
	},
	getList: {
		node: "UsersManager",
		code: function () {
			var self = this;
			zonesOfUser(self.userId, S(function (err, zones) {
				if (err) {
					self.err = err.message;
					self.home('failed');
				} else {
					var zoneNames = zones.map(function (zone) {
						return zone.zoneName;
					});
					self.result = [];
					console.log(zoneNames);

					//definirea elementelor meniului utilizatului in functie de zona de access a acestuia
					if(zoneNames.indexOf('ALL_USERS')!==-1 || zoneNames.indexOf('Admin')!==-1 || zoneNames.indexOf('Analysts')!==-1 || zoneNames.indexOf('Sponsor')!==-1 || zoneNames.indexOf('Organizator')!==-1) {
						self.result.push({
							icon: "glyphicon glyphicon-cog",
							name:"Management",
							url: "",
							children:[
								{
									icon:"",
									name:"Entities",
									url:"apps/examples/Entities/index.html"
								},
								{
									icon:"",
									name:"Compound Entities",
									url:"apps/examples/CompoundEntities/index.html"
								}

							]
						});
						/*self.result.push({
							icon: "glyphicon glyphicon-map-marker",
							name: "Navigation",
							url: "apps/examples/Navigation/index.html"
						});*/
						self.result.push({
							icon:"glyphicon glyphicon-star",
							name:"Activities",
							url:"",
							children:[
								{
									icon:"",
									name:"List all",
									url:"apps/examples/ListActivities/index.html"
								},
								{
									icon:"",
									name:"Manage Ierarchy",
									url:"apps/examples/ActivitiesIerarchy/index.html"
								}
							]
						});
						/*self.result.push({
							icon: "glyphicon glyphicon-list",
							name: "News",
							url: "apps/examples/News/index.html"
						});*/
					}

					/*if(zoneNames.indexOf('Admin')!==-1 || zoneNames.indexOf('Analysts')!==-1 || zoneNames.indexOf('Sponsor')!==-1 || zoneNames.indexOf('Organizator')!==-1) {
						self.result.push({
							icon: "glyphicon glyphicon-lock",
							name: "ACL Management",
							url: "apps/examples/ACL-Management/index.html"
						});
					}*/

					if(zoneNames.indexOf('Admin')!==-1 || zoneNames.indexOf('Sponsor')!==-1 || zoneNames.indexOf('Organizator')!==-1){
						self.result.push({
							icon: "glyphicon glyphicon-calendar",
							name: "Meetings",
							url: "apps/examples/MeetingsManagement/index.html",
							default:true
						});
					}

					if(zoneNames.indexOf('Admin')!==-1) {
						self.result.push({
							icon: "glyphicon glyphicon-user",
							name: "Members",
							url: "apps/examples/UserList/index.html"
						});
						//element din meniu ce are definiti 'copii'
						/*self.result.push({
							icon: "glyphicon glyphicon-tasks",
							name: "Forms & Answers",
							url: "",
							children:[
								{
									icon:"",
									name:"Forms Management",
									url:"apps/examples/FormsManagement/index.html"
								},
								{
									icon:"",
									name:"Answers Management",
									url:"apps/examples/AnswersManagement/index.html"
								}

							]
						});*/
						/*self.result.push({
							icon: "glyphicon glyphicon-envelope",
							name: "Notification Manager",
							url: "apps/examples/NotificationManager/index.html"
						});
						self.result.push({
							icon: "glyphicon glyphicon-indent-left",
							name: "News Manager",
							url: "apps/examples/NewsManager/index.html"
						});*/
					}
					self.result.push({
						icon:"glyphicon glyphicon-time",
						name:"Clocking",
						url:"",
						children:[
						{
							icon:"",
							name:"List All",
							url:"apps/examples/Clocking/index.html"
						},
						{
							icon:"",
							name:"Manage",
							url:"apps/examples/ManageClocking/index.html"
						}
						]
					});
					self.result.push({
						icon:"glyphicons glyphicons-charts",
						name:"Statistics",
						url:"apps/examples/Statistics/index.html"
					});
					self.home('gettingListDone');
				}
			}))
		}
	}
};

menuCtrl;