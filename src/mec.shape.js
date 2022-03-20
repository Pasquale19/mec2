/**
 * mec.shape (c) 2018 Stefan Goessner
 * @license MIT License
 * @requires mec.core.js
 * @requires mec.node.js
 * @requires mec.constraint.js
 * @requires mec.model.js
 * @requires g2.js
 */
"use strict";

/**
 * @method
 * @param {object} - plain javascript shape object.
 * @property {string} type - shape type ['fix'|'flt'|'slider'|'bar'|'beam'|'wheel'|'poly'|'img'|'Schieber'|'line'|'corner'].
 */
mec.shape = {
    extend(shape) {
        if (shape.type && mec.shape[shape.type]) {
            Object.setPrototypeOf(shape, mec.shape[shape.type]);
            shape.constructor();
        }
        return shape;
    }
}

/**
 * @param {object} - fixed node shape.
 * @property {string} p - referenced node id for position.
 * @property {number} [w0=0] - initial angle.
 */
mec.shape.fix = {
    /**
     * Check fixed node properties for validity.
     * @method
     * @param {number} idx - index in shape array.
     * @returns {boolean} false - if no error / warning was detected.
     */
    validate(idx) {
        if (this.p === undefined)
            return { mid:'E_ELEM_REF_MISSING',elemtype:'shape',id:this.id,idx,reftype:'node',name:'p'};
        if (!this.model.nodeById(this.p))
            return { mid:'E_ELEM_INVALID_REF',elemtype:'shape',id:this.id,idx,reftype:'node',name:this.p};
        else
            this.p = this.model.nodeById(this.p);
        return false;
    },
    /**
     * Initialize shape. Multiple initialization allowed.
     * @method
     * @param {object} model - model parent.
     * @param {number} idx - index in shapes array.
     */
    init(model,idx) {
        this.model = model;
        if (!this.model.notifyValid(this.validate(idx))) return;

        this.w0 = this.w0 || 0;
    },
    dependsOn(elem) {
        return this.p === elem;
    },
    asJSON() {
        return '{ "type":"'+this.type+'","p":"'+this.p.id+'"'
                + ((this.w0 && this.w0 > 0.0001) ? ',"w0":'+this.w0 : '')
                + ' }';
    },
    draw(g) {
        g.nodfix({x:()=>this.p.x,y:()=>this.p.y,w:this.w0 || 0});
    }
},
/**
 * @param {object} - floating node shape.
 * @property {string} p - referenced node id for position.
 * @property {number} [w0] - initial angle.
 */
mec.shape.flt = {
    /**
     * Check floating node properties for validity.
     * @method
     * @param {number} idx - index in shape array.
     * @returns {boolean} false - if no error / warning was detected.
     */
    validate(idx) {
        if (this.p === undefined)
            return { mid:'E_ELEM_REF_MISSING',elemtype:'shape',id:this.id,idx,reftype:'node',name:'p'};
        if (!this.model.nodeById(this.p))
            return { mid:'E_ELEM_INVALID_REF',elemtype:'shape',id:this.id,idx,reftype:'node',name:this.p};
        else
            this.p = this.model.nodeById(this.p);
        return false;
    },
    /**
     * Initialize shape. Multiple initialization allowed.
     * @method
     * @param {object} model - model parent.
     * @param {number} idx - index in shapes array.
     */
    init(model,idx) {
        this.model = model;
        if (!this.model.notifyValid(this.validate(idx))) return;

        this.w0 = this.w0 || 0;
    },
    dependsOn(elem) {
        return this.p === elem;
    },
    asJSON() {
        return '{ "type":"'+this.type+'","p":"'+this.p.id+'"'
                + ((this.w0 && this.w0 > 0.0001) ? ',"w0":'+this.w0 : '')
                + ' }';
    },
    draw(g) {
        g.nodflt({x:()=>this.p.x,y:()=>this.p.y,w:this.w0 || 0});
    }
}

/**
 * @param {object} - slider shape.
 * @property {string} p - referenced node id for position.
 * @property {string} [wref] - referenced constraint id for orientation.
 * @property {number} [w0] - initial angle / -difference.
 */
