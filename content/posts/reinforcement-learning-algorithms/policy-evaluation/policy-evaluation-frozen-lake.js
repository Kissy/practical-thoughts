var PolicyEvaluationFrozenLake = function (containerClass) {
    this.DISPLAY = {
        "lowBackgroundColor": "#FFF",
        "highBackgroundColor": "#5BADF0",
        "lowTextColor": "#666",
        "highTextColor": "#FFF",
        "maxTimeStep": 10
    };
    this.MODEL = {
        "p": [
            [1, 1, 1, 1], [1, 1, 1, 1], [1, 1, 1, 1], [1, 1, 1, 1],
            [1, 1, 1, 1], [0, 0, 0, 0], [1, 1, 1, 1], [0, 0, 0, 0],
            [1, 1, 1, 1], [1, 1, 1, 1], [1, 1, 1, 1], [0, 0, 0, 0],
            [0, 0, 0, 0], [1, 1, 1, 1], [1, 1, 1, 1], [0, 0, 0, 0]
        ],
        "r": [
            0, 0, 0, 0,
            0, 0, 0, 0,
            0, 0, 0, 0,
            0, 0, 0, 1
        ],
        "stateCount": 16,
        "simulate": function(s, a) {
            var s2 = s;
            switch (a) {
                case 0:
                    s2 = s - 4;
                    break;
                case 1:
                    s2 = s + 1;
                    break;
                case 2:
                    s2 = s + 4;
                    break;
                case 3:
                    s2 = s - 1;
                    break;
            }
            if (s2 < 0 || s2 >= this["stateCount"]) {
                s2 = s;
            }
            return s2;
        }
    };

    this.theta = 0.01;
    this.gamma = 0.75;
    this.step = 0;

    this.container = d3.select(containerClass);
    var controls = this.container.append("div").classed("controls", true);
    var policyControls = controls.append("div").classed("policy-control", true);

    policyControls.append("button").attr("type", "button").text("OPTIMAL")
        .on("click", this.setOptimalPolicy.bind(this));
    policyControls.append("button").attr("type", "button").text("EQUAL PROBABILITY")
        .on("click", this.setEqualProbabilityPolicy.bind(this));
    policyControls.append("button").attr("type", "button").text("RANDOM")
        .on("click", this.setRandomPolicy.bind(this));

    var timeStepControl = controls.append("div").classed("time-step-control", true);
    var timeStepLabel = timeStepControl.append("label").text("time step $t = $ ");
    this.timeStepValue = timeStepLabel.append("span").text(this.step);
    this.timeStepInput = timeStepControl
        .append("input")
        .attr("type", "range")
        .attr("min", 0)
        .attr("max", this.DISPLAY["maxTimeStep"])
        .property("value", this.step)
        .on("input", this.setTimeStep.bind(this));

    var gammaControl = controls.append("div").classed("gamma-control", true);
    var gammaLabel = gammaControl.append("label").text("gamma $\\gamma =$ ");
    this.gammaValue = gammaLabel.append("span").text(this.gamma);
    this.gammaInput = gammaControl
        .append("input")
        .attr("type", "range")
        .attr("min", 0)
        .attr("max", 1)
        .attr("step", 0.05)
        .property("value", this.gamma)
        .on("input", this.setGamma.bind(this));

    this.container.append("div").classed("frozen-lake-container", true)
        .append("div").classed("frozen-lake", true);

    this.setOptimalPolicy();
};

PolicyEvaluationFrozenLake.prototype.run = function() {
    if (this.timer) {
        this.timer.stop();
    }
    this.step = -1;
    this.timer = d3.interval(this.incrementTimeStep.bind(this), 150);
};

PolicyEvaluationFrozenLake.prototype.draw = function () {
    var cells = this.container
        .select(".frozen-lake")
        .selectAll("div.cell")
        .data(this.valueFunction)
        .join("div")
        .classed("cell", true);

    var parentThis = this;
    var minValue = Math.min.apply(Math, this.valueFunction) || 0;
    var maxValue = Math.max.apply(Math, this.valueFunction) || 1;
    var textColor = d3.scaleQuantize()
        .domain([minValue, maxValue])
        .range([d3.rgb(this.DISPLAY.lowTextColor), d3.rgb(this.DISPLAY.highTextColor)]);
    var backgroundColor = d3.scalePow().exponent(0.5).interpolate(d3.interpolateHcl)
        .domain([minValue, maxValue])
        .range([d3.rgb(this.DISPLAY.lowBackgroundColor), d3.rgb(this.DISPLAY.highBackgroundColor)]);

    cells.style("color", textColor).style("background-color", backgroundColor);

    cells.selectAll("i")
        .data(this.getStatePolicy.bind(this))
        .join("i")
        .attr("class", this.getMaterialIconClass)
        .style("opacity", function (d) { return d; })
        .text(this.getMaterialIconText);

    cells.selectAll("div.labels")
        .data(function (d, i) {
            if (i === parentThis.MODEL["stateCount"] - 1) {
                return [];
            }
            return [d];
        })
        .join("div")
        .classed("labels", true)
        .classed("value", true)
        .text(function (d) {
            return Number(d).toFixed(2);
        });
};

