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
      if (neverDecreases && adjacentDecrease(character, nextCharacter)) {
        neverDecreases = false;
      }
    }
  });

  return doubles && neverDecreases;
};

const adjacentDecrease = (a, b) => {
  return Number.parseInt(a, 10) > Number.parseInt(b, 10);
};

const satisfiesMoreStrictRequirements = password => {
  const stringPassword = password.toString();
  const passwordCharacters = stringPassword.split('');


  let hasAnyOnlyDoubles = false;
  let streak = '';
  passwordCharacters.forEach((character, index) => {
    if (index < (passwordCharacters.length - 1) && !hasAnyOnlyDoubles) {
      const nextCharacter = passwordCharacters[index + 1];
      if (character === nextCharacter) {
        if (streak === '') {
          // (Re)init streak.
          streak = `${character}${character}`;

          if (index === passwordCharacters.length - 2) {
            // Capture adjacent duplicates at the end of the password.
            hasAnyOnlyDoubles = true;
          }
        } else {
          streak += character;
        }
      } else {
        if (streak.length === 2) {
          hasAnyOnlyDoubles = true;
        }
        // Reset streak.
        streak = '';
      }
    }
  });

  return hasAnyOnlyDoubles;
};

const main = () => {
  console.log(`## DAY ${DAY} ## Part 1`);

  const [ rangeFloor, rangeCeiling ] = INPUT.split('-')
    .map(n => Number.parseInt(n, 10));

  const candidates = [];
  for (let i = rangeFloor; i <= rangeCeiling; i += 1) {
    if (satisfiesRequirements(i)) {
      candidates.push(i);
    }
  }
  console.log('candidates:', candidates.length);
  console.log('Part 2');

  const strictCandidates = candidates.filter(satisfiesMoreStrictRequirements);
  console.log('more strict candidates:', strictCandidates.length);
};

main();
