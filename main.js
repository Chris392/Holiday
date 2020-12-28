//Aliases
let Application = PIXI.Application,
  loader = PIXI.loader,
  resources = PIXI.loader.resources,
  Sprite = PIXI.Sprite;

//Create a Pixi Application
let app = new Application({
  width: window.innerWidth,
  height: (window.innerWidth / 16) * 6.5,
  antialias: true,
  transparent: true,
  resolution: 1,
});

//Add the canvas that Pixi automatically created for you to the HTML document
document.body.appendChild(app.view);

bump = new Bump(PIXI);

let state;

let woodCount = 0;

let elapsedTime = 0;

let stunned = false;

let explode = false;

let start = 0;

let startexp;

let superpower = false;

const height = document.querySelector("canvas").height;

//graphics.beginFill();

//load an image and run the `setup` function when it's done
loader
  .add([
    "sprites/character1.png",
    "sprites/character1crouch.png",
    "sprites/wood.png",
    "sprites/grassland2.png",
    "sprites/lava2.png",
    "sprites/leave1.png",
    "sprites/leave2.png",
    "sprites/leave3.png",
    "sprites/leave4.png",
    "sprites/money.png",
  ])
  .load(setup);

//This `setup` function will run when the image has loaded
function setup() {
  grassland = new Sprite(resources["sprites/grassland2.png"].texture);
  grassland.height = 1000;
  //Add the character to the stage
  app.stage.addChild(grassland);

  grassland2 = new Sprite(resources["sprites/grassland2.png"].texture);

  app.stage.addChild(grassland2);

  grassland2.x = 1000;
  grassland2.height = 1000;

  lava = new Sprite(resources["sprites/lava2.png"].texture);

  app.stage.addChild(lava);

  const style = new PIXI.TextStyle({
    fill: "#ffffff",
  });
  woodText = new PIXI.Text("Level 1");

  app.stage.addChild(woodText);

  //Create the woods
  woods = [];

  leaves = [];

  moneys = [];

  //Create the character sprite
  characterTexture = new PIXI.Texture.fromImage("sprites/character1.png");
  characterCrouchTexture = new PIXI.Texture.fromImage(
    "sprites/character1crouch.png"
  );
  character = new Sprite(characterTexture);
  //new Sprite(resources["sprites/character1.png"].texture);

  //Add the character to the stage
  app.stage.addChild(character);

  character.x = 200;
  character.y = 200;
  character.vx = 0;
  character.vy = 0;
  character.width = 60;
  character.height = 60;

  //Capture the keyboard arrow keys
  let left = keyboard("ArrowLeft"),
    up = keyboard("ArrowUp"),
    right = keyboard("ArrowRight"),
    down = keyboard("ArrowDown");
  space = keyboard(" ");

  //Left arrow key `press` method
  left.press = () => {
    //Change the character's velocity when the key is pressed
    character.vx = -5;
    character.vy = 0;
  };

  //Left arrow key `release` method
  left.release = () => {
    //If the left arrow has been released, and the right arrow isn't down,
    //and the character isn't moving vertically:
    //Stop the character
    if (!right.isDown && character.vy === 0) {
      character.vx = 0;
    }
  };

  //Up
  up.press = () => {
    character.vy = -5;
    character.vx = 0;
  };
  up.release = () => {
    if (!down.isDown && character.vx === 0) {
      character.vy = 0;
    }
  };

  //Right
  right.press = () => {
    character.vx = 5;
    character.vy = 0;
  };
  right.release = () => {
    if (!left.isDown && character.vy === 0) {
      character.vx = 0;
    }
  };

  //Down
  down.press = () => {
    character.vy = 5;
    character.vx = 0;
  };
  down.release = () => {
    if (!up.isDown && character.vx === 0) {
      character.vy = 0;
    }
  };

  space.press = () => {
    if (superpower === true) {
      explode = true;
      healthBar.outer.clear();

      let outerBar = new PIXI.Graphics();
      outerBar.beginFill(0xc0c0c0);
      outerBar.drawRect(0, 0, 228, 15);
      outerBar.endFill();
      healthBar.addChild(outerBar);

      healthBar.outer = outerBar;
      healthBar.outer.width = 0;
      superpower = false;
    }
  };

  //Health Bar
  gameScene = new PIXI.Container();
  app.stage.addChild(gameScene);
  //Create the health bar
  healthBar = new PIXI.Container();
  healthBar.position.set(10, height - 30);
  gameScene.addChild(healthBar);

  //Create the black background rectangle
  let innerBar = new PIXI.Graphics();
  innerBar.beginFill(0x000000);
  innerBar.drawRect(0, 0, 228, 15);
  innerBar.endFill();
  healthBar.addChild(innerBar);

  //Create the front red rectangle
  let outerBar = new PIXI.Graphics();
  outerBar.beginFill(0xc0c0c0);
  outerBar.drawRect(0, 0, 228, 15);
  outerBar.endFill();
  healthBar.addChild(outerBar);

  healthBar.outer = outerBar;
  healthBar.outer.width = 0;

  state = level1;

  app.ticker.add((delta) => gameLoop(delta));
}

