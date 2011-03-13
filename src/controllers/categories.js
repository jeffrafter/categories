Questions.Controllers.Categories = Backbone.Controller.extend({
  // Note, the routing order is important or "new" would be considered an id
  routes: {
    "":                 "index",
    "!/categories/new": "build",
    "!/categories/:id": "edit"
  },

  index: function() {
    // This is here to prevent a lot of unneeded re-rendering
    if (this.categories) return;
    var self = this;
    this.categories = new Questions.Collections.Categories();
    this.categories.fetch({
      success: function() {
        new Questions.CollectionView({
          collection           : self.categories,
          childViewConstructor : Questions.Views.Categories.Show,
          childViewTagName     : 'li',
          el                   : $('#questions ul')[0]
        });
      },
      error: function() {
        new Error({ message: "Error loading categories." });
      }
    });
  },

  build: function() {
    if (!this._requireCollection()) return;
    // New objects need to know about the collection
    new Questions.Views.Categories.Edit({
      model: new Questions.Category(),
      collection: this.categories
    });
  },

  edit: function(id) {
    if (!this._requireCollection()) return;
    // Lookup the model in the collection so the view and collection are bound
    var category = this.categories.get(id);
    // Check that it is still there
    if (category) {
      new Questions.Views.Categories.Edit({ model: category });
    } else {
      new Error({ message: 'Could not find that category.' });
      window.location.hash = '#';
    }
  },

  _requireCollection: function() {
    // If you go to a url directly (or refresh) then we will have no collection,
    // Make them go to the start first
    if (!this.categories) window.location.hash = "#";
    return !!this.categories;
  }


});

