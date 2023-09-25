import {
  SSMClient,
  StartSessionCommand,
  TerminateSessionCommand,
} from '@aws-sdk/client-ssm';

export default class SSMConnection {
  private client: SSMClient;

  constructor() {
    this.client = new SSMClient();
  }

  async connect(
    target: string,
    dbHost: string,
    dbPort: string | number,
    localPort: string | number
  ) {
    const input = {
      Target: target,
      DocumentName: 'AWS-StartPortForwardingSessionToRemoteHost',
      Parameters: {
        host: [dbHost],
        portNumber: [dbPort],
        localPortNumber: [localPort],
      },
    };

    const command = new StartSessionCommand(input);

    const response = await this.client.send(command);

    return { response, input };
  }

  disconnect(sessionId: string) {
    const input = {
      SessionId: sessionId,
    };

    const command = new TerminateSessionCommand(input);

    return this.client.send(command);
  }
}
