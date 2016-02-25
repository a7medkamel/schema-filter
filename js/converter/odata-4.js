define(['lib/underscore'
  , 'lib/kendo/kendo.data.odata'  
  , 'component/filter/converter/kendo'
  , 'component/filter/converter/normalize'
  , 'component/filter/adapter/odata-4'  
], function (_, kendo, kendoConverter, normalize, odata_4) {
  'use strict';

  var defaults = {
    fieldMap: {}, // set of field aliases, if property names on clientside and server side are different. like {'id' : 'AdGroupId'}
    // TODO[andreic] : Agree with MT team on standard date format and use it as default
    dateFormat: 'yyyy-MM-ddTHH:mm:ss' // date format if the server requires specific date format. 
  }

  function toOData(filter, options) {
    var kendoFilter;
    options = _.defaults({}, options, defaults);
    kendoFilter = kendoConverter.convert(normalize.convert(filter), options);
    if (!kendoFilter) {
      return '';
    }
    return kendoToOData(kendoFilter);
  }
 
  function kendoToOData(kendoFilter) {
    var odata_params = kendo.data.transports.odata
      .parameterMap({ filter : kendoFilter }, 'read'); 
    return odata_4.from(odata_params).$filter;
  }

  return {
    convert: toOData
  }

});