'use strict'

// Global variables

let game = {
    difficulty: 1,
    computerRandomNum : 0,
    maxScore : 3,
    playerScore : 0,
    computerScore : 0,
    tieScore : 0,
    stars : '☆',
    fullStars : '★',
}
let {difficulty, computerRandomNum, maxScore, playerScore, computerScore, tieScore, stars, fullStars} = game;

// Random number Generator for Computer logic

function randomRps(playerResult, winChance, tieChance) {
    let random = Math.floor(Math.random() * 100 + 1);
    if(random <= winChance) {
        playerResult == 0 ? computerRandomNum = 2
        : playerResult == 1 ? computerRandomNum = 0
        : playerResult == 2 && (computerRandomNum = 1);
    } else if(random > winChance && random < (winChance + tieChance)) {
        playerResult = computerRandomNum;
    } else {
        playerResult == 0 ? computerRandomNum = 1
        : playerResult == 1 ? computerRandomNum = 2
        : playerResult == 2 && (computerRandomNum = 0);
    }
    return !playerResult ? Math.floor(Math.random() * 3) : computerRandomNum;
}

// DOM shortcuts
let statusMsg = document.querySelector(`.status-message`);
let statusTie = document.querySelector(`.status-tie`);

let highlightPressedButton = (addCl, removeCl, removeCl2) => {
document.querySelector(`${addCl}`).classList.add(`btn-pressed`);
document.querySelector(`${removeCl}`).classList.remove(`btn-pressed`);
document.querySelector(`${removeCl2}`).classList.remove(`btn-pressed`);
}

let starColor = (playerOrComputer, color) => {
    document.querySelector(`.score-${playerOrComputer}`).style.color = `${color}`
}

let starsScore = () => {
    document.querySelector(`.score-player`).textContent = `${fullStars.repeat(playerScore)}${stars.repeat(maxScore - playerScore)}`;
    document.querySelector(`.score-computer`).textContent = `${fullStars.repeat(computerScore)}${stars.repeat(maxScore - computerScore)}`;
}

let numbersScore = (additions = ``, additions2 = ``) => {
    document.querySelector(`.score-player`).textContent = `${playerScore}${additions}`;
    document.querySelector(`.score-computer`).textContent = `${computerScore}${additions2}`;
}

let scoreReset = () => {
    playerScore = 0;
    computerScore = 0;
    tieScore = 0;
    statusTie.innerHTML = ``;
    statusMsg.innerHTML = '';
    starColor(`computer`, ` gold`);
    starColor(`player`, ` gold`);
    document.querySelector('.btn-rps-divblock').classList.remove('btn-rps-gameover');
    maxScore <= 5 ? starsScore() :  numbersScore();
    document.querySelector(`.btn-restart-rotating`).classList.remove(`btn-restart`);
    document.querySelector(`.btn-rps-divblock`).classList.add(`btn-rps-divblock-visibility`);
    document.querySelectorAll(`.chosen-rps`).forEach(rpsImage => rpsImage.style.opacity = `0`);
}
scoreReset()

// Core Game Logic

