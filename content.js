function initialize(){
  i = 0;
  videoElement = document.getElementsByTagName('video')[0];
  canvas = document.createElement('canvas');
  canvas.id = 'canvas';
  canvas.width = videoElement.videoWidth;
  canvas.height = videoElement.videoHeight;
};

function capture(){
  videoElement.currentTime -= 3;
  canvas.getContext('2d').drawImage(videoElement, 0, 0, canvas.width, canvas.height);

  // うまくダウンロードされない -> ブラウザでの自動ダウンロードの許可
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
    video = document.querySelector('video');
    if(video != null) {
      clearInterval(initCheckTimer);
      video.addEventListener('loadedmetadata',(event) => {
        initialize();
      });
    }
  };
};

window.addEventListener("load", main, false);
