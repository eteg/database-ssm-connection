# ssm-connect

Github Action for connect to a remote host through aws ssm session.

# Usage

<!-- start usage -->
```yaml
- uses: eteg/ssm-connect@v1 
  with:
    # EC2 instance id of your SSM managed instance. For example, i-a1b2c3d4e5f6g7h8i.
    target-instance-id: ''

    # AWS Region which instance is located. For example, us-east-2.
    aws-region: ''

    # Remote server host. For example, app.host.amazonaws.com.
    remote-host: ''

    # Remote server port. For example, 3000.
    remote-port: ''

    # Local port on the client where traffic should be redirected to. For example, using 3000, the remote server traffic will be redirected to localhost:3000.
    local-port: ''

```
<!-- end usage -->

# Example of use
```yaml
name: Example ssm connection

on:
  push:
    branches:
      - main

jobs:
  access-ssm:
    runs-on: ubuntu-latest

    env:
     LOCAL_PORT: 5432
     NODE_VERSION: 16.x

    environment: prod

    permissions:
      id-token: write
      contents: read

    steps:
      - name: Setup AWS Credentials
        uses: aws-actions/configure-aws-credentials@v2
        with:
          role-to-assume: arn:aws:iam::${{ secrets.AWS_ACCOUNT_ID }}:role/${{ secrets.AWS_ACCOUNT_ID }}
          aws-region: ${{ secrets.AWS_REGION }}

      - name: Start Session
        uses: eteg/ssm-connect@v1
        with:
          target-instance-id: ${{ secrets.BASTION_HOST_INSTANCE_ID }}
          remote-host: ${{ secrets.REMOTE_SERVER_HOST }}
          remote-port: ${{ secrets.REMOTE_SERVER_PORT }}
          local-port: ${{ env.LOCAL_PORT }}
          region: ${{ secrets.AWS_REGION }}

      - name: Check out repository code
        uses: actions/checkout@v3

      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: ${{ env.NODE_VERSION }}

      - name: Install Dependencies
        run: yarn install

      - name: Run migrations
        env:
          DATABASE_URL: postgresql://${{ secrets.DB_USER }}:${{ secrets.DB_PASSWORD }}@localhost:${{ env.LOCAL_PORT }}/${{ secrets.DB_NAME }}
        run: yarn prisma migrate deploy


```

# License

The scripts and documentation in this project are released under the [MIT License](LICENSE)