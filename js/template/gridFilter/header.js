define(['component/jade/util'], function(jade) { if(jade && jade['runtime'] !== undefined) { jade = jade.runtime; } return function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;
var locals_ = (locals || {}),i18n = locals_.i18n,showQuickFilter = locals_.showQuickFilter;
buf.push("<div data-bind=\"css: {'dropdown' : filters().length &gt; 0}\" class=\"filter-header grid-menu\"><div data-toggle=\"dropdown\" aria-haspopup=\"true\" aria-expanded=\"false\" class=\"dropdown-control filter-button\"><span class=\"glyphicon glyphicon-filter\"></span><button" + (jade.attr("title", i18n.get('filter_grid_header'), true, false)) + " class=\"grid-menu\">" + (jade.escape(null == (jade_interp = i18n.get('filter_grid_header')) ? "" : jade_interp)) + "</button></div>");
if ( !!showQuickFilter)
{
buf.push("<div class=\"quick\"><input type=\"text\" data-bind=\"value: quick, valueUpdate: 'keyup'\" class=\"quick-text\"/><button class=\"quick-submit filter_search_icon_small\"></button></div>");
}
buf.push("<div role=\"menu\" class=\"filterMenu dropdown-menu\"><a class=\"new\">" + (jade.escape(null == (jade_interp = i18n.get("filter_grid_addnew")) ? "" : jade_interp)) + "</a><div class=\"apply-header\">" + (jade.escape(null == (jade_interp = i18n.get("filter_grid_applysaved")) ? "" : jade_interp)) + "</div><ul class=\"saved\"><!-- ko foreach: filters--><li><a" + (jade.attr("title", i18n.get('filter_grid_remove'), true, false)) + " class=\"delete\"><span class=\"glyphicon glyphicon-remove\"></span></a><a data-bind=\"text: name\" class=\"apply\"></a></li><!-- /ko--></ul></div></div>");;return buf.join("");
}});