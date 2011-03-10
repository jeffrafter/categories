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
