---
title: "Jenkins Scripted Pipeline collection"
date: 2020-10-11T00:00:00+02:00
draft: false
---

Curated list of useful Jenkins Scripted Pipeline patterns as a complement to
the official [pipeline-example](https://github.com/jenkinsci/pipeline-examples) git repository.

<!--more--> 

# Executor label

{{< highlight groovy "" >}}
node('label') {
    sh 'running-on-executor-with-label'
}
{{< / highlight >}}

# Update Github commit  [status checks](https://docs.github.com/en/free-pro-team@latest/github/collaborating-with-issues-and-pull-requests/about-status-checks)

{{< highlight groovy "" >}}
node {
    step([
        $class: 'GitHubCommitStatusSetter',
        contextSource: [$class: 'ManuallyEnteredCommitContextSource', context: "Checkstyle"],
        statusResultSource: [$class: 'ConditionalStatusResultSource', results: [
                [$class: "AnyBuildResult", 
                    message: "Build ${BUILD_DISPLAY_NAME}", 
                    state: 'SUCCESS']
            ]
        ]
    ])
}
{{< / highlight >}}

# Per-steps status handlers

Notifying a third-party service (i.e. Github) based on a single step or stage result.

{{< highlight groovy "" >}}
node {
    stage_success = false

    catchError(buildResult: 'UNSTABLE', stageResult: 'FAILURE') {
        sh 'command-that-may-fail'
        sh 'update-stage-status-to-success'
        success = true
    }

    if (!stage_success) {
        sh 'update-stage-status-to-failure'
    }
}
{{< / highlight >}}

Using `catchError` allow to correctly set the build & stage results
while still allowing to update third-party service status.

# Run steps inside container

{{< highlight groovy "" >}}
node {
    withDockerContainer('busybox') {
        sh 'ls'
    }
}
{{< / highlight >}}

# Run docker command inside container

{{< highlight groovy "" >}}
node {
    withDockerContainer(args: '-u root -v /var/run/docker.sock:/var/run/docker.sock', image: 'docker') {
        sh 'docker ps'
    }
}
{{< / highlight >}}
