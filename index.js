let deckId = "";

let computerScore = 0;
let myScore = 0;

const cardsContainer = document.querySelector("#cards");
const newDeckBtn = document.querySelector("#new-deck");
const drawCardsBtn = document.querySelector("#draw-cards");
const header = document.querySelector("#header");
const remainingCards = document.querySelector("#remaining");
const computerScoreEl = document.querySelector("#computer-score");
const myScoreEl = document.querySelector("#my-score");

if (deckId === "") {
    drawCardsBtn.disabled = true;
}

const getNewDeck = () => {
    fetch("https://deckofcardsapi.com/api/deck/new/shuffle/")
        .then(res => res.json())
        .then(data => {
            deckId = data.deck_id;

            remainingCards.textContent = `Remaining cards: ${data.remaining}`;

            header.textContent = "Game of War";

            computerScore = 0;
            myScore = 0;
            computerScoreEl.textContent = `Computer score: ${computerScore}`;
            myScoreEl.textContent = `My score: ${myScore}`;

            cardsContainer.children[0].textContent = "";
            cardsContainer.children[1].textContent = "";

            drawCardsBtn.disabled = false;
        });
};

const getCardWinner = (card1, card2) => {
    const valuesArray = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "JACK", "QUEEN", "KING", "ACE"];

    const card1ValueIndex = valuesArray.indexOf(card1.value);
    const card2ValueIndex = valuesArray.indexOf(card2.value);

    if (card1ValueIndex > card2ValueIndex) {
        computerScore++;
        computerScoreEl.textContent = `Computer score: ${computerScore}`;
        return "Computer wins!";
    } else if (card1ValueIndex < card2ValueIndex) {
        myScore++;
        myScoreEl.textContent = `My score: ${myScore}`;
        return "You win!";
    } else {
        return "War!";
    }
};

const drawCards = () => {
    fetch(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=2`)
        .then(res => res.json())
        .then(data => {
            remainingCards.textContent = `Remaining cards: ${data.remaining}`;

            for (let i = 0; i < cardsContainer.children.length; i++) {
                cardsContainer.children[i].innerHTML = `
                    <img src="${data.cards[i].image}" alt="card" class="card">
                `;
            }

            header.textContent = (getCardWinner(data.cards[0], data.cards[1]));

            if (data.remaining === 0) {
                drawCardsBtn.disabled = true;

                if (computerScore > myScore) {
                    header.textContent = "The computer won the game!";
                } else if (myScore > computerScore) {
                    header.textContent = "You won the game!";
                } else {
                    header.textContent = "It's a tie game!";
                }
            }
        });
};

newDeckBtn.addEventListener("click", getNewDeck);

drawCardsBtn.addEventListener("click", drawCards);