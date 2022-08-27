import ancientsData from "../data/ancients";
import difficulties from "../data/difficulties";
import { brownCards, blueCards, greenCards } from "../data/mythicCards/index";
import "../css/style.css";

// карты древних вытягиваем картинки
ancientsData.forEach((x) => {
  const card = document.getElementById(x.id);
  card.src = x.cardFace;
});

const shuffleBtn = document.getElementById("shuffle-btn");
shuffleBtn.addEventListener("click", shuffleCards);

// проверяем радиокнопки
function getCheckedRadioButton(selector) {
  const radioButtons = document.querySelectorAll(selector);
  for (const radioButton of radioButtons) {
    if (radioButton.checked) {
      return radioButton.value;
    }
  }
}
// максимальное количество карт в раскладке древнего
function getMaxSetCard(ancient, card) {
  const ancientCards = ancientsData.filter((x) => x.id === ancient);
  return (
    ancientCards[0].firstStage[card] +
    ancientCards[0].secondStage[card] +
    ancientCards[0].thirdStage[card]
  );
}
// вытягиваем набор карт для древнего
function getSetCards(ancient, card) {
  const ancientCards = ancientsData.filter((x) => x.id === ancient);
  return [
    ancientCards[0].firstStage[card],
    ancientCards[0].secondStage[card],
    ancientCards[0].thirdStage[card],
  ];
}

function shuffleCards() {
  const ancient = getCheckedRadioButton('input[name="ancients-radio"]');
  const difficulty = getCheckedRadioButton('input[name="difficulty-radio"]');
  const greenCardsSelected = collectCards(
    greenCards,
    difficulty,
    getMaxSetCard(ancient, "greenCards")
  );
  const greenCardsShuffled = shuffleDesk(
    greenCardsSelected,
    greenCardsSelected.length
  );
  const blueCardsSelected = collectCards(
    blueCards,
    difficulty,
    getMaxSetCard(ancient, "blueCards")
  );
  const blueCardsShuffled = shuffleCards(
    blueCardsSelected,
    blueCardsSelected.length
  );
  const brownCardsSelected = collectCards(
    brownCards,
    difficulty,
    getMaxSetCard(ancient, "brownCards")
  );
  const brownCardsShuffled = shuffleCards(
    brownCardsSelected,
    brownCardsSelected.length
  );
  console.log(setCardsAncient);
}

function collectCards(desk, difficulty, maxSetCards) {
  if (difficulty === "very-easy") {
    return selectVeryDesk(desk, difficulties[0].id, maxSetCards);
  }
  if (difficulty === "easy") {
    return selectDesk(desk, difficulties[2].id);
  }
  if (difficulty === "normal") {
    return desk.slice();
  }
  if (difficulty === "hard") {
    return selectDesk(desk, difficulties[0].id);
  }
  if (difficulty === "very-hard") {
    return selectVeryDesk(desk, difficulties[2].id, maxSetCards);
  }
}
function selectVeryDesk(desk, difficulty, maxSetCards) {
  const deskSelected = desk.filter((x) => x.difficulty === difficulty);
  if (deskSelected.length < maxSetCards) {
    shuffleDesk(
      desk.filter((x) => x.difficulty === difficulties[1].id),
      maxSetCards - deskSelected.length
    ).forEach((x) => deskSelected.push(x));
  }
  return deskSelected;
}
function selectDesk(desk, difficulty) {
  const deskSelected = desk.filter((x) => x.difficulty !== difficulty);
  return deskSelected;
}
// замешиваем колоду ()
function shuffleDesk(desk, countCards) {
  let copyDesk = desk.slice();
  let resultDesk = [];
  while (copyDesk.length > 0) {
    let randomCard = random(0, copyDesk.length);
    resultDesk.push(copyDesk[randomCard]);
    copyDesk.splice(randomCard, 1);
  }
  return resultDesk.slice(0, countCards);
}
function random(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}
// console.log(ancientsData);
// console.log(difficulties);
// console.log(brownCards, blueCards, greenCards);
