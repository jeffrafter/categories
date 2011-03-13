var Questions = {
  Views: {
    Categories: {}
  },
  Controllers: {},
  Collections: {},
  categories: {},
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

/* Questions.CollectionView
 *
 * Adapted from UpdatingCollectionView by  Neal Stewart, Liquid Media
 *
 * http://liquidmedia.ca/blog/2011/02/backbone-js-part-3/
 *
 * var Questions.Views.Categories.CollectionView = new Questions.CollectionView({
 *   collection           : categories,
 *   childViewConstructor : Questions.Views.Categories.Show,
 *   childViewTagName     : 'li',
 *   el                   : $('#category_list')[0]
 * });
 *
 *
 */
Questions.CollectionView = Backbone.View.extend({
  initialize : function(options) {
    _(this).bindAll('add', 'remove');

    if (!options.childViewConstructor) throw "No child view constructor provided";
    if (!options.childViewTagName) throw "No child view tag name provided";

    this._childViewConstructor = options.childViewConstructor;
    this._childViewTagName = options.childViewTagName;
    this._childViews = [];

    this.collection.each(this.add);

    this.collection.bind('add', this.add);
    this.collection.bind('remove', this.remove);
    this.render();
  },

  add : function(model) {
    var childView = new this._childViewConstructor({
      tagName : this._childViewTagName,
      model : model
    });

    this._childViews.push(childView);

    if (this._rendered) {
      $(this.el).append(childView.render().el);
    }
  },

  remove : function(model) {
    var viewToRemove = _(this._childViews).select(function(cv) { return cv.model === model; })[0];
    this._childViews = _(this._childViews).without(viewToRemove);

    if (this._rendered) $(viewToRemove.el).remove();
  },

  render : function() {
    var that = this;
    this._rendered = true;

    $(this.el).empty();

    _(this._childViews).each(function(childView) {
      $(that.el).append(childView.render().el);
    });

    return this;
  }
});


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

Questions.Views.Categories.Show = Backbone.View.extend({
  events: {
    "click": "edit"
  },

  initialize : function(options) {
    this.render = _.bind(this.render, this);
    this.model.bind('change', this.render);
  },

  render: function() {
    $(this.el).html($(ich.categoryShow(this.model.toJSON())));
    return this;
  },

  edit: function() {
    new Questions.Views.Categories.Edit({ model: this.model });
  }
});

Questions.Views.Categories.Edit = Backbone.View.extend({
  events: {
    "click .save": "save",
    "click .delete": "remove"
  },

  initialize: function() {
    _.bindAll(this, 'render');
    this.render();
  },

  save: function() {
    var isNew = this.model.isNew();
    var self = this;
    this.model.save({
      name: this.$('[name=name]').val(),
      description: this.$('[name=description]').val()},{
      success: function() { if (isNew) self.collection.add(self.model) },
      error: function() { }
    });
  },

  remove: function() {
    this.model.destroy();
  },

  render: function() {
    $(this.el).html($(ich.categoryEdit(this.model.toJSON())));
    $.facebox(this.el);
  }
});

