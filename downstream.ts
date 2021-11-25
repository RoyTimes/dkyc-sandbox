// Copyright 2021 SkyeKiwi
// SPDX-License-Identifier: Apache-2.0

import fs from 'fs'
import path from 'path'

import { DefaultSealer } from '@skyekiwi/crypto';
import { WASMContract } from '@skyekiwi/wasm-contract';
import { Driver } from '@skyekiwi/driver';
import { hexToU8a } from '@skyekiwi/util';

import abi from './fixtures/skyekiwi';
import types from './fixtures/types';

const downstreamPath = path.join(__dirname, 'downloaded.jpg');
require('dotenv').config();

import {
  Authority0
} from './keys'
import { secretId } from './result'

const main = async() => {
  const stream = fs.createWriteStream(downstreamPath, { flags: 'a' });
  const sealer = new DefaultSealer();
  const registry = new WASMContract(process.env.SEED_PHRASE as string, types, abi, '3gVh53DKMJMhQxNTc1fEegJFoZWvitpE7iCLPztDzSzef2Bg');

  const authority = hexToU8a(Authority0['secretKey'])
  sealer.unlock(authority);

  await Driver.downstream(
    secretId, [authority], registry, stream, sealer
  );

  await registry.disconnect();
}

main()
