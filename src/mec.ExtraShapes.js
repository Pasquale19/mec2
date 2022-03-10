console.log('Extra Shapes loaded');

/**
 * @param {object} - slider2 shape.
 * @property {string} p - referenced node id for position.
 * @property {string} [wref] - referenced constraint id for orientation.
 * @property {number} [w0] - initial angle / -difference.
 */
 mec.shape.slider2 = {
    /**
     * Check slider2 shape properties for validity.
     * @method
     * @param {number} idx - index in shape array.
     * @returns {boolean} false - if no error / warning was detected.
     */
    validate(idx) {
        if (this.p === undefined)
            return { mid:'E_ELEM_REF_MISSING',elemtype:'slider2',id:this.id,idx,reftype:'node',name:'p'};
        if (!this.model.nodeById(this.p))
            return { mid:'E_ELEM_INVALID_REF',elemtype:'slider2',id:this.id,idx,reftype:'node',name:this.p};
        else
            this.p = this.model.nodeById(this.p);

        if (this.wref && !this.model.constraintById(this.wref))
            return { mid:'E_ELEM_INVALID_REF',elemtype:'slider2',id:this.id,idx,reftype:'constraint',name:this.wref};
        else
            this.wref = this.model.constraintById(this.wref);

        return false;
    },
    /**
     * Initialize slider2 shape. Multiple initialization allowed.
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
                + ' }';
    },
    draw(g) {
        const w = this.wref ? ()=>this.wref.w : this.w0 || 0;
      //  g.use({grp:'slider',x:400,y:200});
        g.beg({x:()=>this.p.x,y:()=>this.p.y,w})
           .rec({x:-16,y:-10,b:32,h:20,ls:"@nodcolor",fs:"@linkfill",lw:1,lj:"round"})
  .end()
    }
}