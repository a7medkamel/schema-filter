define(['lib/underscore',
        'component/filter/model/filterSchema',
        'component/filter/template/readonly/single',
        'component/filter/template/readonly/list',
        'lib/kendo/kendo.core'
      ], function (_, FilterSchema, singleTemplate, listTemplate, kendo) {

  'use strict';

  var depthTemplateMap = {
    1 : singleTemplate,
    2 : listTemplate
  },
    defaults = {
      prefixes: {
        property  : 'filter_property_',
        operator  : 'filter_operator_',
        value     : 'filter_value_',
        error     : 'filter_error_'
      }
    };

  var FilterI18n = function (schema, i18n, options) {
    this._schema = schema instanceof FilterSchema ? schema : new FilterSchema(schema);
    this._i18n = i18n;
    this.options = options || {};
    this.prefixes = _.defaults({}, this.options.prefixes || {}, defaults.prefixes);
  };

  FilterI18n.prototype.property = function(key){
    var prop = this._schema.getProperty(key),
      i18nkey = !!prop && !!prop.i18n && !!prop.i18n.customProperty ?
        this.prefixes.property + this._schema.entity + '_' + key :
        this.prefixes.property + key;
    return this._i18n.get(i18nkey);
  };

  FilterI18n.prototype.operator = function(key, property){
    var prop = this._schema.getProperty(property),
      i18nkey = !!prop && !!prop.i18n && !!prop.i18n.customOperators ?
        this.prefixes.operator + this._schema.entity + '_' + property + '_' + key :
        this.prefixes.operator + key;
    return this._i18n.get(i18nkey);
  };

  FilterI18n.prototype.value = function(key, property){
    var prop = this._schema.getProperty(property),
      i18nkey;
      if(prop.type === 'datetime' && key instanceof Date){
        return this.date(key);
      }
      else if(prop.type === 'boolean'){
        i18nkey = !!prop && !!prop.i18n && !!prop.i18n.customValues ?
          this.prefixes.value + this._schema.entity + '_' + property + '_' + key :
          this.prefixes.value + key;
        return this._i18n.get(i18nkey);
      }
      else if(!!prop.enum){
        i18nkey = !!prop && !!prop.i18n && !!prop.i18n.customValues ?
          this.prefixes.value + this._schema.entity + '_' + property + '_' + key :
          this.prefixes.value + property + '_' + key;
        return this._i18n.get(i18nkey);
      }
      else{
         return key;
      }
  };

  FilterI18n.prototype.error = function(error){
    return this._i18n.get(this.prefixes.error + error);
  };

  FilterI18n.prototype.date = function(date){
    if(!this.options.shortDateFormat){
      throw ('Short Date Format option must be provided to localize date value');
    }
    return kendo.toString(date, this.options.shortDateFormat);
  };

  FilterI18n.prototype.humanizedHtml = function(filter){

    if(!filter.query || !filter.depth){
      throw new Error('Incorrect filter object');
    }

    var extended = extendFilter.call(this, filter.query),
      template = depthTemplateMap[filter.depth];

    return template({
      filter  : extended,
      i18n    : this._i18n
    });

  };

  function extendFilter(filter){
    var result = {};
    if(!!filter.$and){
      result.$and = _.map(filter.$and, extendFilter.bind(this));
    }
    else if(!!filter.$or){
      result.$or = _.map(filter.$or, extendFilter.bind(this));
    }
    else{
      result = extendPredicate.call(this, filter);
    }
    return result;
  }

  function extendPredicate(predicate){
    var property  = _.keys(predicate)[0],
      opValue     = _.values(predicate)[0],
      operator    = _.keys(opValue)[0].replace(/^\$/, ''),
      value       = _.values(opValue)[0],
      i18n        = {
        property  : this.property(property),
        operator  : this.operator(operator, property),
        values    : _.map(_.isArray(value) ? value : [value], function(val){
          return this.value(val, property);
        }.bind(this))
      };
    return _.extend({}, predicate, {i18n: i18n});
  }

  return FilterI18n;

});
