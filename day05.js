const fs = require('fs');
const util = require('util');

const DAY = '05';
const readFilePromise = util.promisify(fs.readFile);

/**
 * Parse string of codes into list of integers.
 * @param {string} input Comma-separated IntCode commands.
 */
const parseIntCodes = input => {
  return input.split('\n')[0].split(',')
    .map(n => Number.parseInt(n, 10));
}

/**
 * Run the IntCode computer against the provided instructions.
 * @param {*} intCodes
 */
const compute = (intCodes) => {
  let position = 0;
  const instructions = [...intCodes];

  while (instructions[position] !== 99) {
    const instruction = instructions[position];
    const opCode = instruction % 100;

    // Get parameter modes
    const modes = [];
    let digitsPlace = 100;
    while (instruction >= digitsPlace) {
      let mode = Math.floor(instruction / digitsPlace);
      while (mode >= 10) {
        if (mode === 10) {
          mode = 0;
        } else {
          mode = Math.floor(mode / 10);
        }
      }
      modes.push(mode);
      digitsPlace *= 10;
    }

    const param1 = instructions[position + 1];
    const mode1 = (modes.length && (modes.shift() === 1)) ? true : false;
    const param2 = instructions[position + 2];
    const mode2 = (modes.length && (modes.shift() === 1)) ? true : false;
    const param3 = instructions[position + 3];

    let instructionLength;

    if (opCode === 1) {
      instructions[param3] = (mode1 ? param1 : instructions[param1]) + (mode2 ? param2 : instructions[param2]);
      instructionLength = 4;
    } else if (opCode === 2) {
      instructions[param3] = (mode1 ? param1 : instructions[param1]) * (mode2 ? param2 : instructions[param2]);
      instructionLength = 4;
    } else if (opCode === 3) {
      instructions[param1] = 1;
      instructionLength = 2;
    } else if (opCode === 4) {
      console.log(`outputting value at position given by ${param1}: ${(mode1 ? param1 : instructions[param1])}`);
      instructionLength = 2;
    } else {
      console.log('error bad opcode!', opCode);
    }

    position += instructionLength;
  }

  return instructions[0];
}

/**
 * Main :)
 */
const main = async () => {
  console.log(`## DAY ${DAY} ## Part 1`);

  const rawInput = await readFilePromise(
    `./day${DAY}_input.txt`,
    { encoding: 'utf-8' }
  );
  const intCodes = parseIntCodes(rawInput);
  console.log(intCodes);

  compute(intCodes);
};

main();
