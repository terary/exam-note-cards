# Section 4 — todo

## 1

I don't know how to do this.

## 2

Use Athena to look at CloudTrail events in S3

## 3

Do this, all, try with cloudformation

## 4

Set-up alert for an activity using CT, CT-Logs, cw alarm, sns

## 5

Figure out how advanced parameter store sends notification to EventBridge

## 6

Build two cloudformation template - A) Create a secret manager secret and B) one to read secret manager secret

## 7

Maybe try to do this but it may be time consuming and not all that valuable.

## 8

understand better about what IAM can/not do for the different databases. Oracle and MSSQL support TDE (which doesn't sound like user auth), but Mysql Psql, maria all have IAM but the other two do not?

## 9

how does ACM work with CloudFront. He said we don't have to worry about certs if using CloudFront.

## 10

As I read it, there is nothing for users to do for encryption in glacier. What if we encrypt using SSE-KMS, and our life cycle rules move to Glacier? What happens to the encryption then?

## 11

not sure, but involves a `VCP Endpoint Gateway`

## 12

I don't really know, use "Object Lock" or "Glacier Vault Lock"

## 13

the graphic shows user in the Analytics Group have access to two prefixes `/finance/` and `/sales`, Is this one Access point? or is it the case there is a policy for the group? Can access points reference more than one prefix?

## 14

not really sure but I need to try this

## 15

do this hands on

## 16

confirm this)

## 17

Are access points necessary to create Object Lambda, he said Object Lambda are another reason for Access Points

## 18

Does S3 Object Lambdas need "warm-up"? Also, can we call cron to do warm-ups? I mean we can schedule lambda same as cron? can we do warm up there? When doing "warm-up" does it make sense to send arguments `isWarmUp` which then quick-returns.

## 19

find the answer to this question

## 20

Set-up WAF, get to know "Rule Actions: Count | Allow | Block | CAPTCHA | Challenge"

## 21

VERY IMPORTANT - TO DO THIS.

## 22

Can AWS Config send events to EventBridge or other services? SNS only (later he mentions Event Bridge)?

## 23

Set-up AWS Config see it in action

## 24

Set-up Guard Duty, find cost information. This looks like a must-have service, try find reasons not to use it (devils advocate).

## 25

Set-up this, always

## 26

Setup security Hub (and cost)
