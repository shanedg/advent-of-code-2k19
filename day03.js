const fs = require('fs');
const util = require('util');

const readFilePromise = util.promisify(fs.readFile);
const day = '03';

const part1 = () => {
  console.log('Part 1:');
};

const part2 = () => {
  console.log('Part 2:');
};

const main = async () => {
  console.log(`## DAY ${day} ##`);

  const rawInput = await readFilePromise(`./day${day}_input.txt`, { encoding: 'utf-8' });
  console.log(rawInput);
};

main();
