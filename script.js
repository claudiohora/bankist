'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
  type: 'premium',
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
  type: 'standard',
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
  type: 'premium',
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
  type: 'basic',
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const displayMovements = function (movements, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const html = `
    <div class="movements__row">
    <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
    <div class="movements__value">${mov}€</div>
    </div>
    `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${acc.balance}€`;
};

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes}€`;

  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(out)}€`;

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      // console.log(arr);
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `${interest}€`;
};

const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUsernames(accounts);

const updateUI = function (acc) {
  // Display movements
  displayMovements(acc.movements);

  // Display balance
  calcDisplayBalance(acc);

  // Display summary
  calcDisplaySummary(acc);
};

// Event handlers
let currentAccount;

btnLogin.addEventListener('click', function (e) {
  // Prevent from from submitting
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  console.log(currentAccount);

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // Display UI and message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 1;

    // Clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    // Update UI
    updateUI(currentAccount);
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = '';

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    // Doing the transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    // Update UI
    updateUI(currentAccount);
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Number(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    // Add movement
    currentAccount.movements.push(amount);

    // Update UI
    updateUI(currentAccount);
  }
  inputLoanAmount.value = '';
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    currentAccount.username === inputCloseUsername.value &&
    currentAccount.pin === Number(inputClosePin.value)
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );

    // Delete account
    accounts.splice(index, 1);

    // Hide UI
    containerApp.style.opacity = 0;
  }

  inputCloseUsername.value = inputClosePin.value = '';
});

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

//const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////

/*
let arr = ['a', 'b', 'c', 'd', 'e'];

// SLICE
console.log(arr.slice(2));
console.log(arr.slice(2, 4));
console.log(arr.slice(-2));
console.log(arr.slice(-1));
console.log(arr.slice(1, -2));

// SPLICE
arr.splice(-1);
console.log(arr);
arr.splice(1, 2);
console.log(arr);

// REVERSE
arr = ['a', 'b', 'c', 'd', 'e'];
const arr2 = ['j', 'i', 'h', 'g', 'f'];
console.log(arr2.reverse());
console.log(arr2);

// CONCAT
const letters = arr.concat(arr2);
console.log(letters);
console.log([...arr, ...arr2]);

// JOIN
console.log(letters.join(' - '));

const arr = [23, 11, 64];
console.log(arr[0]);
console.log(arr.ar(0));

// getting last array element
console.log(arr[arr.length - 1]);
console.log(arr.slice(-1)[0]);
console.log(arr.at(-1));

console.log('jonas'.at(0));
console.log('jonas'.at(-1));

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

for (const movement of movements) {
  if (movement > 0) {
    console.log(`You deposited ${movement}`);
    } else {
      console.log(`You withdrew ${Math.abs(movement)}`);
  }
  }
  
  console.log('---- FOREACH ----');
  // first parameter is element, second is index and third is the array
  movements.forEach(function (mov, i, arr) {
    if (mo > 0) {
      console.log(`You deposited ${mo}`);
      } else {
        console.log(`You withdrew ${Math.abs(mo)}`);
    }
    });
    
    const currencies = new Map([
      ['USD', 'United States dollar'],
      ['EUR', 'Euro'],
      ['GBP', 'Pound sterling'],
      ]);
      
      // Map
      currencies.forEach(function (value, key, map) {
        console.log(`${key}: ${value}`);
        });
        
        // Set
        const currenciesUnique = new Set(['USD', 'GBP', 'USD', 'EUR', 'EUR']);
        console.log(currenciesUnique);
        currenciesUnique.forEach(function (value, _, map) {
          console.log(`${value}: ${value}`);
          });
          
          
          // CHALLENGE 1
          function checkDogs(dogsJulia, dogsKate) {
            const dogsJulia2 = dogsJulia.slice(1).slice(0, 2);
            console.log(dogsJulia2);
            const dogsBoth = dogsJulia2.concat(dogsKate);
            console.log(dogsBoth);
            
            dogsBoth.forEach(function (dog, i) {
              dog >= 3
              ? console.log(`Dog number ${i} is an adult`)
              : console.log(`Dog number ${i} is still a puppy`);
              });
              }
              
              // test data 1
              let dogsJulia = [3, 5, 2, 12, 7];
              let dogsKate = [4, 1, 15, 8, 3];
              checkDogs(dogsJulia, dogsKate);
              
              dogsJulia = [9, 16, 6, 8, 3];
              dogsKate = [10, 5, 6, 1, 4];
              checkDogs(dogsJulia, dogsKate);
              
              
              const eurToUsd = 1.1;
              
              const movementsUsd = movements.map(mov => mov * eurToUsd);
              console.log(movements);
              console.log(movementsUsd);
              
              const movementsUSDfor = [];
              for (const mov of movements) movementsUSDfor.push(mov * eurToUsd);
              console.log(movementsUSDfor);
              
                  
              const user = 'Steven Thomas Williams'; // stw
              
              const deposits = movements.filter(function (mov) {
                return mov > 0;
              });
              console.log(movements);
              console.log(deposits);
              
              const depositsFor = [];
              for (const mov of movements) if (mov > 0) depositsFor.push(mov);
              console.log(depositsFor);
              
              const withdrawals = movements.filter(mov => mov < 0);
              
              console.log(withdrawals);
              
              // accumulator -> SNOWBALL
              const balance = movements.reduce((acc, cur) => acc + cur, 0);
              console.log(balance);
              
              // Maximum value
              const max = movements.reduce((acc, mov) => {
                if (acc > mov) return acc;
                else return mov;
              }, movements[0]);
              console.log(max);
              
              // CHALLENGE 2
              const testData1 = [5, 2, 4, 1, 15, 8, 3];
              const testData2 = [16, 6, 10, 5, 6, 1, 4];
              
              // isto está errado
              const averageHumanAgeDogs = arr => {
                return (
                  arr
                  .map(age => {
                    if (age <= 2) return 2 * age;
                    else return 16 + age * 4;
                  })
                  .filter(age => age >= 18)
                  .reduce((acc, age) => acc + age, 0) / arr.length
                );
              };
              
              console.log(averageHumanAgeDogs(testData1));
              
              
              // CHALLENGE 3
              const testData1 = [5, 2, 4, 1, 15, 8, 3];
              const testData2 = [16, 6, 10, 5, 6, 1, 4];
              
              // isto está errado
              const averageHumanAgeDogs = arr => {
                arr
                .map(age => (age <= 2 ? 2 * age : 16 + age * 4))
                .filter(age => age >= 18)
                .reduce((acc, age, i, arr) => acc + age / arr.length, 0);
              };
              
              console.log(averageHumanAgeDogs(testData1));
              
              
              const firstWithdrawal = movements.find(mov => mov < 0);
              
              console.log(movements);
              console.log(firstWithdrawal);
              
              console.log(accounts);
              
              const account = accounts.find(acc => acc.owner === 'Jessica Davis');
              console.log(account);
              
              
              console.log(movements);
              const lastWithdrawal = movements.findLast(mov => mov < 0);
              
              // "Your latest large movement was X movements ago"
              
              const latestLargeMovementIndex = movements.findLastIndex(
                mov => Math.abs(mov) > 1000
              );
              console.log(latestLargeMovementIndex);
              console.log(
                `Your latest large movement was ${
                  movements.length - latestLargeMovementIndex
                } movements ago`
              );
              
              const groupedAccounts = Object.groupBy(accounts, account => account.type);
              
              */
