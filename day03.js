const fs = require('fs');
const util = require('util');

const readFilePromise = util.promisify(fs.readFile);
const day = '03';

const reduceCoordinates = (previousCoordinates, currentInstruction) => {
  const { x, y, steps } = previousCoordinates[previousCoordinates.length - 1];

  const direction = currentInstruction.charAt(0);
  const distance = parseInt(currentInstruction.slice(1));

  const positive = direction === 'U' || direction === 'R';
  const yAxis = direction === 'U' || direction === 'D';

  for (let i = 1; i <= distance; i += 1) {
    if (yAxis) {
      previousCoordinates.push({
        x: x,
        // Parentheses are important here!
        // Without them, x is coerced to a boolean before adding i!
        y: y + (positive ? i : -i),
        steps: steps + i,
      });
    } else {
      previousCoordinates.push({
        // Parentheses are important here!
        // Without them, x is coerced to a boolean before adding i!
        x: x + (positive ? i : -i),
        y: y,
        steps: steps + i,
      });
    }
  }

  return previousCoordinates;
};

const getCoordinates = wire => {
  const origin = { x: 0, y: 0, steps: 0 };
  return wire.reduce(reduceCoordinates, [origin]);
}

const findIntersections = (wire1, wire2) => {
  const intersections = [];

  wire1.forEach(w1 => {
    // Exclude the origin
    if (w1.x === 0 && w1.y === 0) {
      return;
    }

    const intersect = wire2.find(w2 => {
      return w1.x === w2.x && w1.y === w2.y;
    });
    if (intersect) {
      intersections.push({
        ...w1,
        steps: w1.steps + intersect.steps,
      });
    }
  });

  return intersections;
};

const manhattanDistance = (x, y) => Math.abs(x) + Math.abs(y);

const reduceManhattanDistances = (shortestDistance, coordinates) => {
  const distanceFromOrigin = manhattanDistance(coordinates.x, coordinates.y);
  if (shortestDistance === 0 || distanceFromOrigin < shortestDistance) {
    return distanceFromOrigin;
  }
  return shortestDistance;
};

const part1 = (intersections) => {
  console.log('Part 1:');

  return intersections.reduce(reduceManhattanDistances, 0);
};

const part2 = (intersections) => {
  console.log('Part 2:');

  return intersections.reduce((steps, intersection) => {
    if (steps === 0 || intersection.steps < steps) {
      return intersection.steps;
    }
    return steps;
  }, 0);
};

const main = async () => {
  console.log(`## DAY ${day} ##`);

  const rawInput = await readFilePromise(`./day${day}_input.txt`, { encoding: 'utf-8' });
  const [ wire1, wire2 ] = rawInput.split('\n').map(path => path.split(','));

  const wire1Coordinates = getCoordinates(wire1);
  const wire2Coordinates = getCoordinates(wire2);
  const intersections = findIntersections(wire1Coordinates, wire2Coordinates);

  const shortestDistanceFromOrigin = part1(intersections);
  console.log('shortest manhattan distance from origin', shortestDistanceFromOrigin);

  const fewestSteps = part2(intersections);
  console.log('fewest steps', fewestSteps);
};

main();
