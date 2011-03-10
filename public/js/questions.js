var Questions = {
  Views: {
    Categories: {}
  },
  Controllers: {},
  Collections: {},
  init: function() {
    new Questions.Controllers.Categories();
    Backbone.history.start();
  }
};
Questions.Category = Backbone.Model.extend({
  localStorage: new Store("categories")
});

Questions.Collections.Categories = Backbone.Collection.extend({
  model: Questions.Category,
  localStorage: new Store("categories")
});

Questions.Controllers.Categories = Backbone.Controller.extend({
  // Note, the routing order is important or "new" would be considered an id
  routes: {
    "":                 "index",
    "!/categories/new": "build",
    "!/categories/:id": "edit"
  },

  edit: function(id) {
    var category = new Questions.Category({ id: id });
    category.fetch({
      success: function(model, resp) {
        new Questions.Views.Categories.Edit({ model: category });
      },
      error: function() {
        new Error({ message: 'Could not find that category.' });
        window.location.hash = '#';
      }
    });
  },

  index: function() {
    var categories = new Questions.Collections.Categories();
    categories.fetch({
      success: function() {
        new Questions.Views.Categories.Index({ collection: categories });
      },
      error: function() {
        new Error({ message: "Error loading categories." });
      }
    });
  },

  // Alias for #new
  build: function() {
    new Questions.Views.Categories.Edit({ model: new Questions.Category() });
  }
});

Questions.Views.Categories.Index = Backbone.View.extend({
  initialize: function() {
    this.categories = this.options.collection;
    this.render();
  },

  render: function() {
    $(this.el).html($(ich.categoryIndex({"categories": this.categories.toJSON()})));
    $('#questions').html(this.el);
  }
});

Questions.Views.Categories.Edit = Backbone.View.extend({
  events: {
    "submit form": "save"
  },

  initialize: function() {
    this.render();
  },

  save: function() {
    var self = this;
    var flash = this.model.isNew() ? 'Successfully created!' : "Saved!";

    this.model.save({
      name: this.$('[name=name]').val(),
      description: this.$('[name=description]').val() }, {
      success: function(model, resp) {
        new Questions.Views.Notice({ message: flash });
        self.model = model;
        self.render();
        self.delegateEvents();
        Backbone.history.saveLocation('!/categories/' + model.id);
      },
      error: function() {
        new Questions.Views.Error();
      }
    });
    return false;
  },

  render: function() {
    $(this.el).html($(ich.categoryEdit(this.model.toJSON())));
    $('#questions').html(this.el);
    this.$('[name=name]').val(this.model.get('name')); // use val, for security reasons
  }
});

