const EXP = new Uint8Array(512);
const LOG = new Uint8Array(256);

for (let value = 1, exponent = 0; exponent < 255; exponent += 1) {
  EXP[exponent] = value;
  LOG[value] = exponent;
  value <<= 1;
  if (value & 0x100) value ^= 0x11d;
}
for (let index = 255; index < 512; index += 1) EXP[index] = EXP[index - 255];

const gfMultiply = (left: number, right: number) => (left === 0 || right === 0 ? 0 : EXP[LOG[left] + LOG[right]]);

const multiplyPolynomial = (left: number[], right: number[]) => {
  const result = Array(left.length + right.length - 1).fill(0);
  left.forEach((leftValue, leftIndex) => right.forEach((rightValue, rightIndex) => {
    result[leftIndex + rightIndex] ^= gfMultiply(leftValue, rightValue);
  }));
  return result;
};

const reedSolomon = (data: number[], degree: number) => {
  let generator = [1];
  for (let index = 0; index < degree; index += 1) generator = multiplyPolynomial(generator, [1, EXP[index]]);
  const remainder = Array(degree).fill(0);
  data.forEach((value) => {
    const factor = value ^ remainder[0];
    remainder.shift();
    remainder.push(0);
    generator.slice(1).forEach((coefficient, index) => { remainder[index] ^= gfMultiply(coefficient, factor); });
  });
  return remainder;
};

const bchFormat = (value: number) => {
  let remainder = value << 10;
  const generator = 0x537;
  while (remainder.toString(2).length >= generator.toString(2).length) {
    remainder ^= generator << (remainder.toString(2).length - generator.toString(2).length);
  }
  return ((value << 10) | remainder) ^ 0x5412;
};

const addFinder = (matrix: (boolean | null)[][], row: number, column: number) => {
  const size = matrix.length;
  for (let dy = -1; dy <= 7; dy += 1) for (let dx = -1; dx <= 7; dx += 1) {
    const y = row + dy; const x = column + dx;
    if (y < 0 || x < 0 || y >= size || x >= size) continue;
    const inside = dx >= 0 && dx <= 6 && dy >= 0 && dy <= 6;
    const black = inside && (dx === 0 || dx === 6 || dy === 0 || dy === 6 || (dx >= 2 && dx <= 4 && dy >= 2 && dy <= 4));
    matrix[y][x] = black;
  }
};

const addAlignment = (matrix: (boolean | null)[][], row: number, column: number) => {
  for (let dy = -2; dy <= 2; dy += 1) for (let dx = -2; dx <= 2; dx += 1) {
    const distance = Math.max(Math.abs(dx), Math.abs(dy));
    if (matrix[row + dy]?.[column + dx] === null) matrix[row + dy][column + dx] = distance !== 1;
  }
};

const addFormat = (matrix: (boolean | null)[][], mask = 0) => {
  const size = matrix.length;
  const format = bchFormat((1 << 3) | mask); // Error correction level L.
  for (let index = 0; index < 15; index += 1) {
    const bit = ((format >> index) & 1) === 1;
    const verticalRow = index < 6 ? index : index < 8 ? index + 1 : size - 15 + index;
    const horizontalColumn = index < 8 ? size - index - 1 : index < 9 ? 15 - index : 15 - index - 1;
    matrix[verticalRow][8] = bit;
    matrix[8][horizontalColumn] = bit;
  }
};

/**
 * Small standards-compliant byte-mode QR encoder for short local payloads.
 * It intentionally supports version 1/2-L only so the browser utility has a
 * clear 32-byte limit instead of pretending to encode arbitrary payloads.
 */
export function createQrMatrix(value: string): boolean[][] {
  const bytes = Array.from(new TextEncoder().encode(value));
  if (!bytes.length) throw new Error('Enter text or a URL to encode.');
  if (bytes.length > 32) throw new Error('This lightweight QR runner supports up to 32 UTF-8 bytes.');
  const version = bytes.length <= 17 ? 1 : 2;
  const dataCodewords = version === 1 ? 19 : 34;
  const eccCodewords = version === 1 ? 7 : 10;
  const bits: number[] = [0, 1, 0, 0];
  for (let shift = 7; shift >= 0; shift -= 1) bits.push((bytes.length >> shift) & 1);
  bytes.forEach((byte) => { for (let shift = 7; shift >= 0; shift -= 1) bits.push((byte >> shift) & 1); });
  for (let index = 0; index < Math.min(4, dataCodewords * 8 - bits.length); index += 1) bits.push(0);
  while (bits.length % 8) bits.push(0);
  const data: number[] = [];
  for (let index = 0; index < bits.length; index += 8) data.push(bits.slice(index, index + 8).reduce((result, bit) => (result << 1) | bit, 0));
  const pads = [0xec, 0x11];
  let padIndex = 0;
  while (data.length < dataCodewords) data.push(pads[padIndex++ % 2]);
  const codewords = [...data, ...reedSolomon(data, eccCodewords)];
  const size = version * 4 + 17;
  const matrix: (boolean | null)[][] = Array.from({ length: size }, () => Array<boolean | null>(size).fill(null));
  addFinder(matrix, 0, 0); addFinder(matrix, size - 7, 0); addFinder(matrix, 0, size - 7);
  for (let index = 8; index < size - 8; index += 1) {
    if (matrix[6][index] === null) matrix[6][index] = index % 2 === 0;
    if (matrix[index][6] === null) matrix[index][6] = index % 2 === 0;
  }
  if (version === 2) addAlignment(matrix, 18, 18);
  matrix[size - 8][8] = true;
  let bitIndex = 0;
  let upward = true;
  for (let column = size - 1; column > 0; column -= 2) {
    if (column === 6) column -= 1;
    for (let rowOffset = 0; rowOffset < size; rowOffset += 1) {
      const row = upward ? size - 1 - rowOffset : rowOffset;
      for (let offset = 0; offset < 2; offset += 1) {
        const currentColumn = column - offset;
        if (matrix[row][currentColumn] !== null) continue;
        const rawBit = bitIndex < codewords.length * 8 ? ((codewords[Math.floor(bitIndex / 8)] >> (7 - (bitIndex % 8))) & 1) === 1 : false;
        matrix[row][currentColumn] = (row + currentColumn) % 2 === 0 ? !rawBit : rawBit;
        bitIndex += 1;
      }
    }
    upward = !upward;
  }
  addFormat(matrix);
  return matrix.map((row) => row.map((cell) => cell === true));
}
