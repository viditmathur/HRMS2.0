function escapeHtml(text) {
  var map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };

  return text.replace(/[&<>"']/g, function(m) { return map[m]; });
}

String.prototype.stripSlashes = function(){
    return this.replace(/\\(.)/mg, "$1");
}

function validateData(data){
    data = data.trim();
    data = data.stripSlashes();
    data = escapeHtml(data);
    return data;
}
//use str.trim() to remove blank spaces from both ends of a string