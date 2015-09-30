var UserModel = Backbone.Model.extend({
	defaults: {
		username: '',
		initialize: function() {
      // this.fetch();
			// this.on("change", this.save, this);
    }
	}
});

// UserModel.prototype.id = (function() {
// 	if(this.id !== undefined) {
// 		return this.id;
// 	} else {
// 		return app.users.models.length;
// 	}
// })();

var TaskModel = Backbone.Model.extend({
	defaults: {
		title: '',
		description: '',
		creator: '',
		assignee: '',
		status: '',
	},
	initialize: function() {
		// this.fetch();
		// this.on("change", this.save, this);
	}
	// Add methods if needed...
});

var allModels = {};

var SharedTaskModel = function (attrs) {
	if (('id' in attrs) && allModels[attrs.id]) {
		return allModels[attrs.id];
	} else {
		var model = new TaskModel(attrs);
		if ('id' in attrs)
			allModels[attrs.id] = model;
		return model;
	}
};
// var UserTasksCollection = Backbone.Collection.extend({
// 	model: TaskModel,
// 	defaults: {
//
// 	},
// 	initialize: function (opts) {
// 		if (opts) {
// 			this.url = opts.url;
// 			console.log("opts.user------>", opts.user);
// 		}
// 		this.fetch();
// 	},
// 	url : "/users"
// });

// var UserTasksCollection = Backbone.Collection.extend({
// 	model: UserTasksModel,
// 	initialize: function() {
// 		this.fetch();
// 	}
// });

// TaskModel.prototype.id = (function() {
// 	if(this.id !== undefined) {
// 		return this.id;
// 	} else {
// 		return app.tasks.models.length;
// 	}
// })();

var UserCollection = Backbone.Collection.extend({
	model: UserModel,
	url : "/users",
	initialize: function() {
		this.fetch();
	}
});

var TaskCollection = Backbone.Collection.extend({
	model: TaskModel,
	url : "/tasks",
	initialize: function() {

	},
	retrieve: function (opts) {
		if (opts) {
			this.url = this.url + "/" + opts.uname;
		}
		this.fetch();
	}
});

var UnassignedTaskCollection = Backbone.Collection.extend({
	model: TaskModel,
	url : "/unassigned",
	initialize: function() {
		this.fetch();
	},
	// render: function () {
	// 	this.fetch();
	// }
	// retrieve: function (opts) {
	// 	if (opts) {
	// 		this.url = this.url + "/" + opts.uname;
	// 	}
	// 	this.fetch();
	// }
});
