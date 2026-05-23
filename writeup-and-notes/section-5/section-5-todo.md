# Section 5 — todo

## 1

He says repeated "Up to 7 per AZ" where does this limit come from

## 2

I thought placement group was a logical grouping. This the slide suggest that they are physically near "Placement Group Cluster, low latency, same rack, same az" (2:14)

## 3

He makes the claim that "Bypasses the underlying Linux OS to provide low-latency" Learn more about this

## 4

Know this, This was suppose to be HPC related but they're throwing in 'general' options 'EBS', is that really "high performance"?, Not also, I thought a limitation of FSx for Lustre - was bound to single AZ.

## 5

Get a better appreciation of GB/s vs IOPS. I think we shouldn't intermingle. I get GB/s (or rate), but IOPS is a little fuzzy why it would be used in similar context.

## 6

Spot vs On Demand - Is there a ratio? How bad of an idea to mix 50% spot/demand?

## 7

Maybe better understand the pro/cons all options a little better. Specifically, what is so bad about the first option, slight increase in capacity, update launch config?

## 8

What are the dis/advantages of spot fleets?

## 9

Look at setting up a spot fleet. It can be deployed across multiple AZ and uses a combo of on-demand and spot. Look at how to set-up the whole system in terms of Forms.

## 10

What is "Easy Service Discovery features to enhance communication"

## 11

Setup ECS and ALB, with a couple of tasks

## 12

Setup fargate with the same couple of tasks from ECS

## 13

What is the point here. I am not sure I understand. We must increase capacity, manually? Why does "serverless" make it easier?

## 14

Answer that question

## 15

Answer that question.

## 16

better understand the underlying architecture

## 17

Set-up EKS at least one time.

## 18

Set-up lambda - use it to access internal resources and internet. Look at deployment strategies and various pros/cons.

## 19

Make a lambda with fixed IP

## 20

VERY IMPORTANT Set-up ALB with websocket. Also see multiple certificate in play

## 21

Set-up API-G to use API Keys

## 22

Setup AppSync

## 23

Look at "Traffic Flow" I think it's just a visual tool.

## 24

Look at "calculated health checks"

## 25

Create a "Multi Region fail over strategy for RDS"
