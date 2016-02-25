define(['lib/underscore'
  , 'lib/kendo/kendo.core'  
], function (_, kendo) {
  'use strict';

  var defaults = {
    fieldMap: {}, // set of field aliases, if property names on clientside and server side are different. like {'id' : 'AdGroupId'}
    dateFormat: 'yyyy-MM-ddTHH:mm:ss' // date format if the server requires specific date format. 
  },
  simpleOperatorMap = {
    $eq: 'eq',
    $ne: 'neq',
    $gt: 'gt',
    $ge: 'gte',
    $gte: 'gte',
    $lt: 'lt',
    $le: 'lte',
    $lte: 'lte',
    $contains: 'contains',
    $doesnotcontain: 'doesnotcontain',
    $substringof: 'contains',
    $endswith: 'endswith',
    $startswith: 'startswith'
  },
  logicalOperatorMap = {
    $and: 'and',
    $or: 'or'
  }

  function convert(filter, options) {
    var kendoFilters;
    options = _.defaults({}, options, defaults);    
    kendoFilters = _.chain(filter)
      .map(_.bind(convertNode, this, options))
      .filter(function(flt) {
        return !!flt;
      })
      .value();
    return (!kendoFilters || _.isEmpty(kendoFilters))
      ? null
      : { filters : kendoFilters };
  }

  function convertNode(options, expression, expressionKey) {
    if (_.isArray(expression)) {
      if (!!logicalOperatorMap[expressionKey]) {
        return {
          logic: logicalOperatorMap[expressionKey],
          filters: _.chain(expression)
            .map(function (expr) {
              return convertNode(options, _.values(expr)[0], _.keys(expr)[0]);
            })
            .filter(function (flt) {
              return !!flt;
            })
            .value()
        };
      } else {
        return null;
      }
    } else {
      return convertLeaf(expressionKey, expression, options);
    }
  }

  function convertLeaf(field, expression, options) {
    var operator = _.keys(expression)[0],
      value = _.values(expression)[0];
    field = !!options.fieldMap[field]
      ? options.fieldMap[field]
      : field;
    if (operator == '$in') {
      return convertEnumSelectionLeaf(field, value);
    }
    else if (!!simpleOperatorMap[operator]) {
      if (value instanceof Date) {
        value = kendo.toString(value, options.dateFormat);
      }
      return simpleExpression(field, operator, value);
    } else {
      return null;
    }
  }

  function convertEnumSelectionLeaf(field, value) {
    if (!_.isArray(value) || value.length == 0) {
      return null;
    } else {
      return {
        logic: 'or',
        filters: _.map(value, _.bind(simpleExpression, this, field, '$eq'))
      };
    }
  }

  function simpleExpression(field, operator, value) {
    return {
      field: field,
      value: value,
      operator: simpleOperatorMap[operator]
    }
  }

  return {
    convert: convert
  }

});