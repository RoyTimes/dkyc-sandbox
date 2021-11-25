import { randomBytes } from 'tweetnacl'
import { AsymmetricEncryption } from '@skyekiwi/crypto'
import { u8aToHex } from '@skyekiwi/util'

const main = async () => {
  for (let i = 0; i < 3; i ++) {
    const secretKey = randomBytes(32)
    const publicKey = AsymmetricEncryption.getPublicKey(secretKey)

    console.log(`export const Authority${i} = ${JSON.stringify({
      'type': 'Authorities',
      'secretKey': u8aToHex(secretKey),
      'publicKey': u8aToHex(publicKey)
    })}`)
  }

  for (let i = 0; i < 6; i++) {
    const secretKey = randomBytes(32)
    const publicKey = AsymmetricEncryption.getPublicKey(secretKey)

    console.log(`export const EndUser${i} = ${JSON.stringify({
      'type': 'End-User',
      'secretKey': u8aToHex(secretKey),
      'publicKey': u8aToHex(publicKey)
    })}`)
  }
}

main()
