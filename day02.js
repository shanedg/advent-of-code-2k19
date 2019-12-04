const fs = require('fs');
const util = require('util');

const readFilePromise = util.promisify(fs.readFile);

const compute = (intCodes, noun, verb) => {
  let position = 0;
  const codes = intCodes.map(code => parseInt(code));

  codes[1] = noun;
  codes[2] = verb;

  while (codes[position] !== 99) {
    const opCode = codes[position];

    const param1Address = codes[position + 1];
    const param2Address = codes[position + 2];
    const resultAddress = codes[position + 3];

    if (opCode === 1) {
      codes[resultAddress] = codes[param1Address] + codes[param2Address];
    } else if (opCode === 2) {
      codes[resultAddress] = codes[param1Address] * codes[param2Address];
    }

    position += 4;
  }

  return codes[0];
}

const part1 = intCodes => {
  console.log('Part 1:');
  return compute(intCodes, 12, 2);
};

const part2 = intCodes => {
  console.log('Part 2:');

  for (let i = 0; i <= 99; i += 1) {
    for (let j = 0; j <= 99; j += 1) {
      const result = compute(intCodes, i, j);
      if (result === 19690720) {
        return [i, j];
      }
    }
  }
};

const getIntCodes = input => {
  const splitOnNewline = input.split('\n');
  return splitOnNewline[0].split(',');
}

const main = async () => {
  console.log('## DAY 2 ##');

  const rawInput = await readFilePromise('./day02_input.txt', { encoding: 'utf-8' });
  const intCodes = getIntCodes(rawInput);

  const position0Value = part1(intCodes);
  console.log(position0Value);

  const nounVerbTuple = part2(intCodes);
  console.log(100 * nounVerbTuple[0] + nounVerbTuple[1]);
};

main();
