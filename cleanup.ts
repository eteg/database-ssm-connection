import * as core from '@actions/core';

import SSMConnection from './services/SSMConnection';

const cleanup = async () => {
  const ssm = new SSMConnection();

  const sessionId = core.getState('ssmSessionId');

  if (!sessionId) {
    return core.setFailed(
      '[database-ssm-connection] Error at cleanup.js - Failed to get SSM SessionId.'
    );
  }

  await ssm.disconnect(sessionId);

  core.info(
    `[database-ssm-connection] SessionId "${sessionId}" terminated successfully.`
  );
};

cleanup();
