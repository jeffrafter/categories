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


