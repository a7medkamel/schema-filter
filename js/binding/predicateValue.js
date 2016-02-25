define(['lib/jquery', 'lib/knockout'], function ($, ko) {
  'use strict';

  function render(element, bindingOptions, predicate) {
    var html = predicate.template()({
        i18n: bindingOptions.i18n
      }),
      $inner = $('<div/>').html(html),
      oldInner = $(element).children()[0];
    if(!!oldInner){
      ko.cleanNode(oldInner);
    }
    $(element).empty().append($inner);
    ko.applyBindings(predicate, $inner[0]);
  }

  ko.bindingHandlers.predicateValue = {

    init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
      var predicate = valueAccessor(),
        bindingOptions = allBindings(),
        rebindObservable = predicate.property;

      render(element, bindingOptions, predicate);


      rebindObservable.subscribe(function () {
        render(element, bindingOptions, predicate);
      });
      return {
        controlsDescendantBindings: true
      };
    },

    update: function (/*element, valueAccessor, allBindings, viewModel, bindingContext*/) {

      // This will be called once when the binding is first applied to an element,
      // and again whenever any observables/computeds that are accessed change
      // Update the DOM element based on the supplied values here.
    }
  };

  return ko.bindingHandlers.predicateValue;
});