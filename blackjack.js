let cardOne = 7;
let cardTwo = 5;
let cardThree = 9;
let sum = cardOne + cardTwo + cardThree;

let cardOneBank = 7;
let cardTwoBank = 5;
let cardThreeBank = 6;
let cardFourBank = 4;
let bankSum = cardOneBank + cardTwoBank + cardThreeBank + cardFourBank;

function checkBlackjack(sum, bankSum) {
  if (sum > 21) {
    console.log('You lost');
    return;
  }

  if (sum === 21) {
    console.log('You win');
    return;
  }

  if (bankSum > 21) {
    console.log('You win');
    return;
  }

  if (sum === bankSum) {
    console.log('Draw');
  } else if (sum > bankSum) {
    console.log('You win');
  } else {
    console.log('Bank win');
  }
}

checkBlackjack(sum, bankSum);
