define(['lib/knockout',
  'lib/jquery',
  'lib/underscore',
  'lib/kendo/kendo.datepicker'], function(ko, $, _){

  ko.bindingHandlers.datePicker = {
    init: function(element, valueAccessor, allBindings){
      var value   = valueAccessor(),
        bindings  = allBindings(),
        culture   = bindings.culture,
        format    = bindings.format;

      if(!ko.isObservable(value)){
        throw new Error('Value accessor for date picker should be observable');
      }

      $(element).kendoDatePicker({
        culture: culture,
        format: format,
        animation: false,
        footer: false,
        value: value(),
        change: function(){
          var val = this.value();
          if(val == null && !!$(element).val()){
            val = $(element).val();
          }
          value(val);
        }
      });

      var widget = $(element).data('kendoDatePicker');
      if(!!widget && _.isFunction(widget.open)){
        $(element).click(widget.open.bind(widget));
      }
    }
  };

  return ko.bindingHandlers.datePicker;
});
