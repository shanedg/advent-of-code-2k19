const fs = require('fs');
const util = require('util');

const DAY = '07';
const readFilePromise = util.promisify(fs.readFile);

const parseIntCodes = input => {
  return input.split('\n')[0].split(',')
    .map(n => Number.parseInt(n, 10));
};

const getParameterModes = instruction => {
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

  return modes;
};

const getParams = (modes, instructions, position) => {
  const param1 = instructions[position + 1];
  const mode1 = (modes.length && (modes.shift() === 1)) ? true : false;
  const param2 = instructions[position + 2];
  const mode2 = (modes.length && (modes.shift() === 1)) ? true : false;
  const param3 = instructions[position + 3];

  return {
    param1,
    mode1,
    param2,
    mode2,
    param3,
  };
};

const compute = (intCodes, phase, inputSignal) => {
  const outputs = [];
  let position = 0;
  const instructions = [...intCodes];

  let phaseGiven = false;

  while (instructions[position] !== 99) {
    const instruction = instructions[position];
    const modes = getParameterModes(instruction);
    const {
      param1,
      mode1,
      param2,
      mode2,
      param3,
    } = getParams(modes, instructions, position);

    const opCode = instruction % 100;
    let instructionLength;

    switch(opCode) {
      case 1:
        instructions[param3] = (mode1 ? param1 : instructions[param1]) + (mode2 ? param2 : instructions[param2]);
        instructionLength = 4;
        break;
      case 2:
        instructions[param3] = (mode1 ? param1 : instructions[param1]) * (mode2 ? param2 : instructions[param2]);
        instructionLength = 4;
        break;
      case 3:
        instructions[param1] = phaseGiven ? inputSignal : phase;
        if (!phaseGiven) {
          phaseGiven = true;
        }
        instructionLength = 2;
        break;
      case 4:
        outputs.push(mode1 ? param1 : instructions[param1]);
        instructionLength = 2;
        break;
      case 5:
        const test = mode1 ? param1 : instructions[param1];
        if (test !== 0) {
          const newPointer = mode2 ? param2 : instructions[param2];
          position = newPointer;
          instructionLength = 0;
        } else {
          instructionLength = 3;
        }
        break;
      case 6:
        const testIfZero = mode1 ? param1 : instructions[param1];
        if (testIfZero === 0) {
          const newPointer = mode2 ? param2 : instructions[param2];
          position = newPointer;
          instructionLength = 0;
        } else {
          instructionLength = 3;
        }
        break;
      case 7:
        const testIfLessThan = mode1 ? param1 : instructions[param1];
        const testIfGreaterThan = mode2 ? param2 : instructions[param2];
        instructions[param3] = (testIfLessThan < testIfGreaterThan) ? 1 : 0;
        instructionLength = 4;
        break;
      case 8:
        const testIfEqual1 = mode1 ? param1 : instructions[param1];
        const testIfEqual2 = mode2 ? param2 : instructions[param2];
        instructions[param3] = (testIfEqual1 === testIfEqual2) ? 1 : 0;
        instructionLength = 4;
        break;
      default:
        throw new Error(`Bad opcode ${opCode}`);
    }

    position += instructionLength;
  }

  return outputs;
};

// lifted/adapted from here: https://initjs.org/all-permutations-of-a-set-f1be174c79f8
const permute = (set) => {
  const permutations = [];

  if (set.length === 1) {
    return set;
  }

  set.forEach((x, i) => {
    const remaining = [].concat(set.slice(0, i), set.slice(i + 1));
    const inner = permute(remaining);
    inner.forEach((y, j) => {
      permutations.push([x].concat(y));
    });
  });

  return permutations;
};

const main = async () => {
  console.log(`## Day ${DAY} ## Part 1`);

  const input = await readFilePromise(
    `./day${DAY}_input.txt`,
    { encoding: 'utf-8' }
  );
  const codes = parseIntCodes(input);

  const phases = [0, 1, 2, 3, 4];
  const settingsPermutations = permute(phases);

  const largestSignal = settingsPermutations.reduce((largest, currentPermutation) => {
    const nextSignal = currentPermutation.reduce((result, current) => {
      return compute(codes, current, result)[0];
    }, 0);
    if (Number.parseInt(nextSignal) > largest) {
      return Number.parseInt(nextSignal);
    }
    return largest;
  }, 0);
  console.log('highest signal that can be sent to thrusters', largestSignal);
  console.assert(largestSignal === 51679);
};

main();
