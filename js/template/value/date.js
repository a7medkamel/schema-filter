define(['component/jade/util'], function(jade) { if(jade && jade['runtime'] !== undefined) { jade = jade.runtime; } return function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;

buf.push("<input type=\"text\" data-bind=\"datePicker:value, format: options.shortDateFormat, culture:options.i18n.culture, css: { error: !validationResult().isValid }\" class=\"datepicker form-control\"/>");;return buf.join("");
}});