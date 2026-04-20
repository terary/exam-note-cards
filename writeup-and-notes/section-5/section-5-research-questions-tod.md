# Section 5 — research questions

## Question 001

__QUESTION__

Simply look at how r53 is used to create the multi-region App Runner. Specifically, there is a DNS record of type "latency" that routes traffic, what is that all about

__ANSWER__


__QUESTION_END__

## Question 002

__QUESTION__

What is the difference between "EKS Anywhere" and "ECS Anywhere"

__ANSWER__


__QUESTION_END__

## Question 003

__QUESTION__

CPU is linked to RAM. RAM limit 10GB. How do we adjust RAM we need?

__ANSWER__


__QUESTION_END__

## Question 004

__QUESTION__

What is the effect of "Reserved Concurrency", kinda a throttle?

__ANSWER__


__QUESTION_END__

## Question 005

__QUESTION__

Lambda concurrency Limit, is it for account? How would you allocation so much quota to certain Lambda but not others.

__ANSWER__


__QUESTION_END__

## Question 006

__QUESTION__

He goes on to say that lambda deployed in with the default settings will not have access to the internet, the only way to do that is with NAT/IGW.

__ANSWER__


__QUESTION_END__

## Question 007

__QUESTION__

He goes on to say how to configure a Lambda/Network to use NAT/IGW to get static IP. Is it possible to create one (few) IP NAT/IGW configurations so all calls from VPC use the same IPs, HOW?

__ANSWER__


__QUESTION_END__

## Question 008

__QUESTION__

Does that mean they SHOULD NOT have any side effects? I think that is impossible?

__ANSWER__


__QUESTION_END__

## Question 009

__QUESTION__

Utilizing Batch/Parallel Lambdas what are the pros and cons. It think he suggested that batch will be more robust.

__ANSWER__


__QUESTION_END__

## Question 010

__QUESTION__

What is Gateway Load Balancer (GWLB). Why is it better than NLB?

__ANSWER__


__QUESTION_END__

## Question 011

__QUESTION__

He mentions that CLB supports only one certificate. That the only way to do two-way verification is traffic passes through CLB directly to the instance. This seems strange, what will be the point of the CLB in that case? Can we configure multiple EC2 instances to use same certificate?

__ANSWER__


__QUESTION_END__

## Question 012

__QUESTION__

Why you might choose CLB over ALB?

__ANSWER__


__QUESTION_END__

## Question 013

__QUESTION__

What does it mean when an IP is the target (within target group)? Is that some sort of "anything goes"

__ANSWER__


__QUESTION_END__

## Question 014

__QUESTION__

Why would you use ALB as a target for NLB?

__ANSWER__


__QUESTION_END__

## Question 015

__QUESTION__

How/Why this is important

__ANSWER__


__QUESTION_END__

## Question 016

__QUESTION__

Acts 'Sticky' so long as the TCP connection is open. NLB

__ANSWER__


__QUESTION_END__

## Question 017

__QUESTION__

What are the 'stages' named environment? But in the slide it shows diverting 5% of traffic from Prod to Test, but he doesn't cover the distribution mechanism. Figure out how to divert traffic from one stage to another with API-G

__ANSWER__


__QUESTION_END__

## Question 018

__QUESTION__

With this configuration, does the client "follow" the redirect URL? Does it make two requests, pre-request and actual upload request?

__ANSWER__


__QUESTION_END__

## Question 019

__QUESTION__

It looks like there is only one endpoint type that is most common (Edge Optimized). I don't understand the use-case for regional vs private? Also, what if we don't want Edge Optimized, is it a choice or these are the 3 options?

__ANSWER__


__QUESTION_END__

## Question 020

__QUESTION__

He seem to make a point that response data is special somehow. Something weird about sending messages `@something`. It didn't make sense to me but I probably want to know better what he is talking about.

__ANSWER__


__QUESTION_END__

## Question 021

__QUESTION__

How to make API-G private

__ANSWER__


__QUESTION_END__

## Question 022

__QUESTION__

What is AppSync. The GraphQL part makes sense but I think there is more to it than that... The "combined data sources" part has me a little confused.

__ANSWER__


__QUESTION_END__

## Question 023

__QUESTION__

What is the difference between "Alias" and "CNAME" records? He explains you can map alias to root of DNS (example.com) but not CNAME?

__ANSWER__


__QUESTION_END__

## Question 024

__QUESTION__

Understand why this is useful? What is the use-case

__ANSWER__


__QUESTION_END__

## Question 025

__QUESTION__

He said something about only returning records for healthy resources?

__ANSWER__


__QUESTION_END__

## Question 026

__QUESTION__

What is the big-deal about health checks and Route 53. It seems to be a point about when records can be used for health check and not. Understand the 'why'

__ANSWER__


__QUESTION_END__

## Question 027

__QUESTION__

I think the deal is that you create one DNS that points to two ALB, R53 will do health checks on both before. If one is failing it will return only the working record

__ANSWER__


__QUESTION_END__

## Question 028

__QUESTION__

Want to see this in action, its pass/fail, not on status code but content?

__ANSWER__


__QUESTION_END__

## Question 029

__QUESTION__

This is a health check on a DNS record or server?

__ANSWER__


__QUESTION_END__

## Question 030

__QUESTION__

You want to know how to do this

__ANSWER__


__QUESTION_END__

## Question 031

__QUESTION__

What are the points of Inbound/Outbound Resolvers. I think its a simple matter.

__ANSWER__


__QUESTION_END__

## Question 032

__QUESTION__

This is unclear. When using global accelerator - 2 Anycast IP and they are used to route traffic? These are standard IPs that are used in DNS resolution?

__ANSWER__


__QUESTION_END__

## Question 033

__QUESTION__

When to choose Accelerator vs Cloud Front

__ANSWER__


__QUESTION_END__

## Question 034

__QUESTION__

These serve different purposes. Can/do they work together? What problem is each solving?

__ANSWER__


__QUESTION_END__

## Question 035

__QUESTION__

Using ECS run time for lambda vs custom runtime?

__ANSWER__


__QUESTION_END__
