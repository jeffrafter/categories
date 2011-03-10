Questions.Category = Backbone.Model.extend({
  localStorage: new Store("categories")
});

Questions.Collections.Categories = Backbone.Collection.extend({
  model: Questions.Category,
  localStorage: new Store("categories")
});

