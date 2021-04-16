function initialize(){
  console.log("initialize");
  i = 0;
  videoElement = document.getElementsByTagName('video')[0];
  console.log(videoElement);
  canvas = document.createElement('canvas');
  canvas.id = 'canvas';
  canvas.width = videoElement.videoWidth;
  canvas.height = videoElement.videoHeight;
};

function capture(){
  console.log("capture");
  videoElement.currentTime -= 5;
  canvas.getContext('2d').drawImage(videoElement, 0, 0, canvas.width, canvas.height);

  // TODO: うまくダウンロードされない（なぜ）
  link = document.createElement('a');
  link.href = canvas.toDataURL();
  link.download = (++i)+".png";
  link.click();
};

document.body.addEventListener('keydown', 
  event => {
    if(event.key === 'd' && event.altKey){
      capture();
    }
  });

function main(e){
  const initCheckTimer = setInterval(jsLoaded,1000);
  function jsLoaded(){
    if(document.querySelector('video') != null) {
      clearInterval(initCheckTimer);
      initialize();
    }
  };
};

window.addEventListener("load", main, false);