function gameLoop(delta) {
  state(delta);
}

let amount = 20;
let speed = 7;
let windspeed = 1.2;
let leaveAmount = 40;
let leaveSpeed = 6;
let moneySpeed = 5;
let moneyAmount = 200;

let oldspeed;
let oldleaveSpeed;
let oldwindSpeed;
let oldleaveAmount;
let oldwoodAmount;

let leaveoffset = 0;
let woodoffset = 0;

let leaveCount = 0;

let points = 0;

let drawn = false;

let doOnce = true;

let casedelawood = 1;

graphics = new PIXI.Graphics();

function level1(delta) {
  elapsedTime += delta;

  //Fill Special-Attac-Bar allways when standing still
  if (
    character.vx <= 0 &&
    character.vy === 0 &&
    healthBar.outer.width <= 228 &&
    stunned === false &&
    explode === false
  ) {
    healthBar.outer.width += 2;
  }

  if (healthBar.outer.width > 226) {
    healthBar.outer.clear();
    let outerBar = new PIXI.Graphics();
    outerBar.beginFill(0xd4af37);
    outerBar.drawRect(0, 0, 228, 15);
    outerBar.endFill();
    healthBar.addChild(outerBar);

    healthBar.outer = outerBar;

    superpower = true;
  }

  if (explode === false) {
    //Throw wood every 2 Seconds
    if (Math.floor(elapsedTime) % amount === 0) {
      //Create Wood
      wood = new Sprite(resources["sprites/wood.png"].texture);

      let x = 2000;
      let y = Math.floor(randomNumber(0, 800));

      wood.x = x;
      wood.y = y;
      wood.anchor.x = 0.6;
      wood.anchor.y = 0.4;
      wood.width = 50;
      wood.height = 50;

      woods.push(wood);
      //Add the character to the stage
      app.stage.addChild(wood);
    }

    //throw money
    if (Math.floor(elapsedTime) % moneyAmount === 0) {
      //Create Wood
      money = new Sprite(resources["sprites/money.png"].texture);

      let x = 2000;
      let y = Math.floor(randomNumber(0, 800));

      money.x = x;
      money.y = y;
      money.anchor.x = 0.6;
      money.anchor.y = 0.4;
      money.height = 30;
      money.widht = 60;

      moneys.push(money);
      //Add the character to the stage
      app.stage.addChild(money);
    }

    //throw Leaves
    if (Math.floor(elapsedTime) % leaveAmount === 0) {
      leave1 = new Sprite(resources["sprites/leave1.png"].texture);
      let x = 2000;
      let y = Math.floor(randomNumber(0, 800));

      leave1.x = x;
      leave1.y = y;
      leave1.anchor.x = 0.5;
      leave1.anchor.y = 0.5;

      leaves.push(leave1);

      app.stage.addChild(leave1);

      leave2 = new Sprite(resources["sprites/leave2.png"].texture);

      y = Math.floor(randomNumber(0, 800));

      leave2.x = x;
      leave2.y = y;
      leave2.anchor.x = 0.5;
      leave2.anchor.y = 0.5;

      leaves.push(leave2);

      app.stage.addChild(leave2);

      leave3 = new Sprite(resources["sprites/leave3.png"].texture);

      y = Math.floor(randomNumber(0, 800));

      leave3.x = x;
      leave3.y = y;
      leave3.anchor.x = 0.5;
      leave3.anchor.y = 0.5;

      leaves.push(leave3);

      app.stage.addChild(leave3);

      leave4 = new Sprite(resources["sprites/leave4.png"].texture);

      y = Math.floor(randomNumber(0, 800));

      leave4.x = x;
      leave4.y = y;
      leave4.anchor.x = 0.5;
      leave4.anchor.y = 0.5;

      leaves.push(leave4);

      app.stage.addChild(leave4);
    }
  }

  //Punkte
  woodText.text = points;

  woods.forEach(function (thiswood) {
    thiswood.x -= speed;
    thiswood.rotation += 0.1;
    if (bump.hit(character, thiswood)) {
      thiswood.x = -1000;
      stunned = true;
      if (doOnce === true) {
        start = Math.floor(elapsedTime);
      }
      doOnce = false;
      character.texture = characterCrouchTexture;
      healthBar.outer.width -= 1;
    }
    if (thiswood.x < -900) {
      if (casedelawood === 1) {
        casedelawood = 2;
        thiswood.x = 2000;
        thiswood.y += 10;
      }
      if (casedelawood === 2) {
        casedelawood = 3;
        thiswood.x = 2607;
        thiswood.y -= 10;
      } else {
        casedelawood = 1;
        thiswood.x = 3002;
      }
      //if (thiswood.x < -200) {
      //thiswood.x = 2000;
    }

    if (explode === true) {
      if (doOnce === true) {
        startexp = Math.floor(elapsedTime);
        oldspeed = speed;
        oldleaveSpeed = leaveSpeed;
        oldwindSpeed = windspeed;
      }
      doOnce = false;

      speed = 0;
      leaveSpeed = 0;
      windspeed = 0;

      /*thiswood.y = -100;
      graphics.lineStyle(5, 0xff0000);
      graphics.drawRect(
        character.x - 80,
        character.y - 80,
        elapsedTime - startexp,
        160
      );
      app.stage.addChild(graphics);

      console.log(startexp); */
    }
  });

  leaves.forEach(function (thisleave) {
    leaveCount++;
    thisleave.x -= leaveSpeed;
    thisleave.rotation += 0.09;
    if (
      (thisleave.x < 1900 && thisleave.x > 1400) ||
      (thisleave.x < 1000 && thisleave.x > 600)
    ) {
      if (leaveCount % 2) {
        thisleave.y += 0.5;
      } else {
        thisleave.y -= 0.5;
      }
    }
    if (
      (thisleave.x < 1300 && thisleave.x > 1000) ||
      (thisleave.x < 600 && thisleave.x > 0)
    ) {
      if (leaveCount % 2) {
        thisleave.y -= 0.5;
      } else {
        thisleave.y += 0.5;
      }
    }
    if (thisleave.x < -200) {
      //app.stage.removeChild(thisleave);
      thisleave.x = 1921;
    }
  });

  moneys.forEach(function (thismoney) {
    thismoney.x -= moneySpeed;
    if (bump.hit(character, thismoney)) {
      points += 10;
      thismoney.x = -20;
    }
    if (thismoney.x < -200) {
      thismoney.x = 5000;
    }
  });

  if (stunned) {
    character.x -= 5;
    character.vx = 0;
    character.vy = 0;
  }

  if (start + 40 == Math.floor(elapsedTime)) {
    doOnce = true;
    stunned = false;
    drawn = false;
    character.texture = characterTexture;
  }

  if (startexp + 100 == Math.floor(elapsedTime)) {
    speed = oldspeed;
    leaveSpeed = oldleaveSpeed;
    windspeed = oldwindSpeed;
    doOnce = true;
    explode = false;
  }

  if (character.x <= 40) {
    state = end;
  }

  if (character.y <= -10 && character.vy <= 0) {
    character.vy = 0;
  }

  if (character.y >= height - 40 && character.vy >= 0) {
    character.vy = 0;
  }

  //Welt wird schwieriger
  if (
    Math.floor(elapsedTime) === 500 ||
    Math.floor(elapsedTime) === 1000 ||
    Math.floor(elapsedTime) === 1500 ||
    Math.floor(elapsedTime) === 2000 ||
    Math.floor(elapsedTime) === 2500 ||
    Math.floor(elapsedTime) === 3000 ||
    Math.floor(elapsedTime) === 3500 ||
    Math.floor(elapsedTime) === 4000 ||
    Math.floor(elapsedTime) === 4500
  ) {
    amount = 0; //Je niedriger desto mehr
    speed += 0.5; //Je höher desto schneller
    windspeed += 0.5; //Je höher desto stärker
    leaveAmount = 0;
    leaveSpeed += 1;
  }

  //Welt wird leichter
  if (
    Math.floor(elapsedTime) === 750 ||
    Math.floor(elapsedTime) === 1250 ||
    Math.floor(elapsedTime) === 1750 ||
    Math.floor(elapsedTime) === 2250 ||
    Math.floor(elapsedTime) === 2750 ||
    Math.floor(elapsedTime) === 3250 ||
    Math.floor(elapsedTime) === 3750 ||
    Math.floor(elapsedTime) === 4250 ||
    Math.floor(elapsedTime) === 4750
  ) {
    amount = 0; //Je niedriger desto mehr
    speed -= 0.3; //Je höher desto schneller
    windspeed -= 0.3; //Je höher desto stärker
    leaveAmount = 0;
    leaveSpeed -= 0.5;
  }

  //Blatt extrem
  if (Math.floor(elapsedTime) === 900 + leaveoffset) {
    oldleaveAmount = leaveAmount;
    leaveAmount = 40;
  }
  if (
    Math.floor(elapsedTime) === 980 + leaveoffset ||
    Math.floor(elapsedTime) === 1050 + leaveoffset
  ) {
    leaveAmount += 10;
  }

  if (Math.floor(elapsedTime) === 1100 + leaveoffset) {
    leaveAmount = oldleaveAmount;
    leaveoffset += 2000;
  }

  //holz extrem
  if (Math.floor(elapsedTime) === 1900 + woodoffset) {
    oldwoodAmount = amount;
    amount = 30;
  }
  if (
    Math.floor(elapsedTime) === 1980 + woodoffset ||
    Math.floor(elapsedTime) === 2050 + woodoffset
  ) {
    amount += 10;
  }

  if (Math.floor(elapsedTime) === 2100 + woodoffset) {
    amount = oldwoodAmount;
    woodoffset += 2000;
  }

  character.x += character.vx - windspeed;
  character.y += character.vy;
}

