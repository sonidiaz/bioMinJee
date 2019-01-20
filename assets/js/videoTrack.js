'use strict';

const videoToBio = (function(){

        const constraints = {
            audio: false,
            video: true
        };

        function handleSuccess(stream) {

            const video = document.querySelector('#videoToBio');
            const canvasToScreen = document.querySelector('#canvasToBio');
            const canvasToScreenCtx = canvasToScreen.getContext('2d');

            const widthCanvasBio = video.getAttribute('width');
            const heightCanvasBio = video.getAttribute('height');
          
            canvasToScreen.setAttribute('width', widthCanvasBio);
            canvasToScreen.setAttribute('height', heightCanvasBio);

            stream = stream;
            video.srcObject = stream;
            
            const valTranslate = {
                w: canvasToScreen.width / 2,
                h: canvasToScreen.height / 2
            }

            const newWidth = valTranslate.w-canvasToScreen.width;
            const newHight = valTranslate.h-canvasToScreen.height;

            video.addEventListener('play', function(e) {
                const $this = this; //cache
                canvasToScreenCtx.translate(valTranslate.w, valTranslate.h);
                canvasToScreenCtx.scale(-1, 1);

                (function loop() {
                    if (!$this.paused && !$this.ended) {
                        canvasToScreenCtx.drawImage($this, newWidth, newHight, canvasToScreen.width, canvasToScreen.height);
                        setTimeout(loop, 1000 / 30); // drawing at 30fps
                  }
                })();
            });
            setTimeout(() => {

                canvasToScreenCtx.drawImage(video, newWidth, newHight, canvasToScreen.width, canvasToScreen.height);
                // console.log(canvasToScreen.toDataURL());

            }, 2000);
        }

        async function init(e) {
            try {
                const stream = await navigator.mediaDevices.getUserMedia(constraints);
                handleSuccess(stream);
                e.target.disabled = true;
            } catch (e) {
                console.log(e);
            }
        }

        return {
            init:init
        }

});
