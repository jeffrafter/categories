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

