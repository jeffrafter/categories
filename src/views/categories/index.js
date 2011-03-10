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

