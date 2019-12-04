const fs = require('fs');
const util = require('util');

const readFilePromise = util.promisify(fs.readFile);

const part1 = masses => {
  console.log('Part 1:');
  const fuelReqs = masses.reduce((counter, current) => {
    if (current === '') {
      return counter;
    }
    return counter + getFuelForMass(current);
  }, 0);
  return fuelReqs;
};

const part2 = masses => {
  console.log('Part 2:');
  let fuelForTheFuel = 0;
  masses.forEach(value => {
    if (value !== '') {
      const mass = parseInt(value);
      fuelForTheFuel += getRecursiveFuel(mass);
    }
  });
  return fuelForTheFuel;
}

const getFuelForMass = mass => {
  return Math.floor((parseInt(mass) / 3)) - 2;
}

const getRecursiveFuel = mass => {
  const fuel = getFuelForMass(mass);
  if (fuel <= 0) {
    return 0;
  }
  return fuel + getRecursiveFuel(fuel);
}

const main = async () => {
  console.log('## DAY 1 ##');

  const rawInput = await readFilePromise('./day_1_input.txt', { encoding: 'utf-8' });
  const masses = rawInput.split('\n');
  const regularFuel = part1(masses);
  console.log(regularFuel);

  const fuelForTheFuel = part2(masses);
  console.log(fuelForTheFuel);
};

main();
