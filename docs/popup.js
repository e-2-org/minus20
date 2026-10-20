function newImage(arg) {
	if (document.images) {
		rslt = new Image();
		rslt.src = arg;
		return rslt;
	}
}

function changeImages() {
	if (document.images && (preloadFlag == true)) {
		for (var i=0; i<changeImages.arguments.length; i+=2) {
			document[changeImages.arguments[i]].src = changeImages.arguments[i+1];
		}
	}
}

var preloadFlag = false;
// the site's folder, so pages in artists/ preload from the same images/
var siteRoot = document.currentScript ? document.currentScript.src.replace(/[^\/]*$/, "") : "";
function preloadImages() {
if (document.images) {
arrow_right = newImage(siteRoot + "images/arrow_right.gif");
preloadFlag = true;
	}
}
var _console = null;
function popup() {
  var url=arguments[0];
  window.location.href=url;
  return;
  var agt=navigator.userAgent.toLowerCase();
  var major=parseInt(navigator.appVersion);
  var isnav=((agt.indexOf('mozilla')!=-1)&&(agt.indexOf('spoofer')==-1)&&(agt.indexOf('compatible')==-1)&&(agt.indexOf('opera')==-1)&&(agt.indexOf('webtv')==-1)&&(agt.indexOf('hotjava')==-1));
  var isnav4=(isnav&&(major==4));
  var sw=800;
  var sh=600;
  if(screen.width) sw=screen.width;
  if(screen.height) sh=screen.height;
  if(screen.availHeight) sh=screen.availHeight;
  var width=(isnav4)?"outerWidth="+sw:"width="+sw;
  var height=(isnav4)?",outerHeight="+sh:",height="+sh;
  var position=(isnav4)?",screenX=0,screenY=0":",left=0,top=0";
  if(arguments[1]==1){
    //chris otto
    if(isnav4){
      alert("Sorry, this piece requires Internet Explorer 4+ or Netscape 6+");
      return;
    }
  }
  var features=width+height+position+",resizable";
  if((_console==null)||(_console.closed)){
    _console=window.open(url,"minus20",features);
  }else{
    _console.close();
    _console=window.open(url,"minus20",features);
  }
  _console.focus();
  _console.moveTo(0,0);
}
