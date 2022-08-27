import ancientsData from "../data/ancients";
import difficulties from "../data/difficulties";
import "../css/style.css";
ancientsData.forEach((x) => faceCardLink(x));
function faceCardLink(ancient) {
  const card = document.getElementById(ancient.id);
  card.src = ancient.cardFace;
}
const shuffleBtn = document.getElementById("shuffleBtn");
shuffleBtn.addEventListener("click", shuffleCards());
function getCheckedRadioButton(selector) {
  const radioButtons = document.querySelectorAll(selector);
  for (const radioButton of radioButtons) {
    if (radioButton.checked) {
      return radioButton.value;
    }
  }
}
function shuffleCards() {
  const ancient = getCheckedRadioButton('input[name="ancients-radio"]');
  const complexity = getCheckedRadioButton('input[name="complexity-radio"]');
  alert(ancient, complexity);
}

console.log(ancientsData);
console.log(difficulties);