mec.shape.slider = {
    /**
     * Check slider shape properties for validity.
     * @method
     * @param {number} idx - index in shape array.
     * @returns {boolean} false - if no error / warning was detected.
     */
    validate(idx) {
        if (this.p === undefined)
            return { mid:'E_ELEM_REF_MISSING',elemtype:'slider',id:this.id,idx,reftype:'node',name:'p'};
        if (!this.model.nodeById(this.p))
            return { mid:'E_ELEM_INVALID_REF',elemtype:'slider',id:this.id,idx,reftype:'node',name:this.p};
        else
            this.p = this.model.nodeById(this.p);

        if (this.wref && !this.model.constraintById(this.wref))
            return { mid:'E_ELEM_INVALID_REF',elemtype:'slider',id:this.id,idx,reftype:'constraint',name:this.wref};
        else
            this.wref = this.model.constraintById(this.wref);

        return false;
    },
    /**
     * Initialize slider shape. Multiple initialization allowed.
     * @method
     * @param {object} model - model parent.
     * @param {number} idx - index in shapes array.
     */
    init(model,idx) {
        this.model = model;
        if (!this.model.notifyValid(this.validate(idx))) return;

        this.w0 = this.w0 || 0;
    },
    /**
     * Check shape for dependencies on another element.
     * @method
     * @param {object} elem - element to test dependency for.
     * @returns {boolean} true, dependency exists.
     */
    dependsOn(elem) {
        return this.p === elem || this.wref === elem;
    },
    asJSON() {
        return '{ "type":"'+this.type+'","p":"'+this.p.id+'"'
                + ((this.w0 && this.w0 > 0.0001) ? ',"w0":'+this.w0 : '')
                + (this.wref ? ',"wref":"'+this.wref.id+'"' : '')
                + ' }';
    },
    draw(g) {
        const w = this.wref ? ()=>this.wref.w : this.w0 || 0;
        g.beg({x:()=>this.p.x,y:()=>this.p.y,w})
           .rec({x:-16,y:-10,b:32,h:20,ls:"@nodcolor",fs:"@linkfill",lw:1,lj:"round"})
         .end()
    }
}

/**
 * @param {object} - bar shape.
 * @property {string} p1 - referenced node id for start point position.
 * @property {string} p2 - referenced node id for end point position.
 */
mec.shape.bar = {
    /**
     * Check bar shape properties for validity.
     * @method
     * @param {number} idx - index in shape array.
     * @returns {boolean} false - if no error / warning was detected.
     */
    validate(idx) {
        if (this.p1 === undefined)
            return { mid:'E_ELEM_REF_MISSING',elemtype:'bar',id:this.id,idx,reftype:'node',name:'p1'};
        if (!this.model.nodeById(this.p1))
            return { mid:'E_ELEM_INVALID_REF',elemtype:'bar',id:this.id,idx,reftype:'node',name:this.p1};
        else
            this.p1 = this.model.nodeById(this.p1);

        if (this.p2 === undefined)
            return { mid:'E_ELEM_REF_MISSING',elemtype:'bar',id:this.id,idx,reftype:'node',name:'p2'};
        if (!this.model.nodeById(this.p2))
            return { mid:'E_ELEM_INVALID_REF',elemtype:'bar',id:this.id,idx,reftype:'node',name:this.p2};
        else
            this.p2 = this.model.nodeById(this.p2);

        return false;
    },
    /**
     * Initialize bar shape. Multiple initialization allowed.
     * @method
     * @param {object} model - model parent.
     * @param {number} idx - index in shapes array.
     */
    init(model,idx) {
        this.model = model;
        this.model.notifyValid(this.validate(idx));
    },
    dependsOn(elem) {
        return this.p1 === elem || this.p2 === elem;
    },
    asJSON() {
        return '{ "type":"'+this.type+'","p1":"'+this.p1.id+'","p2":"'+this.p2.id+'" }';
    },
    draw(g) {
        const x1 = () => this.p1.x,
              y1 = () => this.p1.y,
              x2 = () => this.p2.x,
              y2 = () => this.p2.y;
        g.lin({x1,y1,x2,y2,ls:"@nodcolor",lw:8,lc:"round"})
         .lin({x1,y1,x2,y2,ls:"@nodfill2",lw:5.5,lc:"round"})
         .lin({x1,y1,x2,y2,ls:"@nodfill",lw:3,lc:"round"})
    }
}

/**
 * @param {object} - beam shape.
 * @property {string} p - referenced node id for start point position.
 * @property {string} wref - referenced constraint id for orientation.
 * @property {number} [len=100] - beam length
 */
mec.shape.beam = {
    /**
     * Check beam shape properties for validity.
     * @method
     * @param {number} idx - index in shape array.
     * @returns {boolean} false - if no error / warning was detected.
     */
    validate(idx) {
        if (this.p === undefined)
            return { mid:'E_ELEM_REF_MISSING',elemtype:'beam',id:this.id,idx,reftype:'node',name:'p'};
        if (!this.model.nodeById(this.p))
            return { mid:'E_ELEM_INVALID_REF',elemtype:'beam',id:this.id,idx,reftype:'node',name:this.p};
        else
            this.p = this.model.nodeById(this.p);

        if (this.wref === undefined)
            return { mid:'E_ELEM_REF_MISSING',elemtype:'beam',id:this.id,idx,reftype:'constraint',name:'wref'};
        if (!this.model.constraintById(this.wref))
            return { mid:'E_ELEM_INVALID_REF',elemtype:'beam',id:this.id,idx,reftype:'constraint',name:this.wref};
        else
            this.wref = this.model.constraintById(this.wref);

        return false;
    },
    /**
     * Initialize beam shape. Multiple initialization allowed.
     * @method
     * @param {object} model - model parent.
     * @param {number} idx - index in shapes array.
     */
    init(model,idx) {
        this.model = model;
        if (!this.model.notifyValid(this.validate(idx))) return;

        this.len = this.len || 100;
    },
    dependsOn(elem) {
        return this.p === elem || this.wref === elem;
    },
    asJSON() {
        return '{ "type":"'+this.type+'","p":"'+this.p.id+'","wref":"'+this.wref.id+'","len":"'+this.len+'" }';
    },
    draw(g) {
        const x1 = () => this.p.x,
              y1 = () => this.p.y,
              x2 = () => this.p.x + this.len*Math.cos(this.wref.w),
              y2 = () => this.p.y + this.len*Math.sin(this.wref.w);
        g.lin({x1,y1,x2,y2,ls:"@nodcolor",lw:8,lc:"round"})
         .lin({x1,y1,x2,y2,ls:"@nodfill2",lw:5.5,lc:"round"})
         .lin({x1,y1,x2,y2,ls:"@nodfill",lw:3,lc:"round"})
    }
}

