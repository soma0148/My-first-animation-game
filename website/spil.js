window.addEventListener("load", showTitle);

// Erklæring af variabler
let points;
let lives;

function showTitle() {
  console.log("showTitle");
  //Skjul alle skærme
  hideAll();
  //Vis aktuel skærm (Titel)
  document.querySelector("#start").classList.remove("hide");
  //lyt efter om der bliver klikket på Play knappen
  document.querySelector("#spil_btn_1").addEventListener("click", startGame);
  //lyt efter om der bliver klikket på Info knappen
  document.querySelector("#inst_btn").addEventListener("click", showInst);
}

function showInst() {
  console.log("showInst");
  //Skjul alle skærme
  hideAll();
  //Vis aktuel skærm (Titel)
  document.querySelector("#how_to_play").classList.remove("hide");
  //lyt efter om der bliver klikket på Play knappen
  document.querySelector("#spil_btn_2").addEventListener("click", startGame);
}

function startGame() {
  console.log("startGame");

  //Skjul alle skærme
  hideAll();

  //Nulstil Point og liv
  points = 0;
  lives = 3;

  //Udskriv point og liv på skærmen
  updatePoint();
  updateLives();
  //spil lyden
  document.querySelector("#back_snd").play();

  //Start timeranimationen
  document.querySelector("#time_sprite").classList.add("skrump");
  //lyt efter om timer-animationen er færdig (om tiden er gået)
  document.querySelector("#time_sprite").addEventListener("animationend", endGame);

  //Start fall animation på de to elementer
  document.querySelector("#good_container").classList.add("fall");
  document.querySelector("#bad_container").classList.add("fall");

  //find et tilfældigt tal mellem 1 og 7
  let rand = randomNumber(7);
  //giv elementet "good" den tilfældige position (pos1 - pos7)
  document.querySelector("#good_container").classList.add("pos" + rand);
  //find et nyt tilfældigt tal mellem 1 og 7
  rand = randomNumber(7);
  //giv elementet "bad# den tilfældige position (pos1 - pos7)
  document.querySelector("#bad_container").classList.add("pos" + rand);

  //giv de to elementer en random delay klasse (delay1 - delay4)
  //find et tilfældigt tal mellem 1 og 4
  rand = randomNumber(4);
  document.querySelector("#good_container").classList.add("delay" + rand);
  //find et tilfældigt tal mellem 1 og 4
  rand = randomNumber(4);
  document.querySelector("#bad_container").classList.add("delay" + rand);

  //lyt efter om der bliver klikket på good elementet
  document.querySelector("#good_container").addEventListener("mousedown", goodClick);
  //lyt efter om der bliver klikket på bad elementet
  document.querySelector("#bad_container").addEventListener("mousedown", badClick);

  //lyt efter om faldeanimationen på ""good" er færdig (om den har nået bunden)
  document.querySelector("#good_container").addEventListener("animationiteration", goodReset);
  //lyt efter om faldeanimationen på "bad" er færdig (om den har nået bunden)
  document.querySelector("#bad_container").addEventListener("animationiteration", badReset);
}

function goodClick() {
  console.log("goodClick");

  //fjern eventlistneren for mousedown så man ikke kan klikke flere gange
  document.querySelector("#good_container").removeEventListener("mousedown", goodClick);

  //giv et point
  addPoint();
  //Udskriv point på siden
  updatePoint();

  //stop containeren (freeze)
  document.querySelector("#good_container").classList.add("freeze");
  //få spriten til at forsvinde (fade)
  document.querySelector("#good_sprite").classList.add("fade");

  //lyt efter om fade-animationen på spriten er færdig
  document.querySelector("#good_sprite").addEventListener("animationend", goodReset);
}

function goodReset() {
  console.log("goodReset");

  //Fjern de eventlistnere der fører til funktionen
  document.querySelector("#good_sprite").removeEventListener("animationend", goodReset);
  document.querySelector("#good_container").removeEventListener("animationiteration", goodReset);

  //fjern alle klasser fra containeren
  document.querySelector("#good_container").classList = "";
  //fjern alle klasser fra spriten
  document.querySelector("#good_sprite").classList = "";

  //find et tilfældigt tal mellem 1 og 7
  let rand = randomNumber(7);
  //giv elementet den nye tilfældige position (pos1 - pos7)
  document.querySelector("#good_container").classList.add("pos" + rand);

  //sørg for at klassen fall kan sættes på igen
  document.querySelector("#good_container").offsetHeight;
  //sæt klassen fall på igen
  document.querySelector("#good_container").classList.add("fall");

  //lyt igen efter click og animationiteration
  document.querySelector("#good_container").addEventListener("mousedown", goodClick);
  document.querySelector("#good_container").addEventListener("animationiteration", goodReset);
}

function badClick() {
  console.log("badClick");
  //fjern eventlistneren for mousedown så man ikke kan klikke flere gange
  document.querySelector("#bad_container").removeEventListener("mousedown", badClick);

  //tjek om der er flere liv tilbage, og hvis der ikke er, så gå til endGame.
  //Hvis der er flere liv tilbage så stoppes containeren, spriten forsvinder,
  //der trækkes et liv, liv opdateres på siden og funktionen badReset kaldes
  //når sprite forsvind er færdig ...
  if (lives <= 0) {
    endGame();
  } else {
    //Tæl ned på liv
    subtractLives();
    //Udskriv liv på siden
    updateLives();
    //stop containeren (freeze)
    document.querySelector("#bad_container").classList.add("freeze");
    //få spriten til at forsvinde (spin)
    document.querySelector("#bad_sprite").classList.add("spin");
    //lyt efter om spin-animationen på spriten er færdig
    document.querySelector("#bad_sprite").addEventListener("animationend", badReset);
  }
}