PolicyEvaluationFrozenLake.prototype.getStatePolicy = function (d, i) {
    return this.policy[i];
};

PolicyEvaluationFrozenLake.prototype.getMaterialIconClass = function (d, i) {
    var index = i % 4;
    return ["up", "right", "down", "left"][index] + " material-icons";
};

PolicyEvaluationFrozenLake.prototype.getMaterialIconText = function (d, i) {
    var index = i % 4;
    return "arrow_" + ["upward", "forward", "downward", "back"][index];
};

PolicyEvaluationFrozenLake.prototype.setTimeStep = function () {
    this.step = Number(this.timeStepInput.property("value"));
    this.timeStepValue.text(this.step);
    var policyEvaluation = new PolicyEvaluation(this.MODEL, this.policy, this.theta, this.gamma, this.step);
    this.valueFunction = policyEvaluation.valueFunction;
    this.draw();
};

PolicyEvaluationFrozenLake.prototype.setGamma = function () {
    this.gamma = Number(this.gammaInput.property("value"));
    this.gammaValue.text(this.gamma);
    var policyEvaluation = new PolicyEvaluation(this.MODEL, this.policy, this.theta, this.gamma, this.step);
    this.valueFunction = policyEvaluation.valueFunction;
    this.draw();
};

PolicyEvaluationFrozenLake.prototype.incrementTimeStep = function () {
    this.timeStepInput.property("value", this.step + 1);
    this.setTimeStep();

    if (this.step >= this.DISPLAY["maxTimeStep"]) {
        this.timer.stop();
    }
};

PolicyEvaluationFrozenLake.prototype.getOptimalPolicy = function () {
    return [
        [0, 1, 0, 0], [0, 1, 0, 0], [0, 0, 1, 0], [0, 0, 0, 1],
        [0, 0, 1, 0], [0, 0, 0, 0], [0, 0, 1, 0], [0, 0, 0, 0],
        [0, 1, 0, 0], [0, 1, 0, 0], [0, 0, 1, 0], [0, 0, 0, 0],
        [0, 0, 0, 0], [0, 1, 0, 0], [0, 1, 0, 0], [0, 0, 0, 0]
    ];
};

PolicyEvaluationFrozenLake.prototype.setOptimalPolicy = function () {
    this.policy = this.getOptimalPolicy();
    this.run();
};

PolicyEvaluationFrozenLake.prototype.getEqualProbabilityPolicy = function () {
    var policy = [];
    for (var i = 0; i < this.MODEL["stateCount"] - 1; i++) {
        var state_policy = [];
        for (var a = 0; a < 4; a++) {
            state_policy.push(0.25);
        }
        policy.push(state_policy);
    }
    policy.push([0, 0, 0, 0]);
    return policy;
};

PolicyEvaluationFrozenLake.prototype.setEqualProbabilityPolicy = function () {
    this.policy = this.getEqualProbabilityPolicy();
    this.run();
};

PolicyEvaluationFrozenLake.prototype.getRandomPolicy = function () {
    var policy = [];
    for (var i = 0; i < this.MODEL["stateCount"] - 1; i++) {
        var state_policy = [];
        for (var a = 0; a < 4; a++) {
            state_policy.push(Math.random());
        }
        var total_state_probability = state_policy.reduce(function (p1, p2) {
            return p1 + p2;
        }, 0);
        state_policy = state_policy.map(function (p) {
            return p / total_state_probability;
        });

        policy.push(state_policy);
    }
    policy.push([0, 0, 0, 0]);
    return policy;
};

PolicyEvaluationFrozenLake.prototype.setRandomPolicy = function () {
    this.policy = this.getRandomPolicy();
    this.run();
};

document.addEventListener("DOMContentLoaded", function() {
    new PolicyEvaluationFrozenLake(".policy-evaluation-frozen-lake");
});
