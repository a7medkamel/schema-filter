define(['lib/underscore',
        'lib/knockout',
        'lib/kendo/kendo.core'
], function (_, ko, kendo) {

  function PredicateVM(options) {
    this.options = options || {};

    this.property = ko.observable(this.options.property);
    this.operator = ko.observable(this.options.operator);

    this.metadata = ko.computed(function () {
      return this.options.schema.getProperty(this.property());
    }, this);

    this.value = ko.observable(mapValue.call(this, this.options.value));
    this.values = ko.observableArray(_.isArray(this.options.value) ? this.options.value : []);

    this.operators = ko.computed(this._getOperators, this);
    this.enumOptions = ko.computed(this._getOptions, this);

    this.property.subscribe(function () {
      this.operator(this.metadata().operators[0].replace(/^\$/, ''));
      this.value(null);
      this.values([]);
    }.bind(this));

    this.validationResult = ko.computed(this._validate, this);
    this.template = ko.computed(this._getTemplate, this);

  }

  PredicateVM.prototype.getExpression = function () {
    var value = this._getExpressionValue();
    if (_.isNull(value)) {
      return null;
    }
    return {
      property: this.property(),
      operator: this.operator(),
      value: this._getExpressionValue()
    };
  };

  PredicateVM.prototype._getExpressionValue = function () {
    var value = this.value(),
      values = this.values(),
      operator = this.operator();

    if(!this.validationResult().isValid){
      return null;
    }

    if(operator === 'in'){
      return _.isEmpty(values) ? null : values;
    } else if (_.isString(value)) {
      return !!(value.trim()) ? value : null;
    } else if (_.isNumber(value) || _.isBoolean(value)) {
      return value;
    } else {
      return !!value ? value : null;
    }
  };

  PredicateVM.prototype._getOperators = function () {
    var rawOperators = this.metadata().operators;
    return _.map(rawOperators, function (op) {
      return {
        operator: op,
        localized: this.options.i18nConverter.operator(op, this.property())
      };
    }.bind(this));
  };

  PredicateVM.prototype._getTemplate = function () {
    var keys = {
      property: (this.options.entity || '') + '_' + this.property(),
      typeoperator: this.metadata().type + '_' + this.operator(),
      type: this.metadata().type
    };
    if (!this.options.templates) {
      return null;
    }
    return this.options.templates[keys.property] || this.options.templates[keys.typeoperator] || this.options.templates[keys.type];
  };

  PredicateVM.prototype._getOptions = function () {
    var type = this.metadata().type;
    if (type === 'boolean') {
      return this._getBooleanOptions();
    } else if (!_.isEmpty(this.metadata().enum)) {
      return this._getEnumOptions();
    }
    return [];
  };

  PredicateVM.prototype._getBooleanOptions = function () {
    return [{
      value: true,
      localized: this.options.i18nConverter.value(true, this.property())
      }, {
      value: false,
      localized: this.options.i18nConverter.value(false, this.property())
      }];
  };

  PredicateVM.prototype._getEnumOptions = function () {
    return _.map(this.metadata().enum, function (val) {
      return {
        value: val,
        localized: this.options.i18nConverter.value(val, this.property())
      };
    }.bind(this));
  };

  PredicateVM.prototype._validate = function () {
    var errors = _.reject([this._checkNumber(), this._checkDate()], _.isNull);
    return {
      errors: errors.join(', '),
      isValid: _.isEmpty(errors)
    };
  };

  PredicateVM.prototype._checkNumber = function () {
    var type = this.metadata().type,
      value = this.value();
    if (type === 'number' && !_.isEmpty(value) && _.isNaN(Number(value))) {
      return this.options.i18nConverter.error('incorrect_number_format');
    }
    return null;
  };

  PredicateVM.prototype._checkDate = function () {
    var type = this.metadata().type,
      value = this.value();
    if (type === 'datetime' && !_.isEmpty(value) && !(value instanceof Date)) {
      return this.options.i18nConverter.error('incorrect_date_format');
    }
    return null;
  };

  function mapValue(value){
    var metadata = this.metadata(),
      parsed;
    if(metadata.type !== 'datetime' || value instanceof Date){
      return value;
    }
    parsed = kendo.parseDate(value, this.options.shortDateFormat);
    return !!parsed ? parsed : value;
  }

  return PredicateVM;

});
