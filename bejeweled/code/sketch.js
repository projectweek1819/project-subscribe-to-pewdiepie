const canvasWidth = 1000;
const canvasHeight = 700;
const fieldWidth = 500;
const fieldHeight = 500;
const paddingTop = 100;
const paddingLeft = 250;
const spacer = 50;
let grid = [...Array(fieldWidth / spacer)].map(e => Array(fieldHeight / spacer));

let x = 0;
let y = 0;

//IMAGES
let blueStone;
let greenStone;
let orangeStone;
let purpleStone;
let redStone;
let yellowStone;
let selector;
let darkSlate;
let lightSlate;
let background;

//MOVES
let moves = 40;

//SCORE
let score = 0;
let target = 50000;
let start = false;

//AUDIO

let chain4PrettyGood;
let chain5Pew;
let epicVictoryRoyal;
let victory = true;

//VIDEO
let failure = true;
let endGame = false;


function Stone(color, position){
    this.color = color;
    this.selected = false;
    this.position = position;
    this.delete = false;
}

function Position(x, y){
    this.x = x;
    this.y = y;
}

function preload(){
    //SET IMAGES
    blueStone = loadImage("images/blueStone.png");
    greenStone = loadImage("images/greenStone.png");
    orangeStone = loadImage("images/orangeStone.png");
    purpleStone = loadImage("images/purpleStone.png");
    redStone = loadImage("images/redStone.png");
    yellowStone = loadImage("images/yellowStone.png");
    selector = loadImage("images/selector.png");
    darkSlate = loadImage("images/darkSlate.png");
    lightSlate = loadImage("images/lightSlate.png");
    background = loadImage("images/background.png");

    //FONTS
    font = loadFont('font/upheavtt.ttf');

}

function video() {
    var x = document.createElement("VIDEO");

    x.setAttribute("src","videos/youDied2.mp4");

    x.setAttribute("width", "1000px");
    x.setAttribute("height", "1000px");

    x.setAttribute("autoplay", "autoplay");
    document.body.appendChild(x);

    x.webkitEnterFullScreen();
}

function gif2() {
    let y = document.createElement("IMG");
    y.setAttribute("src", "videos/thanosclear.gif");
    y.setAttribute("width", "304");
    y.setAttribute("height", "228");
    y.setAttribute("alt", "thanosmeme");
    y.setAttribute("class", "thanos2");
    document.body.appendChild(y);
}

function gif() {
    let x = document.createElement("IMG");

    x.setAttribute("src", "videos/thanosclear.gif");

    x.setAttribute("width", "304");
    x.setAttribute("height", "228");

    x.setAttribute("alt", "thanosmeme1");
    x.setAttribute("class", "thanos1");

    document.body.appendChild(x);

}

function setup() {

    textFont(font);
    textSize(20);
    textAlign(CENTER, CENTER);
    createCanvas(canvasWidth, canvasHeight);

    for (let i = 0; i < fieldWidth / spacer; i++) {
        for (let j = 0; j < fieldHeight / spacer; j++) {

            let rng = int(random(6) + 1);

            grid[i][j] = new Stone(rng, new Position(i * spacer + paddingLeft, j * spacer + paddingTop));

        }
    }

    let i = 1;
    document.getElementById('audio').addEventListener('ended', function(){
        if (i === 4) {
            i = 0;
        }
        i++;
        nextSong = "sounds/"+i+".mp3";
        audioPlayer = document.getElementById('audio');
        audioPlayer.src = nextSong;
        audioPLayer.load();
        audioPlayer.play();

    }, false);

    epicVictoryRoyal = new sound("sounds/epicVictoryRoyal.mp3");
    chain4PrettyGood = new sound("sounds/chain4PrettyGood.mp3");
    chain5Pew = new sound("sounds/chain5Pew.mp3");

}

function sound(src) {
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
    this.play = function(){
        this.sound.play();
    };
}

function playGround(){

    for (let i = 0; i < grid[0].length; i++) {
        for (let j = 0; j < grid.length; j++) {


            //SLATES
            if ((i + j) % 2 !== 0){
                image(darkSlate, grid[i][j].position.x, grid[i][j].position.y, spacer, spacer);
            } else {
                image(lightSlate, grid[i][j].position.x, grid[i][j].position.y, spacer, spacer);
            }

            if (grid[i][j].selected){
                image(selector, grid[i][j].position.x, grid[i][j].position.y, spacer, spacer);
            }

            //DELETE DELETE STONE
            if (grid[i][j].delete){
                grid[i][j].color = 0;
                grid[i][j].delete = false;
            }

            //COLOR STONES
            drawStone(i, j, grid[i][j].position.x , grid[i][j].position.y);
        }
    }

}

