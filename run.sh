#!/bin/bash
redis-cli eval "$(cat redis.lua)" 2 \
PROMETHEUS_:histogram:run_cost_name \
PROMETHEUS_histogram_METRIC_KEYS \
'{"b":"sum","labelValues":["link"]}' \
'{"b":"50","labelValues":["link"]}' \
45 \
'{"name":"run_cost","help":"","type":"histogram","labelNames":["name"],"buckets":[20,10,30,40,50,60,70]}'

