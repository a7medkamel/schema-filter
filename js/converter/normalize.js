define(['lib/underscore'], function() {
  'use strict';

  // Module converts filter structure to formal expression tree.
  // Filter structure supports implicit 'AND' operators:
  //  {field1: {$lt:4, $gt:10}} or {field1: 5, field2: 10}
  // This function converts such strcutures to explicit 'and' conditions
  // It also removes redundant 'And' and 'Or' conditions
  function normalize(filter) {
    var conditions = [];

    _.each(filter, function (expression, expressionKey) {      
      if (isFieldName(expressionKey)) {
        conditions.push.apply(conditions, getFieldExpressions(expressionKey, expression));
      } else if (_.isArray(expression) && expression.length > 0) {
        if (expressionKey == '$and') {
          conditions.push.apply(conditions, _.map(expression, normalize));
        }
        else if (expressionKey == '$or') {
          if (expression.length == 1) {
            conditions.push(normalize(expression[0]));
          } else {
            conditions.push({ $or: _.map(expression, normalize) });
          }
        }
      }
    });

    conditions = flattenAndOperators(conditions);

    if (conditions.length == 0) {
      return {};
    }
    if (conditions.length == 1) {
      return conditions[0];
    } else {
      return { $and : conditions };
    }
  }

  function flattenAndOperators(conditions) {
    var result = [];
    _.each(conditions, function(condition) {
      if (!!condition.$and) {
        result.push.apply(result, condition.$and);
        delete condition.$and;
      }
      if (!_.isEmpty(condition)) {
        result.push(condition);
      }
    });
    return result;
  }

  function isFieldName(expressionKey) {
    return expressionKey[0] !== '$';
  }

  function getFieldExpressions(field, expression) {
    if (!_.isObject(expression)) {
      return [toExplicitCondition(field, '$eq', expression)];
    } else {
      return _.map(expression, function(fieldVal, operator) {
        return toExplicitCondition(field, operator, fieldVal);
      });
    }
  }

  function toExplicitCondition(field, operator, value) {
    return _.object([field], [_.object([operator], [value])]);    
  }


  return { convert : normalize };

});