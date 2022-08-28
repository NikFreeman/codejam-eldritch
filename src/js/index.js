import ancientsData from "../data/ancients";
import difficulties from "../data/difficulties";
import { brownCards, blueCards, greenCards } from "../data/mythicCards/index";
import "../css/style.css";
import levels from "./level";

import cardBackground from "../assets/cardBackground";
const playDesk = [];
let tracker = [];
let trackerStage = [];
const cards = ["greenCards", "blueCards", "brownCards"];
const stages = ["firstStage", "secondStage", "thirdStage"];
const mythicCardsBackground = document.querySelector(".img-background");
const mythicCardsPlay = document.querySelector(".img-front");

mythicCardsBackground.src = cardBackground;
mythicCardsPlay.src = cardBackground;
hideCard(mythicCardsBackground);
hideCard(mythicCardsPlay);
// карты древних вытягиваем картинки
ancientsData.forEach((x) => {
  const card = document.getElementById(x.id);
  card.src = x.cardFace;
});

const shuffleBtn = document.getElementById("shuffle-btn");
shuffleBtn.addEventListener("click", shuffleCards);

function hideCard(elem) {
  elem.classList.add("hide");
}
function unHideCard(elem) {
  if (elem.classList.contains("hide")) {
    elem.classList.remove("hide");
  }
}
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
  const ancientCards = ancientsData.find((x) => x.id === ancient);
  return (
    ancientCards.firstStage[card] +
    ancientCards.secondStage[card] +
    ancientCards.thirdStage[card]
  );
}
// вытягиваем набор карт для древнего
function getSetCards(ancient, card) {
  const ancientCards = ancientsData.find((x) => x.id === ancient);
  return [
    ancientCards.firstStage[card],
    ancientCards.secondStage[card],
    ancientCards.thirdStage[card],
  ];
}

function shuffleCards() {
  const ancient = getCheckedRadioButton('input[name="ancients-radio"]');
  const difficulty = getCheckedRadioButton('input[name="difficulty-radio"]');
  playDesk.length = 0;
  const greenCardsSelected = collectCards(
    greenCards,
    difficulty,
    getMaxSetCard(ancient, cards[0])
  );
  const greenCardsShuffled = shuffleDesk(
    greenCardsSelected,
    greenCardsSelected.length
  );
  const blueCardsSelected = collectCards(
    blueCards,
    difficulty,
    getMaxSetCard(ancient, cards[1])
  );
  const blueCardsShuffled = shuffleDesk(
    blueCardsSelected,
    blueCardsSelected.length
  );
  const brownCardsSelected = collectCards(
    brownCards,
    difficulty,
    getMaxSetCard(ancient, cards[2])
  );
  const brownCardsShuffled = shuffleDesk(
    brownCardsSelected,
    brownCardsSelected.length
  );
  const deskFirstStage = [];
  const deskSecondStage = [];
  const deskThirdStage = [];

  getCardStage(
    deskFirstStage,
    greenCardsShuffled,
    getSetCards(ancient, cards[0])[0]
  );
  getCardStage(
    deskSecondStage,
    greenCardsShuffled,
    getSetCards(ancient, cards[0])[1]
  );
  getCardStage(
    deskThirdStage,
    greenCardsShuffled,
    getSetCards(ancient, cards[0])[2]
  );
  getCardStage(
    deskFirstStage,
    blueCardsShuffled,
    getSetCards(ancient, cards[1])[0]
  );
  getCardStage(
    deskSecondStage,
    blueCardsShuffled,
    getSetCards(ancient, cards[1])[1]
  );
  getCardStage(
    deskThirdStage,
    blueCardsShuffled,
    getSetCards(ancient, cards[1])[2]
  );
  getCardStage(
    deskFirstStage,
    brownCardsShuffled,
    getSetCards(ancient, cards[2])[0]
  );
  getCardStage(
    deskSecondStage,
    brownCardsShuffled,
    getSetCards(ancient, cards[2])[1]
  );
  getCardStage(
    deskThirdStage,
    brownCardsShuffled,
    getSetCards(ancient, cards[2])[2]
  );

  shuffleDesk(deskThirdStage, deskThirdStage.length).forEach((x) =>
    playDesk.push(x)
  );
  shuffleDesk(deskSecondStage, deskSecondStage.length).forEach((x) =>
    playDesk.push(x)
  );
  shuffleDesk(deskFirstStage, deskFirstStage.length).forEach((x) =>
    playDesk.push(x)
  );
  const levelString = levels.find((x) => x.id === difficulty).name;
  document.querySelector(
    ".shuffle-settings"
  ).textContent = `Колода мифов: древний: ${ancient}    уровень сложности: ${levelString}`;
  unHideCard(mythicCardsBackground);
  hideCard(mythicCardsPlay);
  for (let stage of stages) {
    if (document.querySelector("." + stage).classList.contains("completed")) {
      document.querySelector("." + stage).classList.remove("completed");
    }
  }

  mythicCardsBackground.addEventListener("click", nextCard);
  trackerStage.length = 0;
  trackerStage = [
    deskFirstStage.length,
    deskSecondStage.length,
    deskThirdStage.length,
  ];
  getTrackerCard(ancient);

  drawTracker();
}
function drawTracker() {
  for (let i = 0; i < 3; i++) {
    let stage = i === 0 ? "firstStage" : i === 1 ? "secondStage" : "thirdStage";
    document.querySelector(`#${stage}-green`).textContent =
      tracker[i].greenCards;
    document.querySelector(`#${stage}-blue`).textContent = tracker[i].blueCards;
    document.querySelector(`#${stage}-brown`).textContent =
      tracker[i].brownCards;
  }
}
function getTrackerCard(ancient) {
  const ancientCards = ancientsData.find((x) => x.id === ancient);
  tracker.length = 0;
  tracker.push(Object.assign({}, ancientCards.firstStage));
  tracker.push(Object.assign({}, ancientCards.secondStage));
  tracker.push(Object.assign({}, ancientCards.thirdStage));
}

function nextCard() {
  unHideCard(mythicCardsPlay);
  let card = playDesk.pop();
  let stage = trackerStage[0] > 0 ? 0 : trackerStage[1] > 0 ? 1 : 2;

  trackerStage[stage]--;
  if (trackerStage[stage] === 0) {
    let stageString =
      stage === 0
        ? ".firstStage"
        : stage === 1
        ? ".secondStage"
        : ".thirdStage";
    document.querySelector(stageString).classList.add("completed");
  }
  let cardColor = card["color"] + "Cards";

  tracker[stage][cardColor]--;
  drawTracker();
  mythicCardsPlay.src = card.cardFace;
  if (playDesk.length === 0) hideCard(mythicCardsBackground);
}
//набор случайных карт из миниколоды в игровой набор
function getCardStage(deskStage, cardsShuffled, count) {
  for (let i = 0; i < count; i++) {
    let randomCard = random(0, cardsShuffled.length);
    deskStage.push(cardsShuffled[randomCard]);
    cardsShuffled.splice(randomCard, 1);
  }
}
// набор коллекции карт в зависимости от сложности
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
// выбираем карты из колод согласно сложности (very-easy and very-hard)
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
// выбираем карты из колод согласно сложности (easy and hard)
function selectDesk(desk, difficulty) {
  const deskSelected = desk.filter((x) => x.difficulty !== difficulty);
  return deskSelected;
}
// тусуем колоду ()
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
