---
title: "Policy Evaluation on Frozen-Lake"
date: 2019-03-23T00:00:00+02:00
resources:
- name: policy-evaluation-js
  src: 'policy-evaluation/*.js'
- name: policy-evaluation-css
  src: 'policy-evaluation/*.css'
---

The Policy Evaluation algorithm compute iteratively the state-value function $v_\pi$ 
for a given policy $\pi$ for a known model in an MDP environment.

<!--more--> 

# Iterative algorithm

A complete in-place version of iterative policy evaluation is shown in pseudocode in
the box below. [^1]

<div class="algorithm">
    <p><b>Input:</b></p>
    <p class="i1">a policy $\pi$ to be evaluated</p>
    <p><b>Parameter:</b></p>
    <p class="i1">a small threshold $\theta > 0$ determining accuracy of estimation</p>
    <br />
    <p><b>Initialization:</b></p>
    <p class="i1">$V(s) \text{, for all } S \in S^+$, arbitrarily except that $V(terminal) = 0$</p>
    <p><b>Policy Evaluation:</b></p>
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
