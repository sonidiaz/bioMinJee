"use strict"


const widthVewport = window.innerWidth;
const deviceMobile = function getViewPort(widthVewport){
    if(window.innerWidth > 768){
        console.log(window.innerWidth);
        return false;
    }else{
        console.log(window.innerWidth);
        return true;
    }
}
const customContrains = {
    'facingMode': 'user', //to use the rear camera, set to 'environment'
    'idealWidth': 345,  //ideal video width in pixels
    'idealHeight': 345, //ideal video height in pixels
    'minWidth': 345,    //min video width in pixels
    'maxWidth': 345,   //max video width in pixels
    'minHeight': 345,   //min video height in pixels
    'maxHeight': 345,  //max video height in pixels,
}


function move_pupil(dx, dy){
    // JeelizBioHelper.bio_pos_head(dx,dy);
}

function rotate_headZ(rz){
    JeelizBioHelper.bio_rot_head(rz);
    
}

// function bio_smile(rz){
//     JeelizBioHelper.bio_smile(rz);
// }

function init(){
    JeelizResizer.size_canvas({
        canvasId: 'jeeFaceFilterCanvas',
        isFullScreen: true,
        callback: function(isError, bestVideoSettings){
            JeelizBioHelper.init({
                canvasId: 'jeeFaceFilterCanvas',
                NNCpath:'../assets/js/helpers/',
                hysteresis: 0.1, //bonus score for already selected expression. Against flickering
                isMirror: false,
                videoSettings: (!deviceMobile()) ? bestVideoSettings : customContrains,
                expressions:[
                    {
                        bioMouthRound: function(ks){
                            return 0.8*ks.mouthRound-0.1*ks.mouthOpen;
                        },
                        bioMouthOpen: function(ks){
                            return 1.0*ks.mouthOpen;
                        },
                        bioMouthRest: function(ks){
                            return 0.4
                        },
                        
                        bioSmile: function(ks){
                            return (ks.smileRight + ks.smileLeft)
                        }
                    },
                    { //left eye
                        bioEyeLeftOpen: function(ks){
                          return 1.-ks.eyeLeftClose;
                        },
                        bioEyeLeftClose: function(ks){
                          return 1.5*ks.eyeLeftClose;
                        }
                    },
                    { //right eye
                        bioEyeRightOpen: function(ks){
                          return 1.-ks.eyeRightClose;
                        },
                        bioEyeRightClose: function(ks){
                          return 1.0*ks.eyeRightClose;
                        }
                    }
                ],
                bioRotationCallback: function(xyz){
                    var rx=xyz[0], //head angle : rotation around X (look up/down)
                        ry=xyz[1], //rotation around Y : look right/left
                        rz=xyz[2]; //rotation around Z : head bending
        
                    var dx=12*ry, 
                        dy=-5+20*rx;
        
                    move_pupil(dx,dy);
                    move_pupil(dx,dy);
                    
                    rotate_headZ(-rz*70);    
                },
                callbackReady: function(spec){
                    console.log(spec);
                }
        
            })
        }
    });
}


document.addEventListener('DOMContentLoaded', function(){
    init();
})