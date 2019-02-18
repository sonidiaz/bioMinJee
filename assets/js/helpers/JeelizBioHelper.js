'use strict';

/**
 * Calculate the simple moving average of an array. A new array is returned with the average
 * of each range of elements. A range will only be calculated when it contains enough elements to fill the range.
 *
 * ```js
 * console.log(sma([1, 2, 3, 4, 5, 6, 7, 8, 9], 4));
 * //=> [ '2.50', '3.50', '4.50', '5.50', '6.50', '7.50' ]
 * //=>   │       │       │       │       │       └─(6+7+8+9)/4
 * //=>   │       │       │       │       └─(5+6+7+8)/4
 * //=>   │       │       │       └─(4+5+6+7)/4
 * //=>   │       │       └─(3+4+5+6)/4
 * //=>   │       └─(2+3+4+5)/4
 * //=>   └─(1+2+3+4)/4
 * ```
 * @param  {Array} `arr` Array of numbers to calculate.
 * @param  {Number} `range` Size of the window to use to when calculating the average for each range. Defaults to array length.
 * @param  {Function} `format` Custom format function called on each calculated average. Defaults to `n.toFixed(2)`.
 * @return {Array} Resulting array of averages.
 * @api public
 */

function sma(arr, range, format) {
  if (!Array.isArray(arr)) {
    throw TypeError('expected first argument to be an array');
  }

  var fn = typeof format === 'function' ? format : toFixed;
  var num = range || arr.length;
  var res = [];
  var len = arr.length + 1;
  var idx = num - 1;
  while (++idx < len) {
    res.push(fn(avg(arr, idx, num)));
  }
  return res;
}

/**
 * Create an average for the specified range.
 *
 * ```js
 * console.log(avg([1, 2, 3, 4, 5, 6, 7, 8, 9], 5, 4));
 * //=> 3.5
 * ```
 * @param  {Array} `arr` Array to pull the range from.
 * @param  {Number} `idx` Index of element being calculated
 * @param  {Number} `range` Size of range to calculate.
 * @return {Number} Average of range.
 */

function avg(arr, idx, range) {
  return sum(arr.slice(idx - range, idx)) / range;
}

/**
 * Calculate the sum of an array.
 * @param  {Array} `arr` Array
 * @return {Number} Sum
 */

function sum(arr) {
  var len = arr.length;
  var num = 0;
  while (len--) num += Number(arr[len]);
  return num;
}

/**
 * Default format method.
 * @param  {Number} `n` Number to format.
 * @return {String} Formatted number.
 */

function toFixed(n) {
  return n.toFixed(2);
}

/**
 * Expose `sma`
 */





"use strict"

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
        const video = document.querySelector('#cutFaceVideo');

        canvasJeeliz = JEEFACETRANSFERAPI.get_cv();

        
        // CVD = JEEFACETRANSFERAPI.Canvas2DDisplay(spec);
        // CVD.ctx.strokeStyle='yellow';

        // video.srcObject = this.spec.GL.canvas.captureStream();
        // video.width = this.spec.GL.canvas.width;
        // video.height = this.spec.GL.canvas.height;
        
        
    }

    const coordinate = {
        x:0,
        y:0,
        s:0
    }

    function onMorphUpdate(quality, benchmarkCoeff){

        const box = document.querySelector('.box')
        const detectedState = {
            x: JEEFACETRANSFERAPI.get_positionScale()[0],
            y: JEEFACETRANSFERAPI.get_positionScale()[1],
            s: JEEFACETRANSFERAPI.get_positionScale()[2],
        }



        COORDINATES.x = window.innerWidth*(detectedState.x+1)/2;
        COORDINATES.y = window.innerHeight*(detectedState.y+1)/2;
        COORDINATES.w = window.innerWidth*detectedState.s;
        
        
        console.log(COORDINATES.x, COORDINATES.y);

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
    }


    const valorBio = (postition, expresion) => {
        return _expressions[postition][expresion](_morphFactorsDict);
    }

    const app = {
        init: function(spec){
            // const { idealWidth, idealHeight } = spec.videoSettings;
      
            // const videoCanvas = document.querySelector('video');
            const videoDisplay = document.querySelector('#videoToBio');
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