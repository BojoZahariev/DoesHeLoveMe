const name1 = document.querySelector('#name1');
const name2 = document.querySelector('#name2');
const submitBtn = document.querySelector('#submitBtn');

//RNG
class RNG {
  constructor(seed) {
    // LCG using GCC's constants
    this.m = 0x80000000; // 2**31;
    this.a = 1103515245;
    this.c = 12345;
    this.state = seed ? seed : Math.floor(Math.random() * (this.m - 1));
  }
  nextInt() {
    this.state = (this.a * this.state + this.c) % this.m;
    return this.state;
  }
  nextFloat() {
    // returns in range [0,1]
    return this.nextInt() / (this.m - 1);
  }
  nextRange(start, end) {
    // returns in range (start, end): including start, excluding end
    // can't modulu nextInt because of weak randomness in lower bits
    let rangeSize = end - start;
    let randomUnder1 = this.nextInt() / this.m;
    return start + Math.floor(randomUnder1 * rangeSize);
  }
  choice(array) {
    return array[this.nextRange(0, array.length)];
  }
}

//Seed
const generateNumbers = (amount, range) => {
  let currentDate = new Date();

  //get the number for the day from the date
  let todayNumber = currentDate.getDate() + currentDate.getMonth() + 1 + currentDate.getFullYear();

  //Numeric value of the name
  const letterToNumber = str => {
    str = str.toLowerCase();
    let sum = 0;
    for (let i = 0; i < str.length; i++) {
      sum += str.charCodeAt(i);
    }

    return sum;
  };

  //lucky numbers change every day
  let rngSeed = new RNG(letterToNumber(name1.value) + letterToNumber(name2.value) + todayNumber);

  //Numbers storage
  const myArray = [];

  let randomNumber = rngSeed.nextRange(1, range);

  //Only unique numbers
  let i = 0;
  while (i < amount) {
    myArray.push(randomNumber);
    randomNumber = rngSeed.nextRange(1, range);
    i++;
  }

  //displayNumbers(myArray, amount);
  console.log(myArray);
};

submitBtn.addEventListener('click', () => {
  if (name1.value !== '' && name2.value !== '') {
    generateNumbers(5, 6);
  } else {
    name1.classList.add('blink');
  }
});

/*
const validation = link => {
  //display link button only if there are numbers on display
  if (valid) {
    firstName.classList.remove('blink');
    input2.classList.remove('blink');
    setTimeout(function() {
      playNow.style.visibility = 'visible';
      playNowLink.href = link;
      playNowLink.textContent = 'Play';
    }, 1500);
    //highlight unfilled inputs
  } else {
    if (firstName.value === '') {
      firstName.classList.add('blink');
    } else {
      firstName.classList.remove('blink');
    }
    if (input2.value === '') {
      input2.classList.add('blink');
    } else {
      input2.classList.remove('blink');
    }
  }
};
*/
