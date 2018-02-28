function lightbox(img) {

  var lbstyles = {
    "display":"block",
    "width":"100%",
    "height":"100vh",
    "background":"rgba(0,0,0,0.9)",
    "position":"fixed",
    "top":"0",
    "left":"0",
    "z-index":"1000000",
    "overflow":"auto",
    "cursor":"pointer"
  };  

  var imgstyles = {
    "width":"auto",
    "height":"auto",
    "max-width":"100vw",
    "max-height":"100vh",
    "margin":"auto",
    "position":"absolute",
    "top":"0",
    "left":"0",
    "bottom":"0",
    "right":"0"
  };
  var lb = document.createElement('div');
  for(key in lbstyles) {
    lb.style[key] = lbstyles[key];
  }
  lb.onclick = function() {
    this.parentNode.removeChild(this);
  }
  var image = document.createElement('img');
  for(key in imgstyles) {
    image.style[key] = imgstyles[key];
  }
  image.src = img.src;
  lb.append(image);
  document.body.append(lb);
  return false;
}