function drawStone(i, j, coordX, coordY ){
    let stone;

    if (!(grid[i][j].color === 0)){
        switch(grid[i][j].color){
            case 1:
                //BLAUW
                stone = blueStone;
                break;

            case 2:
                //GEEL
                stone = yellowStone;
                break;

            case 3:
                //ROOD
                stone = redStone;
                break;

            case 4:
                //PAARS
                stone = purpleStone;
                break;

            case 5:
                //GROEN
                stone = greenStone;
                break;

            case 6:
                //ORANJE
                stone = orangeStone;
                break;
        }

        //DRAW STONES
        image(stone, coordX + 13, coordY + 8, 25, 35);


    }
}

function swap(p, q){

    const temp = grid[(p.position.x - paddingLeft) / spacer][(p.position.y - paddingTop) / spacer].color;

    grid[(p.position.x - paddingLeft) / spacer][(p.position.y - paddingTop) / spacer].color = grid[(q.position.x - paddingLeft)/ spacer][(q.position.y - paddingTop) / spacer].color;

    grid[(q.position.x - paddingLeft) / spacer][(q.position.y - paddingTop) / spacer].color = temp;

}

function horizontalChainAt(x, y){

    let amount = 1;
    for (let i = 1; x + i < grid[0].length; ++i) {
        if (x === 9 || grid[x + i][y].color !== grid[x][y].color) {
            break;
        }
        amount++;
    }

   return amount;

}

function verticalChainAt(x, y) {

    let amount = 1;
    for (let i = 1; y + i < grid.length; ++i) {
        if (y === 9 || grid[x][y + i].color !== grid[x][y].color) {
            break;
        }
        amount++;
    }

    return amount;

}

function removeHorizontal(x){
    for (let i = 0; i < grid[0].length; i++) {
        grid[i][x].delete = true;
    }
}

function removeChains() {

    for (let i = 0; i < grid[0].length; i++) {
        for (let j = 0; j < grid.length; j++) {

            if (grid[i][j].color !== 0){
                let horizontal = horizontalChainAt(i,j);
                let vertical = verticalChainAt(i,j);

                if (horizontal === 3){
                    for (let k = 0; k < horizontal; k++) {
                        grid[i + k][j].delete = true;
                    }
                }

                if (horizontal === 4){
                    for (let k = 0; k < horizontal; k++) {
                        grid[i + k][j].delete = true;
                    }
                }

                if (horizontal === 5){
                    for (let k = 0; k < horizontal; k++) {
                        grid[i + k][j].delete = true;
                    }
                }

                if (vertical === 3){
                    for (let k = 0; k < vertical; k++) {
                        grid[i][j + k].delete = true;
                    }
                }

                if (vertical === 4){
                    for (let k = 0; k < vertical; k++) {
                        grid[i][j + k].delete = true;
                    }
                }

                if (vertical === 5){
                    for (let k = 0; k < vertical; k++) {
                        grid[i][j + k].delete = true;
                    }
                }

                if (start){
                    if (horizontal === 3){
                        score += 500;
                    }

                    if (horizontal === 4){
                        score += 2000;
                        chain4PrettyGood.play();
                    }

                    if (horizontal === 5){
                        score += 10000;
                        chain5Pew.play();
                    }

                    if (vertical === 3){
                        score += 500;

                    }

                    if (vertical === 4){
                        score += 500;
                        chain4PrettyGood.play();
                    }

                    if (vertical === 5){
                        score += 500;
                        chain5Pew.play();
                    }

                }
            }
        }
    }
}

function collapse(){

    for (let i = grid[0].length - 1; i >= 0; i--) {
        for (let j = grid.length - 1; j >= 0; j--) {
            if (j !== 0 && grid[i][j].color === 0){
                swap(grid[i][j], grid[i][j - 1]);
            }
        }
    }
}

function spawn(){
    for (let i = 0; i <= grid[0].length - 1; i++) {
        if (grid[i][0].color === 0 && grid[i][0].delete === false){
            grid[i][0].color = int(random(6) + 1);
        }
    }
}

function legalSwap(x, y){

    let legalMove = false;

    if (x < 8 && horizontalChainAt(x, y) >= 3){
        legalMove = true;
    }

    if (x >= 1 && x < 9 &&horizontalChainAt(x - 1, y) >= 3){
        legalMove = true;
    }

    if (x >= 2 && horizontalChainAt(x - 2, y) >= 3){
        legalMove = true;
    }

    if (y < 8 && verticalChainAt(x, y) >= 3){
        legalMove = true;
    }

    if (y >= 1 && y < 9 &&verticalChainAt(x, y -1) >= 3){
        legalMove = true;
    }

    if (y >= 2 && verticalChainAt(x, y -2) >= 3){
        legalMove = true;
    }

    return legalMove;

}

