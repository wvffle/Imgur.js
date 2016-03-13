var Imgur = function (clientID){
  return {
    upload: function (file, options, next) {
      if(options instanceof Function){
         next = options;
         options = {}
      }

      var type = options.type||'file';
      var secure = options.secure||true;


      var fd  = new FormData();
      var xhttp = new XMLHttpRequest();

      if(type=='file') fd.append('image', file);
      if(type=='base64'){
        var byteString;
        if (file.split(',')[0].indexOf('base64') >= 0)
            byteString = atob(file.split(',')[1]);
        else
            byteString = unescape(file.split(',')[1]);
        var mimeString = file.split(',')[0].split(':')[1].split(';')[0];
        var ia = new Uint8Array(byteString.length);
        for (var i = 0; i < byteString.length; i++)
            ia[i] = byteString.charCodeAt(i);
        fd.append('image', new Blob([ia], {type:mimeString}));
      }
      xhttp.open('POST', 'https://api.imgur.com/3/image');
      xhttp.setRequestHeader('Authorization', 'Client-ID '+clientID);
      xhttp.on('readystatechange', function () {
        if (xhttp.status === 200 && xhttp.readyState === 4) {
          var res = JSON.parse(xhttp.responseText);
          if(secure) return next.call(xhttp, (res.data.link||'').replace('http:', 'https:'))
          else return next.call(xhttp, res.data.link)

        }
      })
      xhttp.send(fd);
    }
  }
}
