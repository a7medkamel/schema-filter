define(['component/jade/util'], function(jade) { if(jade && jade['runtime'] !== undefined) { jade = jade.runtime; } return function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;
var locals_ = (locals || {}),i18n = locals_.i18n;
buf.push("<div data-bind=\"bootstrap_dropdown:true\" class=\"dropdown\"><div data-toggle=\"dropdown\" aria-haspopup=\"true\" aria-expanded=\"false\" class=\"dropdown-control form-control\"><span>" + (jade.escape(null == (jade_interp = i18n.get('filter_enum_selected_count')              ) ? "" : jade_interp)) + "</span><span data-bind=\"text:!!values() ? values().length : 0\"></span><div class=\"glyphicon glyphicon-triangle-bottom\"></div></div><ul role=\"menu\" class=\"dropdown-menu enum-options\"><!-- ko foreach: enumOptions--><li class=\"checkbox\"><label><input type=\"checkbox\" data-bind=\"value: value, checked: $parent.values\"/><span data-bind=\"text:localized\">       </span></label></li><!-- /ko--></ul></div>");;return buf.join("");
}});