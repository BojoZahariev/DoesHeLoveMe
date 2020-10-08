const formContainer = document.querySelector('#formContainer');
const name1 = document.querySelector('#name1');
const name2 = document.querySelector('#name2');
const clearInput = document.querySelector('#clearInput');
const results = document.querySelector('#results');
const daisy = document.querySelector('#daisy');

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

  //lucky numbers change every day
  let rngSeed = new RNG(letterToNumber(name1.value) + letterToNumber(name2.value) + todayNumber);

  //Numbers storage
  const myArray = [];

  let randomNumber = rngSeed.nextRange(1, range);

  //Only unique numbers
  let i = 0;
  while (i < amount) {
    myArray.push(randomNumber);
    //if the first one is <= 3 the rest are in that range as well
    if (randomNumber <= 3) {
      randomNumber = rngSeed.nextRange(1, 4);
      //if the first one is > 3 the rest are in that range as well
    } else if (randomNumber > 3) {
      randomNumber = rngSeed.nextRange(4, range);
    }
    i++;
  }

  displayResults(myArray);
};

//display the results
const displayResults = arr => {
  let resParts = document.querySelectorAll('.resultsPart');

  let i = 0;

  const myLoop = () => {
    setTimeout(() => {
      resParts[i].style.display = 'flex';
      i++;
      if (i < resParts.length) {
        myLoop();
      } else {
        addHearts(arr, resParts);
      }
    }, 200);
  };

  myLoop();
};

//display the hearts
const addHearts = (arr, parent) => {
  console.log(arr);

  let i = 0;
  parent.forEach(element => {
    let b = 0;
    const myLoop = () => {
      setTimeout(() => {
        let heart = document.createElement('img');
        heart.classList.add('hearts');
        heart.alt = 'heart';
        heart.src = 'images/emptyHeart.png';
        heart.classList.add('emptyHearts');
        element.appendChild(heart);

        b++;

        if (b < 6) {
          myLoop();

          //change to full hearts according to the score
        } else {
          setTimeout(() => {
            fillHearts(element, arr, i);
            i++;
          }, 500);
        }
      }, 300);
    };

    myLoop();
  });
};

//change to full hearts according to the score
const fillHearts = (parent, arr, ind) => {
  let hearts = parent.querySelectorAll('.hearts');

  let k = 0;
  while (k < arr[ind]) {
    hearts[k].src = 'images/redHeart.png';
    hearts[k].classList.toggle('emptyHearts');
    k++;
  }
};

//Numeric value of the name
const letterToNumber = str => {
  str = str.toLowerCase();
  let sum = 0;
  for (let i = 0; i < str.length; i++) {
    sum += str.charCodeAt(i);
  }

  return sum;
};

formContainer.addEventListener('submit', e => {
  e.preventDefault();
  clearResults();

  if (name1.value !== '' && name2.value !== '') {
    daisy.style.display = 'inline-block';
    setTimeout(() => {
      generateNumbers(5, 7);
      validation(true);
      daisy.style.display = 'none';
    }, 1500);
  } else {
    validation(false);
  }
});

//clear inputs and results
clearInput.addEventListener('click', () => {
  name1.value = '';
  name2.value = '';
  clearResults();
});

const clearResults = () => {
  //clear list
  document.querySelectorAll('.resultsPart').forEach(element => {
    element.style.display = 'none';
  });

  //clear hearts
  document.querySelectorAll('.hearts').forEach(element => {
    element.remove();
  });
};

const validation = valid => {
  if (valid) {
    name1.classList.remove('blink');
    name2.classList.remove('blink');

    //highlight unfilled inputs
  } else {
    if (name1.value === '') {
      name1.classList.add('blink');
    } else {
      name1.classList.remove('blink');
    }
    if (name2.value === '') {
      name2.classList.add('blink');
    } else {
      name2.classList.remove('blink');
    }
  }
};
