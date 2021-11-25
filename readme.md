# A simple Sandbox to Upload/Download an ID Doc

This sand box is able to:
1. Generate a list of keys for both Authorities & End-Users
2. Upstream a file `mock.jpg` and write a `secretId` to `result.ts`
3. Downstream the `result.ts` and write to `downloaded.jpg`

## How to run
1. run `yarn` to install dependencies
2. write a `.env` file per instructions from the [SkyeKiwi Protocol](https://github.com/skyekiwi/skyekiwi-protocol)
3. Generate some keypairs to mock keys held by authorities and end-users by running `yarn keys`. The command will generate a `key.ts` that contains a bunch of randomly generate keypairs.
4. Upstream the file by `yarn upstream`. The command will read keys from `keys.ts` and upstream the file and write the `secretId` assigned by the secret registry to `result.ts`
5. Downstream the file by `yarn downstream`. The command will read keys from `keys.ts` and read a `secretId` generated on the previous step. Finally, the recovered and downloaded file will be wrote as `downloaded.jpg`. 

## Customization
1. Try to mess with the `encryptionSchema` in the `upstream.ts` to customzied sharing behaviors. Change `numOfShares`, `threshold` or `unencryptedPieceCount` and `members`. There are 10 keys avalible from `keys.ts` to play with.
2. Try to change `mock.jpg` to different file type and different sizes. You may adjust the `highWaterMark` to change the chunk size to better suit your network conditions. It's set to 1MB by default. 
