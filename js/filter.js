define([
  'lib/underscore',
  'component/filter/converter/normalize',
  'component/filter/converter/odata-4',
  'component/filter/converter/legacy',
  'component/filter/converter/i18n',
  'component/filter/model/filterSchema'
], function (_, normalize, odata, legacyConverter, FilterI18n, FilterSchema) {
  'use strict';

  var defaults = {
    odata: {} // options for oData converter: fieldMap, dateFormat
  };

  var Filter = function (query, options) {
    this.options = _.defaults({}, options, defaults);
    this.query = normalize.convert(query);
    this.depth = calculateDepth(this.query);
    this.schema = getFilterSchema(this.options);
  };

  Filter.prototype.odataV4 = function (optionsOverrides) {
    var opts = _.defaults({}, optionsOverrides || {}, this.options.odata);
    return odata.convert(this.query, opts);
  };

  Filter.prototype.legacy = function (){
    return legacyConverter.convert(this, this.schema);
  };

  Filter.fromLegacy = function(expressions, options){
    var schema = getFilterSchema(options);

    var query = legacyConverter.parse(expressions, schema);
    return new Filter(query, options);
  };

  Filter.prototype.humanizedHtml = function(){
    if(!this.i18nConverter){
      if(!this.options.entitySchema || !this.options.i18n){
        throw new Error('You must provide entitySchema and i18n to Filter object constructor to get humanized HTML');
      }
      this.i18nConverter = new FilterI18n(
        this.options.entitySchema,
        this.options.i18n,
        {
          shortDateFormat : this.options.shortDateFormat,
          prefixes        : this.options.i18n_prefixes
        });
    }
    return this.i18nConverter.humanizedHtml(this);
  };

  function calculateDepth(query){
    // Bread First Search in Query exprtession tree to get the depth
    var depth = 0,
      frontier = [query];
    if(_.isEmpty(query)){
      return 0;
    }

    function bfsNextLevel (filters) {
      var next = [];
      _.each(filters, function (flt) {
        next.push.apply(next, flt.$and || []);
        next.push.apply(next, flt.$or || []);
      });
      return next;
    }

    while (!_.isEmpty(frontier)) {
      frontier = bfsNextLevel(frontier);
      depth++;
    }

    return depth;
  }

  function getFilterSchema(options){
    if(!options || !options.entitySchema){
      return null;
    }
    return new FilterSchema(options.entitySchema);
  }

  return Filter;


});
