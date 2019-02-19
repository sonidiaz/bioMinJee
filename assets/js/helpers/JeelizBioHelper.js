
'use strict'


const $head = document.getElementById('head');
const $boca = document.getElementById('mouth');
const $bocaSmile = document.getElementById('mouthSmile');
const $leftEye = document.getElementById('detect-eyes-left');
const $rightEye = document.getElementById('detect-eyes-right');
const videoElement = document.getElementById('video');
let CVD;



const JeelizBioHelper = (function(){

    let _morphFactorsArr, 
        _morphFactorsDict={
        smileRight: 0,          //0
        smileLeft: 0,           //1
        eyeBrowLeftDown: 0,     //2
        eyeBrowRightDown: 0,    //3
        eyeBrowLeftUp: 0,       //4
        eyeBrowRightUp: 0,      //5
        mouthOpen: 0,           //6
        mouthRound: 0,          //7
        eyeRightClose: 0,       //8
        eyeLeftClose: 0,        //9
        mouthNasty: 0           //10
    };
    let _morphIndexToName = Object.keys(_morphFactorsDict);
    let _expressions;

    var _hysteresis=0, 
        _bestCssClassName;

    var _rotation=[0,0,0], 
        _rotationCallback=false;

    let canvasDetected = '';
    
    let canvasJeeliz;

    const COORDINATES = {
        x:0,
        y:0,
        s:0
    }

    let video,
        canvasToImagen,
        canvasToImagenCxt,
        canvasReocorte,
        canvasReocorteCtx,
        videoDisplay;

    function callbackTrack(){
        console.log('object');
    }

    function callbackReady(errCode, spec){

        

        if (errCode){
            console.log('ERROR in JeelizSVGHelper - CANNOT INITIALIZE JEEFACETRANSFERAPI : errCode =', errCode);
            return;
        }
        console.log('INFO : JEEFACETRANSFERAPI is ready !!!');
        _morphFactorsArr=JEEFACETRANSFERAPI.get_morphTargetInfluencesStabilized();

        if (_rotationCallback){
            _rotation=JEEFACETRANSFERAPI.get_rotation();
        }
        JEEFACETRANSFERAPI.set_morphUpdateCallback(onMorphUpdate);

        // const canvasCut = document.querySelector('#cutface');
        // const canvasCxt = canvasCut.getContext('2d');
        video = document.querySelector('#cutFaceVideo');
        canvasToImagen = window.canvasToImagen = document.querySelector('#canvasToImg');
        canvasToImagenCxt = window.canvasToImagenCxt = canvasToImagen.getContext('2d');
        
        canvasReocorte  = window.canvasReocorte =  document.querySelector('#canvasToPicture');
        canvasReocorteCtx = canvasReocorte.getContext('2d');
        
        canvasToImagen.width = JEEFACETRANSFERAPI.get_cv().width;
        canvasToImagen.height = JEEFACETRANSFERAPI.get_cv().height;
        



        canvasJeeliz = JEEFACETRANSFERAPI.get_cv();

        const container = document.querySelector('.demo-container');

     

        let enviado = document.getElementById('img');
        enviado.src = canvasToImagen.toDataURL('image/jpg');
   
        enviado.style.display = 'block';

        takePhotoTracker();
 
        
    }


    function takePhotoTracker(){
            var img = document.getElementById('img');

            var tracker = new tracking.LandmarksTracker();
            tracker.setInitialScale(3);
            tracker.setStepSize(1);
            tracker.setEdgesDensity(0.1);

            tracking.track('#videoToBio', tracker);

            tracker.on('track', function(event) {
                canvasToImagenCxt.clearRect(0,0,canvasToImagen.width, canvasToImagen.height);
                if(!event.data) return;

                event.data.faces.forEach(function(rect) {
                    // window.plot(rect.x, rect.y, rect.width, rect.height);
                    canvasReocorte.width = rect.width;
                    canvasReocorte.height = rect.height;
                    canvasToImagenCxt.strokeStyle = '#a64ceb';
                    canvasToImagenCxt.strokeRect(rect.x, rect.y, rect.width, rect.height);
                    canvasToImagenCxt.font = '11px Helvetica';
                    canvasToImagenCxt.fillStyle = "#fff";
                    canvasToImagenCxt.fillText('x: ' + rect.x + 'px', rect.x + rect.width + 5, rect.y + 11);
                    canvasToImagenCxt.fillText('y: ' + rect.y + 'px', rect.x + rect.width + 5, rect.y + 22);
                    
                    console.log(rect.x, rect.y, rect.width, rect.height);
                    canvasReocorteCtx.drawImage(videoDisplay,rect.x, rect.y, rect.width, rect.height,0,0, rect.width, rect.height );
                });


                // event.data.landmarks.forEach(function(landmarks) {
                // for(var i=0; i < landmarks.length; i++){
                //     window.plotLandmark(landmarks[i][0], landmarks[i][1], 2, '#44ABDA');
                // }
                // });

            });

            window.plot = function(x, y, w, h) {
                var rect = document.createElement('div');
                document.querySelector('.demo-container').appendChild(rect);
                rect.classList.add('rect');
                rect.style.width = w + 'px';
                rect.style.height = h + 'px';
                rect.style.left = (img.offsetLeft + x) + 'px';
                rect.style.top = (img.offsetTop + y) + 'px';
            };

            // window.plotLandmark = function(x,y, radius, color){
            //     var circle = document.createElement('div');
            //     document.querySelector('.demo-container').appendChild(circle);
            //     circle.classList.add('circle');
            //     circle.style.backgroundColor = color;
            //     circle.style.width = (radius*2) + 'px';
            //     circle.style.height = (radius*2) + 'px';
            //     circle.style.left = (img.offsetLeft + x) + 'px';
            //     circle.style.top = (img.offsetTop + y) + 'px';
            // }

    }
    function onMorphUpdate(quality, benchmarkCoeff){

        const box = document.querySelector('.box')
        const detectedState = {
            x: JEEFACETRANSFERAPI.get_positionScale()[0],
            y: JEEFACETRANSFERAPI.get_positionScale()[1],
            s: JEEFACETRANSFERAPI.get_positionScale()[2],
        }



        // COORDINATES.x = window.innerWidth*(detectedState.x+1)/2;
        // COORDINATES.y = window.innerHeight*(detectedState.y+1)/2;
        // COORDINATES.w = window.innerWidth*detectedState.s;
        
        
        // function getCoordinates(detectedState){
        //     COORDINATES.x=Math.round((0.5+0.5*detectedState.x*detectedState.s)*window.innerWidth);
        //     COORDINATES.y=Math.round((0.5+0.5*detectedState.y*detectedState.s)*window.innerHeight);
        //     COORDINATES.w=Math.round(detectedState.s*window.innerHeight);
        //     COORDINATES.h=COORDINATES.w;
        //     return COORDINATES;   
        // }
        // const coo = getCoordinates(detectedState);
        
        // box.style.width = coo.h+'px';
        // box.style.height = coo.w+'px';
        box.style.left = COORDINATES.x + 'px';
        box.style.bottom = COORDINATES.y + 'px';
        // console.log(coo);
        _morphIndexToName.forEach(function(morphKey, morphIndex){
            _morphFactorsDict[morphKey]=_morphFactorsArr[morphIndex];
        });

        app.bio_open_mouth(0,'bioMouthOpen');
        app.bioEyeLeftOpen(1,'bioEyeLeftOpen');
        app.bioEyeRightOpen(2,'bioEyeRightOpen');
        app.bioSmile(0,'bioSmile');
        

        _expressions.forEach((expressionVariants, expressionVariantsIndex) => {
            var bestScore = 1e12,
                bestScoreCSSclassName,
                score;

            for (var cssClassName in expressionVariants){
                score=expressionVariants[cssClassName](_morphFactorsDict);
                if (cssClassName===_bestCssClassName){ //add a bonus if last selected position
                    score+=_hysteresis;                //to avoid position flickering
                }
                if (score>bestScore){
                    bestScore=score;
                    bestScoreCSSclassName=cssClassName;
                }
            }
            if (bestScore<-1) return;
        })

        if (_rotationCallback){
            _rotationCallback(_rotation);
        }
        canvasToImagenCxt.drawImage(videoDisplay,0, 0, canvasToImagen.width, canvasToImagen.height,0,0, canvasToImagen.width, canvasToImagen.height );
    }


    const valorBio = (postition, expresion) => {
        return _expressions[postition][expresion](_morphFactorsDict);
    }

    const app = {
        init: function(spec){
            // const { idealWidth, idealHeight } = spec.videoSettings;
      
            // const videoCanvas = document.querySelector('video');
            videoDisplay = document.querySelector('#videoToBio');
            
            _expressions=spec.expressions;

            if (typeof(spec.hysteresis)!=='undefined') _hysteresis=spec.hysteresis;
            if (typeof(spec.bioRotationCallback)!=='undefined')
            
            _rotationCallback=spec.bioRotationCallback;

            JEEFACETRANSFERAPI.init({
                canvasId: spec.canvasId,
                NNCpath: (spec.NNCpath)?spec.NNCpath:'./',
                callbackReady: callbackReady,
                videoSettings: spec.videoSettings,
            });
            
            JEEFACETRANSFERAPI.onLoad( () => {
                JEEFACETRANSFERAPI.on_detect( detected => {
                    app.detected(detected);
                })
                
                // const canvasID = document.querySelector('#'+spec.canvasId);
                // CVD = JEEFACETRANSFERAPI.Canvas2DDisplay(spec);
                // console.log(CVD);
                JEEFACETRANSFERAPI.switch_displayVideo(false);
                const canvas = JEEFACETRANSFERAPI.get_cv();
                
                let streamVideo = window.streamVideo = canvas.captureStream();
                
                videoDisplay.setAttribute('width', canvas.width);
                videoDisplay.setAttribute('height', canvas.height);
                
                let stream = JEEFACETRANSFERAPI.get_videoStream();
                
                videoDisplay.srcObject = stream;
                // video.srcObject = streamVideo;
                
                // const videoInit = videoToBio();
                // videoInit.init();
            })
      
            // canvasCxt.drawImage(video, ((faceCoo.x-(faceCoo.w*1.4-faceCoo.w)/2)), (faceCoo.y-((faceCoo.h*1.4-faceCoo.h)/2)), faceCoo.w*1.4, faceCoo.h*1.4, 400, 400, faceCoo.w, faceCoo.h);

        },
        detected: function(detected){
            const $solapa = document.querySelector('.aviso');
            const aviso = {
                lost:'Find your face...',
                ok:'I catch you!!'
            }
            if(detected){
                $solapa.style.display = 'block';
                $solapa.style.background = 'rgb(0, 0, 0)';
                $solapa.textContent = aviso.ok;
            }else{
                $solapa.style.display = 'block';
                $solapa.style.background = 'rgb(255, 6, 6)';
                $solapa.textContent = aviso.lost;

            }

            console.log(detected);

            
            // var faceCoo=CVD.getCoordinates(detectState);
            // CVD.ctx.clearRect(0,0,CVD.canvas.width, CVD.canvas.height);
            // CVD.ctx.strokeRect(faceCoo.x, faceCoo.y, faceCoo.w, faceCoo.h);
            // CVD.update_canvasTexture();
        },
        screenTest: function(){

        },
        bio_rot_head: function(angleDeg){
            if(angleDeg < -26){
                $head.textContent = 'Gira a la izquieda';
            }else if(angleDeg > 26){
                $head.textContent = 'Gira a la derecha';
            }else{
                $head.textContent = 'No gira';
            }

        },
        bio_open_mouth: function(postition, expresion){
            
            let valExpre = valorBio(postition, expresion);

            if(valExpre == 0){
                $boca.textContent = 'Cerrada';
                // $boca.parentNode.style.width = '208px';
            }else if(valExpre ==1){
                $boca.textContent = 'Abierta';
                // $boca.parentNode.style.width = '100%';
                // $boca.parentNode.style.background = '#33332229';
            }
        },
        bioEyeLeftOpen: function(postition, expresion){
            let valExpre = valorBio(postition, expresion);
            // console.log('Abierto: ', valExpre);
            if(valExpre < 1){
                setTimeout( () => {
                    $leftEye.textContent = 'Cerrado';
                }, 500)
            }else{
                setTimeout( () => {
                    $leftEye.textContent = 'Abierto';
                }, 500)
            }
        },
        bioEyeRightOpen: function(postition, expresion){
            let valExpre = valorBio(postition, expresion);
            // console.log('Abierto: ', valExpre);
            if(valExpre < 1){
                setTimeout( () => {
                    $rightEye.textContent = 'Cerrado';
                }, 500)
            }else{
                setTimeout( () => {
                    $rightEye.textContent = 'Abierto';
                }, 500)
            }
        },
        bioSmile: function(postition, expresion){
            let valExpre = _expressions[postition][expresion](_morphFactorsDict);
            if(valExpre == 0){
                $bocaSmile.textContent = 'No';
            }else if(valExpre > 0){
                $bocaSmile.textContent = 'Si';
            }
        }

    }
    return app;
})();