/**
 * @param {object} - wheel shape.
 * @property {string} p - referenced node id for center point position, and ...
 * @property {string} [wref] - referenced constraint id for orientation and ...
 * @property {number} [w0=0] - start / offset angle [rad].
 * @property {number} [r=20] - radius
 */
mec.shape.wheel = {
    /**
     * Check wheel shape properties for validity.
     * @method
     * @param {number} idx - index in shape array.
     * @returns {boolean} false - if no error / warning was detected.
     */
    validate(idx) {
        if (this.p === undefined)
            return { mid:'E_ELEM_REF_MISSING',elemtype:'wheel',id:this.id,idx,reftype:'node',name:'p'};
        if (!this.model.nodeById(this.p))
            return { mid:'E_ELEM_INVALID_REF',elemtype:'wheel',id:this.id,idx,reftype:'node',name:this.p};
        else
            this.p = this.model.nodeById(this.p);

        if (this.wref === undefined)
            return { mid:'E_ELEM_REF_MISSING',elemtype:'wheel',id:this.id,idx,reftype:'constraint',name:'wref'};
        if (!this.model.constraintById(this.wref))
            return { mid:'E_ELEM_INVALID_REF',elemtype:'wheel',id:this.id,idx,reftype:'constraint',name:this.wref};
        else
            this.wref = this.model.constraintById(this.wref);

        return false;
    },
    /**
     * Initialize wheel shape. Multiple initialization allowed.
     * @method
     * @param {object} model - model parent.
     * @param {number} idx - index in shapes array.
     */
    init(model,idx) {
        this.model = model;
        if (!this.model.notifyValid(this.validate(idx))) return;

        this.w0 = this.w0 || 0;
        this.r = this.r || 20;
    },
    dependsOn(elem) {
        return this.p === elem || this.wref === elem;
    },
    asJSON() {
        return '{ "type":"'+this.type+'","p":"'+this.p.id+'","r":'+this.r
                + ((this.w0 && this.w0 > 0.0001) ? ',"w0":'+this.w0 : '')
                + (this.wref ? ',"wref":"'+this.wref.id+'"' : '')
                + ' }';
    },
    draw(g) {
        const w = this.wref ? ()=>this.wref.w : this.w0 || 0, r = this.r,
              sgamma = Math.sin(2*Math.PI/3), cgamma = Math.cos(2*Math.PI/3);
        g.beg({x:()=>this.p.x,y:()=>this.p.y,w})
            .lin({x1:0,y1:0,x2:r-4,y2:0,ls:"@nodcolor",lw:8,lc:"round"})
            .lin({x1:0,y1:0,x2:r-4,y2:0,ls:"@nodfill2",lw:5.5,lc:"round"})
            .lin({x1:0,y1:0,x2:r-4,y2:0,ls:"@nodfill",lw:3,lc:"round"})

            .lin({x1:0,y1:0,x2:(r-4)*cgamma,y2:(r-4)*sgamma,ls:"@nodcolor",lw:8,lc:"round"})
            .lin({x1:0,y1:0,x2:(r-4)*cgamma,y2:(r-4)*sgamma,ls:"@nodfill2",lw:5.5,lc:"round"})
            .lin({x1:0,y1:0,x2:(r-4)*cgamma,y2:(r-4)*sgamma,ls:"@nodfill",lw:3,lc:"round"})

            .lin({x1:0,y1:0,x2:(r-4)*cgamma,y2:-(r-4)*sgamma,ls:"@nodcolor",lw:8,lc:"round"})
            .lin({x1:0,y1:0,x2:(r-4)*cgamma,y2:-(r-4)*sgamma,ls:"@nodfill2",lw:5.5,lc:"round"})
            .lin({x1:0,y1:0,x2:(r-4)*cgamma,y2:-(r-4)*sgamma,ls:"@nodfill",lw:3,lc:"round"})

            .cir({x:0,y:0,r:r-2.5,ls:"#e6e6e6",fs:"transparent",lw:5})
            .cir({x:0,y:0,r,ls:"@nodcolor",fs:"transparent",lw:1})
            .cir({x:0,y:0,r:r-5,ls:"@nodcolor",fs:"transparent",lw:1})
         .end()
    }
}

