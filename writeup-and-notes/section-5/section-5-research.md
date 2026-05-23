# Section 5 — research

## 1

Simply look at how r53 is used to create the multi-region App Runner. Specifically, there is a DNS record of type "latency" that routes traffic, what is that all about

## 2

What is the difference between "EKS Anywhere" and "ECS Anywhere"

## 3

CPU is linked to RAM. RAM limit 10GB. How do we adjust RAM we need?

## 4

What is the effect of "Reserved Concurrency", kinda a throttle?

## 5

Lambda concurrency Limit, is it for account? How would you allocation so much quota to certain Lambda but not others.

## 6

He goes on to say that lambda deployed in with the default settings will not have access to the internet, the only way to do that is with NAT/IGW.

## 7

He goes on to say how to configure a Lambda/Network to use NAT/IGW to get static IP. Is it possible to create one (few) IP NAT/IGW configurations so all calls from VPC use the same IPs, HOW?

## 8

Does that mean they SHOULD NOT have any side effects? I think that is impossible?

## 9

Utilizing Batch/Parallel Lambdas what are the pros and cons. It think he suggested that batch will be more robust.

## 10

What is Gateway Load Balancer (GWLB). Why is it better than NLB?

## 11

He mentions that CLB supports only one certificate. That the only way to do two-way verification is traffic passes through CLB directly to the instance. This seems strange, what will be the point of the CLB in that case? Can we configure multiple EC2 instances to use same certificate?

## 12

Why you might choose CLB over ALB?

## 13

What does it mean when an IP is the target (within target group)? Is that some sort of "anything goes"

## 14

Why would you use ALB as a target for NLB?

## 15

How/Why this is important

## 16

Acts 'Sticky' so long as the TCP connection is open. NLB

## 17

What are the 'stages' named environment? But in the slide it shows diverting 5% of traffic from Prod to Test, but he doesn't cover the distribution mechanism. Figure out how to divert traffic from one stage to another with API-G

## 18

With this configuration, does the client "follow" the redirect URL? Does it make two requests, pre-request and actual upload request?

## 19

It looks like there is only one endpoint type that is most common (Edge Optimized). I don't understand the use-case for regional vs private? Also, what if we don't want Edge Optimized, is it a choice or these are the 3 options?

## 20

He seem to make a point that response data is special somehow. Something weird about sending messages `@something`. It didn't make sense to me but I probably want to know better what he is talking about.

## 21

How to make API-G private

## 22

What is AppSync. The GraphQL part makes sense but I think there is more to it than that... The "combined data sources" part has me a little confused.

## 23

What is the difference between "Alias" and "CNAME" records? He explains you can map alias to root of DNS (example.com) but not CNAME?

## 24

Understand why this is useful? What is the use-case

## 25

He said something about only returning records for healthy resources?

## 26

What is the big-deal about health checks and Route 53. It seems to be a point about when records can be used for health check and not. Understand the 'why'

## 27

I think the deal is that you create one DNS that points to two ALB, R53 will do health checks on both before. If one is failing it will return only the working record

## 28

Want to see this in action, its pass/fail, not on status code but content?

## 29

This is a health check on a DNS record or server?

## 30

You want to know how to do this

## 31

What are the points of Inbound/Outbound Resolvers. I think its a simple matter.

## 32

This is unclear. When using global accelerator - 2 Anycast IP and they are used to route traffic? These are standard IPs that are used in DNS resolution?

## 33

When to choose Accelerator vs Cloud Front

## 34

These serve different purposes. Can/do they work together? What problem is each solving?

## 35

Using ECS run time for lambda vs custom runtime?
