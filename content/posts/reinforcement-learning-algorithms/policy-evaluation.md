---
title: "Policy Evaluation on Frozen-Lake"
date: 2019-03-23T00:00:00+02:00
---

<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
<link href="policy-evaluation-frozen-lake.css" rel="stylesheet"></link>

The Policy Evaluation algorithm compute iteratively the state-value function $v_\pi$ 
for a given policy $\pi$ for a known model in an MDP environment.

<!--more--> 

# Iterative algorithm

A complete in-place version of iterative policy evaluation is shown in pseudocode in
the box below. [^1]

<div class="algorithm">
    <p>Input:</p>
    <p class="i1">a policy $\pi$ to be evaluated</p>
    <p>Parameter:</p>
    <p class="i1">a small threshold $\theta > 0$ determining accuracy of estimation</p>
    <p>Initialize:</p>
    <p class="i1">$V(s) \text{, for all } S \in S^+$, arbitrarily except that $V(terminal) = 0$</p>
    <br />
    <p>Loop:</p>
    <p class="i1">$\nabla \leftarrow 0$</p>
    <p class="i1">Loop for each $s \in S$:</p>
    <p class="i2">$v \leftarrow V(s)$</p>
    <p class="i2">$V(s) \leftarrow \sum_a \pi(a|s) \sum_{s',r} p(s',r|s,a)[r + \gamma V(s')]$</p>
    <p class="i2">$\nabla \leftarrow max(\nabla, |v - V(s)|)$</p>
    <p>Until $\nabla < 0$</p>
</div>

# [Frozen Lake](https://gym.openai.com/envs/FrozenLake-v0/) implementation

The implementation of the Policy Evaluation algorithm on the Frozen Lake problem 
displaying the value function $V(s)$ at each time step $t$ for different input policies:

- Optimal Policy — $v_*$
- Policy with equal probability
- Random policy


<div class="policy-evaluation-frozen-lake"></div>

<div style="text-align: right">
<a href="{{< ref "/posts/reinforcement-learning-algorithms.md" >}}">Table of content</a>
</div>

[^1]: Sutton, R. S., & Barto, A. G. (2018). [4.1 Policy Evaluation](http://www.incompleteideas.net/book/RLbook2018.pdf). In Reinforcement learning: an introduction.

<script type="text/javascript" src="//cdnjs.cloudflare.com/ajax/libs/d3/5.9.2/d3.min.js"></script>
<script type="text/javascript" src="policy-evaluation.js"></script>
<script type="text/javascript" src="policy-evaluation-frozen-lake.js"></script>
<script type="text/javascript">
new PolicyEvaluationFrozenLake(".policy-evaluation-frozen-lake");
</script>
