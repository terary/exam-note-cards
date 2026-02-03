## Default VPC Subnets

Default VPC subnets are usually public (have an internet gateway). MSK doesn't need internet access.

## Security Considerations

1. Security groups: The template creates a security group that only allows traffic from itself, so MSK isn't exposed to the internet even in public subnets.
2. Network isolation: MSK is only accessible from within the VPC (or via VPN/bastion).
3. For learning: Using default subnets is fine — security groups provide protection.

## Production Best Practices

- Use private subnets (no internet gateway)
- Use VPC endpoints for AWS service access
- More network isolation

## For Your Learning Project

Using default VPC subnets is acceptable because:
- Security groups restrict access
- MSK is only accessible from within the VPC
- You'll tear it down quickly
- Simpler setup

The security group in the template already restricts access, so MSK won't be internet-accessible even in public subnets.

Should I keep it as-is (using default subnets), or create a version that uses private subnets?