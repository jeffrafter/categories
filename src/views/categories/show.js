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