/**
 * @param {object} - filled polygon shape.
 * @property {array} pts - array of points.
 * @property {string} p - referenced node id for reference point position.
 * @property {string} wref - referenced constraint id for orientation.
 * @property {string} [fill='#aaaaaa88'] - fill color.
 * @property {string} [stroke='transparent'] - stroke color.
 */
mec.shape.poly = {
    /**
     * Check polygon shape properties for validity.
     * @method
     * @param {number} idx - index in shape array.
     * @returns {boolean} false - if no error / warning was detected.
     */
    validate(idx) {
        if (this.pts === undefined)
            return { mid:'E_POLY_PTS_MISSING',id:this.id,idx};
        if (this.pts.length < 2)
            return { mid:'E_POLY_PTS_INVALID',id:this.id,idx};

        if (this.p === undefined)
            return { mid:'E_ELEM_REF_MISSING',elemtype:'polygon',id:this.id,idx,reftype:'node',name:'p'};
        if (!this.model.nodeById(this.p))
            return { mid:'E_ELEM_INVALID_REF',elemtype:'polygon',id:this.id,idx,reftype:'node',name:this.p};
        else
            this.p = this.model.nodeById(this.p);

        if (this.wref === undefined)
            return { mid:'E_ELEM_REF_MISSING',elemtype:'polygon',id:this.id,idx,reftype:'constraint',name:'wref'};
        if (!this.model.constraintById(this.wref))
            return { mid:'E_ELEM_INVALID_REF',elemtype:'polygon',id:this.id,idx,reftype:'constraint',name:this.wref};
        else
            this.wref = this.model.constraintById(this.wref);

        return false;
    },
    /**
     * Initialize polygon shape. Multiple initialization allowed.
     * @method
     * @param {object} model - model parent.
     * @param {number} idx - index in shapes array.
     */
    init(model,idx) {
        this.model = model;
        if (!this.model.notifyValid(this.validate(idx))) return;

        this.fill = this.fill || '#aaaaaa88';
        this.stroke = this.stroke || 'transparent';
    },
    get x0() { return  this.p.x0; },
    get y0() { return  this.p.y0; },
    get w0() { return  this.wref.w0; },
    get w() { return  this.wref.w - this.wref.w0; },
    get x() {
        const w = this.wref.w - this.wref.w0;
        return this.p.x - Math.cos(w)*this.p.x0 + Math.sin(w)*this.p.y0;
    },
    get y() {
        const w = this.wref.w - this.wref.w0;
        return this.p.y - Math.sin(w)*this.p.x0 - Math.cos(w)*this.p.y0;
    },
    dependsOn(elem) {
        return this.p === elem || this.wref === elem;
    },
    asJSON() {
        return '{ "type":"'+this.type+'","pts":'+JSON.stringify(this.pts)+',"p":"'+this.p.id+'"'
                + (this.wref ? ',"wref":"'+this.wref.id+'"' : '')
                + ((this.w0 && this.w0 > 0.0001 && !(this.wref.w0 === this.w0 )) ? ',"w0":'+this.w0 : '')
                + (this.stroke && !(this.stroke === 'transparent') ? ',"stroke":"'+this.stroke+'"' : '')
                + (this.fill && !(this.fill === '#aaaaaa88') ? ',"fill":"'+this.fill+'"' : '')
                + ' }';
    },
    draw(g) {
        g.ply({pts:this.pts,closed:true,x:()=>this.x,y:()=>this.y,w:()=>this.w,fs:this.fill,ls:this.stroke})
    }
}

/**
 * @param {object} - image shape.
 * @property {string} uri - image uri
 * @property {string} p - referenced node id for center point position.
 * @property {string} [wref] - referenced constraint id for orientation.
 * @property {number} [w0=0] - start / offset angle [rad].
 * @property {number} [xoff=0] - x offset value.
 * @property {number} [yoff=0] - y offset value.
 * @property {number} [scl=1] - scaling factor.
 */