function badReset() {
  console.log("badReset");

  //Fjern de eventlistnere der fører til funktionen
  document.querySelector("#bad_sprite").removeEventListener("animationend", badReset);
  document.querySelector("#bad_container").removeEventListener("animationiteration", badReset);

  //fjern alle klasser fra containeren
  document.querySelector("#bad_container").classList = "";
  //fjern alle klasser fra containeren
  document.querySelector("#bad_sprite").classList = "";

  //find et tilfældigt tal mellem 1 og 7
  let rand = randomNumber(7);
  //giv elementet den nye tilfældige position (pos1 - pos7)
  document.querySelector("#bad_container").classList.add("pos" + rand);

  //sørg for at klassen fall kan sættes på igen
  document.querySelector("#bad_container").offsetHeight;
  //sæt klassen fall på igen
  document.querySelector("#bad_container").classList.add("fall");

  //sætter eventlistenerne på igen for click og animationiteration
  document.querySelector("#bad_container").addEventListener("mousedown", badClick);
  document.querySelector("#bad_container").addEventListener("animationiteration", badReset);
}

function endGame() {
  console.log("endGame");
  // fjern timer animation (så den kan sættes på igen)
  document.querySelector("#time_sprite").classList.remove("skrump");
  document.querySelector("#time_sprite").removeEventListener("animationend", endGame);
  // stop alle animationer
  stopAll();
  // find ud af om vi har vundet eller tabt
  if (lives <= 0) {
    gameOver();
  } else if (points > 3) {
    levelComplete();
  } else {
    gameOver();
  }
}

function gameOver() {
  console.log("gameOver");

  //skjul alle skærme
  hideAll();
  document.querySelector("#gameover_snd").play();
  //vis gameover skærmen
  document.querySelector("#game_over").classList.remove("hide");
  //lyt efter om der bliver klikket på spil-igen knappen
  document.querySelector("#restart_1").addEventListener("click", startGame);
}

function levelComplete() {
  console.log("levelComplete");
  //skjul alle skærme

  hideAll();
  document.querySelector("#gameover_snd").play();
  //vis levelcomplete skærmen
  document.querySelector("#level_complete").classList.remove("hide");
  //lyt efter om der bliver klikket på spil-igen knappen
  document.querySelector("#restart_2").addEventListener("click", startGame);
}

// HJÆLPEFUNKTIONER..................................................

// lægger et point til
function addPoint() {
  points++;
  // Kan også skrives:
  // points = points + 1;
}
// udskriver point på siden
function updatePoint() {
  document.querySelector("#myPoints").textContent = points;
}
// trækker et liv fra
function subtractLives() {
  lives--;
  // Kan også skrives:
  // lives = lives - 1;
}
// udskriver liv på siden
function updateLives() {
  document.querySelector("#myLives").textContent = lives;
}
// returnerer et random tal mellem 1 og den medsendte parameter (rand)
function randomNumber(rand) {
  return Math.floor(Math.random() * rand) + 1;
}
// skjuler alle skærme
function hideAll() {
  document.querySelector("#start").classList.add("hide");
  document.querySelector("#how_to_play").classList.add("hide");
  document.querySelector("#game_over").classList.add("hide");
  document.querySelector("#level_complete").classList.add("hide");
}
// stopper alle animationer og eventlistnere
function stopAll() {
  document.querySelector("#good_container").classList = "";
  document.querySelector("#bad_container").classList = "";

  document.querySelector("#good_container").classList = "";
  document.querySelector("#bad_container").classList = "";

  document.querySelector("#good_sprite").classList = "";
  document.querySelector("#bad_sprite").classList = "";

  document.querySelector("#good_container").removeEventListener("mousedown", goodClick);
  document.querySelector("#bad_container").removeEventListener("mousedown", badClick);

  document.querySelector("#good_sprite").removeEventListener("animationend", goodReset);
  document.querySelector("#bad_sprite").removeEventListener("animationend", badReset);

  document.querySelector("#good_container").removeEventListener("animationiteration", goodReset);
  document.querySelector("#bad_container").removeEventListener("animationiteration", badReset);
}

const button_sound = document.querySelector("#button_snd");
document.querySelector("#inst_btn").addEventListener("click", soundButton);
document.querySelector("#spil_btn_1").addEventListener("click", soundButton);
document.querySelector("#spil_btn_2").addEventListener("click", soundButton);
document.querySelector("#restart_1").addEventListener("click", soundButton);
document.querySelector("#restart_2").addEventListener("click", soundButton);

function soundButton() {
  console.log("soundButton");
  button_snd.currentTime = 0;
  button_snd.play();
}

// const start_sound = document.querySelector("#start_snd");
// document.querySelector("#screen").addEventListener("click", spilGame);

// function spilGame() {
//   console.log("spilGame");
//   // start_snd.currentTime = 0;
//   start_snd.play();
// }

function playSound() {
  var audio = document.getElementById("myAudio");
  audio.play();
}