function drawWords(){
    text("MOVES", 235, 40);
    text(moves, 235, 60);
    text("SCORE", 500, 40);
    text(score, 500, 60);
    text("TARGET", 790, 40);
    text(target, 790, 60)
}

function setIntervalX(callback, delay, repetitions) {
    var x = 0;
    var intervalID = setInterval(function () {

        callback();

        if (++x === repetitions) {
            clearInterval(intervalID);
            loop();
        }
    }, delay);

}

function animation(gridX, coordXx, coordXy ,gridY, coordYx, coordYy){

    let shiftTop;
    let shiftBottom;
    let shiftLeft;
    let shiftRight;

    let coordX = new Position(gridX.position.x, gridX.position.y);
    let coordY = new Position(gridY.position.x, gridY.position.y);

    let colorX = gridX.color;
    let colorY = gridY.color;

    if (gridX.position.x > gridY.position.x){
        shiftLeft = true;
    }
    else if(gridX.position.x < gridY.position.x){
        shiftRight = true;
    }
    else{
        if (gridX.position.y > gridY.position.y){
            shiftTop = true;
        }
        else{
            shiftBottom = true;
        }
    }

    if (shiftLeft){

        noLoop();

        setIntervalX(function () {
            gridX.color = 0;
            gridY.color = 0;
            playGround();

            gridX.color = colorX;
            gridY.color = colorY;
            drawStone(coordYx, coordYy, coordX.x--, coordX.y);
            drawStone(coordXx, coordXy,coordY.x++, coordY.y);

        }, 10, 50);

    }

    if (shiftRight){

        noLoop();

        setIntervalX(function () {
            gridX.color = 0;
            gridY.color = 0;
            playGround();

            gridX.color = colorX;
            gridY.color = colorY;
            drawStone(coordYx, coordYy, coordX.x++, coordX.y);
            drawStone(coordXx, coordXy,coordY.x--, coordY.y);

        }, 10, 50);

    }

    if (shiftTop){

        noLoop();

        setIntervalX(function () {
            gridX.color = 0;
            gridY.color = 0;
            playGround();

            gridX.color = colorX;
            gridY.color = colorY;
            drawStone(coordYx, coordYy, coordX.x, coordX.y--);
            drawStone(coordXx, coordXy,coordY.x, coordY.y++);

        }, 10, 50);

    }

    if (shiftBottom){

        noLoop();

        setIntervalX(function () {
            gridX.color = 0;
            gridY.color = 0;
            playGround();

            gridX.color = colorX;
            gridY.color = colorY;
            drawStone(coordYx, coordYy, coordX.x, coordX.y++);
            drawStone(coordXx, coordXy,coordY.x, coordY.y--);

        }, 10, 50);

    }

}

function draw() {

    image(background, 0, 0, canvasWidth, canvasHeight);

    drawWords();
    removeChains();
    collapse();
    spawn();
    playGround();

    if (score >= target && victory){
        gif();
        gif2();
        audio.pause();
        epicVictoryRoyal.play();
        collapse();
        spawn();
        victory = false;
        endGame = true;
    }

    if (moves === 0 && score < target && failure) {
        audio.pause();
        collapse();
        spawn();
        video();
        failure = false;
        endGame = true;
    }

    if (mouseIsPressed && !endGame){

        start = true;

        let oldX = x;
        let oldY = y;

        if (int((mouseX - paddingLeft) / spacer) < 10 && int((mouseY - paddingTop) / spacer) < 10){

            let foo = false;

            let newX = int((mouseX - paddingLeft) / spacer);
            let newY = int((mouseY - paddingTop) / spacer);

            if (newX !== 9 && grid[newX + 1][newY].selected === true){
                foo = true;
            }
            if (newX !== 0 && grid[newX - 1][newY].selected === true){
                foo = true;
            }
            if (newY !== 9 && grid[newX][newY + 1].selected === true){
                foo = true;
            }
            if (newY !== 0 && grid[newX][newY - 1].selected === true){
                foo = true;
            }

            if (foo){
                grid[oldX][oldY].selected = false;
                grid[newX][newY].selected = false;
                swap(grid[oldX][oldY], grid[newX][newY]);


                moves--;

                let foo = false;

                if (legalSwap(oldX, oldY)){
                    foo = true;
                }

                if (legalSwap(newX, newY)){
                    foo = true;
                }

                if (!foo){
                    swap(grid[oldX][oldY], grid[newX][newY]);
                    moves++;
                }else{
                    animation(grid[oldX][oldY], oldX, oldY,grid[newX][newY], newX, newY);
                }

            }else{
                grid[oldX][oldY].selected = false;
                grid[newX][newY].selected = true;
            }

            x = newX;
            y = newY;

        }
    }
}