var PolicyIteration = function(model, policy, theta, gamma, step) {
    this.model = model;
    this.policy = policy;
    this.theta = theta;
    this.gamma = gamma;
    this.step = step;

    this.valueFunction = new Array(this.model["stateCount"]);

    this.initialize();
    this.iteratePolicy();
};

PolicyIteration.prototype.initialize = function() {
    for (var s = 0; s < this.model["stateCount"]; s++) {
        this.valueFunction[s] = 0;
    }
};

PolicyIteration.prototype.iteratePolicy = function() {
    var maxStep = this.step;
    for (var i = 0; i < maxStep; i++) {
        this.step = i;
        if (this.step % 2 === 0) {
            this.evaluatePolicy();
        } else {
            this.improvePolicy();
        }
    }
};

PolicyIteration.prototype.evaluatePolicy = function() {
    var nabla, step = 0;
    do {
        if (step++ > this.step / 2) {
            break;
        }
        nabla = 0;
        var newValueFunction = new Array(this.model["stateCount"]);
        for (var s = 0; s < this.model["stateCount"]; s++) {
            var v = this.valueFunction[s];
            newValueFunction[s] = this.evaluateStateValue(s);
            nabla = Math.max(nabla, Math.abs(v - newValueFunction[s]));
        }
        this.valueFunction = newValueFunction;
    } while (nabla > this.theta);
};

PolicyIteration.prototype.evaluateStateValue = function (s) {
    var v = 0;
    for (var a = 0; a < 4; a++) {
        var q = 0;
        //for (var a2 = 0; a2 < 4; a2++) { // TODO iterate S prime
        var s2 = this.model.simulate(s, a);
        var r = this.model["r"][s2];
        q += this.model["p"][s][a] * (r + this.gamma * this.valueFunction[s2]);
        //}
        v += this.policy[s][a] * q;
    }
    return v;
};

PolicyIteration.prototype.improvePolicy = function() {
    if (this.step <= 0) {
        return;
    }

    var policyStable = true;

    for (var s = 0; s < this.model["stateCount"] - 1; s++) {
        var old_action = this.policy[s];
        this.policy[s] = this.greedyPolicy(s);
        if (old_action !== this.policy[s]) {
            policyStable = false;
        }
    }

    return policyStable;
};

PolicyIteration.prototype.greedyPolicy = function (s) {
    if ([5, 7, 11, 12].indexOf(s) !== -1) {
        return [0, 0, 0, 0];
    }

    var a, q_s = new Array(4);
    for (a = 0; a < 4; a++) {
        var s2 = this.model.simulate(s, a);
        var r = this.model["r"][s2];
        q_s[a] = this.model["p"][s][a] * (r + this.gamma * this.valueFunction[s2]);
    }
    return this.normalize(this.argMax(q_s));
};

PolicyIteration.prototype.argMax = function (q_s) {
    var max_q = Math.max.apply(Math, q_s);
    return q_s.map(function (q) { return Number(q === max_q); });
};


PolicyIteration.prototype.normalize = function (q_s) {
    var total = q_s.reduce(function(a, b) { return a + b; });
    return q_s.map(function (q) { return q / total });
};