mec.shape.img = {
    /**
     * Check image shape properties for validity.
     * @method
     * @param {number} idx - index in shape array.
     * @returns {boolean} false - if no error / warning was detected.
     */
    validate(idx) {
        if (this.uri === undefined)
            return { mid:'E_IMG_URI_MISSING',id:this.id,idx};

        if (this.p === undefined)
            return { mid:'E_ELEM_REF_MISSING',elemtype:'image',id:this.id,idx,reftype:'node',name:'p'};
        if (!this.model.nodeById(this.p))
            return { mid:'E_ELEM_INVALID_REF',elemtype:'image',id:this.id,idx,reftype:'node',name:this.p};
        else
            this.p = this.model.nodeById(this.p);

        if (this.wref && !this.model.constraintById(this.wref))
            return { mid:'E_ELEM_INVALID_REF',elemtype:'image',id:this.id,idx,reftype:'constraint',name:this.wref};
        else
            this.wref = this.model.constraintById(this.wref);

        return false;
    },
    /**
     * Initialize polygon shape. Multiple initialization allowed.
     * @method
     * @param {object} model - model parent.
     * @param {number} idx - index in shapes array.
     */
    init(model,idx) {
        this.model = model;
        if (!this.model.notifyValid(this.validate(idx))) return;

        this.w0 = this.w0 || 0;
        this.xoff = this.xoff || 0;
        this.yoff = this.yoff || 0;
        this.scl = this.scl || 1;
    },
    dependsOn(elem) {
        return this.p === elem || this.wref === elem;
    },
    asJSON() {
        return '{ "type":"'+this.type+'","uri":"'+this.uri+'","p":"'+this.p.id+'"'
                + (this.wref ? ',"wref":"'+this.wref.id+'"' : '')
                + ((this.w0 && Math.abs(this.w0) > 0.0001) ? ',"w0":'+this.w0 : '')
                + ((this.xoff && Math.abs(this.xoff) > 0.0001) ? ',"xoff":'+this.xoff : '')
                + ((this.yoff && Math.abs(this.yoff) > 0.0001) ? ',"yoff":'+this.yoff : '')
                + ((this.scl && Math.abs(this.scl - 1) > 0.0001) ? ',"scl":'+this.scl : '')
                + ' }';
    },
    draw(g) {
        const w0 = this.w0 || 0, w = this.wref ? ()=>this.wref.w + w0 : w0;
        g.img({uri:this.uri,x:()=>this.p.x,y:()=>this.p.y,w,scl:this.scl,xoff:this.xoff,yoff:this.yoff})
    }
}


