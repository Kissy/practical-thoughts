---
title: "Policy Iteration on Frozen-Lake"
date: 2019-03-30T00:00:00+02:00
resources:
- name: policy-iteration-js
  src: 'policy-iteration/*.js'
- name: policy-iteration-css
  src: 'policy-iteration/*.css'
---

The Policy Iteration algorithm compute iteratively an approximation of the optimal policy $\pi_*$ 
by calculating the state-value function for a policy, then improving the policy maximizing the state-value function.

<!--more--> 

# Iterative algorithm

A complete in-place version of iterative policy iteration is shown in pseudocode in
the box below. [^1]

<div class="algorithm">
    <p><b>Parameter:</b></p>
    <p class="i1">a small threshold $\theta > 0$ determining accuracy of estimation</p>
    <br />
    <p><b>1. Initialization:</b></p>
    <p class="i1">$V(s) \text{, for all } S \in S^+$, arbitrarily except that $V(terminal) = 0$</p>
    <p><b>2. Policy Evaluation:</b></p>
    <p class="i1">$\nabla \leftarrow 0$</p>
    <p class="i1">Loop for each $s \in S$:</p>
    <p class="i2">$v \leftarrow V(s)$</p>
    <p class="i2">$V(s) \leftarrow \sum_{s',r} p(s',r|s, \pi(s))[r + \gamma V(s')]$</p>
    <p class="i2">$\nabla \leftarrow max(\nabla, |v - V(s)|)$</p>
    <p>Until $\nabla < 0$</p>
    <p><b>3. Policy Improvement:</b></p>
    <p class="i1">$policy\_stable \leftarrow true$</p>
    <p class="i1">For each $s \in S$</p>
    <p class="i2">$old-actions \leftarrow \pi(s)$</p>
    <p class="i2">$\pi(s) \leftarrow argmax_a \sum_{s',r} p(s',r|s,a)[r + \gamma V(s')]$</p>
    <p class="i2">If $old-action \neq \pi(s)$, then $policy\_stable \leftarrow false$</p>
    <p class="i1">If $policy\_stable$, then stop and return $V \approx v_* \text{ and } \pi \approx \pi_*$; else go to 2.</p>
</div>

# [Frozen Lake](https://gym.openai.com/envs/FrozenLake-v0/) implementation

The implementation of the Policy Iteration algorithm on the Frozen Lake problem 
displaying the value function $V(s)$ at each time step $t$ starting with a policy with equal probability.

<div class="policy-iteration-frozen-lake"></div>

<div style="text-align: right">
<a href="{{< ref "/posts/reinforcement-learning-algorithms.md" >}}">Table of content</a>
</div>

[^1]: Sutton, R. S., & Barto, A. G. (2018). [4.3 Policy Iteration](http://www.incompleteideas.net/book/RLbook2018.pdf). In Reinforcement learning: an introduction.

