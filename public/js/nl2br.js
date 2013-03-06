String.prototype.nl2br = function()
{
	var breakTag = '<br />';
	return this.replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1'+ breakTag +'$2');
}

String.prototype.removeBr = function()
{
	return this.replace(/(<br \/>|<br>)/g, '');
}