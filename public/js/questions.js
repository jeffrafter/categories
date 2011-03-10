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
  routes: {
    "":                       "index",
    "!/categories/:id":       "edit",
    "!/categories/new":       "build"
  },

  edit: function(id) {
    console.log("Editing: "+id);
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

var tmp = null;
Questions.Views.Categories.Index = Backbone.View.extend({
  initialize: function() {
    this.categories = this.options.collection;
    this.render();
  },

  render: function() {
    if(this.categories.length > 0) {
      var out = "<h3><a href='#!/categories/new'>Create New</a></h3><ul>";
      _(this.categories.models).each(function(item) {
        out += "<li><a href='#!/categories/" + item.id + "'>" + item.escape('name') + "</a></li>";
      });
      out += "</ul>";
    } else {
      out = "<h3>No categories! <a href='#!/categories/new'>Create one</a></h3>";
    }
    $(this.el).html(out);
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
    var out = '<form>';
    out += "<label for='name'>Name</label>";
    out += "<input name='name' type='text' />";

    out += "<label for='description'>Description</label>";
    out += "<textarea name='description'>" + (this.model.escape('description') || '') + "</textarea>";

    var submitText = this.model.isNew() ? 'Create' : 'Save';

    out += "<button>" + submitText + "</button>";
    out += "</form>";

    $(this.el).html(out);
    $('#questions').html(this.el);

    this.$('[name=name]').val(this.model.get('name')); // use val, for security reasons
  }
});

