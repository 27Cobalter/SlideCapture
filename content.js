function initialize(){
  i = 0;
  videoElement = document.getElementsByTagName('video')[0];
  canvas = document.createElement('canvas');
  canvas.id = 'canvas';
  lastCanvas = document.createElement('canvas');
};

function capture(){
  // うまくダウンロードされない -> ブラウザでの自動ダウンロードの許可
  link = document.createElement('a');
  link.href = lastCanvas.toDataURL();
  link.download = (++i) + ".png";
  link.click();
};

function checkChangeImage(){
  canvas.width = videoElement.videoWidth;
  canvas.height = videoElement.videoHeight;
  canvas.getContext('2d').drawImage(videoElement, 0, 0, canvas.width, canvas.height);
  var currentCanvas = canvas;
  var currentImage = currentCanvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height);
  if(lastCanvas.width == currentCanvas.width){
    var lastImage = lastCanvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height);
    var sigma = 0;
    var pixCount = 1;
    for(var j = 0; j < currentImage.height; j++){
      for(var i = 0; i < currentImage.width; i++){
        var p = (j * currentImage.width + i) * 4;
        // 白か黒のみ判定
        if(Math.abs(currentImage.data[p] + currentImage.data[p+1] + currentImage.data[p+2] - 384) > 320
          // 順番に表示してくる教員に対応(元が白かったらスキップ)
          && (lastImage.data[p] < 80 && lastImage.data[p+1] < 80 && lastImage.data[p+2] < 80)){
          // oldが0近くならcurrentImageだけで近似できる
          r2 = Math.pow(j-(currentImage.height/2), 2) + Math.pow(i-(currentImage.width/2), 2);
          x = r2 / (Math.pow(currentImage.height/2, 2) + Math.pow(currentImage.width/2, 2));
          sigma += Math.pow(currentImage.data[p], 2) * Math.exp(-x);
          pixCount++;
        }
      }
    }
    var mse = sigma / pixCount;
    console.log("mse " + mse);

    if(mse > 30000){
      capture();
    }
  }else{
    lastCanvas.width = currentCanvas.width;
    lastCanvas.height = currentCanvas.height;
  }
  lastCanvas.getContext('2d').putImageData(currentImage, 0, 0);
}

document.body.addEventListener('keydown', event => {
    if(event.key === 'd' && event.altKey){
      capture();
    }
  });

function main(e){
  const initCheckTimer = setInterval(jsLoaded, 1000);
  function jsLoaded(){
    video = document.querySelector('video');
    if(video != null) {
      clearInterval(initCheckTimer);
      video.addEventListener('loadedmetadata', (event) => {
        initialize();
        const checkImageTimer = setInterval(checkChangeImage, 2000);
      });
    }
  };
};

window.addEventListener("load", main, false);
