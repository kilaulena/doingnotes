var ReplicationHelpers = {
  getLocationHash: function(){
    return hex_md5(window.location.host);
  },
  
  checkForUpdates: function(couchapp){
    var context    = this;
    var outline_id = context.getOutlineId();
    var source     = context.getLocationHash();
    var url        = context.HOST + '/' + context.DB + 
                     '/_changes?filter=doingnotes/changed' +
                     '&source=' + source;    
    
    if(outline_id){ 
      $.getJSON(url, function(json){
        var since = json.last_seq;
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange=function() {
          if(xmlhttp.readyState==3){
            console.log('This has changed in another application:')
            console.log(xmlhttp.responseText)
            if (xmlhttp.responseText.length > 0){
              if(context.$element().find('#change-warning:visible').length == 0){
                $('#change-warning').slideDown('slow');
              }
            }
          }
        }
        xmlhttp.open("GET", url + '&feed=continuous&since=' + since, true);
        xmlhttp.send(null);
      });
    }
  },

  replicateUp: function(){
    var context = this;   
    $.post(context.HOST + '/_replicate', 
      '{"source":"' + context.DB + '", "target":"' + context.SERVER + '/' + context.DB + '", "continuous":true}',
      function(){
        Sammy.log('replicating to ', context.SERVER)
      },"json");
  },
  
  replicateDown: function(){
    var context = this;
    $.post(context.HOST + '/_replicate', 
      '{"source":"' + context.SERVER + '/' + context.DB + '", "target":"' + context.DB + '", "continuous":true}',
      function(){
        Sammy.log('replicating from ', context.SERVER)
      },"json");
  }
}