document.querySelectorAll('.btn-rps').forEach(btn => btn.addEventListener('click', function() {
    statusMsg.innerHTML = '';
    document.querySelectorAll(`.chosen-rps`).forEach(rpsImage => rpsImage.style.opacity = `1`);
    document.querySelector(`.btn-rps-divblock`).classList.remove(`btn-rps-divblock-visibility`);
    document.querySelector('.chosen-rps-player').src = `${btn.src}`;
    let rpsNum = btn.src.slice(-5, -4);

    if(difficulty == 0) {
        computerRandomNum = randomRps(rpsNum, 60, 20);
        } else if (difficulty == 2) {
        computerRandomNum = randomRps(rpsNum, 20, 25);
        } else {
        computerRandomNum = randomRps();
    }
    
    document.querySelector('.chosen-rps-computer').src = `img/img${computerRandomNum}.png`;


    if (rpsNum == computerRandomNum) {
        statusMsg.innerHTML = `TIE!`;
        statusMsg.style.color = `rgb(50, 50, 50)`;
        maxScore > 5 && tieScore++ && (statusTie.innerHTML = `TIE: ${tieScore})`)
    } else if ((rpsNum == 0 && computerRandomNum == 2) || (rpsNum == 1 && computerRandomNum == 0) || (rpsNum == 2 && computerRandomNum == 1)) {
        document.querySelector(`.chosen-rps-player`).style.boxShadow = `0rem 0rem 1rem 2rem rgba(50, 247, 0, 1)`;
        setTimeout(() => {
            document.querySelector(`.chosen-rps-player`).style.boxShadow = `0rem 0rem 1rem 2rem rgba(50, 247, 0, 0)`;
          }, 400)

        playerScore++;
    } else {
        document.querySelector(`.chosen-rps-computer`).style.boxShadow = `0rem 0rem 1rem 2rem rgba(50, 247, 0, 1)`;
        setTimeout(() => {
            document.querySelector(`.chosen-rps-computer`).style.boxShadow = `0rem 0rem 1rem 2rem rgba(50, 247, 0, 0)`;
          }, 400)

        computerScore++;
    }
    maxScore <= 5 ? starsScore() : numbersScore();

    // End of the Game
    if (playerScore >= maxScore || computerScore >= maxScore) {
        playerScore >= maxScore ? (statusMsg.textContent = `You WIN!`)
        :computerScore >= maxScore && (statusMsg.textContent = `Computer WIN!`);
        document.querySelector(`.btn-restart-rotating`).classList.add(`btn-restart`);
        document.querySelector('.btn-rps-divblock').classList.add('btn-rps-gameover');
    }

    // Winrate count (Infinite Score mode)
    if(maxScore > 5) {
    let winrate = (targetNum) => Math.floor((targetNum / (tieScore + playerScore + computerScore)) * 100) 
    statusTie.innerHTML = `TIE: ${tieScore} (${winrate(tieScore)}%)`
    numbersScore(`(${winrate(playerScore)}%)`, `(${winrate(computerScore)}%)`);

    if(winrate(playerScore) >= winrate(computerScore)) {
        starColor(`player`, ` rgb(50, 247, 0)`);
        starColor(`computer`, `gold`);

    } else {
        starColor(`computer`, ` rgb(50, 247, 0)`);
        starColor(`player`, `gold`);
    }
    }
    
}))

    // Restart
document.querySelector('.btn-restart-rotating').addEventListener('click', () => {
    scoreReset();
    })

    // Up to 3★
    document.querySelector('.btn-upto3').addEventListener('click', () => {
        maxScore = 3;
        scoreReset();
        highlightPressedButton('.btn-upto3', '.btn-upto5', '.btn-infinity-score');
        })

    // Up to 5★
    document.querySelector('.btn-upto5').addEventListener('click', () => {
        maxScore = 5;
        scoreReset();
        highlightPressedButton('.btn-upto5', '.btn-upto3', '.btn-infinity-score');
        })

    // Infinite score
    document.querySelector('.btn-infinity-score').addEventListener('click', () => {
        maxScore = 2500;
        scoreReset()
        highlightPressedButton('.btn-infinity-score', '.btn-upto3', '.btn-upto5');
        })


        //--------------------- Difficulty Buttons ---------------------
        // Easy
    document.querySelector('.btn-easy').addEventListener(`click`, () =>  {
        scoreReset();
        difficulty = 0;
        highlightPressedButton('.btn-easy', '.btn-medium', '.btn-hard');
    })

        // Medium
    document.querySelector('.btn-medium').addEventListener(`click`, () =>  {
        scoreReset();
        difficulty = 1;
        highlightPressedButton('.btn-medium', '.btn-easy', '.btn-hard');
        })

        // Hard
    document.querySelector('.btn-hard').addEventListener(`click`, () =>  {
        scoreReset();
        difficulty = 2;
        highlightPressedButton('.btn-hard', '.btn-easy', '.btn-medium');
        });
