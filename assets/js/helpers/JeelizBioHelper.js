"use strict"




const $head = document.getElementById('head');
const $boca = document.getElementById('mouth');
const $bocaSmile = document.getElementById('mouthSmile');
const $leftEye = document.getElementById('detect-eyes-left');
const $rightEye = document.getElementById('detect-eyes-right');
const videoElement = document.getElementById('video');

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
    }

    function onMorphUpdate(quality, benchmarkCoeff){

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
    }


    const valorBio = (postition, expresion) => {
        return _expressions[postition][expresion](_morphFactorsDict);
    }

    const app = {
        init: function(spec){
       
            const { idealWidth, idealHeight } = spec.videoSettings;

            // const videoCanvas = document.querySelector('video');
            const video = document.querySelector('#videoToBio');
            const canvasScreen = document.getElementById('screentest');
            
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
                JEEFACETRANSFERAPI.switch_displayVideo(false);
                const canvas = JEEFACETRANSFERAPI.get_cv();
          
                let streamVideo = window.streamVideo = canvas.captureStream();
     
                video.setAttribute('width', canvas.width);
                video.setAttribute('height', canvas.height);

                // video.srcObject = streamVideo;
    
                setTimeout(() => {
                    // canvasScreen.getContext('2d').drawImage(videoCanvas, 0, 0, canvasScreen.width, canvasScreen.height);

                    // console.log(canvasScreen.toDataURL());

                    console.log('shot!!', canvas.width, canvas.height);
                }, 2000);

                const videoInit = videoToBio();
                videoInit.init();
            })
      

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