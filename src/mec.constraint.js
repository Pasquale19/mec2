/**
 * mec.constraint (c) 2018 Stefan Goessner
 * @license MIT License
 * @requires mec.core.js
 * @requires mec.node.js
 * @requires mec.drive.js
 * @requires mec.model.js
 * @requires g2.js
 */
"use strict";

/**
 * Wrapper class for extending plain constraint objects, usually coming from JSON objects.
 * @method
 * @returns {object} constraint object.
 * @param {object} - plain javascript constraint object.
 * @property {string} id - constraint id.
 * @property {string|number} [idloc='left'] - label location ['left','right',-1..1]
 * @property {string} p1 - first point id.
 * @property {string} p2 - second point id.
 * @property {object} [ori] - orientation object.
 * @property {string} [ori.type] - type of orientation constraint ['free'|'const'|'drive'].
 * @property {number} [ori.w0] - initial angle [rad].
 * @property {string} [ori.ref] - referenced constraint id.
 * @property {string} [ori.passive] - no impulses back to referenced value (default: `false`).
 * @property {string} [ori.reftype] - referencing other orientation or length value ['ori'|'len'].
 * @property {number} [ori.ratio] - ratio to referencing value.
 * @property {string} [ori.func] - drive function name from `mec.drive` object ['linear'|'quadratic', ...].
 *                                 If the name points to a function in `mec.drive` (not an object as usual)
 *                                 it will be called with `ori.arg` as an argument.
 * @property {string} [ori.arg] - drive function argument.
 * @property {number} [ori.t0] - drive parameter start value.
 * @property {number} [ori.Dt] - drive parameter value range.
 * @property {number} [ori.Dw] - drive angular range [rad].
 * @property {boolean} [ori.bounce=false] - drive oscillate between drivestart and driveend.
 * @property {number} [ori.repeat] - drive parameter scaling Dt.
 * @property {boolean} [ori.input=false] - drive flags for actuation via an existing range-input with the same id.
 * @property {object} [len] - length object.
 * @property {string} [len.type] - type of length constraint ['free'|'const'|'ref'|'drive'].
 * @property {number} [len.r0] - initial length.
 * @property {string} [len.ref] - referenced constraint id.
 * @property {string} [len.passive] - no impulses back to referenced value (default: `false`).
 * @property {string} [len.reftype] - referencing other orientation or length value ['ori'|'len'].
 * @property {number} [len.ratio] - ratio to referencing value.
 * @property {string} [len.func] - drive function name ['linear'|'quadratic', ...].
 * @property {string} [len.arg] - drive function argument.
 * @property {number} [len.t0] - drive parameter start value.
 * @property {number} [len.Dt] - drive parameter value range.
 * @property {number} [len.Dr] - drive linear range.
 * @property {boolean} [len.bounce=false] - drive oscillate between drivestart and driveend.
 * @property {number} [len.repeat] - drive parameter scaling Dt.
 * @property {boolean} [len.input=false] - drive flags for actuation via an existing range-input with the same id.
 */
