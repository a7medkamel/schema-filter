define(['lib/underscore'], function (_) {

  var operatorMapping = {
    number    : ['eq', 'neq', 'gt', 'gte', 'lt', 'lte'],
    integer   : ['eq', 'neq', 'gt', 'gte', 'lt', 'lte'],
    array     : ['eq', 'neq', 'gt', 'gte', 'lt', 'lte'],
    string    : ['contains', 'doesnotcontain', 'startswith', 'endswith', 'eq', 'neq'],
    enum      : ['in'],
    boolean   : ['eq'],
    datetime  : ['eq', 'neq', 'gt', 'gte', 'lt', 'lte']
  };

  function FilterSchema(entitySchema) {
    this._entitySchema = entitySchema;
    this._filterProps = _.once(function () {
      var self = getSelfFilterableProps(this._entitySchema),
        deps = getDeepFiltertableProps(this._entitySchema);
        return _.extend(self, deps);
    }.bind(this));

    this.entity = this._entitySchema.type;

    this._aliasMap = _.once(buildAliasMap.bind(this));
  }

  FilterSchema.prototype.getPropertyKeys = function () {
    return _.keys(this._filterProps());
  };

  FilterSchema.prototype.getProperty = function (propertyKey) {
    var property = this._filterProps()[propertyKey],
      type,
      result;
    if (!property) {
      return null;
    }
    type = property.type.toLowerCase();
    result = {
      type: type,
      operators: _.isEmpty(property.enum) ? operatorMapping[type] : operatorMapping['enum'],
      i18n: property.i18n,
      alias : property.alias
    };
    if (!!property.enum) {
      result.enum = property.enum;
    }
    return result;
  };

  // TODO: [andreic][akamel] - refactor into schema utility
  FilterSchema.prototype.toAlias = function(propertyKey, aliasType){
    var property = this.getProperty(propertyKey);
    if(!!property && !!property.alias && !!property.alias[aliasType]){
      return property.alias[aliasType];
    }
    return propertyKey;
  };

  FilterSchema.prototype.fromAlias = function(alias, aliasType){
    return this._aliasMap()[aliasType + '.' + alias];
  };

  function buildAliasMap(){
    return _.chain(this._filterProps())
      .map(function(property, propertyKey){
        return _.map(property.alias || {}, function(alias, aliasType){
          return [aliasType + '.' + alias, propertyKey];
        });
      })
      .flatten(true)
      .object()
      .value();
  }

  function getSelfFilterableProps(schema){
    return _.chain(schema.properties)
      .pairs()
      .filter(function (pair) {
        return !!pair[1] && pair[1].filterable === true;
      })
      .object()
      .value();
  }

  function getDeepFiltertableProps(schema){
    return _.chain(schema.properties)
      .pairs()
      .filter(function(pair){
        return pair[1].type === 'object' && !!pair[1].schema && !!pair[1].filterable;
      }) // Get object properties with "filterable" attribute
      .map(function(pair){
        var parentKey = pair[0];
        return _.chain(pair[1].schema.properties)
          .pick(pair[1].filterable) // pick only filterable properties
          .pairs()
          .map(function(childPair){
            var prop = _.extend({}, childPair[1], {
              alias : pair[1].alias && pair[1].alias[childPair[0]]
            }); // set alias on property object
            return [parentKey + '.' + childPair[0], prop]; // return key-value pair with key = parent/child
          })
          .value();
      })
      .flatten(true)
      .object()
      .value();
  }

  return FilterSchema;

});
