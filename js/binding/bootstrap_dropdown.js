define(['lib/jquery', 'lib/knockout', 'lib/underscore'], function ($, ko, _) {
  'use strict';

  // TODO [andreic] - Choose One between this way and Popover used for Campaign/Adgroup selector and use it
  ko.bindingHandlers.bootstrap_dropdown = {

    init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {      
      var $menu = $(element).children('.dropdown-menu')
      $(element).on('hide.bs.dropdown', function () {
        var wndEvent = window.event;
        if(!wndEvent || !wndEvent.target){
          return;
        }
        if(wndEvent.target == $menu[0] || _.contains($(wndEvent.target).parents(), $menu[0])){
          return false;
        }
      });
    },
    
  };

  return ko.bindingHandlers.bs_dropdown;
});