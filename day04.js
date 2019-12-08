const DAY = '04';
const INPUT = '234208-765869';

const satisfiesRequirements = password => {
  const stringPassword = password.toString();
  const passwordCharacters = stringPassword.split('');

  let doubles = false;
  let neverDecreases = true;
  passwordCharacters.forEach((character, index) => {
    if (index < (passwordCharacters.length - 1)) {
      const nextCharacter = passwordCharacters[index + 1];

      if (!doubles && character === nextCharacter) {
        doubles = true;
      }

      if (neverDecreases && parseInt(character) > parseInt(nextCharacter)) {
        neverDecreases = false;
      }
    }
  });

  return doubles && neverDecreases;
};

const main = () => {
  console.log(`## DAY ${DAY} ## Part 1`);

  const [ rangeFloor, rangeCeiling ] = INPUT.split('-')
    .map(n => Number.parseInt(n, 10));
  let candidateCount = 0;
  for (let i = rangeFloor; i <= rangeCeiling; i += 1) {
    if (satisfiesRequirements(i)) {
      candidateCount += 1;
    }
  }

  console.log('candidates:', candidateCount);

  // testing
  // console.log(111111, 'expect true, got', satisfiesRequirements(111111));
  // console.log(223450, 'expect false, got', satisfiesRequirements(223450));
  // console.log(123789, 'expect false, got', satisfiesRequirements(123789));
};

main();
