const fs = require('fs');
const util = require('util');

const readFilePromise = util.promisify(fs.readFile);
const day = '03';

const reduceCoordinates = (counter, current, index) => {
  const partialCoordinates = [...counter];

  const { x, y } = partialCoordinates[index];
  const nextDirection = current.charAt(0);
  const distance = parseInt(current.slice(1));

  let newX = x;
  let newY = y;
  if (nextDirection === 'U' || nextDirection === 'D') {
    newY = y + (nextDirection === 'U' ? distance : -distance);
  } else {
    newX = x + (nextDirection === 'R' ? distance : -distance);
  }

  const newCoordinates = {
    x: newX,
    y: newY,
  }
  partialCoordinates.push(newCoordinates);

  return partialCoordinates;
}

const getCoordinates = wire => {
  const origin = { x: 0, y: 0 };
  return wire.reduce(reduceCoordinates, [ origin ]);
}

const part1 = (wire1, wire2) => {
  console.log('Part 1:');

  const wire1Coordinates = getCoordinates(wire1);
  // const wire2Coordiantes = getCoordinates(wire2);

  console.log('wire1 coordinates', wire1Coordinates);
};

// const part2 = () => {
//   console.log('Part 2:');
// };

const main = async () => {
  console.log(`## DAY ${day} ##`);

  const rawInput = await readFilePromise(`./day${day}_input.txt`, { encoding: 'utf-8' });
  const [ wire1, wire2 ] = rawInput.split('\n').map(path => path.split(','));

  part1(wire1, wire2);
};

main();
