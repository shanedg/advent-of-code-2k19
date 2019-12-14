const fs = require('fs');
const util = require('util');

const DAY = '06';
const readFilePromise = util.promisify(fs.readFile);

const search = (name, orbitMap, depth = 0) => {
  const children = [];
  const orbitPattern = new RegExp(`^${name}\\)`, 'i');

  let index = orbitMap.findIndex(o => orbitPattern.test(o));
  if (index === -1) {
    return {
      name,
      children: null,
      depth,
    };
  }

  const nextNode = {
    name,
    children,
    depth,
  };

  while (index !== -1 && orbitMap.length > 0) {
    const orbit = orbitMap.splice(index, 1)[0];
    const directOrbit = orbit.split(')')[1];
    const orbittedBy = search(directOrbit, orbitMap, (depth + 1));
    if (orbittedBy) {
      orbittedBy.parent = nextNode;
      children.push(orbittedBy);
    }
    index = orbitMap.findIndex(o => orbitPattern.test(o));
  }

  return nextNode;
};

const countOrbits = (node) => {
  if (node.children === null || node.children.length === 0) {
  return node.depth;
  }

  let total = node.depth;
  node.children.forEach(child => {
    total += countOrbits(child);
  });

  return total;
};

const findNode = (tree, name) => {
  if (tree.name === name) {
    return tree;
  }

  if (tree.children === null) {
    return null;
  }

  return tree.children.reduce((accum, current) => {
    if (accum === null) {
      const foundNode = findNode(current, name);
      if (foundNode) {
        return foundNode;
      }
      return null;
    }
    return accum;
  }, null);
}

const main = async () => {
  console.log(`## Day ${DAY} ## Part 1`);

  const input = await readFilePromise(
    `./day${DAY}_input.txt`,
    { encoding: 'utf-8' }
  );
  const orbits = input.split('\n').filter(orbitalRelationship => orbitalRelationship !== '');

  const tree = search('COM', orbits);
  const totalOrbits = countOrbits(tree);
  console.log(`total number of direct and indrect orbits ${totalOrbits}`);
  console.assert(totalOrbits === 322508);

  console.log('Part 2');
  const santa = findNode(tree, 'SAN');
  const you = findNode(tree, 'YOU');
  console.log(`santa at ${santa.name}, depth ${santa.depth}, orbitting ${santa.parent.name}`);
  console.log(`you at ${you.name}, depth ${you.depth}, orbitting ${you.parent.name}`);

  // TODO: find nearest common ancestor of SANTA and YOU
};

main();