mec.constraint = {
    extend(c) { Object.setPrototypeOf(c, this.prototype); c.constructor(); return c; },
    prototype: {
        constructor() {}, // always parameterless .. !
        /**
         * Check constraint properties for validity.
         * @method
         * @param {number} idx - index in constraint array.
         * @returns {boolean | object} true - if no error was detected, error object otherwise.
         */
        validate(idx) {
            let tmp, warn = false;

            if (!this.id)
                return { mid:'E_ELEM_ID_MISSING',elemtype:'constraint',idx };
            if (this.model.elementById(this.id) !== this)
                return { mid:'E_ELEM_ID_AMBIGIOUS', id:this.id };
            if (!this.p1)
                return { mid:'E_CSTR_NODE_MISSING', id:this.id, loc:'start', p:'p1' };
            if (!this.p2)
                return { mid:'E_CSTR_NODE_MISSING', id:this.id, loc:'end', p:'p2' };
            if (typeof this.p1 === 'string') {
                if (!(tmp=this.model.nodeById(this.p1)))
                    return { mid:'E_CSTR_NODE_NOT_EXISTS', id:this.id, loc:'start', p:'p1', nodeId:this.p1 };
                else
                    this.p1 = tmp;
            }
            if (typeof this.p2 === 'string') {
                if (!(tmp=this.model.nodeById(this.p2)))
                    return { mid:'E_CSTR_NODE_NOT_EXISTS', id:this.id, loc:'end', p:'p2', nodeId:this.p2 };
                else
                    this.p2 = tmp;
            }
            if (mec.isEps(this.p1.x - this.p2.x) && mec.isEps(this.p1.y - this.p2.y))
                warn = { mid:'W_CSTR_NODES_COINCIDE', id:this.id, p1:this.p1.id, p2:this.p2.id };

            if (!this.hasOwnProperty('ori'))
                this.ori = { type:'free' };
            if (!this.hasOwnProperty('len'))
                this.len = { type:'free' };
            if (!this.ori.hasOwnProperty('type'))
                this.ori.type = 'free';
            if (!this.len.hasOwnProperty('type'))
                this.len.type = 'free';

            if (typeof this.ori.ref === 'string') {
                if (!(tmp=this.model.constraintById(this.ori.ref)))
                    return { mid:'E_CSTR_REF_NOT_EXISTS', id:this.id, sub:'ori', ref:this.ori.ref };
                else
                    this.ori.ref = tmp;

                if (this.ori.type === 'drive') {
                    if (this.ori.ref[this.ori.reftype || 'ori'].type === 'free')
                        return { mid:'E_CSTR_DRIVEN_REF_TO_FREE', id:this.id, sub:'ori', ref:this.ori.ref.id, reftype:this.ori.reftype || 'ori' };
                    if (this.ratio !== undefined && this.ratio !== 1)
                        return { mid:'E_CSTR_RATIO_IGNORED', id:this.id, sub:'ori', ref:this.ori.ref.id, reftype:this.ori.reftype || 'ori' };
                }
            }
            if (typeof this.len.ref === 'string') {
                if (!(tmp=this.model.constraintById(this.len.ref)))
                    return { mid:'E_CSTR_REF_NOT_EXISTS', id:this.id, sub:'len', ref:this.len.ref };
                else
                    this.len.ref = tmp;

                if (this.len.type === 'drive') {
                    if (this.len.ref[this.len.reftype || 'len'].type === 'free')
                        return { mid:'E_CSTR_DRIVEN_REF_TO_FREE', id:this.id, sub:'len', ref:this.len.ref.id, reftype:this.len.reftype || 'len' };
                    if (this.ratio !== undefined && this.ratio !== 1)
                        return { mid:'E_CSTR_RATIO_IGNORED', id:this.id, sub:'len', ref:this.ori.ref.id, reftype:this.ori.reftype || 'len' };
                }
            }
            return warn;
        },
        /**
         * Initialize constraint. Multiple initialization allowed.
         * @method
         * @param {object} model - model parent.
         * @param {number} idx - index in constraint array.
         */
        init(model, idx) {
            this.model = model;
            if (!this.model.notifyValid(this.validate(idx))) return;

            const ori = this.ori, len = this.len;

            // initialize absolute magnitude and orientation
            this.initVector();

            this._angle = 0;   // infinite extensible angle

            if      (ori.type === 'free')  this.init_ori_free(ori);
            else if (ori.type === 'const') this.init_ori_const(ori);
            else if (ori.type === 'drive') this.init_ori_drive(ori);

            if      (len.type === 'free')  this.init_len_free(len);
            else if (len.type === 'const') this.init_len_const(len);
            else if (len.type === 'drive') this.init_len_drive(len);

            // trigonometric cache
            this._angle = this.w0;
            this.sw = Math.sin(this.w); this.cw = Math.cos(this.w);

            // lagrange identifiers
            this.lambda_r = this.dlambda_r = 0;
            this.lambda_w = this.dlambda_w = 0;
        },
        /**
         * Init vector magnitude and orientation.
         * Referenced constraints can be assumed to be already initialized here.
         */
/*
         initVector() {
            const correctLen = this.len.hasOwnProperty('r0') && !this.len.hasOwnProperty('ref'),
                  correctOri = this.ori.hasOwnProperty('w0') && !this.ori.hasOwnProperty('ref');
            this.r0 = correctLen ? this.len.r0 : Math.hypot(this.ay,this.ax);
            this.w0 = correctOri ? this.ori.w0 : Math.atan2(this.ay,this.ax);

            if (correctLen || correctOri) {
                this.p2.x = this.p1.x + this.r0*Math.cos(this.w0);
                this.p2.y = this.p1.y + this.r0*Math.sin(this.w0);
            }
        },
*/
        initVector() {
            let correctLen = false, correctOri = false;
            if (this.len.hasOwnProperty('r0')) { 
                this.r0 = this.len.r0;                 // presume absolute value ...
                correctLen = true;
                if (this.len.hasOwnProperty('ref')) {  // relative ...
                    if (this.len.reftype !== 'ori')    // reftype === 'len'
                        this.r0 += (this.len.ratio||1)*this.len.ref.r0; // interprete as relative delta len ...
                //  else                               // todo ...
                }
            }
            else
                this.r0 = Math.hypot(this.ay,this.ax);

            if (this.ori.hasOwnProperty('w0')) { 
                this.w0 = this.ori.w0;                 // presume absolute value ...
                correctOri = true;
                if (this.ori.hasOwnProperty('ref')) {  // relative ...
                    if (this.ori.reftype !== 'len')    // reftype === 'ori'
                        this.w0 += (this.ori.ratio||1)*this.ori.ref.w0; // interprete as relative delta angle ...
                 // else                               // todo ...
                }
            }
            else
                this.w0 = Math.atan2(this.ay,this.ax);

            if (correctLen || correctOri) {
                this.p2.x = this.p1.x + this.r0*Math.cos(this.w0);
                this.p2.y = this.p1.y + this.r0*Math.sin(this.w0);
            }
        },
        /**
         * Track unlimited angle
         */
        angle(w) {
            return this._angle = mec.infAngle(this._angle,w);
        },
        /**
         * Reset constraint
         */
        reset() {
            this.initVector();
            this._angle = this.w0;
            this.lambda_r = this.dlambda_r = 0;
            this.lambda_w = this.dlambda_w = 0;
        },
        get type() {
            const ori = this.ori, len = this.len;
            return ori.type === 'free' && len.type === 'free' ? 'free'
                 : ori.type === 'free' && len.type !== 'free' ? 'rot'
                 : ori.type !== 'free' && len.type === 'free' ? 'tran'
                 : ori.type !== 'free' && len.type !== 'free' ? 'ctrl'
                 : 'invalid';
        },
        get initialized() { return this.model !== undefined },
        get dof() {
            return (this.ori.type === 'free' ? 1 : 0) +
                   (this.len.type === 'free' ? 1 : 0);
        },
        get lenTol() { return mec.tol.len[this.model.tolerance]; },

        // analysis getters
        /**
         * Force value in [N]
         */
        get force() { return -this.lambda_r; },
        get forceAbs() { return -this.lambda_r; },  // deprecated !
        /**
         * Moment value in [N*u]
         */
        get moment() { return -this.lambda_w*this.r; },
        /**
         * Instantaneous centre of velocity
         */
        get pole() {
            return { x:this.p1.x-this.p1.yt/this.wt, y:this.p1.y+this.p1.xt/this.wt };
        },
        get velPole() { return this.pole; },
        /**
         * Inflection pole
         */
        get inflPole() {
            return {
                x:this.p1.x + this.p1.xtt/this.wt**2-this.wtt/this.wt**3*this.p1.xt,
                y:this.p1.y + this.p1.ytt/this.wt**2-this.wtt/this.wt**3*this.p1.yt
            };
        },
        /**
         * Acceleration pole
         */
        get accPole() {
            const wt2  = this.wt**2,
                  wtt  = this.wtt,
                  den  = wtt**2 + wt2**2;
            return {
                x:this.p1.x + (wt2*this.p1.xtt - wtt*this.p1.ytt)/den,
                y:this.p1.y + (wt2*this.p1.ytt + wtt*this.p1.xtt)/den
            };
        },

        /**
         * Number of active drives.
         * @method
         * @param {number} t - current time.
         * @returns {int} Number of active drives.
         */
        activeDriveCount(t) {
            let ori = this.ori, len = this.len, drvCnt = 0;
            if (ori.type === 'drive' && (ori.input || t <= ori.t0 + ori.Dt*(ori.bounce ? 2 : 1)*(ori.repeat || 1) + 0.5*this.model.timer.dt)) 
                ++drvCnt;
            if (len.type === 'drive' && (len.input || t <= len.t0 + len.Dt*(len.bounce ? 2 : 1)*(len.repeat || 1) + 0.5*this.model.timer.dt))
                ++drvCnt;
            return drvCnt;
        },
        /**
         * Check constraint for dependencies on another element.
         * @method
         * @param {object} elem - element to test dependency for.
         * @returns {boolean} dependency exists.
         */
        dependsOn(elem) {
            return this.p1 === elem
                || this.p2 === elem
                || this.ori && this.ori.ref === elem
                || this.len && this.len.ref === elem;
        },
        /**
         * Check constraint for deep (indirect) dependency on another element.
         * @method
         * @param {object} elem - element to test deep dependency for.
         * @returns {boolean} dependency exists.
         */
        /*
        deepDependsOn(target) {
            return this === target
                || this.dependsOn(target)
                || this.model.deepDependsOn(this.p1,target)
                || this.model.deepDependsOn(this.p2,target)
                || this.ori && this.model.deepDependsOn(this.ori.ref,target)
                || this.len && this.model.deepDependsOn(this.len.ref,target);
        },
        */
        // privates
        get ax() { return this.p2.x - this.p1.x },
        get ay() { return this.p2.y - this.p1.y },
        get axt() { return this.p2.xtcur - this.p1.xtcur },
        get ayt() { return this.p2.ytcur - this.p1.ytcur },
        get axtt() { return this.p2.xtt - this.p1.xtt },
        get aytt() { return this.p2.ytt - this.p1.ytt },
        // default orientational constraint equations
        get ori_C() { return this.ay*this.cw - this.ax*this.sw; },
        get ori_Ct() { return this.ayt*this.cw - this.axt*this.sw - this.wt*this.r; },
        get ori_mc() {
            const imc = mec.toZero(this.p1.im + this.p2.im);
            return imc ? 1/imc : 0;
        },
        // default magnitude constraint equations
        get len_C() { return this.ax*this.cw + this.ay*this.sw - this.r; },
        get len_Ct() { return this.axt*this.cw + this.ayt*this.sw - this.rt; },
        get len_mc() {
            let imc = mec.toZero(this.p1.im + this.p2.im);
            return (imc ? 1/imc : 0);
        },

        /**
         * Perform preprocess step.
         * @param {number} dt - time increment.
         */
        pre(dt) {
            let w = this.w;
            // perfect location to update trig. cache
            this.cw = Math.cos(w);
            this.sw = Math.sin(w);
            // apply angular impulse (warmstarting)
            this.ori_impulse_vel(this.lambda_w * dt);
            // apply axial impulse (warmstarting)
            this.len_impulse_vel(this.lambda_r * dt);

            this.dlambda_r = this.dlambda_w = 0; // important !!
        },
        post(dt) {
            // apply angular impulse  Q = J^T * lambda
            this.lambda_w += this.dlambda_w;
            this.ori_apply_Q(this.lambda_w)
            // apply radial impulse  Q = J^T * lambda
            this.lambda_r += this.dlambda_r;
            this.len_apply_Q(this.lambda_r)
        },
        /**
         * Perform position step.
         */
        posStep() {
            let res, w = this.w;
            // perfect location to update trig. cache
            this.cw = Math.cos(w);
            this.sw = Math.sin(w);
            return this.type === 'free' ? true
                 : this.type === 'rot'  ? this.len_pos()
                 : this.type === 'tran' ? this.ori_pos()
                 : this.type === 'ctrl' ? (res = this.ori_pos(), (this.len_pos() && res))
                 : false;
        },
        /**
         * Perform velocity step.
         */
        velStep(dt) {
            let res;
            return this.type === 'free' ? true
                 : this.type === 'rot'  ? this.len_vel(dt)
                 : this.type === 'tran' ? this.ori_vel(dt)
                 : this.type === 'ctrl' ? (res = this.ori_vel(dt), (this.len_vel(dt) && res))
                 : false;
        },

        /**
         * Calculate orientation.
         */
        ori_pos() {
            const C = this.ori_C, impulse = -this.ori_mc * C;

            this.ori_impulse_pos(impulse);
            if (this.ori.ref && !this.ori.passive) {
                const ref = this.ori.ref;
                if (this.ori.reftype === 'len')
                    ref.len_impulse_pos(-(this.ori.ratio||1)*impulse);
                else 
                    ref.ori_impulse_pos(-(this.ori.ratio||1)*this.r/ref.r*impulse);
            }

            return mec.isEps(C, mec.lenTol);  // orientation constraint satisfied .. !
        },
        /**
         * Calculate orientational velocity.
         * @param {dt} - time increment.
         */
        ori_vel(dt) {
            const Ct = this.ori_Ct, impulse = -this.ori_mc * Ct;

            this.ori_impulse_vel(impulse);
            this.dlambda_w += impulse/dt;
            if (this.ori.ref && !this.ori.passive) {
                const ref = this.ori.ref,
                      ratioimp = impulse*(this.ori.ratio || 1);
                if (this.ori.reftype === 'len') {
                    ref.len_impulse_vel(-ratioimp);
                    ref.dlambda_r -= ratioimp/dt;
                }
                else {
                    const refimp = this.r/this.ori.ref.r*ratioimp;
                    ref.ori_impulse_vel(-refimp);
                    ref.dlambda_w -= refimp/dt;
                }
            }

//            return Math.abs(impulse/dt) < mec.forceTol;  // orientation constraint satisfied .. !
            return mec.isEps(Ct*dt, mec.lenTol);  // orientation constraint satisfied .. !
        },
        /**
         * Apply pseudo impulse `impulse` from ori constraint to its node positions.
         * 'delta q = -W * J^T * m_c * C'
         * @param {number} impulse - pseudo impulse.
         */
        ori_impulse_pos(impulse) {
                this.p1.x +=  this.p1.im * this.sw * impulse;
                this.p1.y += -this.p1.im * this.cw * impulse;
                this.p2.x += -this.p2.im * this.sw * impulse;
                this.p2.y +=  this.p2.im * this.cw * impulse;
        },
        /**
         * Apply impulse `impulse` from ori constraint to its node displacements.
         * 'delta dot q = -W * J^T * m_c * dot C'
         * @param {number} impulse - impulse.
         */
        ori_impulse_vel(impulse) {
            this.p1.dxt +=  this.p1.im * this.sw * impulse;
            this.p1.dyt += -this.p1.im * this.cw * impulse;
            this.p2.dxt += -this.p2.im * this.sw * impulse;
            this.p2.dyt +=  this.p2.im * this.cw * impulse;
        },
        /**
         * Apply constraint force `lambda` from ori constraint to its nodes.
         * 'Q_c = J^T * lambda'
         * @param {number} lambda - moment.
         */
        ori_apply_Q(lambda) {
            this.p1.Qx +=  this.sw * lambda;
            this.p1.Qy += -this.cw * lambda;
            this.p2.Qx += -this.sw * lambda;
            this.p2.Qy +=  this.cw * lambda;
        },

        /**
         * Calculate length.
         */
        len_pos() {
            const C = this.len_C, impulse = -this.len_mc * C;

            this.len_impulse_pos(impulse);
            if (this.len.ref && !this.len.passive) {
                if (this.len.reftype === 'ori')
                    this.len.ref.ori_impulse_pos(-(this.len.ratio||1)*impulse);
                else
                    this.len.ref.len_impulse_pos(-(this.len.ratio||1)*impulse);
            }
            return mec.isEps(C, mec.lenTol); // length constraint satisfied .. !
        },
        /**
         * Calculate length velocity.
         * @param {number} dt - time increment.
         */
        len_vel(dt) {
            const Ct = this.len_Ct, impulse = -this.len_mc * Ct;

            this.len_impulse_vel(impulse);
            this.dlambda_r += impulse/dt;
            if (this.len.ref && !this.len.passive) {
                const ref = this.len.ref,
                      ratioimp = impulse*(this.ori.ratio || 1);
                if (this.len.reftype === 'ori') {
                    ref.ori_impulse_vel(-ratioimp);
                    ref.dlambda_w -= ratioimp/dt;
                }
                else {
                    ref.len_impulse_vel(-ratioimp);
                    ref.dlambda_r -= ratioimp/dt;
                }
            }
            return mec.isEps(Ct*dt, mec.lenTol); // velocity constraint satisfied .. !
        },
        /**
         * Apply pseudo impulse `impulse` from len constraint to its node positions.
         * 'delta q = -W * J^T * m_c * C'
         * @param {number} impulse - pseudo impulse.
         */
        len_impulse_pos(impulse) {
                this.p1.x += -this.p1.im * this.cw * impulse;
                this.p1.y += -this.p1.im * this.sw * impulse;
                this.p2.x +=  this.p2.im * this.cw * impulse;
                this.p2.y +=  this.p2.im * this.sw * impulse;
        },
        /**
         * Apply impulse `impulse` from len constraint to its node displacements.
         * 'delta dot q = -W * J^T * m_c * dot C'
         * @param {number} impulse - impulse.
         */
        len_impulse_vel(impulse) {
            this.p1.dxt += -this.p1.im * this.cw * impulse;
            this.p1.dyt += -this.p1.im * this.sw * impulse;
            this.p2.dxt +=  this.p2.im * this.cw * impulse;
            this.p2.dyt +=  this.p2.im * this.sw * impulse;
        },
        /**
         * Apply force `lambda` from len constraint to its node forces.
         * 'Q_c = J^T * lambda'
         * @param {number} lambda - force.
         */
        len_apply_Q(lambda) {
            this.p1.Qx += -this.cw * lambda;
            this.p1.Qy += -this.sw * lambda;
            this.p2.Qx +=  this.cw * lambda;
            this.p2.Qy +=  this.sw * lambda;
        },
        /**
         * Initialize a free orientation constraint.
         * @param {object} ori - orientational sub-object.
         */
        init_ori_free(ori) {
            this.w0 = ori.hasOwnProperty('w0') ? ori.w0 : this.angle(Math.atan2(this.ay,this.ax));
            mec.assignGetters(this, {
                w:  () => this.angle(Math.atan2(this.ay,this.ax)),
                wt: () => (this.ayt*this.cw - this.axt*this.sw)/this.r,
                wtt:() => (this.aytt*this.cw - this.axtt*this.sw)/this.r
            });
        },
        /**
         * Initialize a const orientation constraint.
         * @param {object} ori - orientational sub-object.
         */
        init_ori_const(ori) {
            if (!!ori.ref) {
                const ref = ori.ref = this.model.constraintById(ori.ref) || ori.ref,
                      reftype = ori.reftype || 'ori',
                      ratio = ori.ratio || 1;

                if (!ref.initialized)
                    ref.init(this.model);  // 'idx' argument not necessary here !

                if (reftype === 'ori') {
                    const w0 = ori.hasOwnProperty('w0') ? ref.w0 + ori.w0 : Math.atan2(this.ay,this.ax);

                    mec.assignGetters(this, {
                        w:  () => w0 + ratio*(ref.w - ref.w0),
                        wt: () => ratio*ref.wt,
                        wtt:() => ratio*ref.wtt,
                        ori_C:  () => this.ay*this.cw - this.ax*this.sw - ratio*this.r/(ref.r||1)*(ref.ay*ref.cw - ref.ax*ref.sw),
                        ori_Ct: () => this.ayt*this.cw - this.axt*this.sw - ratio*this.r/(ref.r||1)*(ref.ayt*ref.cw - ref.axt*ref.sw),
                        ori_mc: () => {
                            let imc = mec.toZero(this.p1.im + this.p2.im) + ratio**2*this.r**2/(ref.r||1)**2*mec.toZero(ref.p1.im + ref.p2.im);
                            return imc ? 1/imc : 0;
                        }
                    });
                }
                else { // reftype === 'len'
                    const w0 = ori.hasOwnProperty('w0') ? ref.w0 + ori.w0 : Math.atan2(this.ay,this.ax);

                    mec.assignGetters(this, {
                        w:  () => w0 + ratio*(ref.r - ref.r0)/this.r,
                        wt: () => ratio*ref.rt,
                        wtt:() => ratio*ref.rtt,
                        ori_C:  () => this.r*(this.angle(Math.atan2(this.ay,this.ax)) - w0) - ratio*(ref.ax*ref.cw + ref.ay*ref.sw - ref.r0),
                        ori_Ct: () => this.ayt*this.cw - this.axt*this.sw - ratio*(ref.axt*ref.cw + ref.ayt*ref.sw),
                        ori_mc: () => {
                            let imc = mec.toZero(this.p1.im + this.p2.im) + ratio**2*mec.toZero(ref.p1.im + ref.p2.im);
                            return imc ? 1/imc : 0;
                        }
                    });
                }
            }
            else {
                mec.assignGetters(this, {
                    w:  () => this.w0,
                    wt: () => 0,
                    wtt:() => 0,
                });
            }
        },
        /**
         * Initialize a driven orientation constraint.
         * @param {object} ori - orientational sub-object.
         */
        init_ori_drive(ori) {
            this.w0 = ori.hasOwnProperty('w0') ? ori.w0 : this.angle(Math.atan2(this.ay,this.ax));

            ori.Dw = ori.Dw || 2*Math.PI;
            ori.t0 = ori.t0 || 0;
            ori.Dt = ori.Dt || 1;

            if (ori.input) {
                // maintain a local input controlled time 'local_t'.
                ori.local_t = 0;
                ori.t = () => !this.model.state.preview ? ori.local_t : this.model.timer.t;
                ori.inputCallbk = (w) => { ori.local_t = w*Math.PI/180*ori.Dt/ori.Dw; };
            }
            else
                ori.t = () => this.model.timer.t;

            ori.drive = mec.drive.create({ func: ori.func || ori.input && 'static' || 'linear',
                                            z0: ori.ref ? 0 : this.w0,
                                            Dz: ori.Dw,
                                            t0: ori.t0,
                                            Dt: ori.Dt,
                                            t: ori.t,
                                            bounce: ori.bounce,
                                            repeat: ori.repeat,
                                            args: ori.args
                                         });

            if (!!ori.ref) {
                const ref = ori.ref = this.model.constraintById(ori.ref) || ori.ref,
                      reftype = ori.reftype || 'ori',
                      ratio = ori.ratio || 1;

                if (!ref.initialized)
                    ref.init(this.model);

                if (reftype === 'ori')
                    mec.assignGetters(this, {
                        w:  () => this.w0 + (ref.w - ref.w0) + ori.drive.f(),
                        wt: () => ref.wt + ori.drive.ft(),
                        wtt:() => ref.wtt + ori.drive.ftt(),
                        ori_C:  () => this.r*(this.angle(Math.atan2(this.ay,this.ax)) - this.w0) -this.r*(ref.angle(Math.atan2(ref.ay,ref.ax)) - ref.w0) - this.r*ori.drive.f(),
                        ori_Ct: () => { return this.ayt*this.cw - this.axt*this.sw - this.r/ref.r*(ref.ayt*ref.cw - ref.axt*ref.sw) - this.r*ori.drive.ft()},
                        ori_mc: () => {
                            let imc = mec.toZero(this.p1.im + this.p2.im) + this.r**2/ref.r**2*mec.toZero(ref.p1.im + ref.p2.im);
                            return imc ? 1/imc : 0;
                        }
                    });

                else // reftype === 'len'
                    mec.assignGetters(this, {
                        w:  () => this.w0 + ratio*(ref.r - ref.r0) + ori.drive.f(),
                        wt: () => ratio*ref.rt + ori.drive.ft(),
                        wtt:() => ratio*ref.rtt + ori.drive.ftt()
                    });
            }
            else {
                mec.assignGetters(this, {
                    w:   ori.drive.f,
                    wt:  ori.drive.ft,
                    wtt: ori.drive.ftt
                });
            }
        },
        /**
         * Initialize a free elementary magnitude constraint.
         * @param {object} len - elementary magnitude constraint.
         */
        init_len_free(len) {
            mec.assignGetters(this, {
                r:  () => this.ax*this.cw + this.ay*this.sw,
                rt: () => this.axt*this.cw + this.ayt*this.sw,
                rtt:() => this.axtt*this.cw + this.aytt*this.sw,
            })
        },
        /**
         * Initialize a constant elementary magnitude constraint.
         * @param {object} len - elementary magnitude constraint.
         */
        init_len_const(len) {
            if (!!len.ref) {
                const ref = len.ref = this.model.constraintById(len.ref) || len.ref,
                      reftype = len.reftype || 'len',
                      ratio = len.ratio || 1;

                if (!ref.initialized)
                    ref.init(this.model);

                if (reftype === 'len')
//                    const r0 = ori.hasOwnProperty('r0') ? ref.w0 + ori.w0 : Math.atan2(this.ay,this.ax);
                    mec.assignGetters(this, {
                        r:  () => this.r0 + ratio*(ref.r - ref.r0),
                        rt: () => ratio*ref.rt,
                        rtt:() => ratio*ref.rtt,
                        len_C:  () => (this.ax*this.cw + this.ay*this.sw - this.r0) - ratio*(ref.ax*ref.cw + ref.ay*ref.sw - ref.r0),
                        len_Ct: () =>  this.axt*this.cw + this.ayt*this.sw - ratio*(ref.axt*ref.cw + ref.ayt*ref.sw),
                        len_mc: () => {
                            let imc = mec.toZero(this.p1.im + this.p2.im) + ratio**2*mec.toZero(ref.p1.im + ref.p2.im);
                            return imc ? 1/imc : 0;
                        }
                    });
                else // reftype === 'ori'
                    mec.assignGetters(this, {
                        r:  () => this.r0 + ratio*ref.r*(ref.w - ref.w0),
                        rt: () => ratio*ref.wt,
                        rtt:() => ratio*ref.wtt,
                        len_C:  () => this.ax*this.cw + this.ay*this.sw - this.r0 - ratio*ref.r*(ref.angle(Math.atan2(ref.ay,ref.ax)) - ref.w0),
                        len_Ct: () => this.axt*this.cw + this.ayt*this.sw - ratio*(ref.ayt*ref.cw - ref.axt*ref.sw),
                        len_mc: () => {
                            let imc = mec.toZero(this.p1.im + this.p2.im) + ratio**2*mec.toZero(ref.p1.im + ref.p2.im);
                            return imc ? 1/imc : 0;
                        }
                    });
            }
            else {
                mec.assignGetters(this, {
                    r:  () => this.r0,
                    rt: () => 0,
                    rtt:() => 0,
                });
            }
        },
        /**
         * Initialize a driven elementary magnitude constraint.
         * @param {object} len - elementary magnitude constraint.
         */
        init_len_drive(len) {
            this.r0 = len.hasOwnProperty('r0') ? len.r0 : Math.hypot(this.ay,this.ax);

            len.Dr = len.Dr || 100;
            len.t0 = len.t0 || 0;
            len.Dt = len.Dt || 1;

            if (len.input) {
                // maintain a local input controlled time 'local_t'.
                len.local_t = 0;
                len.t = () => !this.model.state.preview ? len.local_t : this.model.timer.t;
                len.inputCallbk = (u) => { len.local_t = u*len.Dt/len.Dr; };
            }
            else
                len.t = () => this.model.timer.t;

            len.drive = mec.drive.create({func: len.func || len.input && 'static' || 'linear',
                                          z0: len.ref ? 0 : this.r0,
                                          Dz: len.Dr,
                                          t0: len.t0,
                                          Dt: len.Dt,
                                          t: len.t,
                                          bounce: len.bounce,
                                          repeat: len.repeat,
                                          args: len.args
                                        });

            if (!!len.ref) {
                const ref = len.ref = this.model.constraintById(len.ref) || len.ref,
                      reftype = len.reftype || 'len',
                      ratio = len.ratio || 1;

                if (!ref.initialized)
                    ref.init(this.model);

                if (reftype === 'len')
                    mec.assignGetters(this, {
                        r:  () => this.r0 + ratio*(ref.r - ref.r0) + len.drive.f(),
                        rt: () => ref.rt + len.drive.ft(),
                        rtt:() => ref.rtt + len.drive.ftt(),
                        len_C:  () => (this.ax*this.cw + this.ay*this.sw - this.r0) - (ref.ax*ref.cw + ref.ay*ref.sw - ref.r0) - len.drive.f(),
                        len_Ct: () =>  this.axt*this.cw + this.ayt*this.sw - (ref.axt*ref.cw + ref.ayt*ref.sw) - len.drive.ft(),
                        len_mc: () => {
                            let imc = mec.toZero(this.p1.im + this.p2.im) + mec.toZero(ref.p1.im + ref.p2.im);
                            return imc ? 1/imc : 0;
                        }
                    });
                else // reftype === 'ori'
                    mec.assignGetters(this, {
                        r:  () => this.r0 + ratio*(ref.w - ref.w0) + len.drive.f(),
                        rt: () => ratio*ref.wt + len.drive.ft(),
                        rtt:() => ratio*ref.wtt + len.drive.ftt()
                    });
            }
            else {
                mec.assignGetters(this, {
                    r:   len.drive.f,
                    rt:  len.drive.ft,
                    rtt: len.drive.ftt
                });
            }
        },
        asJSON() {
            let jsonString = '{ "id":"'+this.id+'","p1":"'+this.p1.id+'","p2":"'+this.p2.id+'"';
            jsonString+= (this.hid ? `,"hid":${this.hid}` : '');
            jsonString+= (this.txt ? `,"txt":${this.txt}` : '');
            jsonString+= (this.idloc ? `,"txt":${this.idloc}` : '');

            if (this.len && !(this.len.type === 'free')) {
                jsonString += (this.len.type === 'const' ? ',"len":{ "type":"const"' : '')
                            + (this.len.type === 'drive' ? ',"len":{ "type":"drive"' : '')
                            + (this.len.ref ? ',"ref":"'+this.len.ref.id+'"' : '')
                            + (this.len.reftype ? ',"reftype":"'+this.len.reftype+'"' : '')
                            + (this.len.r0 && this.len.r0 > 0.0001 ? ',"r0":'+this.len.r0 : '')
                            + (this.len.ratio && Math.abs(this.len.ratio-1)>0.0001 ? ',"ratio":'+this.len.ratio : '')
                            + (this.len.func ? ',"func":"'+this.len.func+'"' : '')
                            + (this.len.arg ? ',"arg":"'+this.len.arg+'"' : '')
                            + (this.len.t0 && this.len.t0 > 0.0001 ? ',"t0":'+this.len.t0 : '')
                            + (this.len.Dt ? ',"Dt":'+this.len.Dt : '')
                            + (this.len.Dr ? ',"Dr":'+this.len.Dr : '')
                            + (this.len.bounce ? ',"bounce":true' : '')
                            + (this.len.input ? ',"input":true' : '')
                            + ' }'
            };

            if (this.ori && !(this.ori.type === 'free')) {
                jsonString += (this.ori.type === 'const' ? ',"ori":{ "type":"const"' : '')
                            + (this.ori.type === 'drive' ? ',"ori":{ "type":"drive"' : '')
                            + (this.ori.ref ? ',"ref":"'+this.ori.ref.id+'"' : '')
                            + (this.ori.reftype ? ',"reftype":"'+this.ori.reftype+'"' : '')
                            + (this.ori.w0 && this.ori.w0 > 0.0001 ? ',"r0":'+this.ori.w0 : '')
                            + (this.ori.ratio && Math.abs(this.ori.ratio-1)>0.0001 ? ',"ratio":'+this.ori.ratio : '')
                            + (this.ori.func ? ',"func":"'+this.ori.func+'"' : '')
                            + (this.ori.arg ? ',"arg":"'+this.ori.arg+'"' : '')
                            + (this.ori.t0 && this.ori.t0 > 0.0001 ? ',"t0":'+this.ori.t0 : '')
                            + (this.ori.Dt ? ',"Dt":'+this.ori.Dt : '')
                            + (this.ori.Dw ? ',"Dw":'+this.ori.Dw : '')
                            + (this.ori.bounce ? ',"bounce":true' : '')
                            + (this.ori.input ? ',"input":true' : '')
                            + ' }'
            };

            jsonString += ' }';

            return jsonString;
        },
        // interaction
        get showInfo() {
            return this.state & g2.OVER; 
        },
        get infos() {
            return {
                'id': () => `'${this.id}'`,
                'pos': () => `r=${this.r.toFixed(1)},&phi;=${mec.toDeg(this.w).toFixed(0)%360}°`,
                'vel': () => `rt=${mec.to_m(this.rt).toFixed(2)}m/s,&phi;t=${this.wt.toFixed(2)}rad/s`,
                'load': () => `F=${mec.toZero(mec.to_N(this.force)).toPrecision(3)},M=${mec.toZero(mec.toDeg(this.moment)).toPrecision(3)}`
            }
        },
        info(q) { const i =  this.infos[q]; return i ? i() : '?'; },

        get isSolid() { return false },
        get sh() { return this.state & g2.OVER ? [0, 0, 10, this.model.env.show.hoveredElmColor] : this.state & g2.EDIT ? [0, 0, 10, this.model.env.show.selectedElmColor] : false; },
        hitContour({x,y,eps}) {
            const p1 = this.p1, p2 = this.p2,
                  dx = this.p2.x - this.p1.x, dy = this.p2.y - this.p1.y,
                  len = Math.hypot(dy,dx) || 0,
                  off = len ? 2*mec.node.radius/len : 0;
            return g2.isPntOnLin({x,y},{x:p1.x+off*dx,y:p1.y+off*dy},
                                       {x:p2.x-off*dx,y:p2.y-off*dy},eps);
        },
        // drawing
        get color() { return this.model.valid
                           ? this.ls || this.model.env.show.validConstraintColor
                           : this.model.env.show.colors.invalidConstraintColor;  // due to 'this.model.env.show.invalidConstraintColor' undefined
        },
        g2() {
            const {p1,w,r,type,id,idloc,txt} = this, 
                  g = g2().beg({x:p1.x,y:p1.y,w,scl:1,lw:2,
                                ls:this.model.env.show.constraintVectorColor,
                                fs:'@ls',lc:'round',sh:this.sh})
                            .p();
                            if (this.model.env.show.constraintVector){g.m({x:!this.ls && r > 50 ? 50 : 0, y:0});}                          
                            
                            else{g.m({x: 0, y:0});}
                            
                            g.l({x:r,y:0})
                            .stroke({ls:this.color,lw:this.lw||2,ld:this.ld||[], lsh:true});
                            const arrowColor=this.model.env.show.constraintVector ?this.model.env.show.constraintVectorColor:'transparent';
                    g.drw({d:mec.constraint.arrow[type],lsh:true,ls:arrowColor, fs:arrowColor})
                            //.drw({d:mec.constraint.arrow[type],lsh:true})
                          .end();

            if (this.model.env.show.constraintLabels) {

                let idstr=this.txt||id||'?';
               // let idstr=id||'?';

                let  cw = this.cw, sw = this.sw,
                    u = idloc === 'left' ? 0.5
                        : idloc === 'right' ? -0.5
                        : idloc + 0 === idloc ? idloc  // is numeric
                        : 0.5,
                    lam = Math.abs(u)*45, mu = u > 0 ? 10 : -15,
                    xid = p1.x + lam*cw - mu*sw,
                    yid = p1.y + lam*sw + mu*cw;
                if (this.ori.type === 'ref' || this.len.type === 'ref') {
                    const comma = this.ori.type === 'ref' && this.len.type === 'ref' ? ',' : '';
                    idstr += '('
                            +  (this.ori.type === 'ref' ? this.ori.ref.id : '')
                            +  comma
                            +  (this.len.type === 'ref' ? this.len.ref.id : '')
                            +')';
                    xid -= 3*sw;//sinus winkel
                    yid += 3*cw;
                };
                g.txt({str:idstr,x:xid,y:yid,thal:'center',tval:'middle',ls:this.model.env.show.txtColor,
                        font:this.model.env.show.font});
            }
          
            return g;
        },
        draw(g) {
            if (this.model.env.show.constraints)
                g.ins(this); 
        }
    },
    arrow: {
        'ctrl': 'M0,0 35,0M45,0 36,-3 37,0 36,3 Z',
        'rot': 'M12,0 8,6 12,0 8,-6Z M0,0 8,0M15,0 35,0M45,0 36,-3 37,0 36,3 Z',
        'tran': 'M0,0 12,0M16,0 18,0M22,0 24,0 M28,0 35,0M45,0 36,-3 37,0 36,3 Z',
        'free': 'M12,0 8,6 12,0 8,-6ZM0,0 8,0M15,0 18,0M22,0 24,0 M28,0 35,0M45,0 36,-3 37,0 36,3 Z'
    }
}