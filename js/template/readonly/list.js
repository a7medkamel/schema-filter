define(['component/jade/util'], function(jade) { if(jade && jade['runtime'] !== undefined) { jade = jade.runtime; } return function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;
var locals_ = (locals || {}),filter = locals_.filter;
jade_mixins["predicate"] = function(predicate, isFirst){
var block = (this && this.block), attributes = (this && this.attributes) || {};
buf.push("<span class=\"column\">");
if ((!isFirst))
{
buf.push("<span class=\"filterand\"></span>");
}
buf.push((jade.escape(null == (jade_interp = predicate.i18n.property) ? "" : jade_interp)) + "</span><span class=\"filter_operator\">" + (jade.escape(null == (jade_interp = predicate.i18n.operator) ? "" : jade_interp)) + "</span>");
// iterate predicate.i18n.values
;(function(){
  var $$obj = predicate.i18n.values;
  if ('number' == typeof $$obj.length) {

    for (var index = 0, $$l = $$obj.length; index < $$l; index++) {
      var val = $$obj[index];

if ((index != 0))
{
buf.push(",");
}
buf.push("<span class=\"filterValue\">" + (jade.escape(null == (jade_interp = val) ? "" : jade_interp)) + "</span>");
    }

  } else {
    var $$l = 0;
    for (var index in $$obj) {
      $$l++;      var val = $$obj[index];

if ((index != 0))
{
buf.push(",");
}
buf.push("<span class=\"filterValue\">" + (jade.escape(null == (jade_interp = val) ? "" : jade_interp)) + "</span>");
    }

  }
}).call(this);

};
var predicates = filter.$and || filter.$or
buf.push("<span class=\"humanized\">");
// iterate predicates
;(function(){
  var $$obj = predicates;
  if ('number' == typeof $$obj.length) {

    for (var index = 0, $$l = $$obj.length; index < $$l; index++) {
      var predicate = $$obj[index];

jade_mixins["predicate"](predicate, index === 0);
    }

  } else {
    var $$l = 0;
    for (var index in $$obj) {
      $$l++;      var predicate = $$obj[index];

jade_mixins["predicate"](predicate, index === 0);
    }

  }
}).call(this);

buf.push("</span>");;return buf.join("");
}});