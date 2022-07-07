import { bech32 } from 'bech32';

export default class Bech32Address {
  private readonly walletAddress;

  constructor(address: Uint8Array) {
    this.walletAddress = address;
  }

  get address(): Uint8Array {
    return this.walletAddress;
  }

  static fromBech32(address: string, prefix?: string): Bech32Address {
    const decoded = bech32.decode(address);
    if (prefix && decoded.prefix !== prefix) {
      throw new Error('Unmatched prefix');
    }

    return new Bech32Address(new Uint8Array(bech32.fromWords(decoded.words)));
  }

  static validate(bech32Address: string, prefix?: string) {
    const { prefix: decodedPrefix } = bech32.decode(bech32Address);
    if (prefix && prefix !== decodedPrefix) {
      throw new Error(
        `Unexpected prefix (expected: ${prefix}, actual: ${decodedPrefix})`,
      );
    }
  }

  toBech32(prefix: string): string {
    const words = bech32.toWords(this.walletAddress);
    return bech32.encode(prefix, words);
  }
}
