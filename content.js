function initialize(){
  i = 0;
  videoElement = document.getElementsByTagName('video')[0];
  canvas = document.createElement('canvas');
  canvas.id = 'canvas';
  lastImage = null;
};

function capture(){
  // うまくダウンロードされない -> ブラウザでの自動ダウンロードの許可
  link = document.createElement('a');
  link.href = lastImage.toDataURL();
  link.download = (++i)+".png";
  link.click();
};

function checkChangeImage(){
  canvas.width = videoElement.videoWidth;
  canvas.height = videoElement.videoHeight;
  canvas.getContext('2d').drawImage(videoElement, 0, 0, canvas.width, canvas.height);
  var currentImage = canvas.getContext('2d').getImageData(0,0,canvas.width,canvas.height);
  if(lastImage != null && lastImage.width == currentImage.width){
    var sigma = 0;
    var pixCount = 0;
    for(var i = 0; i < currentImage.width*currentImage.height*4; i+=4){
      // 白か黒のみ判定
      // if(Math.abs(currentImage.data[i]+currentImage.data[i+1]+currentImage.data[i+2]-384)>368
      // && Math.abs(lastImage.data[i]+lastImage.data[i+1]+lastImage.data[i+2]-384)>368){
      if(Math.abs(currentImage.data[i]+currentImage.data[i+1]+currentImage.data[i+2]-384)>368
        // 順番に表示してくる教員に対応(元が白かったらスキップ)
      && (lastImage.data[i]+lastImage.data[i+1]+lastImage.data[i+2]) < 16){
        // sigma += Math.pow(currentImage.data[i]-lastImage.data[i], 2);
        // oldが0近くならcurrentImageだけで近似できる
        sigma += Math.pow(currentImage.data[i], 2);
        pixCount++;
      }
    }
    var mse = sigma / pixCount;
    console.log("mse "+mse);

    if(mse > 5000){
      capture();
    }
  }
  lastImage = currentImage;
}

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
        const checkImageTimer = setInterval(checkChangeImage,2000);
      });
    }
  };
};

window.addEventListener("load", main, false);
