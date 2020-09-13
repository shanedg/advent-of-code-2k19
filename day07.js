const fs = require('fs');
const util = require('util');

const { Duplex, Readable, Writable } = require('stream');

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

class IntCodeComputer {
  constructor(codes, phase, name) {
    this.name = name;
    this.instructions = [...codes];
    this.phase = phase;
    this.position = 0;
    this.hasReceivedPhase = false;
    this.isStopped = false;

    // this.input = function* generator(phase) {
    //   yield phase;
    // };
    this.input = this.inputGenerator();

    console.log(`init amp ${this.name} with phase ${phase}`);
  }

  async *inputGenerator() {
    yield this.phase;
  }

  /**
   * async generator approach is interesting but I have to wire
   * all my amplifiers backwards which feels counterintuitive
   *
   * implies that I have to start the feedback loop by starting
   * the last amplifier so that it can `await` the one before it
   * and so on
   */
  async compute() {
    console.log(`amp ${this.name} main loop start`);
    // Main loop
    while (this.instructions[this.position] !== 99) {
      const instruction = this.instructions[this.position];
      const opCode = instruction % 100;

      const modes = getParameterModes(instruction);
      const {
        mode1,
        mode2,
        param1,
        param2,
        param3,
      } = getParams(modes, this.instructions, this.position);

      let instructionLength;

      switch(opCode) {
        case 1:
          this.instructions[param3] = (mode1 ? param1 : this.instructions[param1]) + (mode2 ? param2 : this.instructions[param2]);
          instructionLength = 4;
          break;
        case 2:
          this.instructions[param3] = (mode1 ? param1 : this.instructions[param1]) * (mode2 ? param2 : this.instructions[param2]);
          instructionLength = 4;
          break;
        case 3:
          // this.instructions[param1] = !this.hasReceivedPhase
          //   ? this.phase
          //   // TODO: this is not implemented
          //   // : await asyncInput.next();
          //   // : 99;
          //   : (await this.previousAmplifier.compute().next()).value;
          // if (!this.hasReceivedPhase) {
          //   this.hasReceivedPhase = true;
          // }
          const nextOne = this.input.next().value;
          this.instructions[param1] = nextOne;
          console.log(`trying to accept input ${nextOne}`);
          instructionLength = 2;
          break;
        case 4:
          const outputCode = mode1 ? param1 : this.instructions[param1];
          console.log(`trying to write output ${outputCode}`);
          // TODO: this is not implemented
          // outputs.push(outputCode);
          // yield outputCode;
          await this.output.next(outputCode);
          instructionLength = 2;
          break;
        case 5:
          const test = mode1 ? param1 : this.instructions[param1];
          if (test !== 0) {
            const newPointer = mode2 ? param2 : this.instructions[param2];
            this.position = newPointer;
            instructionLength = 0;
          } else {
            instructionLength = 3;
          }
          break;
        case 6:
          const testIfZero = mode1 ? param1 : this.instructions[param1];
          if (testIfZero === 0) {
            const newPointer = mode2 ? param2 : this.instructions[param2];
            this.position = newPointer;
            instructionLength = 0;
          } else {
            instructionLength = 3;
          }
          break;
        case 7:
          const testIfLessThan = mode1 ? param1 : this.instructions[param1];
          const testIfGreaterThan = mode2 ? param2 : this.instructions[param2];
          this.instructions[param3] = (testIfLessThan < testIfGreaterThan) ? 1 : 0;
          instructionLength = 4;
          break;
        case 8:
          const testIfEqual1 = mode1 ? param1 : this.instructions[param1];
          const testIfEqual2 = mode2 ? param2 : this.instructions[param2];
          this.instructions[param3] = (testIfEqual1 === testIfEqual2) ? 1 : 0;
          instructionLength = 4;
          break;
        default:
          throw new Error(`Bad opcode ${opCode}`);
      }

      this.position += instructionLength;
    }

    console.log(`stopping on ${this.instructions[this.position]} at ${this.position}`);
    this.isStopped = true;
  }
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

  console.log('Part 2');

  const amp1 = new IntCodeComputer(codes, 5, 'A');
  const amp2 = new IntCodeComputer(codes, 6, 'B');
  // amp2.previousAmplifier = amp1;
  // const amp2Result = (await amp2.compute().next()).value;
  amp1.output = amp2.input;
  const amp1Result = await amp1.compute();
  amp2.output = amp1.input;
  // amp1.input = amp2.output;

  // const amp2Result = await amp2.compute();
  console.log(amp1Result);
  // const testing = (await amp1.compute().next()).value;
  // console.log(`testing ${JSON.stringify(testing)}`);

  // const feedbackPhases = [5, 6, 7, 8, 9];
  // const feedbackPermutations = permute(feedbackPhases);

  // const amplifierNames = ['A', 'B', 'C', 'D', 'E'];
  // feedbackPermutations.forEach(phasePermutation => {
  //   const amplifiers = phasePermutation.map((amplifierPhase, index) => {
  //     return new IntCodeComputer(codes, amplifierPhase, amplifierNames[index]);
  //   });

  //   // hook up amplifiers
  //   amplifiers.forEach((amplifier, index, amplifiers) => {
  //     if (index < (amplifiers.length - 1)) {
  //       amplifier.outputTo = amplifiers[index + 1];
  //     } else {
  //       // where should logic around halting & sending signal to thrusters be?
  //       amplifier.outputTo = amplifiers[0];
  //     }
  //   });
  // });
};

main();
