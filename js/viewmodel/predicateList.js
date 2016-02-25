define(['lib/underscore',
        'lib/knockout',
        'lib/kendo/kendo.core',
        'component/filter/model/filterSchema',
        'component/filter/filter',
        'component/filter/viewmodel/predicate',
        'component/filter/converter/i18n'
], function (_, ko, kendo, FilterSchema, Filter, PredicateVM, FilterI18n) {
  'use strict';

  var defaults = {};

  function ViewModel(options) {
    this.options = _.defaults({}, options, defaults);
    this.i18n = this.options.i18n;

    this._schema = new FilterSchema(this.options.entitySchema);
    this._i18nConverter = new FilterI18n(this._schema, this.i18n,
      _.pick(this.options, 'shortDateFormat', 'i18n_prefixes'));

    this.items = ko.observableArray();
    this.properties = this._buildPropertiesArray();

    this.removeItem = this.items.remove.bind(this.items);

    this.setPredicates(this.options.predicates);
  }

  ViewModel.prototype.newItem = function () {
    var firstProperty = this._schema.getPropertyKeys()[0],
      metadata = this._schema.getProperty(firstProperty),
      newItem = this._createItem(firstProperty, metadata.operators[0]);

    this.items.push(newItem);

    return this;
  };


  ViewModel.prototype.setPredicates = function (predicates) {
    this.items(_.map(predicates, this._expressionToItem.bind(this)));
    if (_.isEmpty(this.items())) {
      this.newItem();
    }
    return this;
  };

  ViewModel.prototype.getPredicates = function () {
    var items = this.items();
    if (items.length === 0) {
      return [];
    }
    else {
      return _.chain(items)
        .map(function (item) {
          return item.getExpression();
        })
        .reject(_.isNull)
        .map(function (expr) {
          return _.object([expr.property], [_.object(['$' + expr.operator], [expr.value])]);
        })
        .value();
    }
  };

  ViewModel.prototype._expressionToItem = function (filter) {
    var property = _.keys(filter)[0],
      predicate = filter[property],
      operator = _.keys(predicate)[0];
    return this._createItem(property, operator, _.values(predicate)[0]);
  };


  ViewModel.prototype._createItem = function (property, operator, value) {
    return new PredicateVM(_.extend({}, this.options, {
      property: property,
      operator: !!operator ? operator.replace(/^\$/, '') : operator,
      value: value,
      schema: this._schema,
      i18nConverter: this._i18nConverter
    }));
  };

  ViewModel.prototype._buildPropertiesArray = function () {
    return _.map(this._schema.getPropertyKeys(), function (key) {
      return {
        name: key,
        localized: this._i18nConverter.property(key)
      };
    }.bind(this));
  };

  return ViewModel;

});
