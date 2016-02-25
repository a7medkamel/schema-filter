define(['lib/underscore',
  'component/filter/model/filterSchema'], function(_, FilterSchema){
  'use strict';

  var operatorMap = {
    $contains        : 'Contains',
    $doesnotcontain  : 'DoesNotContain',
    $startswith      : 'BeginsWith',
    $endswith        : 'EndsWith',
    $eq              : 'Equal',
    $neq             : 'NotEqual',
    $gt              : 'Greater',
    $gte             : 'GreaterOrEqual',
    $lt              : 'Less',
    $lte             : 'LessOrEqual',
    $in              : 'EnumSelection'
  },
    reverseOperatorMap = _.invert(operatorMap);

  function convert(filter, schema){
    if(!filter.depth || !filter.query){
      throw new Error('depth or query is not defied. Filter object is incorrect');
    }
    if(filter.depth > 2){
      throw new Error('Filter of depth > 2 can not be converted into legacy filter expressions array');
    }
    if(_.isEmpty(filter.query)){
      return [];
    }

    var mongoExpressions = filter.depth === 1
      ? [filter.query]
      : filter.query.$and || filter.query.$or;
    return _.map(mongoExpressions, _toLegacyExpression.bind(filter, schema));
  }

  function parse(legacyExpressions, schema, logicalOperator) {
    if(!_.isArray(legacyExpressions)){
      throw new Error('First argument must be an array of legacy expressions');
    }
    if (_.isEmpty(legacyExpressions)) {
      return {};
    }

    if (legacyExpressions.length === 1) {
      return _toMongoPredicate(schema, legacyExpressions[0]);
    }
    return _.object([logicalOperator || '$and'],
      [_.map(legacyExpressions, _toMongoPredicate.bind(legacyExpressions, schema))]
    );
  }

  function _toMongoPredicate(schema, legacyExpression) {
    var column          = _fromLegacyColumnName(legacyExpression.SelectedColumn, schema),
      legacyOperator    = legacyExpression.SelectedOperator,
      mongoOperator     = reverseOperatorMap[legacyOperator],
      value             = mongoOperator === '$in'
                          ? legacyExpression.Values
                          : legacyExpression.Values[0];
    return _.object([column], [_.object([mongoOperator], [value])]);
  }

  function _toLegacyExpression(schema, mongoExpression){
    var operatorValue   = _.pairs(_.pairs(mongoExpression)[0][1])[0];
    var mongoOperator   = operatorValue[0],
        mongoValue    =  operatorValue[1];
    return {
      SelectedColumn    : _toLegacyColumnName(_.keys(mongoExpression)[0], schema),
      SelectedOperator  : operatorMap[mongoOperator],
      Values            : _.isArray(mongoValue) ? mongoValue : [mongoValue]
    };
  }

  function _toLegacyColumnName(columnName, schema){
    if(!!schema){
      columnName = schema.toAlias(columnName, 'legacy');
    }
    return columnName.split('/').pop();
  }

  function _fromLegacyColumnName(columnName, schema){
    if(!schema){
      return columnName;
    }
    columnName = schema.fromAlias(columnName, 'legacy') || columnName;
    if(!schema.getProperty(columnName)){
      columnName = _.find(schema.getPropertyKeys(), function(key){
        return key.split('/').pop() === columnName;
      }) || columnName;
    }
    return columnName;
  }

  return {
    convert : convert,
    parse   : parse
  };

});
