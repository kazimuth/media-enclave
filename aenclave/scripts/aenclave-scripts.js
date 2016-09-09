(function(){var
window=this,undefined,_jQuery=window.jQuery,_$=window.$,jQuery=window.jQuery=window.$=function(selector,context){return new jQuery.fn.init(selector,context);},quickExpr=/^[^<]*(<(.|\s)+>)[^>]*$|^#([\w-]+)$/,isSimple=/^.[^:#\[\.,]*$/;jQuery.fn=jQuery.prototype={init:function(selector,context){selector=selector||document;if(selector.nodeType){this[0]=selector;this.length=1;this.context=selector;return this;}
if(typeof selector==="string"){var match=quickExpr.exec(selector);if(match&&(match[1]||!context)){if(match[1])
selector=jQuery.clean([match[1]],context);else{var elem=document.getElementById(match[3]);if(elem&&elem.id!=match[3])
return jQuery().find(selector);var ret=jQuery(elem||[]);ret.context=document;ret.selector=selector;return ret;}}else
return jQuery(context).find(selector);}else if(jQuery.isFunction(selector))
return jQuery(document).ready(selector);if(selector.selector&&selector.context){this.selector=selector.selector;this.context=selector.context;}
return this.setArray(jQuery.isArray(selector)?selector:jQuery.makeArray(selector));},selector:"",jquery:"1.3.2",size:function(){return this.length;},get:function(num){return num===undefined?Array.prototype.slice.call(this):this[num];},pushStack:function(elems,name,selector){var ret=jQuery(elems);ret.prevObject=this;ret.context=this.context;if(name==="find")
ret.selector=this.selector+(this.selector?" ":"")+selector;else if(name)
ret.selector=this.selector+"."+name+"("+selector+")";return ret;},setArray:function(elems){this.length=0;Array.prototype.push.apply(this,elems);return this;},each:function(callback,args){return jQuery.each(this,callback,args);},index:function(elem){return jQuery.inArray(elem&&elem.jquery?elem[0]:elem,this);},attr:function(name,value,type){var options=name;if(typeof name==="string")
if(value===undefined)
return this[0]&&jQuery[type||"attr"](this[0],name);else{options={};options[name]=value;}
return this.each(function(i){for(name in options)
jQuery.attr(type?this.style:this,name,jQuery.prop(this,options[name],type,i,name));});},css:function(key,value){if((key=='width'||key=='height')&&parseFloat(value)<0)
value=undefined;return this.attr(key,value,"curCSS");},text:function(text){if(typeof text!=="object"&&text!=null)
return this.empty().append((this[0]&&this[0].ownerDocument||document).createTextNode(text));var ret="";jQuery.each(text||this,function(){jQuery.each(this.childNodes,function(){if(this.nodeType!=8)
ret+=this.nodeType!=1?this.nodeValue:jQuery.fn.text([this]);});});return ret;},wrapAll:function(html){if(this[0]){var wrap=jQuery(html,this[0].ownerDocument).clone();if(this[0].parentNode)
wrap.insertBefore(this[0]);wrap.map(function(){var elem=this;while(elem.firstChild)
elem=elem.firstChild;return elem;}).append(this);}
return this;},wrapInner:function(html){return this.each(function(){jQuery(this).contents().wrapAll(html);});},wrap:function(html){return this.each(function(){jQuery(this).wrapAll(html);});},append:function(){return this.domManip(arguments,true,function(elem){if(this.nodeType==1)
this.appendChild(elem);});},prepend:function(){return this.domManip(arguments,true,function(elem){if(this.nodeType==1)
this.insertBefore(elem,this.firstChild);});},before:function(){return this.domManip(arguments,false,function(elem){this.parentNode.insertBefore(elem,this);});},after:function(){return this.domManip(arguments,false,function(elem){this.parentNode.insertBefore(elem,this.nextSibling);});},end:function(){return this.prevObject||jQuery([]);},push:[].push,sort:[].sort,splice:[].splice,find:function(selector){if(this.length===1){var ret=this.pushStack([],"find",selector);ret.length=0;jQuery.find(selector,this[0],ret);return ret;}else{return this.pushStack(jQuery.unique(jQuery.map(this,function(elem){return jQuery.find(selector,elem);})),"find",selector);}},clone:function(events){var ret=this.map(function(){if(!jQuery.support.noCloneEvent&&!jQuery.isXMLDoc(this)){var html=this.outerHTML;if(!html){var div=this.ownerDocument.createElement("div");div.appendChild(this.cloneNode(true));html=div.innerHTML;}
return jQuery.clean([html.replace(/ jQuery\d+="(?:\d+|null)"/g,"").replace(/^\s*/,"")])[0];}else
return this.cloneNode(true);});if(events===true){var orig=this.find("*").andSelf(),i=0;ret.find("*").andSelf().each(function(){if(this.nodeName!==orig[i].nodeName)
return;var events=jQuery.data(orig[i],"events");for(var type in events){for(var handler in events[type]){jQuery.event.add(this,type,events[type][handler],events[type][handler].data);}}
i++;});}
return ret;},filter:function(selector){return this.pushStack(jQuery.isFunction(selector)&&jQuery.grep(this,function(elem,i){return selector.call(elem,i);})||jQuery.multiFilter(selector,jQuery.grep(this,function(elem){return elem.nodeType===1;})),"filter",selector);},closest:function(selector){var pos=jQuery.expr.match.POS.test(selector)?jQuery(selector):null,closer=0;return this.map(function(){var cur=this;while(cur&&cur.ownerDocument){if(pos?pos.index(cur)>-1:jQuery(cur).is(selector)){jQuery.data(cur,"closest",closer);return cur;}
cur=cur.parentNode;closer++;}});},not:function(selector){if(typeof selector==="string")
if(isSimple.test(selector))
return this.pushStack(jQuery.multiFilter(selector,this,true),"not",selector);else
selector=jQuery.multiFilter(selector,this);var isArrayLike=selector.length&&selector[selector.length-1]!==undefined&&!selector.nodeType;return this.filter(function(){return isArrayLike?jQuery.inArray(this,selector)<0:this!=selector;});},add:function(selector){return this.pushStack(jQuery.unique(jQuery.merge(this.get(),typeof selector==="string"?jQuery(selector):jQuery.makeArray(selector))));},is:function(selector){return!!selector&&jQuery.multiFilter(selector,this).length>0;},hasClass:function(selector){return!!selector&&this.is("."+selector);},val:function(value){if(value===undefined){var elem=this[0];if(elem){if(jQuery.nodeName(elem,'option'))
return(elem.attributes.value||{}).specified?elem.value:elem.text;if(jQuery.nodeName(elem,"select")){var index=elem.selectedIndex,values=[],options=elem.options,one=elem.type=="select-one";if(index<0)
return null;for(var i=one?index:0,max=one?index+1:options.length;i<max;i++){var option=options[i];if(option.selected){value=jQuery(option).val();if(one)
return value;values.push(value);}}
return values;}
return(elem.value||"").replace(/\r/g,"");}
return undefined;}
if(typeof value==="number")
value+='';return this.each(function(){if(this.nodeType!=1)
return;if(jQuery.isArray(value)&&/radio|checkbox/.test(this.type))
this.checked=(jQuery.inArray(this.value,value)>=0||jQuery.inArray(this.name,value)>=0);else if(jQuery.nodeName(this,"select")){var values=jQuery.makeArray(value);jQuery("option",this).each(function(){this.selected=(jQuery.inArray(this.value,values)>=0||jQuery.inArray(this.text,values)>=0);});if(!values.length)
this.selectedIndex=-1;}else
this.value=value;});},html:function(value){return value===undefined?(this[0]?this[0].innerHTML.replace(/ jQuery\d+="(?:\d+|null)"/g,""):null):this.empty().append(value);},replaceWith:function(value){return this.after(value).remove();},eq:function(i){return this.slice(i,+i+1);},slice:function(){return this.pushStack(Array.prototype.slice.apply(this,arguments),"slice",Array.prototype.slice.call(arguments).join(","));},map:function(callback){return this.pushStack(jQuery.map(this,function(elem,i){return callback.call(elem,i,elem);}));},andSelf:function(){return this.add(this.prevObject);},domManip:function(args,table,callback){if(this[0]){var fragment=(this[0].ownerDocument||this[0]).createDocumentFragment(),scripts=jQuery.clean(args,(this[0].ownerDocument||this[0]),fragment),first=fragment.firstChild;if(first)
for(var i=0,l=this.length;i<l;i++)
callback.call(root(this[i],first),this.length>1||i>0?fragment.cloneNode(true):fragment);if(scripts)
jQuery.each(scripts,evalScript);}
return this;function root(elem,cur){return table&&jQuery.nodeName(elem,"table")&&jQuery.nodeName(cur,"tr")?(elem.getElementsByTagName("tbody")[0]||elem.appendChild(elem.ownerDocument.createElement("tbody"))):elem;}}};jQuery.fn.init.prototype=jQuery.fn;function evalScript(i,elem){if(elem.src)
jQuery.ajax({url:elem.src,async:false,dataType:"script"});else
jQuery.globalEval(elem.text||elem.textContent||elem.innerHTML||"");if(elem.parentNode)
elem.parentNode.removeChild(elem);}
function now(){return+new Date;}
jQuery.extend=jQuery.fn.extend=function(){var target=arguments[0]||{},i=1,length=arguments.length,deep=false,options;if(typeof target==="boolean"){deep=target;target=arguments[1]||{};i=2;}
if(typeof target!=="object"&&!jQuery.isFunction(target))
target={};if(length==i){target=this;--i;}
for(;i<length;i++)
if((options=arguments[i])!=null)
for(var name in options){var src=target[name],copy=options[name];if(target===copy)
continue;if(deep&&copy&&typeof copy==="object"&&!copy.nodeType)
target[name]=jQuery.extend(deep,src||(copy.length!=null?[]:{}),copy);else if(copy!==undefined)
target[name]=copy;}
return target;};var exclude=/z-?index|font-?weight|opacity|zoom|line-?height/i,defaultView=document.defaultView||{},toString=Object.prototype.toString;jQuery.extend({noConflict:function(deep){window.$=_$;if(deep)
window.jQuery=_jQuery;return jQuery;},isFunction:function(obj){return toString.call(obj)==="[object Function]";},isArray:function(obj){return toString.call(obj)==="[object Array]";},isXMLDoc:function(elem){return elem.nodeType===9&&elem.documentElement.nodeName!=="HTML"||!!elem.ownerDocument&&jQuery.isXMLDoc(elem.ownerDocument);},globalEval:function(data){if(data&&/\S/.test(data)){var head=document.getElementsByTagName("head")[0]||document.documentElement,script=document.createElement("script");script.type="text/javascript";if(jQuery.support.scriptEval)
script.appendChild(document.createTextNode(data));else
script.text=data;head.insertBefore(script,head.firstChild);head.removeChild(script);}},nodeName:function(elem,name){return elem.nodeName&&elem.nodeName.toUpperCase()==name.toUpperCase();},each:function(object,callback,args){var name,i=0,length=object.length;if(args){if(length===undefined){for(name in object)
if(callback.apply(object[name],args)===false)
break;}else
for(;i<length;)
if(callback.apply(object[i++],args)===false)
break;}else{if(length===undefined){for(name in object)
if(callback.call(object[name],name,object[name])===false)
break;}else
for(var value=object[0];i<length&&callback.call(value,i,value)!==false;value=object[++i]){}}
return object;},prop:function(elem,value,type,i,name){if(jQuery.isFunction(value))
value=value.call(elem,i);return typeof value==="number"&&type=="curCSS"&&!exclude.test(name)?value+"px":value;},className:{add:function(elem,classNames){jQuery.each((classNames||"").split(/\s+/),function(i,className){if(elem.nodeType==1&&!jQuery.className.has(elem.className,className))
elem.className+=(elem.className?" ":"")+className;});},remove:function(elem,classNames){if(elem.nodeType==1)
elem.className=classNames!==undefined?jQuery.grep(elem.className.split(/\s+/),function(className){return!jQuery.className.has(classNames,className);}).join(" "):"";},has:function(elem,className){return elem&&jQuery.inArray(className,(elem.className||elem).toString().split(/\s+/))>-1;}},swap:function(elem,options,callback){var old={};for(var name in options){old[name]=elem.style[name];elem.style[name]=options[name];}
callback.call(elem);for(var name in options)
elem.style[name]=old[name];},css:function(elem,name,force,extra){if(name=="width"||name=="height"){var val,props={position:"absolute",visibility:"hidden",display:"block"},which=name=="width"?["Left","Right"]:["Top","Bottom"];function getWH(){val=name=="width"?elem.offsetWidth:elem.offsetHeight;if(extra==="border")
return;jQuery.each(which,function(){if(!extra)
val-=parseFloat(jQuery.curCSS(elem,"padding"+this,true))||0;if(extra==="margin")
val+=parseFloat(jQuery.curCSS(elem,"margin"+this,true))||0;else
val-=parseFloat(jQuery.curCSS(elem,"border"+this+"Width",true))||0;});}
if(elem.offsetWidth!==0)
getWH();else
jQuery.swap(elem,props,getWH);return Math.max(0,Math.round(val));}
return jQuery.curCSS(elem,name,force);},curCSS:function(elem,name,force){var ret,style=elem.style;if(name=="opacity"&&!jQuery.support.opacity){ret=jQuery.attr(style,"opacity");return ret==""?"1":ret;}
if(name.match(/float/i))
name=styleFloat;if(!force&&style&&style[name])
ret=style[name];else if(defaultView.getComputedStyle){if(name.match(/float/i))
name="float";name=name.replace(/([A-Z])/g,"-$1").toLowerCase();var computedStyle=defaultView.getComputedStyle(elem,null);if(computedStyle)
ret=computedStyle.getPropertyValue(name);if(name=="opacity"&&ret=="")
ret="1";}else if(elem.currentStyle){var camelCase=name.replace(/\-(\w)/g,function(all,letter){return letter.toUpperCase();});ret=elem.currentStyle[name]||elem.currentStyle[camelCase];if(!/^\d+(px)?$/i.test(ret)&&/^\d/.test(ret)){var left=style.left,rsLeft=elem.runtimeStyle.left;elem.runtimeStyle.left=elem.currentStyle.left;style.left=ret||0;ret=style.pixelLeft+"px";style.left=left;elem.runtimeStyle.left=rsLeft;}}
return ret;},clean:function(elems,context,fragment){context=context||document;if(typeof context.createElement==="undefined")
context=context.ownerDocument||context[0]&&context[0].ownerDocument||document;if(!fragment&&elems.length===1&&typeof elems[0]==="string"){var match=/^<(\w+)\s*\/?>$/.exec(elems[0]);if(match)
return[context.createElement(match[1])];}
var ret=[],scripts=[],div=context.createElement("div");jQuery.each(elems,function(i,elem){if(typeof elem==="number")
elem+='';if(!elem)
return;if(typeof elem==="string"){elem=elem.replace(/(<(\w+)[^>]*?)\/>/g,function(all,front,tag){return tag.match(/^(abbr|br|col|img|input|link|meta|param|hr|area|embed)$/i)?all:front+"></"+tag+">";});var tags=elem.replace(/^\s+/,"").substring(0,10).toLowerCase();var wrap=!tags.indexOf("<opt")&&[1,"<select multiple='multiple'>","</select>"]||!tags.indexOf("<leg")&&[1,"<fieldset>","</fieldset>"]||tags.match(/^<(thead|tbody|tfoot|colg|cap)/)&&[1,"<table>","</table>"]||!tags.indexOf("<tr")&&[2,"<table><tbody>","</tbody></table>"]||(!tags.indexOf("<td")||!tags.indexOf("<th"))&&[3,"<table><tbody><tr>","</tr></tbody></table>"]||!tags.indexOf("<col")&&[2,"<table><tbody></tbody><colgroup>","</colgroup></table>"]||!jQuery.support.htmlSerialize&&[1,"div<div>","</div>"]||[0,"",""];div.innerHTML=wrap[1]+elem+wrap[2];while(wrap[0]--)
div=div.lastChild;if(!jQuery.support.tbody){var hasBody=/<tbody/i.test(elem),tbody=!tags.indexOf("<table")&&!hasBody?div.firstChild&&div.firstChild.childNodes:wrap[1]=="<table>"&&!hasBody?div.childNodes:[];for(var j=tbody.length-1;j>=0;--j)
if(jQuery.nodeName(tbody[j],"tbody")&&!tbody[j].childNodes.length)
tbody[j].parentNode.removeChild(tbody[j]);}
if(!jQuery.support.leadingWhitespace&&/^\s/.test(elem))
div.insertBefore(context.createTextNode(elem.match(/^\s*/)[0]),div.firstChild);elem=jQuery.makeArray(div.childNodes);}
if(elem.nodeType)
ret.push(elem);else
ret=jQuery.merge(ret,elem);});if(fragment){for(var i=0;ret[i];i++){if(jQuery.nodeName(ret[i],"script")&&(!ret[i].type||ret[i].type.toLowerCase()==="text/javascript")){scripts.push(ret[i].parentNode?ret[i].parentNode.removeChild(ret[i]):ret[i]);}else{if(ret[i].nodeType===1)
ret.splice.apply(ret,[i+1,0].concat(jQuery.makeArray(ret[i].getElementsByTagName("script"))));fragment.appendChild(ret[i]);}}
return scripts;}
return ret;},attr:function(elem,name,value){if(!elem||elem.nodeType==3||elem.nodeType==8)
return undefined;var notxml=!jQuery.isXMLDoc(elem),set=value!==undefined;name=notxml&&jQuery.props[name]||name;if(elem.tagName){var special=/href|src|style/.test(name);if(name=="selected"&&elem.parentNode)
elem.parentNode.selectedIndex;if(name in elem&&notxml&&!special){if(set){if(name=="type"&&jQuery.nodeName(elem,"input")&&elem.parentNode)
throw"type property can't be changed";elem[name]=value;}
if(jQuery.nodeName(elem,"form")&&elem.getAttributeNode(name))
return elem.getAttributeNode(name).nodeValue;if(name=="tabIndex"){var attributeNode=elem.getAttributeNode("tabIndex");return attributeNode&&attributeNode.specified?attributeNode.value:elem.nodeName.match(/(button|input|object|select|textarea)/i)?0:elem.nodeName.match(/^(a|area)$/i)&&elem.href?0:undefined;}
return elem[name];}
if(!jQuery.support.style&&notxml&&name=="style")
return jQuery.attr(elem.style,"cssText",value);if(set)
elem.setAttribute(name,""+value);var attr=!jQuery.support.hrefNormalized&&notxml&&special?elem.getAttribute(name,2):elem.getAttribute(name);return attr===null?undefined:attr;}
if(!jQuery.support.opacity&&name=="opacity"){if(set){elem.zoom=1;elem.filter=(elem.filter||"").replace(/alpha\([^)]*\)/,"")+
(parseInt(value)+''=="NaN"?"":"alpha(opacity="+value*100+")");}
return elem.filter&&elem.filter.indexOf("opacity=")>=0?(parseFloat(elem.filter.match(/opacity=([^)]*)/)[1])/100)+'':"";}
name=name.replace(/-([a-z])/ig,function(all,letter){return letter.toUpperCase();});if(set)
elem[name]=value;return elem[name];},trim:function(text){return(text||"").replace(/^\s+|\s+$/g,"");},makeArray:function(array){var ret=[];if(array!=null){var i=array.length;if(i==null||typeof array==="string"||jQuery.isFunction(array)||array.setInterval)
ret[0]=array;else
while(i)
ret[--i]=array[i];}
return ret;},inArray:function(elem,array){for(var i=0,length=array.length;i<length;i++)
if(array[i]===elem)
return i;return-1;},merge:function(first,second){var i=0,elem,pos=first.length;if(!jQuery.support.getAll){while((elem=second[i++])!=null)
if(elem.nodeType!=8)
first[pos++]=elem;}else
while((elem=second[i++])!=null)
first[pos++]=elem;return first;},unique:function(array){var ret=[],done={};try{for(var i=0,length=array.length;i<length;i++){var id=jQuery.data(array[i]);if(!done[id]){done[id]=true;ret.push(array[i]);}}}catch(e){ret=array;}
return ret;},grep:function(elems,callback,inv){var ret=[];for(var i=0,length=elems.length;i<length;i++)
if(!inv!=!callback(elems[i],i))
ret.push(elems[i]);return ret;},map:function(elems,callback){var ret=[];for(var i=0,length=elems.length;i<length;i++){var value=callback(elems[i],i);if(value!=null)
ret[ret.length]=value;}
return ret.concat.apply([],ret);}});var userAgent=navigator.userAgent.toLowerCase();jQuery.browser={version:(userAgent.match(/.+(?:rv|it|ra|ie)[\/: ]([\d.]+)/)||[0,'0'])[1],safari:/webkit/.test(userAgent),opera:/opera/.test(userAgent),msie:/msie/.test(userAgent)&&!/opera/.test(userAgent),mozilla:/mozilla/.test(userAgent)&&!/(compatible|webkit)/.test(userAgent)};jQuery.each({parent:function(elem){return elem.parentNode;},parents:function(elem){return jQuery.dir(elem,"parentNode");},next:function(elem){return jQuery.nth(elem,2,"nextSibling");},prev:function(elem){return jQuery.nth(elem,2,"previousSibling");},nextAll:function(elem){return jQuery.dir(elem,"nextSibling");},prevAll:function(elem){return jQuery.dir(elem,"previousSibling");},siblings:function(elem){return jQuery.sibling(elem.parentNode.firstChild,elem);},children:function(elem){return jQuery.sibling(elem.firstChild);},contents:function(elem){return jQuery.nodeName(elem,"iframe")?elem.contentDocument||elem.contentWindow.document:jQuery.makeArray(elem.childNodes);}},function(name,fn){jQuery.fn[name]=function(selector){var ret=jQuery.map(this,fn);if(selector&&typeof selector=="string")
ret=jQuery.multiFilter(selector,ret);return this.pushStack(jQuery.unique(ret),name,selector);};});jQuery.each({appendTo:"append",prependTo:"prepend",insertBefore:"before",insertAfter:"after",replaceAll:"replaceWith"},function(name,original){jQuery.fn[name]=function(selector){var ret=[],insert=jQuery(selector);for(var i=0,l=insert.length;i<l;i++){var elems=(i>0?this.clone(true):this).get();jQuery.fn[original].apply(jQuery(insert[i]),elems);ret=ret.concat(elems);}
return this.pushStack(ret,name,selector);};});jQuery.each({removeAttr:function(name){jQuery.attr(this,name,"");if(this.nodeType==1)
this.removeAttribute(name);},addClass:function(classNames){jQuery.className.add(this,classNames);},removeClass:function(classNames){jQuery.className.remove(this,classNames);},toggleClass:function(classNames,state){if(typeof state!=="boolean")
state=!jQuery.className.has(this,classNames);jQuery.className[state?"add":"remove"](this,classNames);},remove:function(selector){if(!selector||jQuery.filter(selector,[this]).length){jQuery("*",this).add([this]).each(function(){jQuery.event.remove(this);jQuery.removeData(this);});if(this.parentNode)
this.parentNode.removeChild(this);}},empty:function(){jQuery(this).children().remove();while(this.firstChild)
this.removeChild(this.firstChild);}},function(name,fn){jQuery.fn[name]=function(){return this.each(fn,arguments);};});function num(elem,prop){return elem[0]&&parseInt(jQuery.curCSS(elem[0],prop,true),10)||0;}
var expando="jQuery"+now(),uuid=0,windowData={};jQuery.extend({cache:{},data:function(elem,name,data){elem=elem==window?windowData:elem;var id=elem[expando];if(!id)
id=elem[expando]=++uuid;if(name&&!jQuery.cache[id])
jQuery.cache[id]={};if(data!==undefined)
jQuery.cache[id][name]=data;return name?jQuery.cache[id][name]:id;},removeData:function(elem,name){elem=elem==window?windowData:elem;var id=elem[expando];if(name){if(jQuery.cache[id]){delete jQuery.cache[id][name];name="";for(name in jQuery.cache[id])
break;if(!name)
jQuery.removeData(elem);}}else{try{delete elem[expando];}catch(e){if(elem.removeAttribute)
elem.removeAttribute(expando);}
delete jQuery.cache[id];}},queue:function(elem,type,data){if(elem){type=(type||"fx")+"queue";var q=jQuery.data(elem,type);if(!q||jQuery.isArray(data))
q=jQuery.data(elem,type,jQuery.makeArray(data));else if(data)
q.push(data);}
return q;},dequeue:function(elem,type){var queue=jQuery.queue(elem,type),fn=queue.shift();if(!type||type==="fx")
fn=queue[0];if(fn!==undefined)
fn.call(elem);}});jQuery.fn.extend({data:function(key,value){var parts=key.split(".");parts[1]=parts[1]?"."+parts[1]:"";if(value===undefined){var data=this.triggerHandler("getData"+parts[1]+"!",[parts[0]]);if(data===undefined&&this.length)
data=jQuery.data(this[0],key);return data===undefined&&parts[1]?this.data(parts[0]):data;}else
return this.trigger("setData"+parts[1]+"!",[parts[0],value]).each(function(){jQuery.data(this,key,value);});},removeData:function(key){return this.each(function(){jQuery.removeData(this,key);});},queue:function(type,data){if(typeof type!=="string"){data=type;type="fx";}
if(data===undefined)
return jQuery.queue(this[0],type);return this.each(function(){var queue=jQuery.queue(this,type,data);if(type=="fx"&&queue.length==1)
queue[0].call(this);});},dequeue:function(type){return this.each(function(){jQuery.dequeue(this,type);});}});(function(){var chunker=/((?:\((?:\([^()]+\)|[^()]+)+\)|\[(?:\[[^[\]]*\]|['"][^'"]*['"]|[^[\]'"]+)+\]|\\.|[^ >+~,(\[\\]+)+|[>+~])(\s*,\s*)?/g,done=0,toString=Object.prototype.toString;var Sizzle=function(selector,context,results,seed){results=results||[];context=context||document;if(context.nodeType!==1&&context.nodeType!==9)
return[];if(!selector||typeof selector!=="string"){return results;}
var parts=[],m,set,checkSet,check,mode,extra,prune=true;chunker.lastIndex=0;while((m=chunker.exec(selector))!==null){parts.push(m[1]);if(m[2]){extra=RegExp.rightContext;break;}}
if(parts.length>1&&origPOS.exec(selector)){if(parts.length===2&&Expr.relative[parts[0]]){set=posProcess(parts[0]+parts[1],context);}else{set=Expr.relative[parts[0]]?[context]:Sizzle(parts.shift(),context);while(parts.length){selector=parts.shift();if(Expr.relative[selector])
selector+=parts.shift();set=posProcess(selector,set);}}}else{var ret=seed?{expr:parts.pop(),set:makeArray(seed)}:Sizzle.find(parts.pop(),parts.length===1&&context.parentNode?context.parentNode:context,isXML(context));set=Sizzle.filter(ret.expr,ret.set);if(parts.length>0){checkSet=makeArray(set);}else{prune=false;}
while(parts.length){var cur=parts.pop(),pop=cur;if(!Expr.relative[cur]){cur="";}else{pop=parts.pop();}
if(pop==null){pop=context;}
Expr.relative[cur](checkSet,pop,isXML(context));}}
if(!checkSet){checkSet=set;}
if(!checkSet){throw"Syntax error, unrecognized expression: "+(cur||selector);}
if(toString.call(checkSet)==="[object Array]"){if(!prune){results.push.apply(results,checkSet);}else if(context.nodeType===1){for(var i=0;checkSet[i]!=null;i++){if(checkSet[i]&&(checkSet[i]===true||checkSet[i].nodeType===1&&contains(context,checkSet[i]))){results.push(set[i]);}}}else{for(var i=0;checkSet[i]!=null;i++){if(checkSet[i]&&checkSet[i].nodeType===1){results.push(set[i]);}}}}else{makeArray(checkSet,results);}
if(extra){Sizzle(extra,context,results,seed);if(sortOrder){hasDuplicate=false;results.sort(sortOrder);if(hasDuplicate){for(var i=1;i<results.length;i++){if(results[i]===results[i-1]){results.splice(i--,1);}}}}}
return results;};Sizzle.matches=function(expr,set){return Sizzle(expr,null,null,set);};Sizzle.find=function(expr,context,isXML){var set,match;if(!expr){return[];}
for(var i=0,l=Expr.order.length;i<l;i++){var type=Expr.order[i],match;if((match=Expr.match[type].exec(expr))){var left=RegExp.leftContext;if(left.substr(left.length-1)!=="\\"){match[1]=(match[1]||"").replace(/\\/g,"");set=Expr.find[type](match,context,isXML);if(set!=null){expr=expr.replace(Expr.match[type],"");break;}}}}
if(!set){set=context.getElementsByTagName("*");}
return{set:set,expr:expr};};Sizzle.filter=function(expr,set,inplace,not){var old=expr,result=[],curLoop=set,match,anyFound,isXMLFilter=set&&set[0]&&isXML(set[0]);while(expr&&set.length){for(var type in Expr.filter){if((match=Expr.match[type].exec(expr))!=null){var filter=Expr.filter[type],found,item;anyFound=false;if(curLoop==result){result=[];}
if(Expr.preFilter[type]){match=Expr.preFilter[type](match,curLoop,inplace,result,not,isXMLFilter);if(!match){anyFound=found=true;}else if(match===true){continue;}}
if(match){for(var i=0;(item=curLoop[i])!=null;i++){if(item){found=filter(item,match,i,curLoop);var pass=not^!!found;if(inplace&&found!=null){if(pass){anyFound=true;}else{curLoop[i]=false;}}else if(pass){result.push(item);anyFound=true;}}}}
if(found!==undefined){if(!inplace){curLoop=result;}
expr=expr.replace(Expr.match[type],"");if(!anyFound){return[];}
break;}}}
if(expr==old){if(anyFound==null){throw"Syntax error, unrecognized expression: "+expr;}else{break;}}
old=expr;}
return curLoop;};var Expr=Sizzle.selectors={order:["ID","NAME","TAG"],match:{ID:/#((?:[\w\u00c0-\uFFFF_-]|\\.)+)/,CLASS:/\.((?:[\w\u00c0-\uFFFF_-]|\\.)+)/,NAME:/\[name=['"]*((?:[\w\u00c0-\uFFFF_-]|\\.)+)['"]*\]/,ATTR:/\[\s*((?:[\w\u00c0-\uFFFF_-]|\\.)+)\s*(?:(\S?=)\s*(['"]*)(.*?)\3|)\s*\]/,TAG:/^((?:[\w\u00c0-\uFFFF\*_-]|\\.)+)/,CHILD:/:(only|nth|last|first)-child(?:\((even|odd|[\dn+-]*)\))?/,POS:/:(nth|eq|gt|lt|first|last|even|odd)(?:\((\d*)\))?(?=[^-]|$)/,PSEUDO:/:((?:[\w\u00c0-\uFFFF_-]|\\.)+)(?:\((['"]*)((?:\([^\)]+\)|[^\2\(\)]*)+)\2\))?/},attrMap:{"class":"className","for":"htmlFor"},attrHandle:{href:function(elem){return elem.getAttribute("href");}},relative:{"+":function(checkSet,part,isXML){var isPartStr=typeof part==="string",isTag=isPartStr&&!/\W/.test(part),isPartStrNotTag=isPartStr&&!isTag;if(isTag&&!isXML){part=part.toUpperCase();}
for(var i=0,l=checkSet.length,elem;i<l;i++){if((elem=checkSet[i])){while((elem=elem.previousSibling)&&elem.nodeType!==1){}
checkSet[i]=isPartStrNotTag||elem&&elem.nodeName===part?elem||false:elem===part;}}
if(isPartStrNotTag){Sizzle.filter(part,checkSet,true);}},">":function(checkSet,part,isXML){var isPartStr=typeof part==="string";if(isPartStr&&!/\W/.test(part)){part=isXML?part:part.toUpperCase();for(var i=0,l=checkSet.length;i<l;i++){var elem=checkSet[i];if(elem){var parent=elem.parentNode;checkSet[i]=parent.nodeName===part?parent:false;}}}else{for(var i=0,l=checkSet.length;i<l;i++){var elem=checkSet[i];if(elem){checkSet[i]=isPartStr?elem.parentNode:elem.parentNode===part;}}
if(isPartStr){Sizzle.filter(part,checkSet,true);}}},"":function(checkSet,part,isXML){var doneName=done++,checkFn=dirCheck;if(!part.match(/\W/)){var nodeCheck=part=isXML?part:part.toUpperCase();checkFn=dirNodeCheck;}
checkFn("parentNode",part,doneName,checkSet,nodeCheck,isXML);},"~":function(checkSet,part,isXML){var doneName=done++,checkFn=dirCheck;if(typeof part==="string"&&!part.match(/\W/)){var nodeCheck=part=isXML?part:part.toUpperCase();checkFn=dirNodeCheck;}
checkFn("previousSibling",part,doneName,checkSet,nodeCheck,isXML);}},find:{ID:function(match,context,isXML){if(typeof context.getElementById!=="undefined"&&!isXML){var m=context.getElementById(match[1]);return m?[m]:[];}},NAME:function(match,context,isXML){if(typeof context.getElementsByName!=="undefined"){var ret=[],results=context.getElementsByName(match[1]);for(var i=0,l=results.length;i<l;i++){if(results[i].getAttribute("name")===match[1]){ret.push(results[i]);}}
return ret.length===0?null:ret;}},TAG:function(match,context){return context.getElementsByTagName(match[1]);}},preFilter:{CLASS:function(match,curLoop,inplace,result,not,isXML){match=" "+match[1].replace(/\\/g,"")+" ";if(isXML){return match;}
for(var i=0,elem;(elem=curLoop[i])!=null;i++){if(elem){if(not^(elem.className&&(" "+elem.className+" ").indexOf(match)>=0)){if(!inplace)
result.push(elem);}else if(inplace){curLoop[i]=false;}}}
return false;},ID:function(match){return match[1].replace(/\\/g,"");},TAG:function(match,curLoop){for(var i=0;curLoop[i]===false;i++){}
return curLoop[i]&&isXML(curLoop[i])?match[1]:match[1].toUpperCase();},CHILD:function(match){if(match[1]=="nth"){var test=/(-?)(\d*)n((?:\+|-)?\d*)/.exec(match[2]=="even"&&"2n"||match[2]=="odd"&&"2n+1"||!/\D/.test(match[2])&&"0n+"+match[2]||match[2]);match[2]=(test[1]+(test[2]||1))-0;match[3]=test[3]-0;}
match[0]=done++;return match;},ATTR:function(match,curLoop,inplace,result,not,isXML){var name=match[1].replace(/\\/g,"");if(!isXML&&Expr.attrMap[name]){match[1]=Expr.attrMap[name];}
if(match[2]==="~="){match[4]=" "+match[4]+" ";}
return match;},PSEUDO:function(match,curLoop,inplace,result,not){if(match[1]==="not"){if(match[3].match(chunker).length>1||/^\w/.test(match[3])){match[3]=Sizzle(match[3],null,null,curLoop);}else{var ret=Sizzle.filter(match[3],curLoop,inplace,true^not);if(!inplace){result.push.apply(result,ret);}
return false;}}else if(Expr.match.POS.test(match[0])||Expr.match.CHILD.test(match[0])){return true;}
return match;},POS:function(match){match.unshift(true);return match;}},filters:{enabled:function(elem){return elem.disabled===false&&elem.type!=="hidden";},disabled:function(elem){return elem.disabled===true;},checked:function(elem){return elem.checked===true;},selected:function(elem){elem.parentNode.selectedIndex;return elem.selected===true;},parent:function(elem){return!!elem.firstChild;},empty:function(elem){return!elem.firstChild;},has:function(elem,i,match){return!!Sizzle(match[3],elem).length;},header:function(elem){return/h\d/i.test(elem.nodeName);},text:function(elem){return"text"===elem.type;},radio:function(elem){return"radio"===elem.type;},checkbox:function(elem){return"checkbox"===elem.type;},file:function(elem){return"file"===elem.type;},password:function(elem){return"password"===elem.type;},submit:function(elem){return"submit"===elem.type;},image:function(elem){return"image"===elem.type;},reset:function(elem){return"reset"===elem.type;},button:function(elem){return"button"===elem.type||elem.nodeName.toUpperCase()==="BUTTON";},input:function(elem){return/input|select|textarea|button/i.test(elem.nodeName);}},setFilters:{first:function(elem,i){return i===0;},last:function(elem,i,match,array){return i===array.length-1;},even:function(elem,i){return i%2===0;},odd:function(elem,i){return i%2===1;},lt:function(elem,i,match){return i<match[3]-0;},gt:function(elem,i,match){return i>match[3]-0;},nth:function(elem,i,match){return match[3]-0==i;},eq:function(elem,i,match){return match[3]-0==i;}},filter:{PSEUDO:function(elem,match,i,array){var name=match[1],filter=Expr.filters[name];if(filter){return filter(elem,i,match,array);}else if(name==="contains"){return(elem.textContent||elem.innerText||"").indexOf(match[3])>=0;}else if(name==="not"){var not=match[3];for(var i=0,l=not.length;i<l;i++){if(not[i]===elem){return false;}}
return true;}},CHILD:function(elem,match){var type=match[1],node=elem;switch(type){case'only':case'first':while(node=node.previousSibling){if(node.nodeType===1)return false;}
if(type=='first')return true;node=elem;case'last':while(node=node.nextSibling){if(node.nodeType===1)return false;}
return true;case'nth':var first=match[2],last=match[3];if(first==1&&last==0){return true;}
var doneName=match[0],parent=elem.parentNode;if(parent&&(parent.sizcache!==doneName||!elem.nodeIndex)){var count=0;for(node=parent.firstChild;node;node=node.nextSibling){if(node.nodeType===1){node.nodeIndex=++count;}}
parent.sizcache=doneName;}
var diff=elem.nodeIndex-last;if(first==0){return diff==0;}else{return(diff%first==0&&diff/first>=0);}}},ID:function(elem,match){return elem.nodeType===1&&elem.getAttribute("id")===match;},TAG:function(elem,match){return(match==="*"&&elem.nodeType===1)||elem.nodeName===match;},CLASS:function(elem,match){return(" "+(elem.className||elem.getAttribute("class"))+" ").indexOf(match)>-1;},ATTR:function(elem,match){var name=match[1],result=Expr.attrHandle[name]?Expr.attrHandle[name](elem):elem[name]!=null?elem[name]:elem.getAttribute(name),value=result+"",type=match[2],check=match[4];return result==null?type==="!=":type==="="?value===check:type==="*="?value.indexOf(check)>=0:type==="~="?(" "+value+" ").indexOf(check)>=0:!check?value&&result!==false:type==="!="?value!=check:type==="^="?value.indexOf(check)===0:type==="$="?value.substr(value.length-check.length)===check:type==="|="?value===check||value.substr(0,check.length+1)===check+"-":false;},POS:function(elem,match,i,array){var name=match[2],filter=Expr.setFilters[name];if(filter){return filter(elem,i,match,array);}}}};var origPOS=Expr.match.POS;for(var type in Expr.match){Expr.match[type]=RegExp(Expr.match[type].source+/(?![^\[]*\])(?![^\(]*\))/.source);}
var makeArray=function(array,results){array=Array.prototype.slice.call(array);if(results){results.push.apply(results,array);return results;}
return array;};try{Array.prototype.slice.call(document.documentElement.childNodes);}catch(e){makeArray=function(array,results){var ret=results||[];if(toString.call(array)==="[object Array]"){Array.prototype.push.apply(ret,array);}else{if(typeof array.length==="number"){for(var i=0,l=array.length;i<l;i++){ret.push(array[i]);}}else{for(var i=0;array[i];i++){ret.push(array[i]);}}}
return ret;};}
var sortOrder;if(document.documentElement.compareDocumentPosition){sortOrder=function(a,b){var ret=a.compareDocumentPosition(b)&4?-1:a===b?0:1;if(ret===0){hasDuplicate=true;}
return ret;};}else if("sourceIndex"in document.documentElement){sortOrder=function(a,b){var ret=a.sourceIndex-b.sourceIndex;if(ret===0){hasDuplicate=true;}
return ret;};}else if(document.createRange){sortOrder=function(a,b){var aRange=a.ownerDocument.createRange(),bRange=b.ownerDocument.createRange();aRange.selectNode(a);aRange.collapse(true);bRange.selectNode(b);bRange.collapse(true);var ret=aRange.compareBoundaryPoints(Range.START_TO_END,bRange);if(ret===0){hasDuplicate=true;}
return ret;};}
(function(){var form=document.createElement("form"),id="script"+(new Date).getTime();form.innerHTML="<input name='"+id+"'/>";var root=document.documentElement;root.insertBefore(form,root.firstChild);if(!!document.getElementById(id)){Expr.find.ID=function(match,context,isXML){if(typeof context.getElementById!=="undefined"&&!isXML){var m=context.getElementById(match[1]);return m?m.id===match[1]||typeof m.getAttributeNode!=="undefined"&&m.getAttributeNode("id").nodeValue===match[1]?[m]:undefined:[];}};Expr.filter.ID=function(elem,match){var node=typeof elem.getAttributeNode!=="undefined"&&elem.getAttributeNode("id");return elem.nodeType===1&&node&&node.nodeValue===match;};}
root.removeChild(form);})();(function(){var div=document.createElement("div");div.appendChild(document.createComment(""));if(div.getElementsByTagName("*").length>0){Expr.find.TAG=function(match,context){var results=context.getElementsByTagName(match[1]);if(match[1]==="*"){var tmp=[];for(var i=0;results[i];i++){if(results[i].nodeType===1){tmp.push(results[i]);}}
results=tmp;}
return results;};}
div.innerHTML="<a href='#'></a>";if(div.firstChild&&typeof div.firstChild.getAttribute!=="undefined"&&div.firstChild.getAttribute("href")!=="#"){Expr.attrHandle.href=function(elem){return elem.getAttribute("href",2);};}})();if(document.querySelectorAll)(function(){var oldSizzle=Sizzle,div=document.createElement("div");div.innerHTML="<p class='TEST'></p>";if(div.querySelectorAll&&div.querySelectorAll(".TEST").length===0){return;}
Sizzle=function(query,context,extra,seed){context=context||document;if(!seed&&context.nodeType===9&&!isXML(context)){try{return makeArray(context.querySelectorAll(query),extra);}catch(e){}}
return oldSizzle(query,context,extra,seed);};Sizzle.find=oldSizzle.find;Sizzle.filter=oldSizzle.filter;Sizzle.selectors=oldSizzle.selectors;Sizzle.matches=oldSizzle.matches;})();if(document.getElementsByClassName&&document.documentElement.getElementsByClassName)(function(){var div=document.createElement("div");div.innerHTML="<div class='test e'></div><div class='test'></div>";if(div.getElementsByClassName("e").length===0)
return;div.lastChild.className="e";if(div.getElementsByClassName("e").length===1)
return;Expr.order.splice(1,0,"CLASS");Expr.find.CLASS=function(match,context,isXML){if(typeof context.getElementsByClassName!=="undefined"&&!isXML){return context.getElementsByClassName(match[1]);}};})();function dirNodeCheck(dir,cur,doneName,checkSet,nodeCheck,isXML){var sibDir=dir=="previousSibling"&&!isXML;for(var i=0,l=checkSet.length;i<l;i++){var elem=checkSet[i];if(elem){if(sibDir&&elem.nodeType===1){elem.sizcache=doneName;elem.sizset=i;}
elem=elem[dir];var match=false;while(elem){if(elem.sizcache===doneName){match=checkSet[elem.sizset];break;}
if(elem.nodeType===1&&!isXML){elem.sizcache=doneName;elem.sizset=i;}
if(elem.nodeName===cur){match=elem;break;}
elem=elem[dir];}
checkSet[i]=match;}}}
function dirCheck(dir,cur,doneName,checkSet,nodeCheck,isXML){var sibDir=dir=="previousSibling"&&!isXML;for(var i=0,l=checkSet.length;i<l;i++){var elem=checkSet[i];if(elem){if(sibDir&&elem.nodeType===1){elem.sizcache=doneName;elem.sizset=i;}
elem=elem[dir];var match=false;while(elem){if(elem.sizcache===doneName){match=checkSet[elem.sizset];break;}
if(elem.nodeType===1){if(!isXML){elem.sizcache=doneName;elem.sizset=i;}
if(typeof cur!=="string"){if(elem===cur){match=true;break;}}else if(Sizzle.filter(cur,[elem]).length>0){match=elem;break;}}
elem=elem[dir];}
checkSet[i]=match;}}}
var contains=document.compareDocumentPosition?function(a,b){return a.compareDocumentPosition(b)&16;}:function(a,b){return a!==b&&(a.contains?a.contains(b):true);};var isXML=function(elem){return elem.nodeType===9&&elem.documentElement.nodeName!=="HTML"||!!elem.ownerDocument&&isXML(elem.ownerDocument);};var posProcess=function(selector,context){var tmpSet=[],later="",match,root=context.nodeType?[context]:context;while((match=Expr.match.PSEUDO.exec(selector))){later+=match[0];selector=selector.replace(Expr.match.PSEUDO,"");}
selector=Expr.relative[selector]?selector+"*":selector;for(var i=0,l=root.length;i<l;i++){Sizzle(selector,root[i],tmpSet);}
return Sizzle.filter(later,tmpSet);};jQuery.find=Sizzle;jQuery.filter=Sizzle.filter;jQuery.expr=Sizzle.selectors;jQuery.expr[":"]=jQuery.expr.filters;Sizzle.selectors.filters.hidden=function(elem){return elem.offsetWidth===0||elem.offsetHeight===0;};Sizzle.selectors.filters.visible=function(elem){return elem.offsetWidth>0||elem.offsetHeight>0;};Sizzle.selectors.filters.animated=function(elem){return jQuery.grep(jQuery.timers,function(fn){return elem===fn.elem;}).length;};jQuery.multiFilter=function(expr,elems,not){if(not){expr=":not("+expr+")";}
return Sizzle.matches(expr,elems);};jQuery.dir=function(elem,dir){var matched=[],cur=elem[dir];while(cur&&cur!=document){if(cur.nodeType==1)
matched.push(cur);cur=cur[dir];}
return matched;};jQuery.nth=function(cur,result,dir,elem){result=result||1;var num=0;for(;cur;cur=cur[dir])
if(cur.nodeType==1&&++num==result)
break;return cur;};jQuery.sibling=function(n,elem){var r=[];for(;n;n=n.nextSibling){if(n.nodeType==1&&n!=elem)
r.push(n);}
return r;};return;window.Sizzle=Sizzle;})();jQuery.event={add:function(elem,types,handler,data){if(elem.nodeType==3||elem.nodeType==8)
return;if(elem.setInterval&&elem!=window)
elem=window;if(!handler.guid)
handler.guid=this.guid++;if(data!==undefined){var fn=handler;handler=this.proxy(fn);handler.data=data;}
var events=jQuery.data(elem,"events")||jQuery.data(elem,"events",{}),handle=jQuery.data(elem,"handle")||jQuery.data(elem,"handle",function(){return typeof jQuery!=="undefined"&&!jQuery.event.triggered?jQuery.event.handle.apply(arguments.callee.elem,arguments):undefined;});handle.elem=elem;jQuery.each(types.split(/\s+/),function(index,type){var namespaces=type.split(".");type=namespaces.shift();handler.type=namespaces.slice().sort().join(".");var handlers=events[type];if(jQuery.event.specialAll[type])
jQuery.event.specialAll[type].setup.call(elem,data,namespaces);if(!handlers){handlers=events[type]={};if(!jQuery.event.special[type]||jQuery.event.special[type].setup.call(elem,data,namespaces)===false){if(elem.addEventListener)
elem.addEventListener(type,handle,false);else if(elem.attachEvent)
elem.attachEvent("on"+type,handle);}}
handlers[handler.guid]=handler;jQuery.event.global[type]=true;});elem=null;},guid:1,global:{},remove:function(elem,types,handler){if(elem.nodeType==3||elem.nodeType==8)
return;var events=jQuery.data(elem,"events"),ret,index;if(events){if(types===undefined||(typeof types==="string"&&types.charAt(0)=="."))
for(var type in events)
this.remove(elem,type+(types||""));else{if(types.type){handler=types.handler;types=types.type;}
jQuery.each(types.split(/\s+/),function(index,type){var namespaces=type.split(".");type=namespaces.shift();var namespace=RegExp("(^|\\.)"+namespaces.slice().sort().join(".*\\.")+"(\\.|$)");if(events[type]){if(handler)
delete events[type][handler.guid];else
for(var handle in events[type])
if(namespace.test(events[type][handle].type))
delete events[type][handle];if(jQuery.event.specialAll[type])
jQuery.event.specialAll[type].teardown.call(elem,namespaces);for(ret in events[type])break;if(!ret){if(!jQuery.event.special[type]||jQuery.event.special[type].teardown.call(elem,namespaces)===false){if(elem.removeEventListener)
elem.removeEventListener(type,jQuery.data(elem,"handle"),false);else if(elem.detachEvent)
elem.detachEvent("on"+type,jQuery.data(elem,"handle"));}
ret=null;delete events[type];}}});}
for(ret in events)break;if(!ret){var handle=jQuery.data(elem,"handle");if(handle)handle.elem=null;jQuery.removeData(elem,"events");jQuery.removeData(elem,"handle");}}},trigger:function(event,data,elem,bubbling){var type=event.type||event;if(!bubbling){event=typeof event==="object"?event[expando]?event:jQuery.extend(jQuery.Event(type),event):jQuery.Event(type);if(type.indexOf("!")>=0){event.type=type=type.slice(0,-1);event.exclusive=true;}
if(!elem){event.stopPropagation();if(this.global[type])
jQuery.each(jQuery.cache,function(){if(this.events&&this.events[type])
jQuery.event.trigger(event,data,this.handle.elem);});}
if(!elem||elem.nodeType==3||elem.nodeType==8)
return undefined;event.result=undefined;event.target=elem;data=jQuery.makeArray(data);data.unshift(event);}
event.currentTarget=elem;var handle=jQuery.data(elem,"handle");if(handle)
handle.apply(elem,data);if((!elem[type]||(jQuery.nodeName(elem,'a')&&type=="click"))&&elem["on"+type]&&elem["on"+type].apply(elem,data)===false)
event.result=false;if(!bubbling&&elem[type]&&!event.isDefaultPrevented()&&!(jQuery.nodeName(elem,'a')&&type=="click")){this.triggered=true;try{elem[type]();}catch(e){}}
this.triggered=false;if(!event.isPropagationStopped()){var parent=elem.parentNode||elem.ownerDocument;if(parent)
jQuery.event.trigger(event,data,parent,true);}},handle:function(event){var all,handlers;event=arguments[0]=jQuery.event.fix(event||window.event);event.currentTarget=this;var namespaces=event.type.split(".");event.type=namespaces.shift();all=!namespaces.length&&!event.exclusive;var namespace=RegExp("(^|\\.)"+namespaces.slice().sort().join(".*\\.")+"(\\.|$)");handlers=(jQuery.data(this,"events")||{})[event.type];for(var j in handlers){var handler=handlers[j];if(all||namespace.test(handler.type)){event.handler=handler;event.data=handler.data;var ret=handler.apply(this,arguments);if(ret!==undefined){event.result=ret;if(ret===false){event.preventDefault();event.stopPropagation();}}
if(event.isImmediatePropagationStopped())
break;}}},props:"altKey attrChange attrName bubbles button cancelable charCode clientX clientY ctrlKey currentTarget data detail eventPhase fromElement handler keyCode metaKey newValue originalTarget pageX pageY prevValue relatedNode relatedTarget screenX screenY shiftKey srcElement target toElement view wheelDelta which".split(" "),fix:function(event){if(event[expando])
return event;var originalEvent=event;event=jQuery.Event(originalEvent);for(var i=this.props.length,prop;i;){prop=this.props[--i];event[prop]=originalEvent[prop];}
if(!event.target)
event.target=event.srcElement||document;if(event.target.nodeType==3)
event.target=event.target.parentNode;if(!event.relatedTarget&&event.fromElement)
event.relatedTarget=event.fromElement==event.target?event.toElement:event.fromElement;if(event.pageX==null&&event.clientX!=null){var doc=document.documentElement,body=document.body;event.pageX=event.clientX+(doc&&doc.scrollLeft||body&&body.scrollLeft||0)-(doc.clientLeft||0);event.pageY=event.clientY+(doc&&doc.scrollTop||body&&body.scrollTop||0)-(doc.clientTop||0);}
if(!event.which&&((event.charCode||event.charCode===0)?event.charCode:event.keyCode))
event.which=event.charCode||event.keyCode;if(!event.metaKey&&event.ctrlKey)
event.metaKey=event.ctrlKey;if(!event.which&&event.button)
event.which=(event.button&1?1:(event.button&2?3:(event.button&4?2:0)));return event;},proxy:function(fn,proxy){proxy=proxy||function(){return fn.apply(this,arguments);};proxy.guid=fn.guid=fn.guid||proxy.guid||this.guid++;return proxy;},special:{ready:{setup:bindReady,teardown:function(){}}},specialAll:{live:{setup:function(selector,namespaces){jQuery.event.add(this,namespaces[0],liveHandler);},teardown:function(namespaces){if(namespaces.length){var remove=0,name=RegExp("(^|\\.)"+namespaces[0]+"(\\.|$)");jQuery.each((jQuery.data(this,"events").live||{}),function(){if(name.test(this.type))
remove++;});if(remove<1)
jQuery.event.remove(this,namespaces[0],liveHandler);}}}}};jQuery.Event=function(src){if(!this.preventDefault)
return new jQuery.Event(src);if(src&&src.type){this.originalEvent=src;this.type=src.type;}else
this.type=src;this.timeStamp=now();this[expando]=true;};function returnFalse(){return false;}
function returnTrue(){return true;}
jQuery.Event.prototype={preventDefault:function(){this.isDefaultPrevented=returnTrue;var e=this.originalEvent;if(!e)
return;if(e.preventDefault)
e.preventDefault();e.returnValue=false;},stopPropagation:function(){this.isPropagationStopped=returnTrue;var e=this.originalEvent;if(!e)
return;if(e.stopPropagation)
e.stopPropagation();e.cancelBubble=true;},stopImmediatePropagation:function(){this.isImmediatePropagationStopped=returnTrue;this.stopPropagation();},isDefaultPrevented:returnFalse,isPropagationStopped:returnFalse,isImmediatePropagationStopped:returnFalse};var withinElement=function(event){var parent=event.relatedTarget;while(parent&&parent!=this)
try{parent=parent.parentNode;}
catch(e){parent=this;}
if(parent!=this){event.type=event.data;jQuery.event.handle.apply(this,arguments);}};jQuery.each({mouseover:'mouseenter',mouseout:'mouseleave'},function(orig,fix){jQuery.event.special[fix]={setup:function(){jQuery.event.add(this,orig,withinElement,fix);},teardown:function(){jQuery.event.remove(this,orig,withinElement);}};});jQuery.fn.extend({bind:function(type,data,fn){return type=="unload"?this.one(type,data,fn):this.each(function(){jQuery.event.add(this,type,fn||data,fn&&data);});},one:function(type,data,fn){var one=jQuery.event.proxy(fn||data,function(event){jQuery(this).unbind(event,one);return(fn||data).apply(this,arguments);});return this.each(function(){jQuery.event.add(this,type,one,fn&&data);});},unbind:function(type,fn){return this.each(function(){jQuery.event.remove(this,type,fn);});},trigger:function(type,data){return this.each(function(){jQuery.event.trigger(type,data,this);});},triggerHandler:function(type,data){if(this[0]){var event=jQuery.Event(type);event.preventDefault();event.stopPropagation();jQuery.event.trigger(event,data,this[0]);return event.result;}},toggle:function(fn){var args=arguments,i=1;while(i<args.length)
jQuery.event.proxy(fn,args[i++]);return this.click(jQuery.event.proxy(fn,function(event){this.lastToggle=(this.lastToggle||0)%i;event.preventDefault();return args[this.lastToggle++].apply(this,arguments)||false;}));},hover:function(fnOver,fnOut){return this.mouseenter(fnOver).mouseleave(fnOut);},ready:function(fn){bindReady();if(jQuery.isReady)
fn.call(document,jQuery);else
jQuery.readyList.push(fn);return this;},live:function(type,fn){var proxy=jQuery.event.proxy(fn);proxy.guid+=this.selector+type;jQuery(document).bind(liveConvert(type,this.selector),this.selector,proxy);return this;},die:function(type,fn){jQuery(document).unbind(liveConvert(type,this.selector),fn?{guid:fn.guid+this.selector+type}:null);return this;}});function liveHandler(event){var check=RegExp("(^|\\.)"+event.type+"(\\.|$)"),stop=true,elems=[];jQuery.each(jQuery.data(this,"events").live||[],function(i,fn){if(check.test(fn.type)){var elem=jQuery(event.target).closest(fn.data)[0];if(elem)
elems.push({elem:elem,fn:fn});}});elems.sort(function(a,b){return jQuery.data(a.elem,"closest")-jQuery.data(b.elem,"closest");});jQuery.each(elems,function(){if(this.fn.call(this.elem,event,this.fn.data)===false)
return(stop=false);});return stop;}
function liveConvert(type,selector){return["live",type,selector.replace(/\./g,"`").replace(/ /g,"|")].join(".");}
jQuery.extend({isReady:false,readyList:[],ready:function(){if(!jQuery.isReady){jQuery.isReady=true;if(jQuery.readyList){jQuery.each(jQuery.readyList,function(){this.call(document,jQuery);});jQuery.readyList=null;}
jQuery(document).triggerHandler("ready");}}});var readyBound=false;function bindReady(){if(readyBound)return;readyBound=true;if(document.addEventListener){document.addEventListener("DOMContentLoaded",function(){document.removeEventListener("DOMContentLoaded",arguments.callee,false);jQuery.ready();},false);}else if(document.attachEvent){document.attachEvent("onreadystatechange",function(){if(document.readyState==="complete"){document.detachEvent("onreadystatechange",arguments.callee);jQuery.ready();}});if(document.documentElement.doScroll&&window==window.top)(function(){if(jQuery.isReady)return;try{document.documentElement.doScroll("left");}catch(error){setTimeout(arguments.callee,0);return;}
jQuery.ready();})();}
jQuery.event.add(window,"load",jQuery.ready);}
jQuery.each(("blur,focus,load,resize,scroll,unload,click,dblclick,"+"mousedown,mouseup,mousemove,mouseover,mouseout,mouseenter,mouseleave,"+"change,select,submit,keydown,keypress,keyup,error").split(","),function(i,name){jQuery.fn[name]=function(fn){return fn?this.bind(name,fn):this.trigger(name);};});jQuery(window).bind('unload',function(){for(var id in jQuery.cache)
if(id!=1&&jQuery.cache[id].handle)
jQuery.event.remove(jQuery.cache[id].handle.elem);});(function(){jQuery.support={};var root=document.documentElement,script=document.createElement("script"),div=document.createElement("div"),id="script"+(new Date).getTime();div.style.display="none";div.innerHTML='   <link/><table></table><a href="/a" style="color:red;float:left;opacity:.5;">a</a><select><option>text</option></select><object><param/></object>';var all=div.getElementsByTagName("*"),a=div.getElementsByTagName("a")[0];if(!all||!all.length||!a){return;}
jQuery.support={leadingWhitespace:div.firstChild.nodeType==3,tbody:!div.getElementsByTagName("tbody").length,objectAll:!!div.getElementsByTagName("object")[0].getElementsByTagName("*").length,htmlSerialize:!!div.getElementsByTagName("link").length,style:/red/.test(a.getAttribute("style")),hrefNormalized:a.getAttribute("href")==="/a",opacity:a.style.opacity==="0.5",cssFloat:!!a.style.cssFloat,scriptEval:false,noCloneEvent:true,boxModel:null};script.type="text/javascript";try{script.appendChild(document.createTextNode("window."+id+"=1;"));}catch(e){}
root.insertBefore(script,root.firstChild);if(window[id]){jQuery.support.scriptEval=true;delete window[id];}
root.removeChild(script);if(div.attachEvent&&div.fireEvent){div.attachEvent("onclick",function(){jQuery.support.noCloneEvent=false;div.detachEvent("onclick",arguments.callee);});div.cloneNode(true).fireEvent("onclick");}
jQuery(function(){var div=document.createElement("div");div.style.width=div.style.paddingLeft="1px";document.body.appendChild(div);jQuery.boxModel=jQuery.support.boxModel=div.offsetWidth===2;document.body.removeChild(div).style.display='none';});})();var styleFloat=jQuery.support.cssFloat?"cssFloat":"styleFloat";jQuery.props={"for":"htmlFor","class":"className","float":styleFloat,cssFloat:styleFloat,styleFloat:styleFloat,readonly:"readOnly",maxlength:"maxLength",cellspacing:"cellSpacing",rowspan:"rowSpan",tabindex:"tabIndex"};jQuery.fn.extend({_load:jQuery.fn.load,load:function(url,params,callback){if(typeof url!=="string")
return this._load(url);var off=url.indexOf(" ");if(off>=0){var selector=url.slice(off,url.length);url=url.slice(0,off);}
var type="GET";if(params)
if(jQuery.isFunction(params)){callback=params;params=null;}else if(typeof params==="object"){params=jQuery.param(params);type="POST";}
var self=this;jQuery.ajax({url:url,type:type,dataType:"html",data:params,complete:function(res,status){if(status=="success"||status=="notmodified")
self.html(selector?jQuery("<div/>").append(res.responseText.replace(/<script(.|\s)*?\/script>/g,"")).find(selector):res.responseText);if(callback)
self.each(callback,[res.responseText,status,res]);}});return this;},serialize:function(){return jQuery.param(this.serializeArray());},serializeArray:function(){return this.map(function(){return this.elements?jQuery.makeArray(this.elements):this;}).filter(function(){return this.name&&!this.disabled&&(this.checked||/select|textarea/i.test(this.nodeName)||/text|hidden|password|search/i.test(this.type));}).map(function(i,elem){var val=jQuery(this).val();return val==null?null:jQuery.isArray(val)?jQuery.map(val,function(val,i){return{name:elem.name,value:val};}):{name:elem.name,value:val};}).get();}});jQuery.each("ajaxStart,ajaxStop,ajaxComplete,ajaxError,ajaxSuccess,ajaxSend".split(","),function(i,o){jQuery.fn[o]=function(f){return this.bind(o,f);};});var jsc=now();jQuery.extend({get:function(url,data,callback,type){if(jQuery.isFunction(data)){callback=data;data=null;}
return jQuery.ajax({type:"GET",url:url,data:data,success:callback,dataType:type});},getScript:function(url,callback){return jQuery.get(url,null,callback,"script");},getJSON:function(url,data,callback){return jQuery.get(url,data,callback,"json");},post:function(url,data,callback,type){if(jQuery.isFunction(data)){callback=data;data={};}
return jQuery.ajax({type:"POST",url:url,data:data,success:callback,dataType:type});},ajaxSetup:function(settings){jQuery.extend(jQuery.ajaxSettings,settings);},ajaxSettings:{url:location.href,global:true,type:"GET",contentType:"application/x-www-form-urlencoded",processData:true,async:true,xhr:function(){return window.ActiveXObject?new ActiveXObject("Microsoft.XMLHTTP"):new XMLHttpRequest();},accepts:{xml:"application/xml, text/xml",html:"text/html",script:"text/javascript, application/javascript",json:"application/json, text/javascript",text:"text/plain",_default:"*/*"}},lastModified:{},ajax:function(s){s=jQuery.extend(true,s,jQuery.extend(true,{},jQuery.ajaxSettings,s));var jsonp,jsre=/=\?(&|$)/g,status,data,type=s.type.toUpperCase();if(s.data&&s.processData&&typeof s.data!=="string")
s.data=jQuery.param(s.data);if(s.dataType=="jsonp"){if(type=="GET"){if(!s.url.match(jsre))
s.url+=(s.url.match(/\?/)?"&":"?")+(s.jsonp||"callback")+"=?";}else if(!s.data||!s.data.match(jsre))
s.data=(s.data?s.data+"&":"")+(s.jsonp||"callback")+"=?";s.dataType="json";}
if(s.dataType=="json"&&(s.data&&s.data.match(jsre)||s.url.match(jsre))){jsonp="jsonp"+jsc++;if(s.data)
s.data=(s.data+"").replace(jsre,"="+jsonp+"$1");s.url=s.url.replace(jsre,"="+jsonp+"$1");s.dataType="script";window[jsonp]=function(tmp){data=tmp;success();complete();window[jsonp]=undefined;try{delete window[jsonp];}catch(e){}
if(head)
head.removeChild(script);};}
if(s.dataType=="script"&&s.cache==null)
s.cache=false;if(s.cache===false&&type=="GET"){var ts=now();var ret=s.url.replace(/(\?|&)_=.*?(&|$)/,"$1_="+ts+"$2");s.url=ret+((ret==s.url)?(s.url.match(/\?/)?"&":"?")+"_="+ts:"");}
if(s.data&&type=="GET"){s.url+=(s.url.match(/\?/)?"&":"?")+s.data;s.data=null;}
if(s.global&&!jQuery.active++)
jQuery.event.trigger("ajaxStart");var parts=/^(\w+:)?\/\/([^\/?#]+)/.exec(s.url);if(s.dataType=="script"&&type=="GET"&&parts&&(parts[1]&&parts[1]!=location.protocol||parts[2]!=location.host)){var head=document.getElementsByTagName("head")[0];var script=document.createElement("script");script.src=s.url;if(s.scriptCharset)
script.charset=s.scriptCharset;if(!jsonp){var done=false;script.onload=script.onreadystatechange=function(){if(!done&&(!this.readyState||this.readyState=="loaded"||this.readyState=="complete")){done=true;success();complete();script.onload=script.onreadystatechange=null;head.removeChild(script);}};}
head.appendChild(script);return undefined;}
var requestDone=false;var xhr=s.xhr();if(s.username)
xhr.open(type,s.url,s.async,s.username,s.password);else
xhr.open(type,s.url,s.async);try{if(s.data)
xhr.setRequestHeader("Content-Type",s.contentType);if(s.ifModified)
xhr.setRequestHeader("If-Modified-Since",jQuery.lastModified[s.url]||"Thu, 01 Jan 1970 00:00:00 GMT");xhr.setRequestHeader("X-Requested-With","XMLHttpRequest");xhr.setRequestHeader("Accept",s.dataType&&s.accepts[s.dataType]?s.accepts[s.dataType]+", */*":s.accepts._default);}catch(e){}
if(s.beforeSend&&s.beforeSend(xhr,s)===false){if(s.global&&!--jQuery.active)
jQuery.event.trigger("ajaxStop");xhr.abort();return false;}
if(s.global)
jQuery.event.trigger("ajaxSend",[xhr,s]);var onreadystatechange=function(isTimeout){if(xhr.readyState==0){if(ival){clearInterval(ival);ival=null;if(s.global&&!--jQuery.active)
jQuery.event.trigger("ajaxStop");}}else if(!requestDone&&xhr&&(xhr.readyState==4||isTimeout=="timeout")){requestDone=true;if(ival){clearInterval(ival);ival=null;}
status=isTimeout=="timeout"?"timeout":!jQuery.httpSuccess(xhr)?"error":s.ifModified&&jQuery.httpNotModified(xhr,s.url)?"notmodified":"success";if(status=="success"){try{data=jQuery.httpData(xhr,s.dataType,s);}catch(e){status="parsererror";}}
if(status=="success"){var modRes;try{modRes=xhr.getResponseHeader("Last-Modified");}catch(e){}
if(s.ifModified&&modRes)
jQuery.lastModified[s.url]=modRes;if(!jsonp)
success();}else
jQuery.handleError(s,xhr,status);complete();if(isTimeout)
xhr.abort();if(s.async)
xhr=null;}};if(s.async){var ival=setInterval(onreadystatechange,13);if(s.timeout>0)
setTimeout(function(){if(xhr&&!requestDone)
onreadystatechange("timeout");},s.timeout);}
try{xhr.send(s.data);}catch(e){jQuery.handleError(s,xhr,null,e);}
if(!s.async)
onreadystatechange();function success(){if(s.success)
s.success(data,status);if(s.global)
jQuery.event.trigger("ajaxSuccess",[xhr,s]);}
function complete(){if(s.complete)
s.complete(xhr,status);if(s.global)
jQuery.event.trigger("ajaxComplete",[xhr,s]);if(s.global&&!--jQuery.active)
jQuery.event.trigger("ajaxStop");}
return xhr;},handleError:function(s,xhr,status,e){if(s.error)s.error(xhr,status,e);if(s.global)
jQuery.event.trigger("ajaxError",[xhr,s,e]);},active:0,httpSuccess:function(xhr){try{return!xhr.status&&location.protocol=="file:"||(xhr.status>=200&&xhr.status<300)||xhr.status==304||xhr.status==1223;}catch(e){}
return false;},httpNotModified:function(xhr,url){try{var xhrRes=xhr.getResponseHeader("Last-Modified");return xhr.status==304||xhrRes==jQuery.lastModified[url];}catch(e){}
return false;},httpData:function(xhr,type,s){var ct=xhr.getResponseHeader("content-type"),xml=type=="xml"||!type&&ct&&ct.indexOf("xml")>=0,data=xml?xhr.responseXML:xhr.responseText;if(xml&&data.documentElement.tagName=="parsererror")
throw"parsererror";if(s&&s.dataFilter)
data=s.dataFilter(data,type);if(typeof data==="string"){if(type=="script")
jQuery.globalEval(data);if(type=="json")
data=window["eval"]("("+data+")");}
return data;},param:function(a){var s=[];function add(key,value){s[s.length]=encodeURIComponent(key)+'='+encodeURIComponent(value);};if(jQuery.isArray(a)||a.jquery)
jQuery.each(a,function(){add(this.name,this.value);});else
for(var j in a)
if(jQuery.isArray(a[j]))
jQuery.each(a[j],function(){add(j,this);});else
add(j,jQuery.isFunction(a[j])?a[j]():a[j]);return s.join("&").replace(/%20/g,"+");}});var elemdisplay={},timerId,fxAttrs=[["height","marginTop","marginBottom","paddingTop","paddingBottom"],["width","marginLeft","marginRight","paddingLeft","paddingRight"],["opacity"]];function genFx(type,num){var obj={};jQuery.each(fxAttrs.concat.apply([],fxAttrs.slice(0,num)),function(){obj[this]=type;});return obj;}
jQuery.fn.extend({show:function(speed,callback){if(speed){return this.animate(genFx("show",3),speed,callback);}else{for(var i=0,l=this.length;i<l;i++){var old=jQuery.data(this[i],"olddisplay");this[i].style.display=old||"";if(jQuery.css(this[i],"display")==="none"){var tagName=this[i].tagName,display;if(elemdisplay[tagName]){display=elemdisplay[tagName];}else{var elem=jQuery("<"+tagName+" />").appendTo("body");display=elem.css("display");if(display==="none")
display="block";elem.remove();elemdisplay[tagName]=display;}
jQuery.data(this[i],"olddisplay",display);}}
for(var i=0,l=this.length;i<l;i++){this[i].style.display=jQuery.data(this[i],"olddisplay")||"";}
return this;}},hide:function(speed,callback){if(speed){return this.animate(genFx("hide",3),speed,callback);}else{for(var i=0,l=this.length;i<l;i++){var old=jQuery.data(this[i],"olddisplay");if(!old&&old!=="none")
jQuery.data(this[i],"olddisplay",jQuery.css(this[i],"display"));}
for(var i=0,l=this.length;i<l;i++){this[i].style.display="none";}
return this;}},_toggle:jQuery.fn.toggle,toggle:function(fn,fn2){var bool=typeof fn==="boolean";return jQuery.isFunction(fn)&&jQuery.isFunction(fn2)?this._toggle.apply(this,arguments):fn==null||bool?this.each(function(){var state=bool?fn:jQuery(this).is(":hidden");jQuery(this)[state?"show":"hide"]();}):this.animate(genFx("toggle",3),fn,fn2);},fadeTo:function(speed,to,callback){return this.animate({opacity:to},speed,callback);},animate:function(prop,speed,easing,callback){var optall=jQuery.speed(speed,easing,callback);return this[optall.queue===false?"each":"queue"](function(){var opt=jQuery.extend({},optall),p,hidden=this.nodeType==1&&jQuery(this).is(":hidden"),self=this;for(p in prop){if(prop[p]=="hide"&&hidden||prop[p]=="show"&&!hidden)
return opt.complete.call(this);if((p=="height"||p=="width")&&this.style){opt.display=jQuery.css(this,"display");opt.overflow=this.style.overflow;}}
if(opt.overflow!=null)
this.style.overflow="hidden";opt.curAnim=jQuery.extend({},prop);jQuery.each(prop,function(name,val){var e=new jQuery.fx(self,opt,name);if(/toggle|show|hide/.test(val))
e[val=="toggle"?hidden?"show":"hide":val](prop);else{var parts=val.toString().match(/^([+-]=)?([\d+-.]+)(.*)$/),start=e.cur(true)||0;if(parts){var end=parseFloat(parts[2]),unit=parts[3]||"px";if(unit!="px"){self.style[name]=(end||1)+unit;start=((end||1)/e.cur(true))*start;self.style[name]=start+unit;}
if(parts[1])
end=((parts[1]=="-="?-1:1)*end)+start;e.custom(start,end,unit);}else
e.custom(start,val,"");}});return true;});},stop:function(clearQueue,gotoEnd){var timers=jQuery.timers;if(clearQueue)
this.queue([]);this.each(function(){for(var i=timers.length-1;i>=0;i--)
if(timers[i].elem==this){if(gotoEnd)
timers[i](true);timers.splice(i,1);}});if(!gotoEnd)
this.dequeue();return this;}});jQuery.each({slideDown:genFx("show",1),slideUp:genFx("hide",1),slideToggle:genFx("toggle",1),fadeIn:{opacity:"show"},fadeOut:{opacity:"hide"}},function(name,props){jQuery.fn[name]=function(speed,callback){return this.animate(props,speed,callback);};});jQuery.extend({speed:function(speed,easing,fn){var opt=typeof speed==="object"?speed:{complete:fn||!fn&&easing||jQuery.isFunction(speed)&&speed,duration:speed,easing:fn&&easing||easing&&!jQuery.isFunction(easing)&&easing};opt.duration=jQuery.fx.off?0:typeof opt.duration==="number"?opt.duration:jQuery.fx.speeds[opt.duration]||jQuery.fx.speeds._default;opt.old=opt.complete;opt.complete=function(){if(opt.queue!==false)
jQuery(this).dequeue();if(jQuery.isFunction(opt.old))
opt.old.call(this);};return opt;},easing:{linear:function(p,n,firstNum,diff){return firstNum+diff*p;},swing:function(p,n,firstNum,diff){return((-Math.cos(p*Math.PI)/2)+0.5)*diff+firstNum;}},timers:[],fx:function(elem,options,prop){this.options=options;this.elem=elem;this.prop=prop;if(!options.orig)
options.orig={};}});jQuery.fx.prototype={update:function(){if(this.options.step)
this.options.step.call(this.elem,this.now,this);(jQuery.fx.step[this.prop]||jQuery.fx.step._default)(this);if((this.prop=="height"||this.prop=="width")&&this.elem.style)
this.elem.style.display="block";},cur:function(force){if(this.elem[this.prop]!=null&&(!this.elem.style||this.elem.style[this.prop]==null))
return this.elem[this.prop];var r=parseFloat(jQuery.css(this.elem,this.prop,force));return r&&r>-10000?r:parseFloat(jQuery.curCSS(this.elem,this.prop))||0;},custom:function(from,to,unit){this.startTime=now();this.start=from;this.end=to;this.unit=unit||this.unit||"px";this.now=this.start;this.pos=this.state=0;var self=this;function t(gotoEnd){return self.step(gotoEnd);}
t.elem=this.elem;if(t()&&jQuery.timers.push(t)&&!timerId){timerId=setInterval(function(){var timers=jQuery.timers;for(var i=0;i<timers.length;i++)
if(!timers[i]())
timers.splice(i--,1);if(!timers.length){clearInterval(timerId);timerId=undefined;}},13);}},show:function(){this.options.orig[this.prop]=jQuery.attr(this.elem.style,this.prop);this.options.show=true;this.custom(this.prop=="width"||this.prop=="height"?1:0,this.cur());jQuery(this.elem).show();},hide:function(){this.options.orig[this.prop]=jQuery.attr(this.elem.style,this.prop);this.options.hide=true;this.custom(this.cur(),0);},step:function(gotoEnd){var t=now();if(gotoEnd||t>=this.options.duration+this.startTime){this.now=this.end;this.pos=this.state=1;this.update();this.options.curAnim[this.prop]=true;var done=true;for(var i in this.options.curAnim)
if(this.options.curAnim[i]!==true)
done=false;if(done){if(this.options.display!=null){this.elem.style.overflow=this.options.overflow;this.elem.style.display=this.options.display;if(jQuery.css(this.elem,"display")=="none")
this.elem.style.display="block";}
if(this.options.hide)
jQuery(this.elem).hide();if(this.options.hide||this.options.show)
for(var p in this.options.curAnim)
jQuery.attr(this.elem.style,p,this.options.orig[p]);this.options.complete.call(this.elem);}
return false;}else{var n=t-this.startTime;this.state=n/this.options.duration;this.pos=jQuery.easing[this.options.easing||(jQuery.easing.swing?"swing":"linear")](this.state,n,0,1,this.options.duration);this.now=this.start+((this.end-this.start)*this.pos);this.update();}
return true;}};jQuery.extend(jQuery.fx,{speeds:{slow:600,fast:200,_default:400},step:{opacity:function(fx){jQuery.attr(fx.elem.style,"opacity",fx.now);},_default:function(fx){if(fx.elem.style&&fx.elem.style[fx.prop]!=null)
fx.elem.style[fx.prop]=fx.now+fx.unit;else
fx.elem[fx.prop]=fx.now;}}});if(document.documentElement["getBoundingClientRect"])
jQuery.fn.offset=function(){if(!this[0])return{top:0,left:0};if(this[0]===this[0].ownerDocument.body)return jQuery.offset.bodyOffset(this[0]);var box=this[0].getBoundingClientRect(),doc=this[0].ownerDocument,body=doc.body,docElem=doc.documentElement,clientTop=docElem.clientTop||body.clientTop||0,clientLeft=docElem.clientLeft||body.clientLeft||0,top=box.top+(self.pageYOffset||jQuery.boxModel&&docElem.scrollTop||body.scrollTop)-clientTop,left=box.left+(self.pageXOffset||jQuery.boxModel&&docElem.scrollLeft||body.scrollLeft)-clientLeft;return{top:top,left:left};};else
jQuery.fn.offset=function(){if(!this[0])return{top:0,left:0};if(this[0]===this[0].ownerDocument.body)return jQuery.offset.bodyOffset(this[0]);jQuery.offset.initialized||jQuery.offset.initialize();var elem=this[0],offsetParent=elem.offsetParent,prevOffsetParent=elem,doc=elem.ownerDocument,computedStyle,docElem=doc.documentElement,body=doc.body,defaultView=doc.defaultView,prevComputedStyle=defaultView.getComputedStyle(elem,null),top=elem.offsetTop,left=elem.offsetLeft;while((elem=elem.parentNode)&&elem!==body&&elem!==docElem){computedStyle=defaultView.getComputedStyle(elem,null);top-=elem.scrollTop,left-=elem.scrollLeft;if(elem===offsetParent){top+=elem.offsetTop,left+=elem.offsetLeft;if(jQuery.offset.doesNotAddBorder&&!(jQuery.offset.doesAddBorderForTableAndCells&&/^t(able|d|h)$/i.test(elem.tagName)))
top+=parseInt(computedStyle.borderTopWidth,10)||0,left+=parseInt(computedStyle.borderLeftWidth,10)||0;prevOffsetParent=offsetParent,offsetParent=elem.offsetParent;}
if(jQuery.offset.subtractsBorderForOverflowNotVisible&&computedStyle.overflow!=="visible")
top+=parseInt(computedStyle.borderTopWidth,10)||0,left+=parseInt(computedStyle.borderLeftWidth,10)||0;prevComputedStyle=computedStyle;}
if(prevComputedStyle.position==="relative"||prevComputedStyle.position==="static")
top+=body.offsetTop,left+=body.offsetLeft;if(prevComputedStyle.position==="fixed")
top+=Math.max(docElem.scrollTop,body.scrollTop),left+=Math.max(docElem.scrollLeft,body.scrollLeft);return{top:top,left:left};};jQuery.offset={initialize:function(){if(this.initialized)return;var body=document.body,container=document.createElement('div'),innerDiv,checkDiv,table,td,rules,prop,bodyMarginTop=body.style.marginTop,html='<div style="position:absolute;top:0;left:0;margin:0;border:5px solid #000;padding:0;width:1px;height:1px;"><div></div></div><table style="position:absolute;top:0;left:0;margin:0;border:5px solid #000;padding:0;width:1px;height:1px;" cellpadding="0" cellspacing="0"><tr><td></td></tr></table>';rules={position:'absolute',top:0,left:0,margin:0,border:0,width:'1px',height:'1px',visibility:'hidden'};for(prop in rules)container.style[prop]=rules[prop];container.innerHTML=html;body.insertBefore(container,body.firstChild);innerDiv=container.firstChild,checkDiv=innerDiv.firstChild,td=innerDiv.nextSibling.firstChild.firstChild;this.doesNotAddBorder=(checkDiv.offsetTop!==5);this.doesAddBorderForTableAndCells=(td.offsetTop===5);innerDiv.style.overflow='hidden',innerDiv.style.position='relative';this.subtractsBorderForOverflowNotVisible=(checkDiv.offsetTop===-5);body.style.marginTop='1px';this.doesNotIncludeMarginInBodyOffset=(body.offsetTop===0);body.style.marginTop=bodyMarginTop;body.removeChild(container);this.initialized=true;},bodyOffset:function(body){jQuery.offset.initialized||jQuery.offset.initialize();var top=body.offsetTop,left=body.offsetLeft;if(jQuery.offset.doesNotIncludeMarginInBodyOffset)
top+=parseInt(jQuery.curCSS(body,'marginTop',true),10)||0,left+=parseInt(jQuery.curCSS(body,'marginLeft',true),10)||0;return{top:top,left:left};}};jQuery.fn.extend({position:function(){var left=0,top=0,results;if(this[0]){var offsetParent=this.offsetParent(),offset=this.offset(),parentOffset=/^body|html$/i.test(offsetParent[0].tagName)?{top:0,left:0}:offsetParent.offset();offset.top-=num(this,'marginTop');offset.left-=num(this,'marginLeft');parentOffset.top+=num(offsetParent,'borderTopWidth');parentOffset.left+=num(offsetParent,'borderLeftWidth');results={top:offset.top-parentOffset.top,left:offset.left-parentOffset.left};}
return results;},offsetParent:function(){var offsetParent=this[0].offsetParent||document.body;while(offsetParent&&(!/^body|html$/i.test(offsetParent.tagName)&&jQuery.css(offsetParent,'position')=='static'))
offsetParent=offsetParent.offsetParent;return jQuery(offsetParent);}});jQuery.each(['Left','Top'],function(i,name){var method='scroll'+name;jQuery.fn[method]=function(val){if(!this[0])return null;return val!==undefined?this.each(function(){this==window||this==document?window.scrollTo(!i?val:jQuery(window).scrollLeft(),i?val:jQuery(window).scrollTop()):this[method]=val;}):this[0]==window||this[0]==document?self[i?'pageYOffset':'pageXOffset']||jQuery.boxModel&&document.documentElement[method]||document.body[method]:this[0][method];};});jQuery.each(["Height","Width"],function(i,name){var tl=i?"Left":"Top",br=i?"Right":"Bottom",lower=name.toLowerCase();jQuery.fn["inner"+name]=function(){return this[0]?jQuery.css(this[0],lower,false,"padding"):null;};jQuery.fn["outer"+name]=function(margin){return this[0]?jQuery.css(this[0],lower,false,margin?"margin":"border"):null;};var type=name.toLowerCase();jQuery.fn[type]=function(size){return this[0]==window?document.compatMode=="CSS1Compat"&&document.documentElement["client"+name]||document.body["client"+name]:this[0]==document?Math.max(document.documentElement["client"+name],document.body["scroll"+name],document.documentElement["scroll"+name],document.body["offset"+name],document.documentElement["offset"+name]):size===undefined?(this.length?jQuery.css(this[0],type):null):this.css(type,typeof size==="string"?size:size+"px");};});})();(function($)
{var defaults={onClick:function(){$(this).find('>a').each(function(){if(this.href)
{window.location=this.href;}});},arrowSrc:'',subDelay:300,mainDelay:10};$.fn.clickMenu=function(options)
{var shown=false;var liOffset=(($.browser.msie)?4:2);var settings=$.extend({},defaults,options);var hideDIV=function(div,delay)
{if(div.timer&&!div.isVisible)
{clearTimeout(div.timer);}
else if(div.timer)
{return;}
if(div.isVisible)
{div.timer=setTimeout(function()
{$(getAllChilds(getOneChild(div,'UL'),'LI')).unbind('mouseover',liHoverIn).unbind('mouseout',liHoverOut).unbind('click',settings.onClick);$(div).hide();div.isVisible=false;div.timer=null;},delay);}};var showDIV=function(div,delay)
{if(div.timer)
{clearTimeout(div.timer);}
if(!div.isVisible)
{div.timer=setTimeout(function()
{if(!checkClass(div.parentNode,'hover'))
{return;}
$(getAllChilds(getOneChild(div,'UL'),'LI')).mouseover(liHoverIn).mouseout(liHoverOut).click(settings.onClick);if(!checkClass(div.parentNode,'main'))
{$(div).css('left',div.parentNode.offsetWidth-liOffset);}
div.isVisible=true;$(div).show();if($.browser.msie)
{var cW=$(getOneChild(div,'UL')).width();if(cW<100)
{cW=100;}
$(div).css('width',cW);}
div.timer=null;},delay);}};var testHandleHover=function(e)
{var p=(e.type=="mouseover"?e.fromElement:e.toElement)||e.relatedTarget;while(p&&p!=this)
{try
{p=p.parentNode;}
catch(e)
{p=this;}}
if(p==this)
{return false;}
return true;};var mainHoverIn=function(e)
{var lis=getAllChilds(this.parentNode,'LI');var pattern=new RegExp("(^|\\s)hover(\\s|$)");for(var i=0;i<lis.length;i++)
{if(pattern.test(lis[i].className))
{$(lis[i]).removeClass('hover');}}
$(this).addClass('hover');if(shown)
{hoverIn(this,settings.mainDelay);}};var liHoverIn=function(e)
{if(!testHandleHover(e))
{return false;}
if(e.target!=this)
{if(!isChild(this,e.target))
{return;}}
hoverIn(this,settings.subDelay);};var hoverIn=function(li,delay)
{var innerDiv=getOneChild(li,'DIV');var n=li.parentNode.firstChild;for(;n;n=n.nextSibling)
{if(n.nodeType==1&&n.nodeName.toUpperCase()=='LI')
{var div=getOneChild(n,'DIV');if(div&&div.timer&&!div.isVisible)
{clearTimeout(div.timer);div.timer=null;}}}
var pNode=li.parentNode;for(;pNode;pNode=pNode.parentNode)
{if(pNode.nodeType==1&&pNode.nodeName.toUpperCase()=='DIV')
{if(pNode.timer)
{clearTimeout(pNode.timer);pNode.timer=null;$(pNode.parentNode).addClass('hover');}}}
$(li).addClass('hover');if(innerDiv&&innerDiv.isVisible)
{if(innerDiv.timer)
{clearTimeout(innerDiv.timer);innerDiv.timer=null;}
else
{return;}}
$(li.parentNode.getElementsByTagName('DIV')).each(function(){if(this!=innerDiv&&this.isVisible)
{hideDIV(this,delay);$(this.parentNode).removeClass('hover');}});if(innerDiv)
{showDIV(innerDiv,delay);}};var liHoverOut=function(e)
{if(!testHandleHover(e))
{return false;}
if(e.target!=this)
{if(!isChild(this,e.target))
{return;}}
var div=getOneChild(this,'DIV');if(!div)
{$(this).removeClass('hover');}
else
{if(!div.isVisible)
{$(this).removeClass('hover');}}};var mainHoverOut=function(e)
{var div=getOneChild(this,'DIV');var relTarget=e.relatedTarget||e.toElement;var p;if(!shown)
{$(this).removeClass('hover');}
else if(!div&&relTarget)
{p=findParentWithClass(e.target,'UL','clickMenu');if(p.contains(relTarget))
{$(this).removeClass('hover');}}
else if(relTarget)
{p=findParentWithClass(e.target,'UL','clickMenu');if(!div.isVisible&&(p.contains(relTarget)))
{$(this).removeClass('hover');}}};var mainClick=function()
{var div=getOneChild(this,'DIV');if(div&&div.isVisible)
{clean();$(this).addClass('hover');}
else
{hoverIn(this,settings.mainDelay);shown=true;$(document).bind('mousedown',checkMouse);}
return false;};var checkMouse=function(e)
{var vis=false;var cm=findParentWithClass(e.target,'UL','clickMenu');if(cm)
{$(cm.getElementsByTagName('DIV')).each(function(){if(this.isVisible)
{vis=true;}});}
if(!vis)
{clean();}};var clean=function()
{$('ul.clickMenu div.outerbox').each(function(){if(this.timer)
{clearTimeout(this.timer);this.timer=null;}
if(this.isVisible)
{$(this).hide();this.isVisible=false;}});$('ul.clickMenu li').removeClass('hover');$('ul.clickMenu>li li').unbind('mouseover',liHoverIn).unbind('mouseout',liHoverOut).unbind('click',settings.onClick);$(document).unbind('mousedown',checkMouse);shown=false;};var getOneChild=function(elem,name)
{if(!elem)
{return null;}
var n=elem.firstChild;for(;n;n=n.nextSibling)
{if(n.nodeType==1&&n.nodeName.toUpperCase()==name)
{return n;}}
return null;};var getAllChilds=function(elem,name)
{if(!elem)
{return[];}
var r=[];var n=elem.firstChild;for(;n;n=n.nextSibling)
{if(n.nodeType==1&&n.nodeName.toUpperCase()==name)
{r[r.length]=n;}}
return r;};var findParentWithClass=function(elem,searchTag,searchClass)
{var pNode=elem.parentNode;var pattern=new RegExp("(^|\\s)"+searchClass+"(\\s|$)");for(;pNode;pNode=pNode.parentNode)
{if(pNode.nodeType==1&&pNode.nodeName.toUpperCase()==searchTag&&pattern.test(pNode.className))
{return pNode;}}
return null;};var checkClass=function(elem,searchClass)
{var pattern=new RegExp("(^|\\s)"+searchClass+"(\\s|$)");if(pattern.test(elem.className))
{return true;}
return false;};var isChild=function(elem,childElem)
{var n=elem.firstChild;for(;n;n=n.nextSibling)
{if(n==childElem)
{return true;}}
return false;};return this.each(function()
{if(window.Node&&Node.prototype&&!Node.prototype.contains)
{Node.prototype.contains=function(arg)
{return!!(this.compareDocumentPosition(arg)&16);};}
if(!checkClass(this,'clickMenu'))
{$(this).addClass('clickMenu');}
$('ul',this).shadowBox();if($.browser.msie&&(!$.browser.version||parseInt($.browser.version)<=6))
{if($.fn.bgiframe)
{$('div.outerbox',this).bgiframe();}
else
{$('div.outerbox',this).append('<iframe style="display:block;position:absolute;top:0;left:0;z-index:-1;filter:mask();'+'width:expression(this.parentNode.offsetWidth);height:expression(this.parentNode.offsetHeight)"/>');}}
$(this).bind('closemenu',function(){clean();});var liElems=getAllChilds(this,'LI');for(var j=0;j<liElems.length;j++)
{if(getOneChild(getOneChild(getOneChild(liElems[j],'DIV'),'UL'),'LI'))
{$(liElems[j]).click(mainClick);}}
$(liElems).hover(mainHoverIn,mainHoverOut).addClass('main').find('>div').addClass('inner');if(settings.arrowSrc)
{$('div.inner div.outerbox',this).before('<img src="'+settings.arrowSrc+'" class="liArrow" />');}
$(this).wrap('<div class="cmDiv"></div>').after('<div style="clear: both; visibility: hidden;"></div>');});};$.fn.clickMenu.setDefaults=function(o)
{$.extend(defaults,o);};})(jQuery);(function($)
{$.fn.shadowBox=function(){return this.each(function()
{var outer=$('<div class="outerbox"></div>').get(0);if($(this).css('position')=='absolute')
{$(outer).css({position:'relative',width:this.offsetWidth,height:this.offsetHeight});}
else
{$(outer).css('position','absolute');}
$(this).addClass('innerBox').wrap(outer).before('<div class="shadowbox1"></div><div class="shadowbox2"></div><div class="shadowbox3"></div>');});};})(jQuery);(function($)
{var defaults={listTargetID:null,onClass:'',offClass:'',hideInList:[],colsHidden:[],saveState:false,onToggle:null,show:function(cell){showCell(cell);},hide:function(cell){hideCell(cell);}};var idCount=0;var cookieName='columnManagerC';var saveCurrentValue=function(table)
{var val='',i=0,colsVisible=table.cMColsVisible;if(table.cMSaveState&&table.id&&colsVisible&&$.cookie)
{for(;i<colsVisible.length;i++)
{val+=(colsVisible[i]==false)?0:1;}
$.cookie(cookieName+table.id,val,{expires:9999});}};var hideCell=function(cell)
{if(jQuery.browser.msie)
{(hideCell=function(c)
{c.style.setAttribute('display','none');})(cell);}
else
{(hideCell=function(c)
{c.style.display='none';})(cell);}};var showCell=function(cell)
{if(jQuery.browser.msie)
{(showCell=function(c)
{c.style.setAttribute('display','block');})(cell);}
else
{(showCell=function(c)
{c.style.display='table-cell';})(cell);}};var cellVisible=function(cell)
{if(jQuery.browser.msie)
{return(cellVisible=function(c)
{return c.style.getAttribute('display')!='none';})(cell);}
else
{return(cellVisible=function(c)
{return c.style.display!='none';})(cell);}};var getCell=function(table,cells,col)
{for(var i=0;i<cells.length;i++)
{if(cells[i].realIndex===undefined)
{fixCellIndexes(table);}
if(cells[i].realIndex==col)
{return cells[i];}}
return null;};var fixCellIndexes=function(table)
{var rows=table.rows;var len=rows.length;var matrix=[];for(var i=0;i<len;i++)
{var cells=rows[i].cells;var clen=cells.length;for(var j=0;j<clen;j++)
{var c=cells[j];var rowSpan=c.rowSpan||1;var colSpan=c.colSpan||1;var firstAvailCol=-1;if(!matrix[i])
{matrix[i]=[];}
var m=matrix[i];while(m[++firstAvailCol]){}
c.realIndex=firstAvailCol;for(var k=i;k<i+rowSpan;k++)
{if(!matrix[k])
{matrix[k]=[];}
var matrixrow=matrix[k];for(var l=firstAvailCol;l<firstAvailCol+colSpan;l++)
{matrixrow[l]=1;}}}}};$.fn.columnManager=function(options)
{var settings=$.extend({},defaults,options);var createColumnHeaderList=function(table)
{if(!settings.listTargetID)
{return;}
var $target=$('#'+settings.listTargetID);if(!$target.length)
{return;}
var headRow=null;if(table.tHead&&table.tHead.length)
{headRow=table.tHead.rows[0];}
else if(table.rows.length)
{headRow=table.rows[0];}
else
{return;}
var cells=headRow.cells;if(!cells.length)
{return;}
var $list=null;if($target.get(0).nodeName.toUpperCase()=='UL')
{$list=$target;}
else
{$list=$('<ul></ul>');$target.append($list);}
var colsVisible=table.cMColsVisible;for(var i=0;i<cells.length;i++)
{if($.inArray(i+1,settings.hideInList)>=0)
{continue;}
colsVisible[i]=(colsVisible[i]!==undefined)?colsVisible[i]:true;var text=$(cells[i]).text(),addClass;if(!text.length)
{text=$(cells[i]).html();if(!text.length)
{text='undefined';}}
if(colsVisible[i]&&settings.onClass)
{addClass=settings.onClass;}
else if(!colsVisible[i]&&settings.offClass)
{addClass=settings.offClass;}
var $li=$('<li class="'+addClass+'">'+text+'</li>').click(toggleClick);$li[0].cmData={id:table.id,col:i};$list.append($li);}
table.cMColsVisible=colsVisible;};var toggleClick=function()
{var data=this.cmData;if(data&&data.id&&data.col>=0)
{var colNum=data.col,$table=$('#'+data.id);if($table.length)
{$table.toggleColumns([colNum+1],settings);var colsVisible=$table.get(0).cMColsVisible;if(settings.onToggle)
{settings.onToggle.apply($table.get(0),[colNum+1,colsVisible[colNum]]);}}}};var getSavedValue=function(tableID)
{var val=$.cookie(cookieName+tableID);if(val)
{var ar=val.split('');for(var i=0;i<ar.length;i++)
{ar[i]&=1;}
return ar;}
return false;};return this.each(function()
{this.id=this.id||'jQcM0O'+idCount++;var i,colsHide=[],colsVisible=[];fixCellIndexes(this);if(settings.colsHidden.length)
{for(i=0;i<settings.colsHidden.length;i++)
{colsVisible[settings.colsHidden[i]-1]=true;colsHide[settings.colsHidden[i]-1]=true;}}
if(settings.saveState)
{var colsSaved=getSavedValue(this.id);if(colsSaved&&colsSaved.length)
{for(i=0;i<colsSaved.length;i++)
{colsVisible[i]=true;colsHide[i]=!colsSaved[i];}}
this.cMSaveState=true;}
this.cMColsVisible=colsVisible;if(colsHide.length)
{var a=[];for(i=0;i<colsHide.length;i++)
{if(colsHide[i])
{a[a.length]=i+1;}}
if(a.length)
{$(this).toggleColumns(a);}}
createColumnHeaderList(this);});};$.fn.toggleColumns=function(columns,cmo)
{return this.each(function()
{var i,toggle,di,rows=this.rows,colsVisible=this.cMColsVisible;if(!columns)
return;if(columns.constructor==Number)
columns=[columns];if(!colsVisible)
colsVisible=this.cMColsVisible=[];for(i=0;i<rows.length;i++)
{var cells=rows[i].cells;for(var k=0;k<columns.length;k++)
{var col=columns[k]-1;if(col>=0)
{var c=getCell(this,cells,col);if(!c)
{var cco=col;while(cco>0&&!(c=getCell(this,cells,--cco))){}
if(!c)
{continue;}}
if(colsVisible[col]==undefined)
{colsVisible[col]=true;}
if(colsVisible[col])
{toggle=cmo&&cmo.hide?cmo.hide:hideCell;di=-1;}
else
{toggle=cmo&&cmo.show?cmo.show:showCell;di=1;}
if(!c.chSpan)
{c.chSpan=0;}
if(c.colSpan>1||(di==1&&c.chSpan&&cellVisible(c)))
{if(c.realIndex+c.colSpan+c.chSpan-1<col)
{continue;}
c.colSpan+=di;c.chSpan+=di*-1;}
else if(c.realIndex+c.chSpan<col)
{continue;}
else
{toggle(c);}}}}
for(i=0;i<columns.length;i++)
{this.cMColsVisible[columns[i]-1]=!colsVisible[columns[i]-1];if(cmo&&cmo.listTargetID&&(cmo.onClass||cmo.offClass))
{var onC=cmo.onClass,offC=cmo.offClass,$li;if(colsVisible[columns[i]-1])
{onC=offC;offC=cmo.onClass;}
$li=$("#"+cmo.listTargetID+" li").filter(function(){return this.cmData&&this.cmData.col==columns[i]-1;});if(onC)
{$li.removeClass(onC);}
if(offC)
{$li.addClass(offC);}}}
saveCurrentValue(this);});};$.fn.showColumns=function(columns,cmo)
{return this.each(function()
{var i,cols=[],cV=this.cMColsVisible;if(cV)
{if(columns&&columns.constructor==Number)
columns=[columns];for(i=0;i<cV.length;i++)
{if(!cV[i]&&(!columns||$.inArray(i+1,columns)>-1))
cols.push(i+1);}
$(this).toggleColumns(cols,cmo);}});};$.fn.hideColumns=function(columns,cmo)
{return this.each(function()
{var i,cols=columns,cV=this.cMColsVisible;if(cV)
{if(columns.constructor==Number)
columns=[columns];cols=[];for(i=0;i<columns.length;i++)
{if(cV[columns[i]-1]||cV[columns[i]-1]==undefined)
cols.push(columns[i]);}}
$(this).toggleColumns(cols,cmo);});};})(jQuery);jQuery.cookie=function(name,value,options){if(typeof value!='undefined'){options=options||{};if(value===null){value='';options=$.extend({},options);options.expires=-1;}var expires='';if(options.expires&&(typeof options.expires=='number'||options.expires.toUTCString)){var date;if(typeof options.expires=='number'){date=new Date();date.setTime(date.getTime()+(options.expires*24*60*60*1000));}else{date=options.expires;}expires='; expires='+date.toUTCString();}var path=options.path?'; path='+(options.path):'';var domain=options.domain?'; domain='+(options.domain):'';var secure=options.secure?'; secure':'';document.cookie=[name,'=',encodeURIComponent(value),expires,path,domain,secure].join('');}else{var cookieValue=null;if(document.cookie&&document.cookie!=''){var cookies=document.cookie.split(';');for(var i=0;i<cookies.length;i++){var cookie=jQuery.trim(cookies[i]);if(cookie.substring(0,name.length+1)==(name+'=')){cookieValue=decodeURIComponent(cookie.substring(name.length+1));break;}}}return cookieValue;}};(function(jQuery){if(jQuery.fn.__bind__===undefined){jQuery.fn.__bind__=jQuery.fn.bind;}
if(jQuery.fn.__unbind__===undefined){jQuery.fn.__unbind__=jQuery.fn.unbind;}
if(jQuery.fn.__find__===undefined){jQuery.fn.__find__=jQuery.fn.find;}
var hotkeys={version:'0.7.9',override:/keypress|keydown|keyup/g,triggersMap:{},specialKeys:{27:'esc',9:'tab',32:'space',13:'return',8:'backspace',145:'scroll',20:'capslock',144:'numlock',19:'pause',45:'insert',36:'home',46:'del',35:'end',33:'pageup',34:'pagedown',37:'left',38:'up',39:'right',40:'down',109:'-',112:'f1',113:'f2',114:'f3',115:'f4',116:'f5',117:'f6',118:'f7',119:'f8',120:'f9',121:'f10',122:'f11',123:'f12',191:'/'},shiftNums:{"`":"~","1":"!","2":"@","3":"#","4":"$","5":"%","6":"^","7":"&","8":"*","9":"(","0":")","-":"_","=":"+",";":":","'":"\"",",":"<",".":">","/":"?","\\":"|"},newTrigger:function(type,combi,callback){var result={};result[type]={};result[type][combi]={cb:callback,disableInInput:false,shortcut:combi};return result;}};hotkeys.specialKeys=jQuery.extend(hotkeys.specialKeys,{96:'0',97:'1',98:'2',99:'3',100:'4',101:'5',102:'6',103:'7',104:'8',105:'9',106:'*',107:'+',109:'-',110:'.',111:'/'});jQuery.fn.find=function(selector){this.query=selector;return jQuery.fn.__find__.apply(this,arguments);};jQuery.fn.unbind=function(type,combi,fn){if(jQuery.isFunction(combi)){fn=combi;combi=null;}
if(combi&&typeof combi==='string'){var selectorId=((this.prevObject&&this.prevObject.query)||(this[0].id&&this[0].id)||this[0]).toString();var hkTypes=type.split(' ');for(var x=0;x<hkTypes.length;x++){delete hotkeys.triggersMap[selectorId][hkTypes[x]][combi];}}
return this.__unbind__(type,fn);};jQuery.fn.bind=function(type,data,fn){var handle=type.match(hotkeys.override);if(jQuery.isFunction(data)||!handle){return this.__bind__(type,data,fn);}
else{var result=null,pass2jq=jQuery.trim(type.replace(hotkeys.override,''));if(pass2jq){result=this.__bind__(pass2jq,data,fn);}
if(typeof data==="string"){data={'combi':data};}
if(data.combi){for(var x=0;x<handle.length;x++){var eventType=handle[x];var combi=data.combi.toLowerCase(),trigger=hotkeys.newTrigger(eventType,combi,fn),selectorId=((this.prevObject&&this.prevObject.query)||(this[0].id&&this[0].id)||this[0]).toString();trigger[eventType][combi].disableInInput=data.disableInInput;if(!hotkeys.triggersMap[selectorId]){hotkeys.triggersMap[selectorId]=trigger;}
else if(!hotkeys.triggersMap[selectorId][eventType]){hotkeys.triggersMap[selectorId][eventType]=trigger[eventType];}
var mapPoint=hotkeys.triggersMap[selectorId][eventType][combi];if(!mapPoint){hotkeys.triggersMap[selectorId][eventType][combi]=[trigger[eventType][combi]];}
else if(mapPoint.constructor!==Array){hotkeys.triggersMap[selectorId][eventType][combi]=[mapPoint];}
else{hotkeys.triggersMap[selectorId][eventType][combi][mapPoint.length]=trigger[eventType][combi];}
this.each(function(){var jqElem=jQuery(this);if(jqElem.attr('hkId')&&jqElem.attr('hkId')!==selectorId){selectorId=jqElem.attr('hkId')+";"+selectorId;}
jqElem.attr('hkId',selectorId);});result=this.__bind__(handle.join(' '),data,hotkeys.handler)}}
return result;}};hotkeys.findElement=function(elem){if(!jQuery(elem).attr('hkId')){if(jQuery.browser.opera||jQuery.browser.safari){while(!jQuery(elem).attr('hkId')&&elem.parentNode){elem=elem.parentNode;}}}
return elem;};hotkeys.handler=function(event){var target=hotkeys.findElement(event.currentTarget),jTarget=jQuery(target),ids=jTarget.attr('hkId');if(ids){ids=ids.split(';');var code=event.which,type=event.type,special=hotkeys.specialKeys[code],character=!special&&String.fromCharCode(code).toLowerCase(),shift=event.shiftKey,ctrl=event.ctrlKey,alt=event.altKey||event.originalEvent.altKey,mapPoint=null;for(var x=0;x<ids.length;x++){if(hotkeys.triggersMap[ids[x]][type]){mapPoint=hotkeys.triggersMap[ids[x]][type];break;}}
if(mapPoint){var trigger;if(!shift&&!ctrl&&!alt){trigger=mapPoint[special]||(character&&mapPoint[character]);}
else{var modif='';if(alt)modif+='alt+';if(ctrl)modif+='ctrl+';if(shift)modif+='shift+';trigger=mapPoint[modif+special];if(!trigger){if(character){trigger=mapPoint[modif+character]||mapPoint[modif+hotkeys.shiftNums[character]]||(modif==='shift+'&&mapPoint[hotkeys.shiftNums[character]]);}}}
if(trigger){var result=false;for(var x=0;x<trigger.length;x++){if(trigger[x].disableInInput){var elem=jQuery(event.target);if(jTarget.is("input")||jTarget.is("textarea")||jTarget.is("select")||elem.is("input")||elem.is("textarea")||elem.is("select")){return true;}}
result=result||trigger[x].cb.apply(this,[event]);}
return result;}}}};window.hotkeys=hotkeys;return jQuery;})(jQuery);jQuery.tableDnD={currentTable:null,dragObject:null,mouseOffset:null,oldY:0,build:function(options){this.each(function(){this.tableDnDConfig=jQuery.extend({onDragStyle:null,onDropStyle:null,onDragClass:"tDnD_whileDrag",onDrop:null,onDragStart:null,scrollAmount:5,serializeRegexp:/[^\-]*$/,serializeParamName:null,dragHandle:null},options||{});jQuery.tableDnD.makeDraggable(this);});jQuery(document).bind('mousemove',jQuery.tableDnD.mousemove).bind('mouseup',jQuery.tableDnD.mouseup);return this;},makeDraggable:function(table){var config=table.tableDnDConfig;if(table.tableDnDConfig.dragHandle){var cells=jQuery("td."+table.tableDnDConfig.dragHandle,table);cells.each(function(){jQuery(this).mousedown(function(ev){jQuery.tableDnD.dragObject=this.parentNode;jQuery.tableDnD.currentTable=table;jQuery.tableDnD.mouseOffset=jQuery.tableDnD.getMouseOffset(this,ev);if(config.onDragStart){config.onDragStart(table,this);}
return false;});})}else{var rows=jQuery("tr",table);rows.each(function(){var row=jQuery(this);if(!row.hasClass("nodrag")){row.mousedown(function(ev){if(ev.target.tagName=="TD"){jQuery.tableDnD.dragObject=this;jQuery.tableDnD.currentTable=table;jQuery.tableDnD.mouseOffset=jQuery.tableDnD.getMouseOffset(this,ev);if(config.onDragStart){config.onDragStart(table,this);}
return false;}}).css("cursor","move");}});}},updateTables:function(){this.each(function(){if(this.tableDnDConfig){jQuery.tableDnD.makeDraggable(this);}})},mouseCoords:function(ev){if(ev.pageX||ev.pageY){return{x:ev.pageX,y:ev.pageY};}
return{x:ev.clientX+document.body.scrollLeft-document.body.clientLeft,y:ev.clientY+document.body.scrollTop-document.body.clientTop};},getMouseOffset:function(target,ev){ev=ev||window.event;var docPos=this.getPosition(target);var mousePos=this.mouseCoords(ev);return{x:mousePos.x-docPos.x,y:mousePos.y-docPos.y};},getPosition:function(e){var left=0;var top=0;if(e.offsetHeight==0){e=e.firstChild;}
while(e.offsetParent){left+=e.offsetLeft;top+=e.offsetTop;e=e.offsetParent;}
left+=e.offsetLeft;top+=e.offsetTop;return{x:left,y:top};},mousemove:function(ev){if(jQuery.tableDnD.dragObject==null){return;}
var dragObj=jQuery(jQuery.tableDnD.dragObject);var config=jQuery.tableDnD.currentTable.tableDnDConfig;var mousePos=jQuery.tableDnD.mouseCoords(ev);var y=mousePos.y-jQuery.tableDnD.mouseOffset.y;var yOffset=window.pageYOffset;if(document.all){if(typeof document.compatMode!='undefined'&&document.compatMode!='BackCompat'){yOffset=document.documentElement.scrollTop;}
else if(typeof document.body!='undefined'){yOffset=document.body.scrollTop;}}
if(mousePos.y-yOffset<config.scrollAmount){window.scrollBy(0,-config.scrollAmount);}else{var windowHeight=window.innerHeight?window.innerHeight:document.documentElement.clientHeight?document.documentElement.clientHeight:document.body.clientHeight;if(windowHeight-(mousePos.y-yOffset)<config.scrollAmount){window.scrollBy(0,config.scrollAmount);}}
if(y!=jQuery.tableDnD.oldY){var movingDown=y>jQuery.tableDnD.oldY;jQuery.tableDnD.oldY=y;if(config.onDragClass){dragObj.addClass(config.onDragClass);}else{dragObj.css(config.onDragStyle);}
var currentRow=jQuery.tableDnD.findDropTargetRow(dragObj,y);if(currentRow){if(movingDown&&jQuery.tableDnD.dragObject!=currentRow){jQuery.tableDnD.dragObject.parentNode.insertBefore(jQuery.tableDnD.dragObject,currentRow.nextSibling);}else if(!movingDown&&jQuery.tableDnD.dragObject!=currentRow){jQuery.tableDnD.dragObject.parentNode.insertBefore(jQuery.tableDnD.dragObject,currentRow);}}}
return false;},findDropTargetRow:function(draggedRow,y){var rows=jQuery.tableDnD.currentTable.rows;for(var i=0;i<rows.length;i++){var row=rows[i];var rowY=this.getPosition(row).y;var rowHeight=parseInt(row.offsetHeight)/2;if(row.offsetHeight==0){rowY=this.getPosition(row.firstChild).y;rowHeight=parseInt(row.firstChild.offsetHeight)/2;}
if((y>rowY-rowHeight)&&(y<(rowY+rowHeight))){if(row==draggedRow){return null;}
var config=jQuery.tableDnD.currentTable.tableDnDConfig;if(config.onAllowDrop){if(config.onAllowDrop(draggedRow,row)){return row;}else{return null;}}else{var nodrop=jQuery(row).hasClass("nodrop");if(!nodrop){return row;}else{return null;}}
return row;}}
return null;},mouseup:function(e){if(jQuery.tableDnD.currentTable&&jQuery.tableDnD.dragObject){var droppedRow=jQuery.tableDnD.dragObject;var config=jQuery.tableDnD.currentTable.tableDnDConfig;if(config.onDragClass){jQuery(droppedRow).removeClass(config.onDragClass);}else{jQuery(droppedRow).css(config.onDropStyle);}
jQuery.tableDnD.dragObject=null;if(config.onDrop){config.onDrop(jQuery.tableDnD.currentTable,droppedRow);}
jQuery.tableDnD.currentTable=null;}},serialize:function(){if(jQuery.tableDnD.currentTable){return jQuery.tableDnD.serializeTable(jQuery.tableDnD.currentTable);}else{return"Error: No Table id set, you need to set an id on your table and every row";}},serializeTable:function(table){var result="";var tableId=table.id;var rows=table.rows;for(var i=0;i<rows.length;i++){if(result.length>0)result+="&";var rowId=rows[i].id;if(rowId&&table.tableDnDConfig&&table.tableDnDConfig.serializeRegexp){rowId=rowId.match(table.tableDnDConfig.serializeRegexp)[0];}
result+=tableId+'[]='+rowId;}
return result;},serializeTables:function(){var result="";this.each(function(){result+=jQuery.tableDnD.serializeTable(this);});return result;}}
jQuery.fn.extend({tableDnD:jQuery.tableDnD.build,tableDnDUpdate:jQuery.tableDnD.updateTables,tableDnDSerialize:jQuery.tableDnD.serializeTables});function shallow_array_equals(a1,a2){if(a1.length!=a2.length){return false;}
for(var i=0;i<a1.length;i++){if(a1[i]!=a2[i]){return false;}}
return true;}
function pluralize(num,opt_plural,opt_singular){var plural=opt_plural||'s';var singular=opt_singular||'';if(num==1){return singular;}else{return plural;}}
function PeriodicalExecuter(callback,frequency){this.callback=callback;this.frequency=frequency;this.currentlyExecuting=false;this.timer=null;}
PeriodicalExecuter.prototype={registerCallback:function(){var oSelf=this;this.timer=setInterval(function(){oSelf.onTimerEvent();},this.frequency*1000);},execute:function(){this.callback(this);},start:function(){if(!this.timer){this.registerCallback();window.setTimeout(this.callback,1);}},stop:function(){if(!this.timer)return;clearInterval(this.timer);this.timer=null;},onTimerEvent:function(){if(!this.currentlyExecuting){try{this.currentlyExecuting=true;this.execute();}finally{this.currentlyExecuting=false;}}}};var controls={DELAY:5,updater:null,timestepper:null,playlist_info:null,initialize:function(playlist_info){controls.updater=new PeriodicalExecuter(controls.update,controls.DELAY);controls.timestepper=new PeriodicalExecuter(function(){if(controls.playlist_info){controls.update_elapsed_time(1+controls.playlist_info.elapsed_time);}},1);controls.playlist_info=playlist_info;controls.update_playlist_info(playlist_info);if(Boolean($.cookie('controls_minimized'))){controls.minimize();}else{controls.updater.start();}},update:function(opt_action){var url='/audio/json/controls_update/';var parameters=null;if(typeof opt_action=='string'){url='/audio/json/control/';parameters={'action':opt_action}}
var options={url:url,type:'post',dataType:'json',error:function(transport,textStatus,exception){controls.error(textStatus);},success:function(response_json){controls.update_playlist_info(response_json);}};if(parameters){options['data']=parameters;}
jQuery.ajax(options);},_playlist_empty:function(playlist_info){return!Boolean(playlist_info&&playlist_info.songs&&playlist_info.songs.length>0);},playlist_changed:function(playlist_info){var old_plist_empty=controls._playlist_empty(controls.playlist_info);var new_plist_empty=controls._playlist_empty(playlist_info);if(!(old_plist_empty||new_plist_empty)){return!(controls.playlist_info.playlist_length==playlist_info.playlist_length&&shallow_array_equals(controls.playlist_info.songs,playlist_info.songs));}else{return!(old_plist_empty&&new_plist_empty);}},update_playlist_info:function(playlist_info){if(playlist_info.error){controls.error(playlist_info.error);return;}
var regex=/^\/audio\/channels\/(\d+\/)?$/;var on_channels=regex.test(window.location.pathname);if(on_channels&&controls.playlist_changed(playlist_info)){controls.updater.stop();window.location.reload();return;}
controls.playlist_info=playlist_info;if(controls._playlist_empty(playlist_info)){controls.clear_controls();}else{controls.update_elapsed_time(playlist_info.elapsed_time);if(playlist_info.playing){controls.timestepper.start();jQuery('#pause').show();jQuery('#play').hide();}else{jQuery('#pause').hide();jQuery('#play').show();}
jQuery('#current-song').text(playlist_info.songs[0]);var song_list=jQuery('#song-list');song_list.empty();for(var i=1;i<playlist_info.songs.length;i++){var li=document.createElement('li');song_list.append(li);jQuery(li).text(playlist_info.songs[i]);}
var length=playlist_info.playlist_length;var duration=playlist_info.playlist_duration;var msg=length+' song'+pluralize(length)+' total, ';msg+=duration.toFixed(0)+' playing time.';if(playlist_info.playlist_length>3){msg='... '+msg;}
jQuery('#control-trailer').text(msg);}},TIME_BAR_WIDTH:160,update_elapsed_time:function(time){var tbar=jQuery('#timebar');if(tbar.length==0||!controls.playlist_info)return;controls.playlist_info.elapsed_time=time;var width=Math.min(controls.TIME_BAR_WIDTH,controls.TIME_BAR_WIDTH*time/controls.playlist_info.song_duration);tbar.css('width',width+'px');},error:function(msg){controls.clear_controls();jQuery('#current-song').html(msg);},clear_controls:function(){controls.timestepper.stop();controls.update_elapsed_time(0);setTimeout(function(){controls.update_elapsed_time(0);},1000);jQuery('#current-song').text('--');jQuery('#song-list').empty();jQuery('#control-trailer').empty();},minimize:function(){jQuery('#controls').hide();jQuery('#controls-restore').show();controls.updater.stop();$.cookie('controls_minimized','1',{path:'/',expires:7});},restore:function(){jQuery('#controls-restore').hide();jQuery('#controls').show();controls.updater.start();$.cookie('controls_minimized','',{path:'/',expires:-1});},play:function(){controls._control_action('play');},pause:function(){controls._control_action('pause');controls.timestepper.stop();jQuery('#pause').hide();jQuery('#play').show();},skip:function(){controls._control_action('skip');},shuffle:function(){controls._control_action('shuffle');},_control_action:function(action){controls.update(action);}};(function($){var options={'combi':'/','disableInInput':true};$(document).bind('keydown',options,function(){$('#search_box').focus().select();return false;});var navs={'c':'/audio/channels/','p':'/audio/playlists/','f':'/audio/playlists/favorites/','b':'/audio/browse/','u':'/audio/upload/fancy/','r':'/audio/roulette/','h':'/audio/',};for(var key in navs){(function(){var url=navs[key];var options={'combi':key,'disableInInput':true};$(document).bind('keydown',options,function(){window.location=url;return false;});})();}})(jQuery);var channels={channel_id:null,dequeue:function(){var playids=songlist.gather_playids();if(playids.length>0){document.forms.dequeueform.playids.value=playids;document.forms.dequeueform.submit();}},askemail:function(){with(songlist){start_subaction();add_subaction_label("Email a link to the current song to:");add_subaction_textbox("emailaddress","username@example.com",channels.okemail);add_subaction_button("ok","channels.okemail();","Send");add_subaction_cancel_button();}},okemail:function(){var params={email:jQuery("#emailaddress").val(),ids:jQuery("#currentsong").attr('name')};var options={url:"/audio/json/email/",type:"post",data:params,dataType:'json',error:function(){songlist.error_message("Got no reponse from server.");},success:function(json){if("error"in json){songlist.error_message(json.error);}else if("success"in json){songlist.success_message(json.success);}else{songlist.error_message("Unintelligible server response.");}}};jQuery.ajax(options);},recent:function(){songlist.error_message("This feature isn't done yet.");},reorder_songs:function(table,row){row=jQuery(row);var prev_row=row.prev("tr");var playid=jQuery(".song_selected",row).attr('playid');var after_playid=jQuery(".song_selected",prev_row).attr('playid');if(!after_playid){after_playid=-1;}
if(!channels.channel_id)return;jQuery.ajax({url:'/audio/channels/'+channels.channel_id+'/reorder/',type:'get',data:{'playid':playid,'after_playid':after_playid},dataType:'json',success:function(data){if(data.error){this.error(data.error);return;}
controls.update_playlist_info(data);},error:function(errorMsg){controls.error(String(errorMsg));}});}};function fileQueued(file){try{var progress=new FileProgress(file,this.customSettings.progressTarget);progress.setStatus("Pending...");progress.toggleCancel(true,this);}catch(ex){this.debug(ex);}}
function fileQueueError(file,errorCode,message){try{if(errorCode===SWFUpload.QUEUE_ERROR.QUEUE_LIMIT_EXCEEDED){alert("You have attempted to queue too many files.\n"+
(message===0?"You have reached the upload limit.":"You may select "+(message>1?"up to "+message+" files.":"one file.")));return;}
var progress=new FileProgress(file,this.customSettings.progressTarget);progress.setError();progress.toggleCancel(false);switch(errorCode){case SWFUpload.QUEUE_ERROR.FILE_EXCEEDS_SIZE_LIMIT:progress.setStatus("File is too big.");this.debug("Error Code: File too big, File name: "+file.name+", File size: "+file.size+", Message: "+message);break;case SWFUpload.QUEUE_ERROR.ZERO_BYTE_FILE:progress.setStatus("Cannot upload Zero Byte files.");this.debug("Error Code: Zero byte file, File name: "+file.name+", File size: "+file.size+", Message: "+message);break;case SWFUpload.QUEUE_ERROR.INVALID_FILETYPE:progress.setStatus("Invalid File Type.");this.debug("Error Code: Invalid File Type, File name: "+file.name+", File size: "+file.size+", Message: "+message);break;default:if(file!==null){progress.setStatus("Unhandled Error");}
this.debug("Error Code: "+errorCode+", File name: "+file.name+", File size: "+file.size+", Message: "+message);break;}}catch(ex){this.debug(ex);}}
function fileDialogComplete(numFilesSelected,numFilesQueued){try{if(numFilesSelected>0){}
this.startUpload();}catch(ex){this.debug(ex);}}
function uploadStart(file){try{var progress=new FileProgress(file,this.customSettings.progressTarget);progress.setStatus("Uploading...");progress.toggleCancel(true,this);}
catch(ex){}
return true;}
function uploadProgress(file,bytesLoaded,bytesTotal){try{}catch(ex){this.debug(ex);}}
function uploadSuccess(file,serverData){try{var progress=new FileProgress(file,this.customSettings.progressTarget);progress.setComplete();progress.setStatus("Complete.");progress.toggleCancel(false);songlist.insert_row("<tr>"+serverData+"</tr>");}catch(ex){this.debug(ex);}}
function uploadError(file,errorCode,message){try{var progress=new FileProgress(file,this.customSettings.progressTarget);progress.setError();progress.toggleCancel(false);switch(errorCode){case SWFUpload.UPLOAD_ERROR.HTTP_ERROR:progress.setStatus("Upload Error: "+message);this.debug("Error Code: HTTP Error, File name: "+file.name+", Message: "+message);break;case SWFUpload.UPLOAD_ERROR.UPLOAD_FAILED:progress.setStatus("Upload Failed.");this.debug("Error Code: Upload Failed, File name: "+file.name+", File size: "+file.size+", Message: "+message);break;case SWFUpload.UPLOAD_ERROR.IO_ERROR:progress.setStatus("Server (IO) Error");this.debug("Error Code: IO Error, File name: "+file.name+", Message: "+message);break;case SWFUpload.UPLOAD_ERROR.SECURITY_ERROR:progress.setStatus("Security Error");this.debug("Error Code: Security Error, File name: "+file.name+", Message: "+message);break;case SWFUpload.UPLOAD_ERROR.UPLOAD_LIMIT_EXCEEDED:progress.setStatus("Upload limit exceeded.");this.debug("Error Code: Upload Limit Exceeded, File name: "+file.name+", File size: "+file.size+", Message: "+message);break;case SWFUpload.UPLOAD_ERROR.FILE_VALIDATION_FAILED:progress.setStatus("Failed Validation.  Upload skipped.");this.debug("Error Code: File Validation Failed, File name: "+file.name+", File size: "+file.size+", Message: "+message);break;case SWFUpload.UPLOAD_ERROR.FILE_CANCELLED:if(this.getStats().files_queued===0){}
progress.setStatus("Cancelled");progress.setCancelled();break;case SWFUpload.UPLOAD_ERROR.UPLOAD_STOPPED:progress.setStatus("Stopped");break;default:progress.setStatus("Unhandled Error: "+errorCode);this.debug("Error Code: "+errorCode+", File name: "+file.name+", File size: "+file.size+", Message: "+message);break;}}catch(ex){this.debug(ex);}}
function uploadComplete(file){if(this.getStats().files_queued===0){}}
function queueComplete(numFilesUploaded){var status=document.getElementById("divStatus");status.innerHTML=numFilesUploaded+" file"+(numFilesUploaded===1?"":"s")+" uploaded.";}
function FileProgress(file,targetID){this.fileProgressID=file.id;this.opacity=100;this.height=0;this.progressRow=document.getElementById(this.fileProgressID);if(!this.progressRow){this.progressRow=document.createElement("tr");this.progressRow.className="progressWrapper";this.progressRow.id=this.fileProgressID;var numColumns=$('#songlist thead th').size();this.progressCell=document.createElement("td");this.progressCell.className="progressContainer";this.progressCell.setAttribute('colspan',numColumns);var $progressCancel=$('<a class="progressCancel" href="#">Cancel</a>');$progressCancel.css('visibility','hidden');var $progressText=$('<span class="progressName"></span>');$progressText.text(file.name);var $progressBar=$('<span class="progressBarInProgress"></span>');var $progressStatus=$('<span class="progressBarStatus">&nbsp;</span>');this.progressCell.appendChild($progressCancel.get(0));this.progressCell.appendChild($progressText.get(0));this.progressCell.appendChild($progressStatus.get(0));this.progressCell.appendChild($progressBar.get(0));this.progressRow.appendChild(this.progressCell);var tbody=jQuery('#songlist tbody').get(0);tbody.appendChild(this.progressRow);}else{this.progressCell=this.progressRow.firstChild;}
this.height=this.progressRow.offsetHeight;}
FileProgress.prototype.setProgress=function(percentage){this.progressCell.className="progressContainer green";this.progressCell.childNodes[2].className="progressBarInProgress";this.progressCell.childNodes[2].style.width=percentage+"%";};FileProgress.prototype.setComplete=function(){this.progressCell.className="progressContainer blue";this.progressCell.childNodes[2].className="progressBarComplete";this.progressCell.childNodes[2].style.width="";var oSelf=this;oSelf.disappear();};FileProgress.prototype.setError=function(){this.progressCell.className="progressContainer red";this.progressCell.childNodes[2].className="progressBarError";this.progressCell.childNodes[2].style.width="";var oSelf=this;setTimeout(function(){oSelf.disappear();},5000);};FileProgress.prototype.setCancelled=function(){this.progressCell.className="progressContainer";this.progressCell.childNodes[2].className="progressBarError";this.progressCell.childNodes[2].style.width="";var oSelf=this;setTimeout(function(){oSelf.disappear();},2000);};FileProgress.prototype.setStatus=function(status){this.progressCell.childNodes[2].innerHTML=status;};FileProgress.prototype.toggleCancel=function(show,swfUploadInstance){this.progressCell.childNodes[0].style.visibility=show?"visible":"hidden";if(swfUploadInstance){var fileID=this.fileProgressID;this.progressCell.childNodes[0].onclick=function(){swfUploadInstance.cancelUpload(fileID);return false;};}};FileProgress.prototype.disappear=function(){jQuery(this.progressRow).hide();return;var reduceOpacityBy=15;var reduceHeightBy=4;var rate=30;if(this.opacity>0){this.opacity-=reduceOpacityBy;if(this.opacity<0){this.opacity=0;}
if(this.progressRow.filters){try{this.progressRow.filters.item("DXImageTransform.Microsoft.Alpha").opacity=this.opacity;}catch(e){this.progressRow.style.filter="progid:DXImageTransform.Microsoft.Alpha(opacity="+this.opacity+")";}}else{this.progressRow.style.opacity=this.opacity/100;}}
if(this.height>0){this.height-=reduceHeightBy;if(this.height<0){this.height=0;}
this.progressRow.style.height=this.height+"px";}
if(this.height>0||this.opacity>0){var oSelf=this;setTimeout(function(){oSelf.disappear();},rate);}else{this.progressRow.style.display="none";}};filter={option:function(value,text){var node=document.createElement("option");node.value=value;node.appendChild(document.createTextNode(text));return node;},button:function(value,action){var node=document.createElement("input");node.type="button";node.value=value;node.setAttribute("onclick",action);return node;},kind_select:function(){var node=document.createElement("select");node.id="str";node.setAttribute("onchange","filter.change_kind(this);");node.appendChild(filter.option("title","Song title"));node.appendChild(filter.option("album","Album name"));node.appendChild(filter.option("artist","Artist name"));node.appendChild(filter.option("track","Track number"));node.appendChild(filter.option("time","Song duration"));node.appendChild(filter.option("date_added","Date added"));node.appendChild(filter.option("last_played","Last played"));node.appendChild(filter.option("play_count","Play Count"));node.appendChild(filter.option("skip_count","Skip Count"));node.appendChild(filter.option("and","Satisfies all"));node.appendChild(filter.option("nand","Doesn't satisfy all"));node.appendChild(filter.option("or","Satisfies any"));node.appendChild(filter.option("nor","Doesn't satisfy any"));return node;},rule_select:function(cat){var node=document.createElement("select");node.setAttribute("onchange","filter.change_rule(this);");if(cat=="str"){node.id="str";node.appendChild(filter.option("in","contains"));node.appendChild(filter.option("notin","doesn't contain"));node.appendChild(filter.option("start","starts with"));node.appendChild(filter.option("notstart","doesn't start with"));node.appendChild(filter.option("end","ends with"));node.appendChild(filter.option("notend","doesn't end with"));node.appendChild(filter.option("is","is"));node.appendChild(filter.option("notis","is not"));}else if(cat=="int"){node.id="range";node.appendChild(filter.option("inside","is within range"));node.appendChild(filter.option("outside","is outside range"));node.appendChild(filter.option("lte","is at most"));node.appendChild(filter.option("gte","is at least"));node.appendChild(filter.option("is","is"));node.appendChild(filter.option("notis","is not"));}else if(cat=="date"){node.id="range";node.appendChild(filter.option("inside","is within range"));node.appendChild(filter.option("outside","is outside range"));node.appendChild(filter.option("before","is before"));node.appendChild(filter.option("after","is after"));node.appendChild(filter.option("last","is in the last"));node.appendChild(filter.option("nolast","is not in the last"));}
return node;},change_kind:function(select){var option=select.childNodes[select.selectedIndex];var newcat=filter.category(option.value);var oldcat=select.id;if(oldcat==newcat)return;var listitem=select.parentNode;listitem.removeChild(select.nextSibling);listitem.removeChild(select.nextSibling);if(newcat=="bool"){var btn=filter.button("+","filter.add_rule(this);")
listitem.appendChild(btn);listitem.appendChild(document.createElement("ul"));filter.add_rule(btn);}else{var rulesel=filter.rule_select(newcat);listitem.appendChild(rulesel);var rule=rulesel.firstChild.value;listitem.appendChild(filter.field_span(filter.auspice(newcat,rule)));}
select.id=newcat;},change_rule:function(select){var cat=select.previousSibling.id;var option=select.childNodes[select.selectedIndex];var newausp=filter.auspice(cat,option.value);var oldausp=select.id;if(oldausp==newausp)return;var listitem=select.parentNode;listitem.removeChild(select.nextSibling);listitem.appendChild(filter.field_span(newausp));select.id=newausp;},textbox:function(size){var node=document.createElement("input");node.type="text";node.size=size;return node;},field_span:function(ausp){var span=document.createElement("span");span.className="field";if(ausp=="str"){span.appendChild(filter.textbox("30"));}else if(ausp=="one"){span.appendChild(filter.textbox("14"));}else if(ausp=="range"){span.appendChild(filter.textbox("14"));span.appendChild(filter.textbox("14"));}else if(ausp=="udate"){span.appendChild(filter.textbox("5"));var select=document.createElement("select");select.appendChild(filter.option("hour","hours"));select.appendChild(filter.option("day","days"));select.appendChild(filter.option("week","weeks"));select.appendChild(filter.option("month","months"));select.appendChild(filter.option("year","years"));span.appendChild(select);}
return span;},category:function(kind){if(kind=="title"||kind=="album"||kind=="artist"){return"str";}else if(kind=="time"||kind=="track"||kind=="play_count"||kind=="skip_count"){return"int";}else if(kind=="date_added"||kind=="last_played"){return"date";}else if(kind=="and"||kind=="or"||kind=="nand"||kind=="nor"){return"bool";}else return"nix";},auspice:function(cat,rule){if(cat=="str"){return"str";}else if(cat=="int"){if(rule=="is"||rule=="notis"||rule=="lte"||rule=="gte"){return"one";}else if(rule=="inside"||rule=="outside"){return"range";}}else if(cat=="date"){if(rule=="before"||rule=="after")return"one";else if(rule=="inside"||rule=="outside")return"range";else if(rule=="last"||rule=="nolast")return"udate"}
return"nix";},criterion:function(){var listitem=document.createElement("li");listitem.appendChild(filter.button("\u2212","filter.removeFilter(this);"));listitem.appendChild(filter.kind_select());listitem.appendChild(filter.rule_select("str"));listitem.appendChild(filter.field_span("str"));return listitem;},removeFilter:function(button){var listitem=button.parentNode;listitem.parentNode.removeChild(listitem);},add_rule:function(button){button.nextSibling.appendChild(filter.criterion());},subgather:function(item,prefix){var kindsel=item.firstChild.nextSibling;kindsel.name=prefix;if(kindsel.id=="bool"){prefix+="_"
var kids=kindsel.nextSibling.nextSibling.childNodes;for(var i=0;i<kids.length;i++){filter.subgather(kids[i],prefix+i);}}else{var rulesel=kindsel.nextSibling;rulesel.name=prefix+"_r";prefix+="_f"
var flds=rulesel.nextSibling.childNodes;for(var i=0;i<flds.length;i++){flds[i].name=prefix+i;}}},gather:function(){filter.subgather(document.getElementById("root"),"k");}}
var playlist={id:null,allow_edit:false,save:function(){if(!playlist.id||!playlist.allow_edit)return;songlist.update_songlist('/audio/playlists/edit/'+playlist.id+'/');},remove:function(){var ids=songlist.gather_ids(true);if(ids.length>0){document.forms.removeform.ids.value=ids;document.forms.removeform.submit();}},askdel:function(){with(songlist){start_subaction();add_subaction_label("Um, are you sure about that?");add_subaction_button("ok","playlist.okdel();","Delete it!");add_subaction_cancel_button();}},okdel:function(){songlist.end_subaction();document.forms.playlistdeleteform.submit();}};$(document).ready(function(){songlist.initialize_triangles();songlist.initialize_colpicker();songlist.initialize_favorites();songlist.initialize_hotkeys();});var songlist={start_subaction:function(){songlist.end_subaction();jQuery("#actions").hide();},end_subaction:function(){jQuery("#actions").show();jQuery("#subactions").empty();},cancel:function(){songlist.end_subaction();},add_subaction_item:function(item){jQuery("#subactions").append(item);},add_subaction_span:function(item){var span=document.createElement("span");span.appendChild(item);songlist.add_subaction_item(span);},add_subaction_label:function(text){var label=document.createElement("span");label.appendChild(document.createTextNode(text));songlist.add_subaction_item(label);},add_subaction_textbox:function(ID,value,opt_callback){var box=document.createElement("input");box.type="text";box.size=30;box.id=ID;box.value=value;songlist.add_subaction_span(box);if(opt_callback){jQuery(box).keyup(function(evt){if(evt.keyCode==13){opt_callback();}});}},add_subaction_button:function(klass,action,text){var sprite=$('<div/>');sprite.addClass('aenclave-sprites aenclave-sprites-'+klass+'-png');sprite.html('&nbsp;');var button=$('<a/>');button.attr('href','javascript:'+action);button.text(text);button.prepend(sprite);songlist.add_subaction_item(button);},add_subaction_cancel_button:function(){songlist.add_subaction_button("cancel","songlist.cancel();","Cancel");},success_message:function(text){songlist.start_subaction();songlist.add_subaction_label(text);songlist.add_subaction_button("ok","songlist.end_subaction();","Yay!");},error_message:function(text){songlist.start_subaction();songlist.add_subaction_label(text);songlist.add_subaction_button("cancel","songlist.cancel();","Phooey!");},select_all:function(box){jQuery("#songlist input").attr('checked',!!box.checked);},random_int:function(n){return Math.floor(Math.random()*n);},E_SAMPLE_SIZE_TOO_LARGE:"sample size greater than pop size",random_sample:function(population,k){var results=[];var selected=[];var pop_size=population.length;if(k>pop_size){throw songlist.E_SAMPLE_SIZE_TOO_LARGE;}
for(var i=0;i<k;i++){j=songlist.random_int(pop_size);while(selected[j]){j=songlist.random_int(pop_size);}
selected[j]=true;results.push(population[j]);}
return results;},start_enter_sample:function(){with(songlist){start_subaction();var label=$('<span id="sample_size_label">Enter sample size:</span>');add_subaction_item(label);add_subaction_textbox('sample_size','',songlist.end_enter_sample);add_subaction_button('ok','songlist.end_enter_sample();','Go');add_subaction_cancel_button();}},end_enter_sample:function(){var k_str=$('#sample_size').val();var k=parseInt(k_str,10);var label=$('#sample_size_label');if(isNaN(k)){label.text('Sample size was not an integer:');}else{try{songlist.select_random(k);}catch(e){if(e===songlist.E_SAMPLE_SIZE_TOO_LARGE){label.text('Sample size too large:');return;}else{throw e;}}
songlist.end_subaction();}},select_random:function(k){if(!k){var k_str=$('#select_sample_size').val();k=parseInt(k_str,10);if(isNaN(k)){songlist.start_enter_sample();}}
var all_songs=$('#songlist .song_selected');all_songs.attr('checked',false);var songs_sample=songlist.random_sample($.makeArray(all_songs),k);$(songs_sample).attr('checked','checked');},gather_ids:function(empty){function get_names(boxen){return jQuery.makeArray(boxen.map(function(i,box){return box.name;}));}
var names=get_names(jQuery('#songlist .song_selected:checked'));if(!empty&&names.length==0){return get_names(jQuery("#songlist .song_selected")).join(' ');}
return names.join(' ');},gather_indices:function(){var selected=[];jQuery("#songlist .song_selected").each(function(i){if(this.checked)selected.push(i);});return selected.join(' ');},gather_playids:function(){var boxen=jQuery("#songlist .song_selected:checked");return jQuery.makeArray(boxen.map(function(i,box){return box.getAttribute('playid');})).join(' ');},queue_click:function(link){var para=document.createElement('p');var control_div=jQuery('#controls').get(0);control_div.appendChild(para);para.innerHTML='queueing...';link.style.cursor='wait';para.style.cursor='wait';var options={type:'post',dataType:'json',url:link.href+"&getupdate=1",error:function(transport){para.innerHTML='failed to queue.';},success:function(response_json){if(response_json.error){para.innerHTML='failed to queue.';}else{para.innerHTML='queued successfully.';controls.update_playlist_info(response_json);}},complete:function(transport){link.style.cursor='';para.style.cursor='';window.setTimeout(function(){control_div.removeChild(para);},3000);}};jQuery.ajax(options);return false;},queue:function(){var ids=songlist.gather_ids(true);if(ids.length>0){document.forms.queueform.ids.value=ids;document.forms.queueform.submit();}else{songlist.error_message("You haven't selected any songs.");}},dl:function(){var ids=songlist.gather_ids(true);if(ids.length>0){document.forms.dlform.ids.value=ids;document.forms.dlform.submit();}else{songlist.error_message("You haven't selected any songs.");}},askcreate:function(){with(songlist){start_subaction();add_subaction_label("Put songs into a playlist called:");add_subaction_textbox("playlistname","Rockin' Out",songlist.okcreate);add_subaction_button("ok","songlist.okcreate();","Create playlist");add_subaction_cancel_button();}},okcreate:function(){var name=document.getElementById("playlistname").value;document.forms.createform.name.value=name;document.forms.createform.ids.value=songlist.gather_ids(false);songlist.end_subaction();document.forms.createform.submit();},askdelete:function(){with(songlist){start_subaction();add_subaction_label("Submit a delete request for the selected songs?");add_subaction_button("ok","songlist.okdelete();","Yes");add_subaction_cancel_button();}},delete_:function(){with(songlist){start_subaction();add_subaction_label("Really DELETE the selected songs?");add_subaction_button("ok","songlist.okdelete();","Yes, those tunes suck!");add_subaction_cancel_button();}},okdelete:function(){document.forms.deleteform.ids.value=songlist.gather_ids(false);songlist.end_subaction();document.forms.deleteform.submit();},askadd:function(){jQuery.ajax({url:"/audio/json/playlists/user/",type:'GET',dataType:'json',success:function(json){if("error"in json){songlist.error_message(json.error);}else{songlist._make_askadd_tray(json);}},error:function(){songlist.error_message("Got no reponse from server.");}});},_make_askadd_tray:function(json){var select=document.createElement("select");select.id="playlistid"
for(var i=0;i<json.length;i++){var item=json[i];var option=document.createElement("option");option.value=item.pid;option.appendChild(document.createTextNode(item.name));select.appendChild(option);}
if(select.childNodes.length>0){with(songlist){start_subaction();add_subaction_label("Add songs to playlist:");add_subaction_span(select);add_subaction_button("ok","songlist.okadd();","Add songs");add_subaction_cancel_button();}}else songlist.error_message("No playlists exist that you may edit.");},okadd:function(){var select=document.getElementById("playlistid");var addform=document.forms.addform;addform.pid.value=select.value;addform.ids.value=songlist.gather_ids(false);songlist.end_subaction();addform.submit();},report_bad_recs:function(){var ids=songlist.gather_ids(true);var options={type:'post',dataType:'json',url:"/audio/recommendations/feedback/",data:{original_songs:songlist.original_songs,bad_songs:ids},error:function(transport){alert("Error while reporting bad recommendations.");},success:function(response_json){jQuery('#songlist .song_selected:checked').closest('tr').remove();tablesort.recolor_rows();jQuery('#feedback_msg').text("Thank you for your feedback!");setTimeout(function(){jQuery('#feedback_msg').html("&nbsp;")},3000);}};jQuery.ajax(options);},enable_dnd:function(opt_onDrop){jQuery('#songlist tr.c .drag').removeClass('drag');jQuery('#songlist').tableDnD({onDrop:function(table,row){tablesort.recolor_rows();if(opt_onDrop){opt_onDrop(table,row);}},dragHandle:'drag'});},update_songlist:function(url){var song_ids=[];var boxen=jQuery('#songlist input');for(var i=0;i<boxen.length;i++){if(boxen[i].type=='checkbox'&&boxen[i].name){song_ids.push(boxen[i].name);}}
var data={ids:song_ids.join(' ')};jQuery.post(url,data,function(json,statusText){if(statusText=='success'){if(json.success){}else if(json.error){songlist.error_message(json.error);}else{songlist.error_message("Malformed server response.");}}else{songlist.error_message("Error reaching the server.");}},'json');},_edit_column_done:function(target){var oldClasses="aenclave-sprites-edit-png aenclave-sprites-cancel-png";var doneClass="aenclave-sprites-ok-png";$(".aenclave-sprites",target).removeClass(oldClasses).addClass(doneClass);target.each(function(){this.onclick=function(){songlist.done_editing(this);}});},_edit_column_edit:function(target){var oldClasses="aenclave-sprites-ok-png aenclave-sprites-cancel-png";var newClass="aenclave-sprites-edit-png";$(".aenclave-sprites",target).removeClass(oldClasses).addClass(newClass);target.each(function(){this.onclick=function(){songlist.edit_song(this);}});},_edit_column_error:function(target){var oldClasses="aenclave-sprites-ok-png aenclave-sprites-edit-png";var newClass="aenclave-sprites-cancel-png";$(".aenclave-sprites",target).removeClass(oldClasses).addClass(newClass);target.each(function(){this.onclick=function(){}});},edit_song:function(target){target=jQuery(target);target.parent('tr:first').children('.editable').each(function(){var cell=jQuery(this);var input=jQuery(document.createElement("input"));if(cell.hasClass("track")){input.attr("size","2");}
input.attr("type","text");input.attr("value",cell.text().strip());input.addClass("text");input.keypress(function(e){if(e.keyCode==13)songlist.done_editing(target);});cell.empty().append(input);});songlist._edit_column_done(target);},done_editing:function(target){target=jQuery(target);var parent=target.parent("tr:first");var songid=parent.children(".select").children(":first").attr('name');var params={id:songid};parent.children(".editable").each(function(){elt=jQuery(this);params[elt.attr('name')]=elt.children("input:first").attr('value');});var options={url:"/audio/json/edit/",type:'post',data:params,dataType:'json',success:function(json){if("error"in json){songlist.error_message(json.error);}else{songlist._update_edited_song(target,json);}},error:function(){songlist._edit_column_error(target);songlist.error_message("Got no reponse from server.");}};jQuery.ajax(options);},_update_edited_song:function(target,json){target=jQuery(target);songlist._edit_column_edit(target);jQuery(target).parent("TR:first").children(".editable").each(function(i){var elt=jQuery(this);var info=json[i];if(info.href){var link=jQuery(document.createElement("A"));if(info.klass)link.addClass(info.klass);link.attr('href',info.href);link.text(info.text);elt.empty().append(link);}else{elt.empty().text(info.text);}});},insert_row:function(row){jQuery('#songlist tbody').append(row);tablesort.recolor_rows();songlist.on_songlist_updated();},sort_column:function(sort_header,order){if(order=='asc'){tablesort.sorta(sort_header[0]);}else if(order=='desc'){tablesort.sortd(sort_header[0]);}},on_songlist_updated:function(){songlist.initialize_favorites();},initialize_favorites:function(){var hearts=$('.fav-heart:not(.fav-touched)');hearts.click(songlist.toggle_favorite);hearts.hover(function(){var heart=$(this);heart.attr('hovering','true');songlist.update_heart_sprite(heart);},function(){var heart=$(this);heart.attr('hovering','false');songlist.update_heart_sprite(heart);});hearts.addClass('fav-touched');},toggle_favorite:function(){var heart=$(this);var favorited=heart.attr('favorited')=='true'?'false':'true';heart.attr('favorited',favorited);heart.attr('hovering','false');songlist.update_heart_sprite(heart);var song_id=heart.attr('id').replace('fav-heart-','');$.post('/audio/json/favorite_song/'+song_id+'/',{favorited:favorited});},update_heart_sprite:function(heart){var pink='aenclave-sprites-heart-pink-png';var gray='aenclave-sprites-heart-gray-png';var red='aenclave-sprites-heart-png';var newClass;if(heart.attr('hovering')=='true'){newClass=pink;}else{if(heart.attr('favorited')=='true'){newClass=red;}else{newClass=gray;}}
heart.removeClass(pink+' '+gray+' '+red).addClass(newClass);},initialize_colpicker:function(){var allowToHide=['play-count','skip-count','last-played','date-added'];var visibleColumns=$.makeArray($('#songlist thead th').map(function(col){$th=$(this);for(var i=0;i<allowToHide.length;i++){if($th.hasClass(allowToHide[i])){return null;}}
return col+1;}));$('#songlist').columnManager({listTargetID:'col-list',onClass:'col-on',offClass:'col-off',onToggle:songlist.update_colmenu_sprites,saveState:true,hideInList:visibleColumns});$('#col-list li').prepend('<span class="aenclave-sprites">&nbsp;</span>');songlist.update_colmenu_sprites();$('#ul-select-col').clickMenu({onClick:function(){}});},update_colmenu_sprites:function(){var cols=$('#col-list');var cols_on=$('li.col-on .aenclave-sprites',cols);cols_on.removeClass('aenclave-sprites-cross-png');cols_on.addClass('aenclave-sprites-tick-png');var cols_on=$('li.col-off .aenclave-sprites',cols);cols_on.removeClass('aenclave-sprites-tick-png');cols_on.addClass('aenclave-sprites-cross-png');},show_triangle:function(triangle){triangle.addClass("tri_visible").css('visibility','');},hide_triangle:function(triangle){triangle.removeClass("tri_visible").css('visibility','hidden');},initialize_triangles:function(){songlist.show_triangle($($('.triangle').get(0)));},change_selection:function(direction){var triangle=$('.triangle.tri_visible');var tr=triangle.closest('tr');var next_tr;if(direction=='j'){next_tr=tr.next('tr');}else{next_tr=tr.prev('tr');}
var next_triangle=$('.triangle',next_tr);if(next_tr.size()!=0){songlist.hide_triangle(triangle);songlist.show_triangle(next_triangle);}},queue_selection:function(){var triangle=$('.triangle.tri_visible');var queue_link=$('a',triangle.closest('td').nextAll('.title'));queue_link.click();},initialize_hotkeys:function(){var options={'combi':'a','disableInInput':true};$(document).bind('keydown',{'combi':'a','disableInInput':true},function(){var box=$('#checkall').get(0);box.checked=!box.checked;songlist.select_all(box);return false;});$(document).bind('keydown',{'combi':'j','disableInInput':true},function(){songlist.change_selection('j');});$(document).bind('keydown',{'combi':'k','disableInInput':true},function(){songlist.change_selection('k');});$(document).bind('keydown',{'combi':'return','disableInInput':true},function(){songlist.queue_selection();});}};var SWFUpload;if(SWFUpload==undefined){SWFUpload=function(settings){this.initSWFUpload(settings);};}
SWFUpload.prototype.initSWFUpload=function(settings){try{this.customSettings={};this.settings=settings;this.eventQueue=[];this.movieName="SWFUpload_"+SWFUpload.movieCount++;this.movieElement=null;SWFUpload.instances[this.movieName]=this;this.initSettings();this.loadFlash();this.displayDebugInfo();}catch(ex){delete SWFUpload.instances[this.movieName];throw ex;}};SWFUpload.instances={};SWFUpload.movieCount=0;SWFUpload.version="2.2.0 Beta 2";SWFUpload.QUEUE_ERROR={QUEUE_LIMIT_EXCEEDED:-100,FILE_EXCEEDS_SIZE_LIMIT:-110,ZERO_BYTE_FILE:-120,INVALID_FILETYPE:-130};SWFUpload.UPLOAD_ERROR={HTTP_ERROR:-200,MISSING_UPLOAD_URL:-210,IO_ERROR:-220,SECURITY_ERROR:-230,UPLOAD_LIMIT_EXCEEDED:-240,UPLOAD_FAILED:-250,SPECIFIED_FILE_ID_NOT_FOUND:-260,FILE_VALIDATION_FAILED:-270,FILE_CANCELLED:-280,UPLOAD_STOPPED:-290};SWFUpload.FILE_STATUS={QUEUED:-1,IN_PROGRESS:-2,ERROR:-3,COMPLETE:-4,CANCELLED:-5};SWFUpload.BUTTON_ACTION={SELECT_FILE:-100,SELECT_FILES:-110,START_UPLOAD:-120};SWFUpload.CURSOR={ARROW:-1,HAND:-2};SWFUpload.WINDOW_MODE={WINDOW:"window",TRANSPARENT:"transparent",OPAQUE:"opaque"};SWFUpload.prototype.initSettings=function(){this.ensureDefault=function(settingName,defaultValue){this.settings[settingName]=(this.settings[settingName]==undefined)?defaultValue:this.settings[settingName];};this.ensureDefault("upload_url","");this.ensureDefault("file_post_name","Filedata");this.ensureDefault("post_params",{});this.ensureDefault("use_query_string",false);this.ensureDefault("requeue_on_error",false);this.ensureDefault("http_success",[]);this.ensureDefault("file_types","*.*");this.ensureDefault("file_types_description","All Files");this.ensureDefault("file_size_limit",0);this.ensureDefault("file_upload_limit",0);this.ensureDefault("file_queue_limit",0);this.ensureDefault("flash_url","swfupload.swf");this.ensureDefault("prevent_swf_caching",true);this.ensureDefault("button_image_url","");this.ensureDefault("button_width",1);this.ensureDefault("button_height",1);this.ensureDefault("button_text","");this.ensureDefault("button_text_style","color: #000000; font-size: 16pt;");this.ensureDefault("button_text_top_padding",0);this.ensureDefault("button_text_left_padding",0);this.ensureDefault("button_action",SWFUpload.BUTTON_ACTION.SELECT_FILES);this.ensureDefault("button_disabled",false);this.ensureDefault("button_placeholder_id",null);this.ensureDefault("button_cursor",SWFUpload.CURSOR.ARROW);this.ensureDefault("button_window_mode",SWFUpload.WINDOW_MODE.WINDOW);this.ensureDefault("debug",false);this.settings.debug_enabled=this.settings.debug;this.settings.return_upload_start_handler=this.returnUploadStart;this.ensureDefault("swfupload_loaded_handler",null);this.ensureDefault("file_dialog_start_handler",null);this.ensureDefault("file_queued_handler",null);this.ensureDefault("file_queue_error_handler",null);this.ensureDefault("file_dialog_complete_handler",null);this.ensureDefault("upload_start_handler",null);this.ensureDefault("upload_progress_handler",null);this.ensureDefault("upload_error_handler",null);this.ensureDefault("upload_success_handler",null);this.ensureDefault("upload_complete_handler",null);this.ensureDefault("debug_handler",this.debugMessage);this.ensureDefault("custom_settings",{});this.customSettings=this.settings.custom_settings;if(this.settings.prevent_swf_caching){this.settings.flash_url=this.settings.flash_url+"?swfuploadrnd="+Math.floor(Math.random()*999999999);}
delete this.ensureDefault;};SWFUpload.prototype.loadFlash=function(){if(this.settings.button_placeholder_id!==""){this.replaceWithFlash();}else{this.appendFlash();}};SWFUpload.prototype.appendFlash=function(){var targetElement,container;if(document.getElementById(this.movieName)!==null){throw"ID "+this.movieName+" is already in use. The Flash Object could not be added";}
targetElement=document.getElementsByTagName("body")[0];if(targetElement==undefined){throw"Could not find the 'body' element.";}
container=document.createElement("div");container.style.width="1px";container.style.height="1px";container.style.overflow="hidden";targetElement.appendChild(container);container.innerHTML=this.getFlashHTML();};SWFUpload.prototype.replaceWithFlash=function(){var targetElement,tempParent;if(document.getElementById(this.movieName)!==null){throw"ID "+this.movieName+" is already in use. The Flash Object could not be added";}
targetElement=document.getElementById(this.settings.button_placeholder_id);if(targetElement==undefined){throw"Could not find the placeholder element.";}
tempParent=document.createElement("div");tempParent.innerHTML=this.getFlashHTML();targetElement.parentNode.replaceChild(tempParent.firstChild,targetElement);};SWFUpload.prototype.getFlashHTML=function(){return['<object id="',this.movieName,'" type="application/x-shockwave-flash" data="',this.settings.flash_url,'" width="',this.settings.button_width,'" height="',this.settings.button_height,'" class="swfupload">','<param name="wmode" value="',this.settings.button_window_mode,'" />','<param name="movie" value="',this.settings.flash_url,'" />','<param name="quality" value="high" />','<param name="menu" value="false" />','<param name="allowScriptAccess" value="always" />','<param name="flashvars" value="'+this.getFlashVars()+'" />','</object>'].join("");};SWFUpload.prototype.getFlashVars=function(){var paramString=this.buildParamString();var httpSuccessString=this.settings.http_success.join(",");return["movieName=",encodeURIComponent(this.movieName),"&amp;uploadURL=",encodeURIComponent(this.settings.upload_url),"&amp;useQueryString=",encodeURIComponent(this.settings.use_query_string),"&amp;requeueOnError=",encodeURIComponent(this.settings.requeue_on_error),"&amp;httpSuccess=",encodeURIComponent(httpSuccessString),"&amp;params=",encodeURIComponent(paramString),"&amp;filePostName=",encodeURIComponent(this.settings.file_post_name),"&amp;fileTypes=",encodeURIComponent(this.settings.file_types),"&amp;fileTypesDescription=",encodeURIComponent(this.settings.file_types_description),"&amp;fileSizeLimit=",encodeURIComponent(this.settings.file_size_limit),"&amp;fileUploadLimit=",encodeURIComponent(this.settings.file_upload_limit),"&amp;fileQueueLimit=",encodeURIComponent(this.settings.file_queue_limit),"&amp;debugEnabled=",encodeURIComponent(this.settings.debug_enabled),"&amp;buttonImageURL=",encodeURIComponent(this.settings.button_image_url),"&amp;buttonWidth=",encodeURIComponent(this.settings.button_width),"&amp;buttonHeight=",encodeURIComponent(this.settings.button_height),"&amp;buttonText=",encodeURIComponent(this.settings.button_text),"&amp;buttonTextTopPadding=",encodeURIComponent(this.settings.button_text_top_padding),"&amp;buttonTextLeftPadding=",encodeURIComponent(this.settings.button_text_left_padding),"&amp;buttonTextStyle=",encodeURIComponent(this.settings.button_text_style),"&amp;buttonAction=",encodeURIComponent(this.settings.button_action),"&amp;buttonDisabled=",encodeURIComponent(this.settings.button_disabled),"&amp;buttonCursor=",encodeURIComponent(this.settings.button_cursor)].join("");};SWFUpload.prototype.getMovieElement=function(){if(this.movieElement==undefined){this.movieElement=document.getElementById(this.movieName);}
if(this.movieElement===null){throw"Could not find Flash element";}
return this.movieElement;};SWFUpload.prototype.buildParamString=function(){var postParams=this.settings.post_params;var paramStringPairs=[];if(typeof(postParams)==="object"){for(var name in postParams){if(postParams.hasOwnProperty(name)){paramStringPairs.push(encodeURIComponent(name.toString())+"="+encodeURIComponent(postParams[name].toString()));}}}
return paramStringPairs.join("&amp;");};SWFUpload.prototype.destroy=function(){try{this.stopUpload();var movieElement=null;try{movieElement=this.getMovieElement();}catch(ex){}
if(movieElement!=undefined&&movieElement.parentNode!=undefined&&typeof movieElement.parentNode.removeChild==="function"){var container=movieElement.parentNode;if(container!=undefined){container.removeChild(movieElement);if(container.parentNode!=undefined&&typeof container.parentNode.removeChild==="function"){container.parentNode.removeChild(container);}}}
SWFUpload.instances[this.movieName]=null;delete SWFUpload.instances[this.movieName];delete this.movieElement;delete this.settings;delete this.customSettings;delete this.eventQueue;delete this.movieName;delete window[this.movieName];return true;}catch(ex1){return false;}};SWFUpload.prototype.displayDebugInfo=function(){this.debug(["---SWFUpload Instance Info---\n","Version: ",SWFUpload.version,"\n","Movie Name: ",this.movieName,"\n","Settings:\n","\t","upload_url:               ",this.settings.upload_url,"\n","\t","flash_url:                ",this.settings.flash_url,"\n","\t","use_query_string:         ",this.settings.use_query_string.toString(),"\n","\t","requeue_on_error:         ",this.settings.requeue_on_error.toString(),"\n","\t","http_success:             ",this.settings.http_success.join(", "),"\n","\t","file_post_name:           ",this.settings.file_post_name,"\n","\t","post_params:              ",this.settings.post_params.toString(),"\n","\t","file_types:               ",this.settings.file_types,"\n","\t","file_types_description:   ",this.settings.file_types_description,"\n","\t","file_size_limit:          ",this.settings.file_size_limit,"\n","\t","file_upload_limit:        ",this.settings.file_upload_limit,"\n","\t","file_queue_limit:         ",this.settings.file_queue_limit,"\n","\t","debug:                    ",this.settings.debug.toString(),"\n","\t","prevent_swf_caching:      ",this.settings.prevent_swf_caching.toString(),"\n","\t","button_placeholder_id:    ",this.settings.button_placeholder_id.toString(),"\n","\t","button_image_url:         ",this.settings.button_image_url.toString(),"\n","\t","button_width:             ",this.settings.button_width.toString(),"\n","\t","button_height:            ",this.settings.button_height.toString(),"\n","\t","button_text:              ",this.settings.button_text.toString(),"\n","\t","button_text_style:        ",this.settings.button_text_style.toString(),"\n","\t","button_text_top_padding:  ",this.settings.button_text_top_padding.toString(),"\n","\t","button_text_left_padding: ",this.settings.button_text_left_padding.toString(),"\n","\t","button_action:            ",this.settings.button_action.toString(),"\n","\t","button_disabled:          ",this.settings.button_disabled.toString(),"\n","\t","custom_settings:          ",this.settings.custom_settings.toString(),"\n","Event Handlers:\n","\t","swfupload_loaded_handler assigned:  ",(typeof this.settings.swfupload_loaded_handler==="function").toString(),"\n","\t","file_dialog_start_handler assigned: ",(typeof this.settings.file_dialog_start_handler==="function").toString(),"\n","\t","file_queued_handler assigned:       ",(typeof this.settings.file_queued_handler==="function").toString(),"\n","\t","file_queue_error_handler assigned:  ",(typeof this.settings.file_queue_error_handler==="function").toString(),"\n","\t","upload_start_handler assigned:      ",(typeof this.settings.upload_start_handler==="function").toString(),"\n","\t","upload_progress_handler assigned:   ",(typeof this.settings.upload_progress_handler==="function").toString(),"\n","\t","upload_error_handler assigned:      ",(typeof this.settings.upload_error_handler==="function").toString(),"\n","\t","upload_success_handler assigned:    ",(typeof this.settings.upload_success_handler==="function").toString(),"\n","\t","upload_complete_handler assigned:   ",(typeof this.settings.upload_complete_handler==="function").toString(),"\n","\t","debug_handler assigned:             ",(typeof this.settings.debug_handler==="function").toString(),"\n"].join(""));};SWFUpload.prototype.addSetting=function(name,value,default_value){if(value==undefined){return(this.settings[name]=default_value);}else{return(this.settings[name]=value);}};SWFUpload.prototype.getSetting=function(name){if(this.settings[name]!=undefined){return this.settings[name];}
return"";};SWFUpload.prototype.callFlash=function(functionName,argumentArray){argumentArray=argumentArray||[];var movieElement=this.getMovieElement();var returnValue;if(typeof movieElement[functionName]==="function"){if(argumentArray.length===0){returnValue=movieElement[functionName]();}else if(argumentArray.length===1){returnValue=movieElement[functionName](argumentArray[0]);}else if(argumentArray.length===2){returnValue=movieElement[functionName](argumentArray[0],argumentArray[1]);}else if(argumentArray.length===3){returnValue=movieElement[functionName](argumentArray[0],argumentArray[1],argumentArray[2]);}else{throw"Too many arguments";}
if(returnValue!=undefined&&typeof returnValue.post==="object"){returnValue=this.unescapeFilePostParams(returnValue);}
return returnValue;}else{throw"Invalid function name: "+functionName;}};SWFUpload.prototype.selectFile=function(){this.callFlash("SelectFile");};SWFUpload.prototype.selectFiles=function(){this.callFlash("SelectFiles");};SWFUpload.prototype.startUpload=function(fileID){this.callFlash("StartUpload",[fileID]);};SWFUpload.prototype.cancelUpload=function(fileID,triggerErrorEvent){if(triggerErrorEvent!==false){triggerErrorEvent=true;}
this.callFlash("CancelUpload",[fileID,triggerErrorEvent]);};SWFUpload.prototype.stopUpload=function(){this.callFlash("StopUpload");};SWFUpload.prototype.getStats=function(){return this.callFlash("GetStats");};SWFUpload.prototype.setStats=function(statsObject){this.callFlash("SetStats",[statsObject]);};SWFUpload.prototype.getFile=function(fileID){if(typeof(fileID)==="number"){return this.callFlash("GetFileByIndex",[fileID]);}else{return this.callFlash("GetFile",[fileID]);}};SWFUpload.prototype.addFileParam=function(fileID,name,value){return this.callFlash("AddFileParam",[fileID,name,value]);};SWFUpload.prototype.removeFileParam=function(fileID,name){this.callFlash("RemoveFileParam",[fileID,name]);};SWFUpload.prototype.setUploadURL=function(url){this.settings.upload_url=url.toString();this.callFlash("SetUploadURL",[url]);};SWFUpload.prototype.setPostParams=function(paramsObject){this.settings.post_params=paramsObject;this.callFlash("SetPostParams",[paramsObject]);};SWFUpload.prototype.addPostParam=function(name,value){this.settings.post_params[name]=value;this.callFlash("SetPostParams",[this.settings.post_params]);};SWFUpload.prototype.removePostParam=function(name){delete this.settings.post_params[name];this.callFlash("SetPostParams",[this.settings.post_params]);};SWFUpload.prototype.setFileTypes=function(types,description){this.settings.file_types=types;this.settings.file_types_description=description;this.callFlash("SetFileTypes",[types,description]);};SWFUpload.prototype.setFileSizeLimit=function(fileSizeLimit){this.settings.file_size_limit=fileSizeLimit;this.callFlash("SetFileSizeLimit",[fileSizeLimit]);};SWFUpload.prototype.setFileUploadLimit=function(fileUploadLimit){this.settings.file_upload_limit=fileUploadLimit;this.callFlash("SetFileUploadLimit",[fileUploadLimit]);};SWFUpload.prototype.setFileQueueLimit=function(fileQueueLimit){this.settings.file_queue_limit=fileQueueLimit;this.callFlash("SetFileQueueLimit",[fileQueueLimit]);};SWFUpload.prototype.setFilePostName=function(filePostName){this.settings.file_post_name=filePostName;this.callFlash("SetFilePostName",[filePostName]);};SWFUpload.prototype.setUseQueryString=function(useQueryString){this.settings.use_query_string=useQueryString;this.callFlash("SetUseQueryString",[useQueryString]);};SWFUpload.prototype.setRequeueOnError=function(requeueOnError){this.settings.requeue_on_error=requeueOnError;this.callFlash("SetRequeueOnError",[requeueOnError]);};SWFUpload.prototype.setHTTPSuccess=function(http_status_codes){if(typeof http_status_codes==="string"){http_status_codes=http_status_codes.replace(" ","").split(",");}
this.settings.http_success=http_status_codes;this.callFlash("SetHTTPSuccess",[http_status_codes]);};SWFUpload.prototype.setDebugEnabled=function(debugEnabled){this.settings.debug_enabled=debugEnabled;this.callFlash("SetDebugEnabled",[debugEnabled]);};SWFUpload.prototype.setButtonImageURL=function(buttonImageURL){if(buttonImageURL==undefined){buttonImageURL="";}
this.settings.button_image_url=buttonImageURL;this.callFlash("SetButtonImageURL",[buttonImageURL]);};SWFUpload.prototype.setButtonDimensions=function(width,height){this.settings.button_width=width;this.settings.button_height=height;var movie=this.getMovieElement();if(movie!=undefined){movie.style.width=width+"px";movie.style.height=height+"px";}
this.callFlash("SetButtonDimensions",[width,height]);};SWFUpload.prototype.setButtonText=function(html){this.settings.button_text=html;this.callFlash("SetButtonText",[html]);};SWFUpload.prototype.setButtonTextPadding=function(left,top){this.settings.button_text_top_padding=top;this.settings.button_text_left_padding=left;this.callFlash("SetButtonTextPadding",[left,top]);};SWFUpload.prototype.setButtonTextStyle=function(css){this.settings.button_text_style=css;this.callFlash("SetButtonTextStyle",[css]);};SWFUpload.prototype.setButtonDisabled=function(isDisabled){this.settings.button_disabled=isDisabled;this.callFlash("SetButtonDisabled",[isDisabled]);};SWFUpload.prototype.setButtonAction=function(buttonAction){this.settings.button_action=buttonAction;this.callFlash("SetButtonAction",[buttonAction]);};SWFUpload.prototype.setButtonCursor=function(cursor){this.settings.button_cursor=cursor;this.callFlash("SetButtonCursor",[cursor]);};SWFUpload.prototype.queueEvent=function(handlerName,argumentArray){if(argumentArray==undefined){argumentArray=[];}else if(!(argumentArray instanceof Array)){argumentArray=[argumentArray];}
var self=this;if(typeof this.settings[handlerName]==="function"){this.eventQueue.push(function(){this.settings[handlerName].apply(this,argumentArray);});setTimeout(function(){self.executeNextEvent();},0);}else if(this.settings[handlerName]!==null){throw"Event handler "+handlerName+" is unknown or is not a function";}};SWFUpload.prototype.executeNextEvent=function(){var f=this.eventQueue?this.eventQueue.shift():null;if(typeof(f)==="function"){f.apply(this);}};SWFUpload.prototype.unescapeFilePostParams=function(file){var reg=/[$]([0-9a-f]{4})/i;var unescapedPost={};var uk;if(file!=undefined){for(var k in file.post){if(file.post.hasOwnProperty(k)){uk=k;var match;while((match=reg.exec(uk))!==null){uk=uk.replace(match[0],String.fromCharCode(parseInt("0x"+match[1],16)));}
unescapedPost[uk]=file.post[k];}}
file.post=unescapedPost;}
return file;};SWFUpload.prototype.flashReady=function(){var movieElement=this.getMovieElement();if(typeof movieElement.StartUpload!=="function"){throw"ExternalInterface methods failed to initialize.";}
if(window[this.movieName]==undefined){window[this.movieName]=movieElement;}
this.queueEvent("swfupload_loaded_handler");};SWFUpload.prototype.fileDialogStart=function(){this.queueEvent("file_dialog_start_handler");};SWFUpload.prototype.fileQueued=function(file){file=this.unescapeFilePostParams(file);this.queueEvent("file_queued_handler",file);};SWFUpload.prototype.fileQueueError=function(file,errorCode,message){file=this.unescapeFilePostParams(file);this.queueEvent("file_queue_error_handler",[file,errorCode,message]);};SWFUpload.prototype.fileDialogComplete=function(numFilesSelected,numFilesQueued){this.queueEvent("file_dialog_complete_handler",[numFilesSelected,numFilesQueued]);};SWFUpload.prototype.uploadStart=function(file){file=this.unescapeFilePostParams(file);this.queueEvent("return_upload_start_handler",file);};SWFUpload.prototype.returnUploadStart=function(file){var returnValue;if(typeof this.settings.upload_start_handler==="function"){file=this.unescapeFilePostParams(file);returnValue=this.settings.upload_start_handler.call(this,file);}else if(this.settings.upload_start_handler!=undefined){throw"upload_start_handler must be a function";}
if(returnValue===undefined){returnValue=true;}
returnValue=!!returnValue;this.callFlash("ReturnUploadStart",[returnValue]);};SWFUpload.prototype.uploadProgress=function(file,bytesComplete,bytesTotal){file=this.unescapeFilePostParams(file);this.queueEvent("upload_progress_handler",[file,bytesComplete,bytesTotal]);};SWFUpload.prototype.uploadError=function(file,errorCode,message){file=this.unescapeFilePostParams(file);this.queueEvent("upload_error_handler",[file,errorCode,message]);};SWFUpload.prototype.uploadSuccess=function(file,serverData){file=this.unescapeFilePostParams(file);this.queueEvent("upload_success_handler",[file,serverData]);};SWFUpload.prototype.uploadComplete=function(file){file=this.unescapeFilePostParams(file);this.queueEvent("upload_complete_handler",file);};SWFUpload.prototype.debug=function(message){this.queueEvent("debug_handler",message);};SWFUpload.prototype.debugMessage=function(message){if(this.settings.debug){var exceptionMessage,exceptionValues=[];if(typeof message==="object"&&typeof message.name==="string"&&typeof message.message==="string"){for(var key in message){if(message.hasOwnProperty(key)){exceptionValues.push(key+": "+message[key]);}}
exceptionMessage=exceptionValues.join("\n")||"";exceptionValues=exceptionMessage.split("\n");exceptionMessage="EXCEPTION: "+exceptionValues.join("\nEXCEPTION: ");SWFUpload.Console.writeLine(exceptionMessage);}else{SWFUpload.Console.writeLine(message);}}};SWFUpload.Console={};SWFUpload.Console.writeLine=function(message){var console,documentForm;try{console=document.getElementById("SWFUpload_Console");if(!console){documentForm=document.createElement("form");document.getElementsByTagName("body")[0].appendChild(documentForm);console=document.createElement("textarea");console.id="SWFUpload_Console";console.style.fontFamily="monospace";console.setAttribute("wrap","off");console.wrap="off";console.style.overflow="auto";console.style.width="700px";console.style.height="350px";console.style.margin="5px";documentForm.appendChild(console);}
console.value+=message+"\n";console.scrollTop=console.scrollHeight-console.clientHeight;}catch(ex){alert("Exception: "+ex.name+" Message: "+ex.message);}};var SWFUpload;if(typeof(SWFUpload)==="function"){SWFUpload.prototype.initSettings=function(oldInitSettings){return function(){if(typeof(oldInitSettings)==="function"){oldInitSettings.call(this);}
this.refreshCookies(false);};}(SWFUpload.prototype.initSettings);SWFUpload.prototype.refreshCookies=function(sendToFlash){if(sendToFlash===undefined){sendToFlash=true;}
sendToFlash=!!sendToFlash;var postParams=this.settings.post_params;var i,cookieArray=document.cookie.split(';'),caLength=cookieArray.length,c,eqIndex,name,value;for(i=0;i<caLength;i++){c=cookieArray[i];while(c.charAt(0)===" "){c=c.substring(1,c.length);}
eqIndex=c.indexOf("=");if(eqIndex>0){name=c.substring(0,eqIndex);value=c.substring(eqIndex+1);postParams[name]=value;}}
if(sendToFlash){this.setPostParams(postParams);}};}
var SWFUpload;if(typeof(SWFUpload)==="function"){SWFUpload.queue={};SWFUpload.prototype.initSettings=(function(oldInitSettings){return function(){if(typeof(oldInitSettings)==="function"){oldInitSettings.call(this);}
this.customSettings.queue_cancelled_flag=false;this.customSettings.queue_upload_count=0;this.settings.user_upload_complete_handler=this.settings.upload_complete_handler;this.settings.upload_complete_handler=SWFUpload.queue.uploadCompleteHandler;this.settings.queue_complete_handler=this.settings.queue_complete_handler||null;};})(SWFUpload.prototype.initSettings);SWFUpload.prototype.startUpload=function(fileID){this.customSettings.queue_cancelled_flag=false;this.callFlash("StartUpload",[fileID]);};SWFUpload.prototype.cancelQueue=function(){this.customSettings.queue_cancelled_flag=true;this.stopUpload();var stats=this.getStats();while(stats.files_queued>0){this.cancelUpload();stats=this.getStats();}};SWFUpload.queue.uploadCompleteHandler=function(file){var user_upload_complete_handler=this.settings.user_upload_complete_handler;var continueUpload;if(file.filestatus===SWFUpload.FILE_STATUS.COMPLETE){this.customSettings.queue_upload_count++;}
if(typeof(user_upload_complete_handler)==="function"){continueUpload=(user_upload_complete_handler.call(this,file)===false)?false:true;}else{continueUpload=true;}
if(continueUpload){var stats=this.getStats();if(stats.files_queued>0&&this.customSettings.queue_cancelled_flag===false){this.startUpload();}else if(this.customSettings.queue_cancelled_flag===false){this.queueEvent("queue_complete_handler",[this.customSettings.queue_upload_count]);this.customSettings.queue_upload_count=0;}else{this.customSettings.queue_cancelled_flag=false;this.customSettings.queue_upload_count=0;}}};}
var tablesort={recolor_rows:function(){jQuery('#songlist tbody tr').each(function(i){var row=jQuery(this);if(row.hasClass('c'))return;row.removeClass('a');row.removeClass('b');row.addClass(!(i%2)?'a':'b');});},sort_keys:{'int':function(text){var value=parseInt(text,10);if(isNaN(value)){return"";}else{return value;}},'date':function(text){var date=new Date();var dateparts=text.split(" ");var timeparts;if(dateparts.length==2){timeparts=dateparts[1].split(":");date.setHours(parseInt(timeparts[0],10));date.setMinutes(parseInt(timeparts[1],10));date.setSeconds(parseInt(timeparts[2],10));if(dateparts[0]=="Today");else if(dateparts[0]=="Yesterday"){date=new Date(date-24*60*60*1000);}}else{date.setDate(parseInt(dateparts[0],10));date.setMonth({Jan:0,Feb:1,Mar:2,Apr:3,May:4,Jun:5,Jul:6,Aug:7,Sep:8,Oct:9,Nov:10,Dec:11}[dateparts[1]]);date.setYear(parseInt(dateparts[2],10));timeparts=dateparts[3].split(":");}
date.setHours(parseInt(timeparts[0],10));date.setMinutes(parseInt(timeparts[1],10));date.setSeconds(parseInt(timeparts[2],10));return date;},'time':function(text){var parts=text.split(":");var total=0;for(var i=0;i<parts.length;i++){total=60*total+parseInt(parts[i],10);}
return total;},'text':function(text){return text;}},sort_rows_by:function(col,type,reversed){var key=tablesort.sort_keys[type];if(!key)throw"Invalid sort key:"+type;var tbody=jQuery('#songlist tbody').get(0);var rows=$.makeArray($('#songlist tbody tr').map(function(i,row){tbody.removeChild(row);var text=$(row.cells[col]).text().strip();return{key:key(text),index:i,row:row};}));if(reversed){rows.sort(function(a,b){if(a.key==="")return 1;else if(b.key==="")return-1;else if(a.key<b.key)return 1;else if(a.key>b.key)return-1;else return a.index-b.index;});}else{rows.sort(function(a,b){if(a.key==="")return 1;else if(b.key==="")return-1;else if(a.key<b.key)return-1;else if(a.key>b.key)return 1;else return a.index-b.index;});}
for(var i=0;i<rows.length;i++){tbody.appendChild(rows[i].row);}
tablesort.recolor_rows();},sorta:function(cell){var type=cell.getAttribute('sorttype');var col=-1;jQuery('#songlist thead th').each(function(i,child){if(child==cell){col=i;child.onclick=function(){tablesort.sortd(child);};child.className="sorta";}else if(child.className=="sorta"||child.className=="sortd"){child.onclick=function(){tablesort.sorta(child);};child.className="sort";}});if(col==-1)throw"Column not found.";tablesort.sort_rows_by(col,type,false);},sortd:function(cell){var type=cell.getAttribute('sorttype');var col=-1;jQuery('#songlist thead th').each(function(i,child){if(child==cell){col=i;child.onclick=function(){tablesort.sorta(child);};child.className="sortd";}else if(child.className=="sorta"||child.className=="sortd"){child.onclick=function(){tablesort.sorta(child);};child.className="sort";}});if(col==-1)throw"Column not found.";tablesort.sort_rows_by(col,type,true);}};var upload={disable_form:function(form){var inputs=form.getElementsByTagName("input");for(var i=0;i<inputs.length;i++){var input=inputs[i];if(input.type=="submit")input.disabled=true;}}};