define(['lib/underscore',
        'lib/backbone',
        'lib/knockout',
        'lib/jquery',
        'component/filter/filter',
        'component/filter/view/predicateList',
        'component/filter/template/gridFilter/editor'
      ], function (_, backbone, ko, $, Filter, PredicateList, editorTemplate) {

  'use strict';

  var Editor = backbone.View.extend({

    events: {
      'click .apply'  : 'apply',
      'click .cancel' : 'cancel'
    },

    initialize: function(){
      this.ko_model = this.options.ko_model;
    },

    render: function(){
      var $layout = $(editorTemplate({
        i18n : this.options.i18n,
      })),
        $listContainer = $layout.find('.list-placeholder');

      this.$el.html($layout);
      ko.applyBindings(this.ko_model, this.el);

      this.predicateList = new PredicateList(_.extend({}, this.options, {
        el : $listContainer
      }));
      this.predicateList.render();
      return this;
    },

    show: function(){
      this.$el.show();
      return this;
    },

    hide: function(){
      this.$el.hide();
      return this;
    },

    remove: function(){
      this.predicateList.remove();
      ko.cleanNode(this.el);
      this.$el.empty();
    },

    apply: function(){
      var filter = this.predicateList.getFilter();
      if(filter.depth > 0){
        this.trigger('apply', {
          filter : filter,
          name : this.ko_model.newName()
        });
      }
    },

    clean: function(){
      this.ko_model.newName('');
      this.predicateList.setFilter(new Filter({}));
    },

    cancel: function(){
      this.clean();
      this.hide();
      this.trigger('cancel');
    }
  });

  return Editor;

});
