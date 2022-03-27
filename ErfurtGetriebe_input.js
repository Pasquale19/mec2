let itrMax, asmItrMax,corrMax,model;
const mecO=mec;
const ctx = document.getElementById('c').getContext('2d');  // the canvas-context
const vp={x:100,y:-10,scl:1};
const g= g2().clr().view({cartesian:true}).view(vp).grid();

model = {
    "id":"ErfurtGetriebe",
 
    "nodes": [
    { "id" :"A0" ,"x":0,"y":600,"base":true, "optic":"FG" },
    { "id" :"A" ,"x":63.9878700000001,"y":633.00837},
    { "id" :"B0" ,"x":330,"y":945,"base":true, "optic":"FG" },
    { "id" :"B" ,"x":465.19434,"y":839.9721},
    { "id" :"C" ,"x":519.22338,"y":723.92193},
    { "id" :"D" ,"x":408.22914,"y":506.39622},
    { "id" :"D0" ,"x":450,"y":426,"base":true, "optic":"FG" },
    { "id" :"E" ,"x":398.41071,"y":600.65061},
    { "id" :"F" ,"x":57.1667700000001,"y":503.10723},
    { "id" :"G" ,"x":175.00254,"y":583.2744},
    { "id" :"H0" ,"x":20.727,"y":349.2,"base":true, "optic":"FG" },
    { "id" :"H" ,"x":20.72709,"y":349.011},
    { "id" :"I" ,"x":325.68372,"y":699.35976},
    { "id" :"J" ,"x":249.10329,"y":575.64357},
    { "id" :"K0" ,"x":30.138,"y":32.6823,"base":true, "optic":"FG" },
    { "id" :"K" ,"x":30.138,"y":32.68239}
    

    

    
    ],
    "constraints": [
      { "id":"l2","p1":"A0","p2":"A","len":{ "type":"const" } ,"ori":{ "type":"drive","Dt":10,"Dw":6.283185307179586 }},
      { "id":"l3","p1":"A","p2":"B","len":{ "type":"const" } },
      { "id":"4","p1":"B0","p2":"B","len":{ "type":"const" } },
      { "id":"l4_2","p1":"B0","p2":"C","len":{ "type":"const" },"ori":{ "type":"const","ref":"4" } },
     
      { "id":"l5","p1":"C","p2":"D","len":{ "type":"const" } },
      { "id":"6","p1":"D0","p2":"D","len":{ "type":"const" } },
      { "id":"l6","p1":"D0","p2":"E","len":{ "type":"const" } ,"ori":{ "type":"const","ref":"6" }, "txt":" "},
      { "id":"l6_2","p1":"D0","p2":"I","len":{ "type":"const" } ,"ori":{ "type":"const","ref":"6" }, "txt":" "},
     
      { "id":"7","p1":"E","p2":"F","len":{ "type":"const" } },
      { "id":"8","p1":"A0","p2":"F","len":{ "type":"const" } },
      { "id":"l8_2","p1":"A0","p2":"G","len":{ "type":"const" } ,"ori":{ "type":"const","ref":"8" },"txt":" "},
      
     
      { "id":"9","p1":"G","p2":"H","len":{ "type":"const" }},
      { "id":"l10","p1":"H0","p2":"H","ori":{ "type":"const" }, "hid":true},
      
      { "id":"11","p1":"I","p2":"J","len":{ "type":"const" }},
      { "id":"12","p1":"A","p2":"J","len":{ "type":"const" }},
      { "id":"13","p1":"J","p2":"K","len":{ "type":"const" }},
 
      { "id":"l14","p1":"K0","p2":"K","ori":{ "type":"const" }, "txt":" ", "hid":true}     
    ],
    "loads": [
    {      "id":"F1","type":"force","p":"K",
      "value":30,"w0":1.5708,"mode":"push"      }
  ],"shapes":[
    { "type": "slider", "p": "H" ,"wref":"l14"}
  
  
  ]
  };


function start(){
    itrMax=document.getElementById("in_itrMax");
    asmItrMax=document.getElementById('in_asmItrMax');
    corrMax=document.getElementById('in_corrMax');
    mecO.asmItrMax=asmItrMax;
    mecO.corrMax=corrMax;
    mecO.itrMax=itrMax;

     // simulation
     const simulate = () => {
        model.tick(1/60);                 // solve model with fixed stepping
        g.exe(ctx);                       // render its pose on the canvas
        requestAnimationFrame(simulate);  // keep calling back
    };

    mec.model.extend(model);                    // extend the model
    model.init();                               // initialize it
    model.draw(g);                              // append model-graphics to graphics-obj

    simulate();         


}

   
             

        