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
};

main();
