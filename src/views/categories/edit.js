Questions.Views.Categories.Edit = Backbone.View.extend({
  events: {
    "click .save": "save",
    "click .delete": "remove"
  },

  initialize: function() {
    _.bindAll(this, 'render');
    this.model.bind('change', this.render);
    this.render();
  },

  save: function() {
    var self = this;
    this.model.save({
      name: this.$('[name=name]').val(),
      description: this.$('[name=description]').val() }, {
      success: function(model, resp) {
        self.model = model;
        self.delegateEvents();
        Backbone.history.saveLocation('!/categories/' + model.id);
      },
      error: function() {}
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

