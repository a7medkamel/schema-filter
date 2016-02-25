define(['lib/underscore',
        'lib/backbone',
        'lib/knockout',
        'component/filter/filter',
        'component/filter/viewmodel/gridFilter',
        'component/filter/view/gridFilterEditor',
        'component/filter/template/gridFilter/header'
      ], function (_, backbone, ko, Filter, ViewModel, Editor, headerTemplate) {

  'use strict';

  var defaults = {
    $editorContainer : undefined // required option - container to show/hide filter editor
  };

  var GridFilter = backbone.View.extend({

    events: {
      'click .new'            : 'newFilter',
      'click .saved .apply'   : 'applySaved',
      'click .saved .delete'  : 'delete',
      'click .filter-button'  : 'filterClick',
      'click .quick-submit'   : 'quick',
      'keyup .quick-text'     : 'quick'
    },

    initialize: function(){
      this.options = _.defaults({}, this.options, defaults);

      var filters = this.options.filters;
      this.ko_model = new ViewModel({
        i18n      : this.options.i18n
      });

      if(_.isArray(filters)){
        this.ko_model.filters(filters);
      }
      else if(_.isFunction(filters)){
        filters(function(error, data){
          this.ko_model.filters(data);
        }.bind(this));
      }
    },

    render: function(){
      var html = headerTemplate({
        i18n: this.options.i18n,
        showQuickFilter: !!this.options.quickProperty
      });
      this.$el.html(html);
      ko.applyBindings(this.ko_model, this.el);
      return this;
    },

    newFilter: function(){
      if(!!this.editor){
        this.editor.clean();
      }
      this.expand();
    },

    expand: function(){
      if(!this.editor){
        this.editor = new Editor(_.extend({}, this.options, {
          ko_model  : this.ko_model,
          el        : this.options.$editorContainer
        }));
        this.editor.render();
        this.editor.on('apply', this.apply.bind(this));
        this.editor.on('cancel', this.trigger.bind(this, 'collapse'));
      }
      this.editor.show();
      this.trigger('expand');
      return this;
    },

    filterClick: function(){
      if(this.ko_model.filters().length === 0){
        this.expand();
      }
    },

    collapse: function(){
      this.editor.hide();
      return this;
    },

    apply: function(args){
      if(args.filter.depth === 0){
        return;
      }

      if(!!args.name && _.isFunction(this.options.save)){
        this.options.save(args, saveCompleted.bind(this, args));
      }
      this.trigger('apply', args.filter);
      if(!!this.editor){
        this.editor.hide();
      }
    },

    applySaved: function(ev){
      var item = ko.dataFor(ev.target);
      if(!!item){
        this.trigger('apply', item.filter);
      }
    },

    delete: function(ev){
      var item = ko.dataFor(ev.target);
      if(!!item && !!this.options.delete){
        this.options.delete(item, function(error, success){
          if(!error){
            this.ko_model.filters.remove(item);
          }
        }.bind(this));
      }
    },

    remove: function(){
      if(!!this.editor){
        this.editor.remove();
      }
      ko.cleanNode(this.el);
    },

    // TODO : unit test
    quick: function(ev){      
      if(!!ev.keyCode && ev.keyCode !== 13){
        return;
      }
      if(this.ko_model.quick().trim() === ''){
        return;
      }
      var filter = _.object([this.options.quickProperty],
        [_.object([this.options.quickOperator || '$contains'], [this.ko_model.quick()])]);
      this.apply({filter : new Filter(filter)});
    }

  });

  function saveCompleted(args, error, overrides){
    var filterObj = _.extend({}, args, overrides);
    this.ko_model.filters.push(filterObj);
  }

  return GridFilter;

});
