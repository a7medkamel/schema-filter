define(['component/jade/util'], function(jade) { if(jade && jade['runtime'] !== undefined) { jade = jade.runtime; } return function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;
var locals_ = (locals || {}),i18n = locals_.i18n;
buf.push("<div class=\"filter-body\"><div class=\"panel\"><div class=\"panel-heading\"><div class=\"panel-title\"><header class=\"filter_title\">" + (jade.escape(null == (jade_interp = i18n.get('filter_grid_header')) ? "" : jade_interp)) + "</header></div></div><div class=\"panel-body\"><div class=\"list-placeholder\"></div><div class=\"save-form form-inline\"><input maxlength=\"100\" type=\"text\"" + (jade.attr("placeholder", i18n.get('filter_grid_name_watermark'), true, false)) + " data-bind=\"value: newName\" class=\"form-control name\"/><button class=\"filter_button apply btn btn-primary\">" + (jade.escape(null == (jade_interp = i18n.get('filter_grid_apply')) ? "" : jade_interp)) + "</button><button class=\"filter_button cancel btn btn-default\">" + (jade.escape(null == (jade_interp = i18n.get('filter_grid_cancel')) ? "" : jade_interp)) + "</button></div></div></div></div>");;return buf.join("");
}});