define(['component/filter/template/value/number',
        'component/filter/template/value/string',
        'component/filter/template/value/enum',
        'component/filter/template/value/boolean',
        'component/filter/template/value/date'
      ], function(numberTemplate, stringTemplate, enumTemplate, booleanTemplate,
      dateTemplate){

  return {
    number    : numberTemplate,
    string    : stringTemplate,
    string_in : enumTemplate,
    boolean   : booleanTemplate,
    datetime  : dateTemplate
  };

});
