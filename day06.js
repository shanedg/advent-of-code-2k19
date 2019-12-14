const fs = require('fs');
const util = require('util');

const DAY = '06';
const readFilePromise = util.promisify(fs.readFile);

const search = (name, orbitMapData) => {
  // TODO: this is all backwards:
  // every orbital relationship has only 1 _PARENT_
  // but may have more 0 or more _CHILDREN_

  // const orbitPattern = new RegExp(`^${name}\\)`, 'i');
  // const orbitIndex = orbitMapData.findIndex(orbit => orbitPattern.test(orbit));

  // if (orbitIndex !== null && orbitMapData.length > 0) {
  //   const orbit = orbitMapData.splice(orbitIndex, 1);
  //   const directOrbit = orbit[0].split(')')[1];

  //   return {
  //     name,
  //     child: search(directOrbit, orbitMapData),
  //   };
  // }

  // return {
  //   name,
  //   child: null,
  // };
};

const main = async () => {
  console.log(`## Day ${DAY} ## Part 1`);

  const input = await readFilePromise(
    `./day${DAY}_input.txt`,
    { encoding: 'utf-8' }
  );
  const orbits = input.split('\n').filter(orbitalRelationship => orbitalRelationship !== '');

  const result = search('COM', orbits);
  // console.log(JSON.stringify(result, null, 2));
};

main();
