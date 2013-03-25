String.prototype.nl2br = function()
{
	var breakTag = '<br />';
	return this.replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1'+ breakTag +'$2');
};

String.prototype.removeBr = function()
{
	return this.replace(/(<br \/>|<br>)/g, '');
};

String.prototype.parselinks = function() {
    var regexp = /((ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?)/gi;
    return this.replace(regexp,'<a href="$1" target="_blank">$1</a>');
};

String.prototype.removelinks = function() {
	var regexp = /<a [^>]*>(.*)<\/a>/gi;
	return this.replace(regexp, '$1');
};

String.prototype.escape = function() {
	return this
		.replace(/&(?!\w+;)/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;');
};