function end() {
  //Save Highscore locally

  points = Math.floor(points);

  localStorage.setItem("currentHighscore", points);
  if (localStorage.getItem("localHighscore") <= points) {
    localStorage.setItem("localHighscore", points);
  }

  /*
  //Send Highscore per Post to next page
  var form = document.createElement("form");
  form.setAttribute('method', "post");
  form.setAttribute('action', "scoreboard.php")

  console.log(form);

  var hiddenInput = document.createElement("input");
  hiddenInput.setAttribute('type', "hidden");
  hiddenInput.setAttribute('value', points);
  hiddenInput.setAttribute('name', "points");

  var submit = document.createElement("input");
  submit.setAttribute('type', "submit");
  submit.setAttribute('value', "Submit");

  form.appendChild(hiddenInput);
  form.appendChild(submit);

  document.body.appendChild(form);

  form.submit();
  */

  const formData = new FormData();
  formData.append("score", points);

  fetch("saveHighscore.php", {
    method: "post",
    body: formData,
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      listScores(data);
    })
    .catch(function (error) {
      console.log("error: " + error);
    });

  function listScores(data) {
    //Erstelle Liste
    /*
    const listContainter = document.getElementById("listContainer");
    const listElement = document.createElement("ul");
    listContainter.appendChild(listElement);

    for (i = 0; i < 5; ++i) {
      const listItem = document.createElement("li");
      listItem.innerHTML = data[i].name;

      listElement.appendChild(listItem);
    }

    console.log(data[0].name);
  
  */

    //Erstelle Tabelle
    let table = document.querySelector("table");

    let thead = table.createTHead();
    let row = thead.insertRow();

    let th = document.createElement("th");
    let text = document.createTextNode("Platz:");
    th.appendChild(text);
    row.appendChild(th);

    th = document.createElement("th");
    text = document.createTextNode("Name:");
    th.appendChild(text);
    row.appendChild(th);

    th = document.createElement("th");
    text = document.createTextNode("Punkte:");
    th.appendChild(text);
    row.appendChild(th);

    let inputMade = false;

    for (i = 0; i < 5; i++) {
      let row = table.insertRow();
      for (j = 0; j < 3; j++) {
        let cell = row.insertCell();
        let textorpoints;
        if (j === 0) {
          textorpoints = i + 1;
        } else if (
          j === 1 &&
          data[i].points === points &&
          inputMade === false
        ) {
          textorpoints = "makeInput";
          inputMade = true;
        } else if (j === 1) {
          textorpoints = data[i].name;
        } else {
          textorpoints = data[i].points;
        }
        if (textorpoints != "makeInput") {
          let text = document.createTextNode(textorpoints);
          cell.appendChild(text);
        } else {
          cell.className = "cellWithInput";
          cell.appendChild(input);
        }
      }
    }
  }

  //Pop up High-Score Window
  document.getElementById("score").style.display = "block";
  document.querySelector("#score h1").textContent += "  " + points;

  app.ticker.stop();
}

//prepare Input
const input = document.createElement("input");
input.type = "text";
input.className = "playerName";
input.placeholder = "ENTER NAME HERE";

input.addEventListener("keydown", (event) => {
  console.log(input.value);
  if (event.keyCode === 13) {
    let name = input.value;
    let text = document.createTextNode(input.value);
    input.style.display = "none";
    cellWithInput = document.getElementsByClassName("cellWithInput")[0];
    cellWithInput.appendChild(text);

    let formData = new FormData();
    formData.append("score", points);
    formData.append("name", name);

    fetch("saveName.php", {
      method: "post",
      body: formData,
    })
      .then(function (response) {
        return response.json();
      })
      .catch(function (error) {
        console.log("error: " + error);
      });
  }
});
