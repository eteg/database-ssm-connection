import * as child from 'child_process';
import * as core from '@actions/core';

import SSMConnection from './services/SSMConnection';

const main = async () => {
  const ssm = new SSMConnection();
  
  const targetInstanceId = core.getInput('target-instance-id', { required: true });
  const remoteHost = core.getInput('remote-host', { required: true });
  const remotePort = core.getInput('remote-port', { required: true });
  const localPort = core.getInput('local-port', { required: true });
  const awsRegion = core.getInput('aws-region', { required: true });
  const awsProfile = core.getInput('aws-profile', { required: false });

  const { response, input } = await ssm.connect(
    targetInstanceId,
    remoteHost,
    remotePort,
    localPort
  );

  const jsonResponse = JSON.stringify(response);
  const commandType = 'StartSession';
  const jsonInput = JSON.stringify(input);
  const ssmEndpoint = `https://ssm.${awsRegion}.amazonaws.com`;

  const ssmPluginArgs = [
    jsonResponse,
    awsRegion,
    commandType,
    awsProfile,
    jsonInput,
    ssmEndpoint,
  ];

  child
    .spawn('session-manager-plugin', ssmPluginArgs, {
      stdio: 'ignore',
      detached: true,
    })
    .unref();

  const { SessionId: sessionId } = response;

  core.info(
    `[database-ssm-connection] SessionId "${sessionId}" connected successfully.`
  );

  core.saveState('ssmSessionId', sessionId);
};

main();
