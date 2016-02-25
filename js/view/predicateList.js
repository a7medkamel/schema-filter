define(['lib/underscore',
        'lib/backbone',
        'lib/knockout',
        'component/filter/filter',
        'component/filter/template/predicateList',
        'component/filter/viewmodel/predicateList',
        'component/filter/view/defaultTemplates',
        'component/filter/binding/predicateValue',
        'component/filter/binding/bootstrap_dropdown',
        'component/filter/binding/datePicker'
       ], function (_, backbone, ko, Filter, layoutTemplate, PredicatesListVM,
  defaultTemplates) {

  'use strict';

  var defaults = {
    layoutTemplate: layoutTemplate,
    itemTemplates: defaultTemplates
  };

  var View = backbone.View.extend({

    events: {
      'click .new': 'newItem',
      'click .remove': 'removeItem'
    },

    initialize: function (options) {
      if (!options.entitySchema) {
        throw new Error('Entity schema must be provided for the filter control');
      }
      this.options = options;
      this.layoutTemplate = options.layoutTemplate || defaults.layoutTemplate;
      this.itemTemplates = _.defaults({}, options.itemTemplates, defaults.itemTemplates);
      this.ko_model = new PredicatesListVM(_.extend({}, {
          templates         : this.itemTemplates
        },
        _.pick(this.options, 'entitySchema', 'i18n', 'shortDateFormat', 'i18n_prefixes')
      ));

      if (options.selected) {
        this.setFilter(options.selected);
      }

      this.newItem = this.ko_model.newItem.bind(this.ko_model);
    },

    setFilter: function (filter) {
      var filterObj = filter instanceof Filter ? filter : new Filter(filter),
        predicates = [];

      validateFilter(filterObj);
      if (filterObj.depth === 1) {
        predicates.push(filterObj.query);
      } else if (filterObj.depth > 1) {
        // TODO [andreic] : We don't maintain logicalOperator here. Based on the use cases decide wheter to store it or not
        predicates.push.apply(predicates, filterObj.query.$and);
        predicates.push.apply(predicates, filterObj.query.$or);
      }
      this.ko_model.setPredicates(predicates);
    },

    getFilter: function (logicalOperator) {
      var predicates = this.getPredicates(),
        filter;
      if (_.isEmpty(predicates)) {
        filter = {};
      } else if (predicates.length === 1) {
        filter = predicates[0];
      } else {
        filter = _.object([logicalOperator || '$and'], [predicates]);
      }
      return new Filter(filter, _.pick(this.options,
        'entitySchema', 'i18n', 'shortDateFormat', 'i18n_prefixes'));
    },

    getPredicates: function () {
      return this.ko_model.getPredicates();
    },

    render: function () {
      var layout = this.layoutTemplate({
        i18n: this.options.i18n
      });
      this.$el.html(layout);
      ko.applyBindings(this.ko_model, this.el);
      return this;
    },

    remove: function () {
      ko.cleanNode(this.el);
      return this;
    },

    removeItem: function (ev) {
      var data = ko.dataFor(ev.target);
      if (!!data) {
        this.ko_model.removeItem(data);
      }
    }

  });

  function validateFilter(filter) {
    if (filter.depth > 2) {
      throw new Error('Filter control doesn\'t support expression trees of depth > 2');
    }
  }

  return View;
});