/**
 * @param {object} - line with fixed length
 * @property {string} p1 - referenced node id for start point position.
 * @property {string} p2 - referenced node id for end point position.
 * @property {number} wref - if p2 is not provided wref will be used as reference
 * @property {number} len - length of lin
 * @property {string} txt - optional label
 * @property {string} lintype - optional type
 */
 mec.shape.line = {
    /**
     * Check line shape properties for validity.
     * @method
     * @param {number} idx - index in shape array.
     * @returns {boolean} false - if no error / warning was detected.
     */
    validate(idx) {
        //check p1
        if (this.p1 === undefined)
            return { mid:'E_ELEM_REF_MISSING',elemtype:'line',id:this.id,idx,reftype:'node',name:'p1'};
        if (!this.model.nodeById(this.p1))
            return { mid:'E_ELEM_INVALID_REF',elemtype:'line',id:this.id,idx,reftype:'node',name:this.p1};
        else
            this.p1 = this.model.nodeById(this.p1);
        //check wref or p2
        if (this.wref!==undefined)
        {
             if (this.wref && !this.model.constraintById(this.wref))
                return { mid:'E_ELEM_INVALID_REF',elemtype:'line',id:this.id,idx,reftype:'constraint',name:this.wref};
            else
                this.wref = this.model.constraintById(this.wref);
        }
        else{
                if (this.p2 === undefined)
                    return { mid:'E_ELEM_REF_MISSING',elemtype:'line',id:this.id,idx,reftype:'node',name:'p2'};
                if (!this.model.nodeById(this.p2))
                    return { mid:'E_ELEM_INVALID_REF',elemtype:'line',id:this.id,idx,reftype:'node',name:this.p2};
                else
                    this.p2 = this.model.nodeById(this.p2);
        }
        //check len
        if (this.len === undefined ||this.len<0)
            return { mid:'E_LEN_MISSING',elemtype:'line',id:this.id,idx};


        return false;
    },
    /**
     * Initialize line shape. Multiple initialization allowed.
     * @method
     * @param {object} model - model parent.
     * @param {number} idx - index in shapes array.
     */
    init(model,idx) {
        this.model = model;
        this.model.notifyValid(this.validate(idx));
    },
    dependsOn(elem) {
        return this.p1 === elem || this.p2 === elem;
    },
    asJSON() {
        let jsonString = '{ "type":"'+this.type+'","p1":"'+this.p1.id+'",    ';
        if (this.p2!==undefined)
        {
            jsonString+=' "p2":"'+this.p2.id+'"   ';
        }
        else{
            jsonString+= this.wref ? ' "wref":"'+this.wref.id+'"   '  : '' ;
        }
        jsonString+=',"len":"'+this.len+'"';
        jsonString+= this.color ? ' ,"color":"'+this.color+'"   '  : '' ;
        jsonString+= this.txt ? ' ,"txt":"'+this.txt+'"   '  : '' ;
        
        jsonString+= this.lintype ? ' ,"lintype":"'+this.lintype+'"   '  : '' ;
        jsonString+=' }';
        return jsonString;
    },
    draw(g) {
        const x1 = this.p1.x,
                y1 = this.p1.y;
        let w;
        if (this.p2!==undefined)
        {
           const px2 = this.p2.x,
                 py2 =  this.p2.y;
            w=()=> Math.atan2(this.p2.y-this.p1.y,this.p2.x-this.p1.x);
          //  console.log("p2 defined");
        }
        else{
            w=()=>this.wref.w;
            //console.log("w defined");
        }
       const x2=Math.cos(w)*this.len+x1;
       const y2=Math.sin(w)*this.len+y1;

       //add text g.txt

       switch(this.lintype)
       {
           case'normal':
                g.beg({x:()=>this.p1.x,y:()=>this.p1.y,w:w});
                    g.lin({x1:0,y1:0,x2:this.len,y2:0});
                g.end();
                break;
            case 'grd1':
                g.beg({x:()=>this.p1.x,y:()=>this.p1.y,w:w});
                    g.grdline({x1:0,y1:0,x2:this.len,y2:0, typ:'mid'});
                g.end();
                break;
            case 'grd2':
                g.beg({x:()=>this.p1.x,y:()=>this.p1.y,w:w});
                    g.grdline({x1:0,y1:0,x2:this.len,y2:0, typ:'out'});
                g.end();
                break;
            default:
                g.beg({x:()=>this.p1.x,y:()=>this.p1.y,w:w});
                    g.lin({x1:0,y1:0,x2:this.len,y2:0});
                g.end();
                break;
       }

    }
}
/**
 * @param {object} - Schieber shape.
 * @property {string} p - referenced node id for position.
 * @property {string} [wref] - referenced constraint id for orientation.
 * @property {number} [w0] - initial angle / -difference.
 */
 mec.shape.Schieber = {
    /**
     * Check Schieber shape properties for validity.
     * @method
     * @param {number} idx - index in shape array.
     * @returns {boolean} false - if no error / warning was detected.
     */
    validate(idx) {
        if (this.p === undefined)
            return { mid:'E_ELEM_REF_MISSING',elemtype:'Schieber',id:this.id,idx,reftype:'node',name:'p'};
        if (!this.model.nodeById(this.p))
            return { mid:'E_ELEM_INVALID_REF',elemtype:'Schieber',id:this.id,idx,reftype:'node',name:this.p};
        else
            this.p = this.model.nodeById(this.p);

        if (this.wref && !this.model.constraintById(this.wref))
            return { mid:'E_ELEM_INVALID_REF',elemtype:'Schieber',id:this.id,idx,reftype:'constraint',name:this.wref};
        else
            this.wref = this.model.constraintById(this.wref);

        return false;
    },
    /**
     * Initialize Schieber shape. Multiple initialization allowed.
     * @method
     * @param {object} model - model parent.
     * @param {number} idx - index in shapes array.
     */
    init(model,idx) {
        this.model = model;
        if (!this.model.notifyValid(this.validate(idx))) return;

        this.w0 = this.w0 || 0;
        this.fill=this.fill||'white';
    },
    /**
     * Check shape for dependencies on another element => called by mec.model
     * @method
     * @param {object} elem - element to test dependency for.
     * @returns {boolean} true, dependency exists.
     */
    dependsOn(elem) {
        return this.p === elem || this.wref === elem;
    },
    asJSON() {
        return '{ "type":"'+this.type+'","p":"'+this.p.id+'"'
                + ((this.w0 && this.w0 > 0.0001) ? ',"w0":'+this.w0 : '')
                + (this.wref ? ',"wref":"'+this.wref.id+'"' : '')
                + ((this.fill ||this.fill==='white') ? ',"fill":"'+this.fill+'"' : '')
                + ' }';
    },
    draw(g) {
        const w = this.wref ? ()=>this.wref.w : this.w0 || 0;
      //  g.use({grp:'slider',x:400,y:200});
        g.beg({x:()=>this.p.x,y:()=>this.p.y,w})
           .rec({x:-16,y:-10,b:32,h:20,ls:"@nodcolor",fs:this.fill,lw:1,lj:"round"})
  .end()
    }
}

