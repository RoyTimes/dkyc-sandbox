// Copyright 2021 SkyeKiwi
// SPDX-License-Identifier: Apache-2.0

import fs from 'fs'
import path from 'path'

import { mnemonicToMiniSecret, mnemonicValidate } from '@polkadot/util-crypto';

import { File } from '@skyekiwi/file';
import { DefaultSealer, EncryptionSchema } from '@skyekiwi/crypto';
import { WASMContract } from '@skyekiwi/wasm-contract';
import { Crust } from '@skyekiwi/crust-network';
import { Driver } from '@skyekiwi/driver';
import { hexToU8a } from '@skyekiwi/util';

import abi from './fixtures/skyekiwi';
import types from './fixtures/types';

const credentialPath = path.join(__dirname, 'mock.jpg');
require('dotenv').config();

import {
  Authority0, Authority1
} from './keys'

const main = async () => {

  const mnemonic = process.env.SEED_PHRASE as string;

  if (!mnemonicValidate(mnemonic)) {
    throw new Error('mnemonic failed to read - e2e.spec.ts');
  }

  const storage = new Crust(mnemonic);
  const registry = new WASMContract(mnemonic, types, abi, '3gVh53DKMJMhQxNTc1fEegJFoZWvitpE7iCLPztDzSzef2Bg');


  const file = new File({
    fileName: "some_id.jpg",
    readStream: fs.createReadStream(credentialPath, {
      // chunk size at 1MB
      highWaterMark: 1 * (10 ** 6)
    })
  });

  const sealer = new DefaultSealer();
  sealer.unlock(mnemonicToMiniSecret(mnemonic));

  // share the file with two authorties
  const encryptionSchema = new EncryptionSchema({
    author: sealer.getAuthorKey(),
    numOfShares: 6,
    threshold: 2,
    unencryptedPieceCount: 0
  });


  encryptionSchema.addMember(sealer.getAuthorKey(), 2);
  encryptionSchema.addMember(hexToU8a(Authority0['publicKey']), 2);
  encryptionSchema.addMember(hexToU8a(Authority1['publicKey']), 2);

  const result = await Driver.upstream(
    file, sealer, encryptionSchema, storage, registry
  );

  // @ts-ignore
  fs.writeFileSync(path.join(__dirname, 'result.ts'), `export const secretId = ${result['ok']}`)

  await storage.disconnect();
  await registry.disconnect();
}

main()
