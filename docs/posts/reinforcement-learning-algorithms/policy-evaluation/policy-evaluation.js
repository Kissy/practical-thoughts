var PolicyEvaluation = function(model, policy, theta, gamma, step) {
    this.model = model;
    this.policy = policy;
    this.theta = theta;
    this.gamma = gamma;
    this.step = step;

    this.valueFunction = new Array(this.model["stateCount"]);

    this.initialize();
    this.evaluatePolicy();
};

PolicyEvaluation.prototype.initialize = function() {
    for (var s = 0; s < this.model["stateCount"]; s++) {
        this.valueFunction[s] = 0;
    }
};

PolicyEvaluation.prototype.evaluatePolicy = function() {
    var nabla, step = 0;
    do {
        nabla = 0;
        for (var s = 0; s < this.model["stateCount"]; s++) {
            var v = this.valueFunction[s];
            this.valueFunction[s] = this.evaluateStateValue(s);
            nabla = Math.max(nabla, Math.abs(v - this.valueFunction[s]));
        }
        if (step++ >= this.step) {
            break;
        }
    } while (nabla > this.theta);
};

PolicyEvaluation.prototype.evaluateStateValue = function (s) {
    var v = 0;
    for (var a = 0; a < 4; a++) {
        var q = 0;
        for (var a2 = 0; a2 < 4; a2++) {
            var s2 = this.model.simulate(s, a2);
            var r = this.model["r"][s2];
            q += this.model["p"][s][a] * (r + this.gamma * this.valueFunction[s2]);
        }
        v += this.policy[s][a] * q;
    }
    return v;
};