/**
 * @param {object} - Ecke shape.
 * @property {string} p1 - referenced node id for position.
 * @property {string} [p2] - referenced constraint id for position2.
 * @property {string} [p3] - referenced constraint id for position3.
 */
 mec.shape.Ecke = {
    /**
     * Check Ecke shape properties for validity.
     * @method
     * @param {number} idx - index in shape array.
     * @returns {boolean} false - if no error / warning was detected.
     */
    validate(idx) {
        if (this.p1 === undefined)
            return { mid:'E_ELEM_REF_MISSING',elemtype:'Ecke',id:this.id,idx,reftype:'node',name:'p1'};
        if (!this.model.nodeById(this.p1))
            return { mid:'E_ELEM_INVALID_REF',elemtype:'Ecke',id:this.id,idx,reftype:'node',name:this.p1};
        else
            this.p1 = this.model.nodeById(this.p1);

        if (this.p2 === undefined)
            return { mid:'E_ELEM_REF_MISSING',elemtype:'Ecke',id:this.id,idx,reftype:'node',name:'p2'};
        if (!this.model.nodeById(this.p2))
            return { mid:'E_ELEM_INVALID_REF',elemtype:'Ecke',id:this.id,idx,reftype:'node',name:this.p2};
        else
            this.p2 = this.model.nodeById(this.p2);

        if (this.p3 === undefined)
            return { mid:'E_ELEM_REF_MISSING',elemtype:'Ecke',id:this.id,idx,reftype:'node',name:'p3'};
        if (!this.model.nodeById(this.p3))
            return { mid:'E_ELEM_INVALID_REF',elemtype:'Ecke',id:this.id,idx,reftype:'node',name:this.p3};
        else
            this.p3 = this.model.nodeById(this.p3);


        return false;
    },
    /**
     * Initialize corner shape. Multiple initialization allowed.
     * @method
     * @param {object} model - model parent.
     * @param {number} idx - index in shapes array.
     */
    init(model,idx) {
        this.model = model;
        if (!this.model.notifyValid(this.validate(idx))) return;

        this.fill=this.fill||'black';
        this.size=this.size||'30';
        this.w0 = this.w0 || 0;
        this.side=this.side||1;
    },
    /**
     * Check shape for dependencies on another element => called by mec.model
     * @method
     * @param {object} elem - element to test dependency for.
     * @returns {boolean} true, dependency exists.
     */
    dependsOn(elem) {
        return this.p1 === elem || this.p3 === elem|| this.p2 === elem;
    },
    asJSON() {
      
        let jsonString= '{ "type":"'+this.type+'","p1":"'+this.p1.id+'","p2":"'+this.p2.id+'","p3":"'+this.p3.id+'"';
        jsonString+= (this.size ||this.size===20)? ' ,"size":"'+this.size+'"   '  : '' ;
        jsonString+= (this.side ||this.side<0)? ' ,"side":"'+this.side+'"   '  : '' ;
        jsonString+=' }';
        return jsonString;
    },
    draw(g) {
        const alpha1=Math.atan2(this.p1.y-this.p2.y,this.p1.x-this.p2.x);
        const alpha2=Math.atan2(this.p3.y-this.p2.y,this.p3.x-this.p2.x);
        let dw=alpha2-alpha1;
        if (this.side<1)
            dw=2*Math.PI-dw;
        g.beg({x:()=>this.p2.x,y:()=>this.p2.y,w:()=>Math.atan2(this.p1.y-this.p2.y,this.p1.x-this.p2.x)});
        g.p().m({x:this.size,y:0})
            .q({x1:this.size*Math.cos(dw/2*this.side)/2,y1:this.size*Math.sin(dw/2*this.side)/2,x:this.size*Math.cos(dw*this.side),y:this.size*Math.sin(dw*this.side)})            
            .l({x:0,y:0})
            .l({x:this.size,y:0})
            .z()            
            .fill({fs:this.fill});
        g.end();        
    }
}

