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

