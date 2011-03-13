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
