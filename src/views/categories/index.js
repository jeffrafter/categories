Questions.Views.Categories.Index = Backbone.View.extend({
  initialize: function() {
    this.categories = this.options.collection;
    this.categories.bind('all', this.render);
    _.bindAll(this, 'render');
    this.render();
  },

  render: function() {
    $(this.el).html($(ich.categoryIndex({"categories": this.categories.toJSON()})));
    $('#questions').html(this.el);
  }
});

