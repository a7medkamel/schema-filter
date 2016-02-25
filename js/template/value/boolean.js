define(['component/jade/util'], function(jade) { if(jade && jade['runtime'] !== undefined) { jade = jade.runtime; } return function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;

buf.push("<select data-bind=\"value: value, options: enumOptions, optionsText:'localized', optionsValue:'value'\" class=\"form-control\"></select>");;return buf.join("");
}});