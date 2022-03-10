
console.log('mec3.element.js loaded');
/*ignore jslint start*/
class Mec3Element extends HTMLElement{

  static get observedAttributes() {
    return ['width', 'height', 'cartesian', 'grid', 'x0', 'y0',
        'darkmode', 'gravity', 'hidenodes', 'hideconstraints',
        'nodelabels', 'constraintlabels', 'loadlabels',
        'nodeinfo', 'constraintinfo'];
}

constructor(){
  super();
  this._shadow = this.attachShadow({mode: 'open'});
  
}
//#region region getter and setter*/
get width() { return this.style.width||+this.getAttribute('width') || 301; }
set width(q) { if (q) this.setAttribute('width', q); }
get height() { return this.style.height||+this.getAttribute('height') || 201; }
set height(q) { if (q) this.setAttribute('height', q); }
get x0() { return (+this.getAttribute('x0')) || 0; }
set x0(q) { if (q) this.setAttribute('x0', q); }
get y0() { return (+this.getAttribute('y0')) || 0; }
set y0(q) { if (q) this.setAttribute('y0', q); }
get pausing(){return this._ispaused;}
set pausing(q) {this._ispaused=q;}
get constraintVector() { return this.hasAttribute('constraintVector') || false; }
set constraintVector(q) { q ? this.setAttribute('constraintVector', '') : this.removeAttribute('constraintVector'); }
get grid() { return this.hasAttribute('grid') || false; }
set grid(q) { q ? this.setAttribute('grid', '') : this.removeAttribute('grid'); }
//#endregion
parseModel() {
  try { this._model = JSON.parse(this.innerHTML); return true; }
  catch (e) { this._shadow.innerHTML = e.message; }
  return false;
}



    onclick(e){
       //this.cnvclicked();
    
       if (this._ispaused===undefined) this._ispaused=false;
      this._ispaused=!this._ispaused;
      if (!this._ispaused)
      {    
          console.log(`start: ${this._ispaused}`);
          window.requestAnimationFrame(() => this.render()); //start again
      }
   
         
      
  }
   render() {
      if (this._ispaused) return;
      this._model.tick(1/60);  
      this._g.exe(this._ctx);
      window. requestAnimationFrame(() => this.render());
  }

/*
    connectedCallback() fires when the element is inserted into the DOM. It's a good place to set the initial role, tabindex, internal state, and install event listeners.
    **/
    connectedCallback() {

      //console.log('connected Callback');
      //create model
      if (!this.parseModel()) return;
      this._ispaused=false;
     //install show from attributes
    this._show = Object.create(Object.getPrototypeOf(mec.show), Object.getOwnPropertyDescriptors(mec.show)); // copy defaults
    this._show.darkmode = this.getAttribute('darkmode') === "" ? true : false;  // boolean
    this._show.nodes = this.getAttribute('hidenodes') === "" ? false : true;  // boolean
    this._show.constraints = this.getAttribute('hideconstraints') === "" ? false : true;  // boolean
    this._show.nodeLabels = this.getAttribute('nodelabels') === "" ? true : false;  // boolean
    this._show.constraintLabels = this.getAttribute('constraintlabels') === "" ? true : false;  // boolean
    this._show.nodeInfo = this.hasAttribute('nodeinfo') && (this.getAttribute('nodeinfo') || 'id');  // string
    this._show.constraintInfo = this.hasAttribute('constraintinfo') && (this.getAttribute('constraintinfo') || 'id');  // string
    //this._show.constraintVector = this.hasAttribute('constraintinfo') && (this.getAttribute('constraintinfo') || 'id');  // string
    // set gravity from attribute
    this.gravity = this.getAttribute('gravity') === "" ? true : false;

    //setup model
    
    mec.show.constraintLabels=false;
    mec.show.nodeLabels=true;
    mec.show.constraintVector=false;
    this._model = mec.model.extend(this._model, this);
    this._model.init();


    // find input-drives
    this._inputs = this._model.inputControlledDrives;
    // find chart elements which are refered to by the model
    this._charts = this._model.views.filter(v => v.as === 'chart' && v.canvas);
    this._chartRefs = this._charts.map(c => document.getElementById(c.canvas));
    // Apply functions to html elements.
    for (const idx in this._chartRefs) {
        const elm = this._chartRefs[idx];
        const chart = this._charts[idx];
        Object.assign(elm, chart.graph);
        elm.nod = () => {
            // this._charts[idx].previewNod;
            const data = chart.graph.funcs[0].data;
            const pt = data.findIndex(data => data.t > chart.local_t);
            return pt === -1
                ? { scl: 0 } // If point is out of bounds
                : {
                    x: (data[pt].x - elm._chart.xmin) * (elm._chart.b / 
                        (elm._chart.xmax - elm._chart.xmin)) + elm._chart.x,
                    y: (data[pt].y - elm._chart.ymin) * (elm._chart.h /
                        (elm._chart.ymax - elm._chart.ymin)) + elm._chart.y,
                    // y: elm._chart.y + elm._chart.h,
                    scl: 1
                };
        }
    }

    //create shadow dom
    this._shadow.innerHTML = Mec3Element.template({
      width: this.width,
      height: this.height
    });


    // get elements from the shadow dom
    this._cnv=this._shadow.getElementById('cnv');
    this._ctx = this._cnv.getContext('2d');

    //add event listener
     this._cnv.addEventListener('click',e=> this.onclick(e) );

    
    //create g2 object
    this._viewport={x:this.x0||0,y:this.y0||0,scl:1||1,cartesian:true};
    this._g = g2().clr().view(this._viewport);
        
    if (this.grid) this._g.grid({ color:'black' });
    //draw model and start simulation
    this._model.draw(this._g);
    this._g.exe(this._ctx);                              // append model-graphics to graphics-obj
    //this.simulate();   
    window. requestAnimationFrame(() => this.render());
 
    }
    disconnectedCallback() {
      this._cnv.removeEventListener("click", this.cnvclicked, false);
  }
  attributeChangedCallback(name, oldval, val) {
    if (this._shadow && this._shadow.getElementById('cnv')) {
        if (name === 'width') {  // todo: preserve minimum width
            this._shadow.getElementById('cnv').setAttribute('width', val);
            this._shadow.querySelector('.status').style.width = val + 'px';
        }
        if (name === 'height')   // todo: preserve minimum height
            this._shadow.getElementById('cnv').setAttribute('height', val);
    }
}

/**
 * html template of the object
 * @param {number} - width of canvas 
 * @returns 
 */
  static template({width,height}) {
    return `
<style>
#cnv {
    background-color: white;

    touch-action: none;
}
</style>
<canvas id="cnv" width="${width}" height="${height}" touch-action="none"></canvas><br>
<input id="slider" type="range"></input>
`
  }
}

window.onload=()=>{window.customElements.define('mec-3', Mec3Element);}
    
/*ignore jslint end*/ 