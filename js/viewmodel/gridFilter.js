define(['lib/underscore',
        'lib/knockout'
], function (_, ko) {
  'use strict';

  var ViewModel = function(options){

    this.filters = ko.observableArray(options.filters);
    this.newName = ko.observable();
    this.quick = ko.observable();
  }

  return ViewModel;

});
