var PolicyIterationFrozenLake = function (containerClass) {
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
    this.gamma = 0.5;
    this.step = 0;

    this.container = d3.select(containerClass);
    var controls = this.container.append("div").classed("controls", true);

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

    this.container.append("div").classed("frozen-lake-container", true)
        .append("div").classed("frozen-lake", true);

    this.setEqualProbabilityPolicy();
    this.run();
};

PolicyIterationFrozenLake.prototype.run = function() {
    if (this.timer) {
        this.timer.stop();
    }
    this.timer = d3.interval(this.incrementTimeStep.bind(this), 150);
};

PolicyIterationFrozenLake.prototype.draw = function () {
    var cells = this.container
        .select(".frozen-lake")
        .selectAll("div.cell")
        .data(this.valueFunction)
        .join("div")
        .classed("cell", true);

    var minValue = Math.min.apply(Math, this.valueFunction) || 0;
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
        .style("opacity", function (d) { return d === 0 ? 0 : 0.25 + d; })
        .text(this.getMaterialIconText);

    cells.selectAll("div.labels")
        .data(function (d) {
            return [d];
        })
        .join("div")
        .classed("labels", true)
        .classed("value", true)
        .text(function (d) {
            return Number(d).toFixed(2);
        });
};

PolicyIterationFrozenLake.prototype.getStatePolicy = function (d, i) {
    return this.policy[i];
};

PolicyIterationFrozenLake.prototype.getMaterialIconClass = function (d, i) {
    var index = i % 4;
    return ["up", "right", "down", "left"][index] + " material-icons";
};

PolicyIterationFrozenLake.prototype.getMaterialIconText = function (d, i) {
    var index = i % 4;
    return "arrow_" + ["upward", "forward", "downward", "back"][index];
};

PolicyIterationFrozenLake.prototype.setTimeStep = function () {
    this.step = Number(this.timeStepInput.property("value"));
    this.timeStepValue.text(this.step);
    this.setEqualProbabilityPolicy();
    var policyIteration = new PolicyIteration(this.MODEL, this.policy, this.theta, this.gamma, this.step);
    this.policy = policyIteration.policy;
    this.valueFunction = policyIteration.valueFunction;
    this.draw();
};

PolicyIterationFrozenLake.prototype.incrementTimeStep = function () {
    this.timeStepInput.property("value", this.step + 1);
    this.setTimeStep();

    if (this.step >= this.DISPLAY["maxTimeStep"]) {
        this.timer.stop();
    }
};

PolicyIterationFrozenLake.prototype.setEqualProbabilityPolicy = function () {
    this.policy = [];
    for (var i = 0; i < this.MODEL["stateCount"] - 1; i++) {
        if ([5, 7, 11, 12].indexOf(i) !== -1) {
            this.policy.push([0, 0, 0, 0]);
        } else {
            var state_policy = [];
            for (var a = 0; a < 4; a++) {
                state_policy.push(0.25);
            }
            this.policy.push(state_policy);
        }
    }
    this.policy.push([0, 0, 0, 0]);
};

document.addEventListener("DOMContentLoaded", function() {
    new PolicyIterationFrozenLake(".policy-iteration-frozen-lake");
});
