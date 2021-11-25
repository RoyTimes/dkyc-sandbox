// Copyright 2021 SkyeKiwi
// SPDX-License-Identifier: Apache-2.0

import fs from 'fs'
import path from 'path'

import { mnemonicToMiniSecret, mnemonicValidate } from '@polkadot/util-crypto';

import { File } from '@skyekiwi/file';
import { AsymmetricEncryption, DefaultSealer, EncryptionSchema } from '@skyekiwi/crypto';
import { WASMContract } from '@skyekiwi/wasm-contract';
import { Crust } from '@skyekiwi/crust-network';
import { Driver } from '@skyekiwi/driver';

import abi from './mock/skyekiwi';
import types from './mock/types';

const credentialPath = path.join(__dirname, 'mock.jpg');
require('dotenv').config();

const main = async () => {

  const mnemonic = process.env.SEED_PHRASE as string;

  if (!mnemonicValidate(mnemonic)) {
    throw new Error('mnemonic failed to read - e2e.spec.ts');
  }

  const storage = new Crust(mnemonic);
  const registry = new WASMContract(mnemonic, types, abi, '3gVh53DKMJMhQxNTc1fEegJFoZWvitpE7iCLPztDzSzef2Bg');


  const file = new File({
    fileName: "some_id.jpg",
    readStream: fs.createReadStream(credentialPath)
  });

  const sealer = new DefaultSealer();
  sealer.unlock(mnemonicToMiniSecret(mnemonic));

  const encryptionSchema = new EncryptionSchema({
    author: sealer.getAuthorKey(),
    numOfShares: 2,
    threshold: 2,
    unencryptedPieceCount: 1
  });

  encryptionSchema.addMember(sealer.getAuthorKey(), 1);

  const result = await Driver.upstream(
    file, sealer, encryptionSchema, storage, registry
  );

  console.log(result);

  await storage.disconnect();
  await registry.disconnect();
}

main()