/**
 * @param {object} - corner shape.
 * @property {string} p - referenced node id for position.
 * @property {string} [p1] - referenced node id for position2.
 * @property {string} [p2] - referenced node id for position3.
 * @property {string} [wref1] - referenced constraint id for angle1.
 * @property {string} [wref2] - referenced constraint id for angle2.
 */
 mec.shape.corner = {
    /**
     * Check corner shape properties for validity.
     * @method
     * @param {number} idx - index in shape array.
     * @returns {boolean} false - if no error / warning was detected.
     */
    validate(idx) {
        if (this.p === undefined)
            return { mid:'E_ELEM_REF_MISSING',elemtype:'corner',id:this.id,idx,reftype:'node',name:'p'};
        if (!this.model.nodeById(this.p))
            return { mid:'E_ELEM_INVALID_REF',elemtype:'corner',id:this.id,idx,reftype:'node',name:this.p};
        else
            this.p = this.model.nodeById(this.p);

        //first reference
        if (this.wref1 === undefined){
            if (this.p1===undefined){
                return { mid:'E_ELEM_REF_MISSING',elemtype:'corner',id:this.id,idx,reftype:'node',name:'wref1'};
            }
            else
            {
                if (!this.model.nodeById(this.p1))
                    return { mid:'E_ELEM_INVALID_REF',elemtype:'corner',id:this.id,idx,reftype:'node',name:this.p1};
                else
                    this.p1 = this.model.nodeById(this.p1);
            }
        }
        else {
            if (!this.model.constraintById(this.wref1))
                return { mid:'E_ELEM_INVALID_REF',elemtype:'corner',id:this.id,idx,reftype:'constraint',name:this.wref1};
            else
                this.wref1 = this.model.constraintById(this.wref1);
        }

        //second reference
        if (this.wref2 === undefined){
            if (this.p2===undefined){
                return { mid:'E_ELEM_REF_MISSING',elemtype:'corner',id:this.id,idx,reftype:'node',name:'wref2'};
            }
            else
            {
                if (!this.model.nodeById(this.p2))
                    return { mid:'E_ELEM_INVALID_REF',elemtype:'corner',id:this.id,idx,reftype:'node',name:this.p2};
                else
                    this.p2 = this.model.nodeById(this.p2);
            }
        }
        else {
            if (!this.model.constraintById(this.wref2))
                return { mid:'E_ELEM_INVALID_REF',elemtype:'corner',id:this.id,idx,reftype:'constraint',name:this.wref2};
            else
                this.wref2 = this.model.constraintById(this.wref2);
        }

        


        return false;
    },
    /**
     * Initialize corner shape. Multiple initialization allowed.
     * @method
     * @param {object} model - model parent.
     * @param {number} idx - index in shapes array.
     */
    init(model,idx) {
        this.model = model;
        if (!this.model.notifyValid(this.validate(idx))) return;

        this.fill=this.fill||'black';
        this.size=this.size||'30';
        
    },
    /**
     * Check shape for dependencies on another element => called by mec.model
     * @method
     * @param {object} elem - element to test dependency for.
     * @returns {boolean} true, dependency exists.
     */
    dependsOn(elem) {

        return this.p === elem || this.wref1 === elem|| this.wref2 === elem ||this.p1 === elem ||this.p2 === elem;
    },
    asJSON() {
      
        let jsonString= '{ "type":"'+this.type+'","p":"'+this.p.id+'"';
        if (this.wref1===undefined)
            jsonString+=',"p1":"'+this.p1.id+'"';
        else
            jsonString+=',"wref1":"'+this.wref1.id+'"';

        if (this.wref2===undefined)
            jsonString+=',"p2":"'+this.p2.id+'"';
        else
            jsonString+=',"wref2":"'+this.wref2.id+'"';

        jsonString+= (this.size ||this.size===20)? ' ,"size":"'+this.size+'"   '  : '' ;
        jsonString+=' }';
        return jsonString;
    },
    draw(g) {
        const w1=()=>this.wref1===undefined? Math.atan2(this.p1.x-this.p.x,this.p1.y-this.p.y) :this.wref1.w;
       const w2=()=>this.wref2===undefined? Math.atan2(this.p2.x-this.p.x,this.p2.y-this.p.y) :this.wref2.w;
       let dw=()=>w2-w1;
       if (this.wref1===undefined && this.wref2===undefined)
       {

       }
      const angle1=this.wref1===undefined? Math.atan2(this.p1.x-this.p.x,this.p1.y-this.p.y) :this.wref1.w;
      const   angle2=this.wref2===undefined? Math.atan2(this.p2.x-this.p.x,this.p2.y-this.p.y) :this.wref2.w;
   //    dw=angle2-angle1;
        
              const W1=w1;
   // console.log(`w1${W1}`);
    console.log(`w2${w2}`);
    console.log(`dw${dw+2}`);
/*const l=()=>this.size;//length
        const alpha1=Math.atan2(this.p1.y-this.p2.y,this.p1.x-this.p2.x);
        const alpha2=Math.atan2(this.p3.y-this.p2.y,this.p3.x-this.p2.x);

        const A1={x:Math.cos(alpha1)*this.size+this.p2.x,y:Math.sin(alpha1)*this.size+this.p2.y};
        const A2={x:Math.cos(alpha2)*this.size+this.p2.x,y:Math.sin(alpha2)*this.size+this.p2.y};
        const M={x:(A1.x+A2.y)/2,y:(A1.x+A2.y)/2};
        let cP={x:0.9*M.x+0.1*this.p2.x,
                y:0.9*M.y+0.1*this.p2.y};
         cP={x:0.4*A1.x+0.4*A2.x+0.2*this.p2.x,
            y:0.4*A1.y+0.4*A2.y+0.2*this.p2.y};
      //  cP={x:0.2*(this.p1.x + this.p3.x)+0.6*this.p2.x,            y:0.4*(this.p1.y + this.p3.y)+0.6*this.p2.y};
        
        let toString=function (P){return `${Math.round(P.x)} ${Math.round(P.y)}`;};
        console.log(`alpha1=${Math.round(alpha1*180/Math.PI)} \n alpha2=${alpha2*180/Math.PI} `);
       console.log(`A1=${toString(A1)}\np2=${toString(p2)}\nA2=${toString(A2)}`);
       console.log(`cP: ${toString(cP)}`);
*/
        g.beg({x:()=>this.p.x,y:()=>this.p.y,w:w1});
            //g.cir({x:0,y:0,r:10,ls:'black',fs:'black'});
            g.p().m({x:this.size,y:0})
                .l({x:Math.cos(dw)*this.size,y:Math.sin(dw)*this.size})
                .l({x:0,y:0})
                //.q({x1:cP.x,y1:cP.y,x:A2.x,y:A2.y})
                //.l({x:A2.x,y:A2.y})
                .l({x:this.size,y:0})
                .z()
                .stroke({ls:'#888',lw:2,lc:'round',lj:'round'}) ;           
            //.fill({fs:this.fill});
        g.end();
        g.beg({x:Math.cos(dw)*this.size,y:()=>this.p.y,w:w1});
            const x1=()=>0,
                x2=()=>0,
                y1=()=>100,
                y3=()=>1;
                    g.lin({x1,y1,x2:100,y2:70});
        g.end();
        

        
    }
}