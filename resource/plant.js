/**
 * MIT License
 * Copyright (c) 2024 github.com/Barqawiz/
 * **/
const canvas = document.getElementById('plantCanvas');
const ctx = canvas.getContext('2d');

let isDayMode = true; // start with day mode
let growthStage = 1; // 0: seed, 1: seedling, 2: growing, 3: mature
let needsWater = false;
let needsSun = false;

let textTimeout;
let animationAngle = 0;

function drawPlant() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // draw background
    if (isDayMode) {
        drawDayBackground();
    } else {
        drawNightBackground();
    }

    // save the context
    ctx.save();
    // move to the bottom center of the canvas
    ctx.translate(canvas.width / 2, canvas.height);

    // apply idle animation sway
    ctx.rotate(Math.sin(animationAngle) * 0.05); // sway angle

    // draw plant based on growth stage
    if (growthStage >= 0) {
        // seed stage
        drawSeed();
    }

    if (growthStage >= 1) {
        // seedling stage
        drawStem(1);
        drawLeaves(1);
    }

    if (growthStage >= 2) {
        // growing stage
        drawStem(2); // taller stem
        drawLeaves(2); // more leaves
    }

    if (growthStage >= 3) {
        // mature stage
        drawStem(3);
        drawLeaves(3);
        drawFlower();
    }

    ctx.restore();

    // display needs
    if (needsWater && needsSun) {
        document.getElementById('message').innerText = 'I need water and sun!';
    } else if (needsWater) {
        document.getElementById('message').innerText = 'I need water!';
        // draw "I need water" text next to plant
        ctx.save();
        ctx.translate(canvas.width / 2 + 50, canvas.height - 100);
        ctx.fillStyle = '#0000ff';
        ctx.font = '16px Arial';
        ctx.fillText('I need water!', 0, 0);
        ctx.restore();
    } else if (needsSun) {
        document.getElementById('message').innerText = 'I need sun!';
        // draw "I need sun" text next to plant
        ctx.save();
        ctx.translate(canvas.width / 2 + 50, canvas.height - 130);
        ctx.fillStyle = '#FFA500';
        ctx.font = '16px Arial';
        ctx.fillText('I need sun!', 0, 0);
        ctx.restore();

        // draw cloud over sun
        if (isDayMode) {
            drawCloud(30, 50); // adjusted position
        }
    } else {
        document.getElementById('message').innerText = '';
    }
}

function drawSeed() {
    ctx.fillStyle = '#8B4513'; // brown color for seed
    ctx.beginPath();
    ctx.ellipse(0, 0, 10, 10, 0, 0, Math.PI * 2);
    ctx.fill();
}

function drawStem(stage) {
    ctx.strokeStyle = '#228B22'; // forestGreen color
    ctx.lineWidth = 5;

    ctx.beginPath();
    ctx.moveTo(0, 0);

    if (stage === 1) {
        // short stem
        ctx.bezierCurveTo(0, -20, 10, -40, 0, -60);
    } else if (stage === 2) {
        // medium stem
        ctx.bezierCurveTo(0, -50, 20, -100, 0, -150);
    } else if (stage === 3) {
        // tall stem
        ctx.bezierCurveTo(0, -70, 30, -140, 0, -210);
    }

    ctx.stroke();
}

function drawLeaves(stage) {
    if (stage >= 1) {
        // left leaf
        drawLeaf(ctx, -15, -60, 1, -Math.PI / 4);
        // right leaf
        drawLeaf(ctx, 15, -80, 1, Math.PI / 4);
    }
    if (stage >= 2) {
        // additional leaves
        drawLeaf(ctx, -20, -110, 0.8, -Math.PI / 3);
        drawLeaf(ctx, 20, -130, 0.8, Math.PI / 3);
    }
    if (stage >= 3) {
        // more leaves
        drawLeaf(ctx, -25, -160, 0.6, -Math.PI / 2.5);
        drawLeaf(ctx, 25, -180, 0.6, Math.PI / 2.5);
    }
}

function drawLeaf(ctx, x, y, scale, angle) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.scale(scale, scale);
    ctx.fillStyle = '#32CD32'; // limeGreen color
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(15, -10, 15, -30, 0, -40);
    ctx.bezierCurveTo(-15, -30, -15, -10, 0, 0);
    ctx.fill();
    ctx.restore();
}

function drawFlower() {
    ctx.save();
    ctx.translate(0, -210); // move to the top of the stem
    // draw petals
    for (let i = 0; i < 5; i++) {
        ctx.fillStyle = '#FF69B4'; // hot pink
        ctx.beginPath();
        ctx.rotate((Math.PI * 2) / 5);
        ctx.moveTo(0, 0);
        ctx.lineTo(0, -20);
        ctx.arc(0, -30, 10, 0, Math.PI);
        ctx.lineTo(0, -20);
        ctx.fill();
    }
    // draw center of the flower
    ctx.fillStyle = '#FFD700'; // gold
    ctx.beginPath();
    ctx.arc(0, 0, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
}

function drawDayBackground() {
    // sky blue background
    ctx.fillStyle = '#87CEEB';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // draw sun
    ctx.fillStyle = '#FFD700';
    ctx.beginPath();
    ctx.arc(50, 50, 30, 0, Math.PI * 2);
    ctx.fill();

    // if needs sun, draw cloud over part of sun
    if (needsSun) {
        drawCloud(30, 50);
    }
}

function drawCloud(x, y) {
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(x, y, 20, Math.PI * 0.5, Math.PI * 1.5);
    ctx.arc(x + 20, y - 20, 20, Math.PI, Math.PI * 2);
    ctx.arc(x + 40, y - 20, 20, Math.PI, Math.PI * 2);
    ctx.arc(x + 60, y, 20, Math.PI * 1.5, Math.PI * 0.5);
    ctx.moveTo(x + 60, y + 20);
    ctx.lineTo(x, y + 20);
    ctx.fill();
}

function drawNightBackground() {
    ctx.fillStyle = '#0a0a2a'; // dark blue
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // draw stars
    for (let i = 0; i < 50; i++) {
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        ctx.arc(x, y, 1, 0, Math.PI * 2);
        ctx.fill();
    }
}

function toggleDayNightMode() {
    isDayMode = !isDayMode;

    // change the background color of the body
    if (isDayMode) {
        document.body.style.backgroundColor = '#ffffff';
        document.body.style.color = '#000000';
        document.getElementById('plantCanvas').style.backgroundColor = '#87CEEB';
        document.getElementById('plantCanvas').style.borderColor = '#000';
    } else {
        document.body.style.backgroundColor = '#0a0a2a';
        document.body.style.color = '#ffffff';
        document.getElementById('plantCanvas').style.backgroundColor = '#1a1a3d';
        document.getElementById('plantCanvas').style.borderColor = '#fff';
    }

    drawPlant();
}

function waterPlant() {
    // keep the animation as it with drops
    playWateringAnimation();

    needsWater = false;
    drawPlant();
}

function giveSun() {
    if (needsSun) {
        needsSun = false;
        // play sun animation
        playSunAnimation();
    } else {
        playSunAnimation();
    }
}

function changeGrowthStage() {
    growthStage = (growthStage + 1) % 4; // now 4 stages
    drawPlant();
}

function showRandomText() {
    const messages = [
        "Plants make people happy!",
        "Don't forget to water me!",
        "I'm growing strong!",
        "I love sunlight!",
        "Thank you for taking care of me!"
    ];
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    // display the message in the textDisplay div
    document.getElementById('textDisplay').innerText = randomMessage;

    // hide the text after some time
    clearTimeout(textTimeout);
    textTimeout = setTimeout(() => {
        document.getElementById('textDisplay').innerText = '';
    }, 5000); // hide after 5 seconds
}

function playWateringAnimation() {
    let dropletY = -150;
    function animateDroplet() {
        drawPlant();
        ctx.save();
        ctx.translate(canvas.width / 2, dropletY);
        ctx.fillStyle = '#0000ff';
        ctx.beginPath();
        ctx.arc(0, 0, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        dropletY += 5;
        if (dropletY <= canvas.height) {
            requestAnimationFrame(animateDroplet);
        } else {
            drawPlant();
        }
    }
    animateDroplet();
}

function playSunAnimation() {
    // show the cloud moving away
    let cloudX = 30;
    function animateSun() {
        drawPlant();
        ctx.save();
        ctx.translate(cloudX, 50);
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(0, 0, 20, Math.PI * 0.5, Math.PI * 1.5);
        ctx.arc(20, -20, 20, Math.PI, Math.PI * 2);
        ctx.arc(40, -20, 20, Math.PI, Math.PI * 2);
        ctx.arc(60, 0, 20, Math.PI * 1.5, Math.PI * 0.5);
        ctx.moveTo(60, 20);
        ctx.lineTo(0, 20);
        ctx.fill();
        ctx.restore();

        cloudX += 2;
        if (cloudX < canvas.width) {
            requestAnimationFrame(animateSun);
        } else {
            drawPlant();
        }
    }
    animateSun();
}

function showCuteReaction() {
    let heartY = canvas.height / 2;
    function animateHeart() {
        drawPlant();
        ctx.save();
        ctx.translate(canvas.width / 2, heartY);
        ctx.fillStyle = '#ff69b4'; // hot pink color
        ctx.beginPath();
        ctx.moveTo(0, -10);
        ctx.bezierCurveTo(-25, -35, -50, 0, 0, 30);
        ctx.bezierCurveTo(50, 0, 25, -35, 0, -10);
        ctx.fill();
        ctx.restore();
        heartY -= 5;
        if (heartY > 0) {
            requestAnimationFrame(animateHeart);
        } else {
            drawPlant();
        }
    }
    animateHeart();
}

function fertilizePlant() {
    // improved fertilize animation without bag moving down
    let particles = [];
    // start sprinkling particles
    for (let i = 0; i < 20; i++) {
        particles.push({
            x: canvas.width / 2 - 10 + Math.random() * 20,
            y: canvas.height / 2,
            vy: 2 + Math.random() * 2
        });
    }
    function animateParticles() {
        drawPlant();

        // draw particles
        ctx.fillStyle = '#8B4513'; // brown color for particles
        particles.forEach((p, index) => {
            ctx.beginPath();
            ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
            ctx.fill();
            p.y += p.vy;
            if (p.y > canvas.height) {
                particles.splice(index, 1);
            }
        });

        if (particles.length > 0) {
            requestAnimationFrame(animateParticles);
        } else {
            drawPlant();
        }
    }
    animateParticles();
}

function playMusic() {
    // show moving musical notes
    let notes = [];
    for (let i = 0; i < 5; i++) {
        notes.push({
            x: canvas.width / 2 + Math.random() * 100 - 50,
            y: canvas.height - 100,
            vy: -2 - Math.random() * 2
        });
    }
    function animateNotes() {
        drawPlant();
        ctx.save();
        // set music note color based on day/night mode
        if (isDayMode) {
            ctx.fillStyle = '#000000'; // black in day
        } else {
            ctx.fillStyle = '#ffffff'; // white in night
        }
        notes.forEach(note => {
            ctx.font = '20px Arial';
            ctx.fillText('♪', note.x, note.y);
            note.y += note.vy;
        });
        ctx.restore();
        if (notes[0].y > 0) {
            requestAnimationFrame(animateNotes);
        } else {
            drawPlant();
        }
    }
    animateNotes();
}

function talkToPlant() {
    let opacity = 1;
    function animateSpeechBubble() {
        drawPlant();
        ctx.save();
        ctx.globalAlpha = opacity;
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(canvas.width / 2 - 60, canvas.height / 2 - 150, 120, 50);
        ctx.fillStyle = '#000000';
        ctx.font = '14px Arial';
        ctx.fillText('Hello, friend!', canvas.width / 2 - 50, canvas.height / 2 - 120);
        ctx.restore();
        opacity -= 0.02;
        if (opacity > 0) {
            requestAnimationFrame(animateSpeechBubble);
        } else {
            drawPlant();
        }
    }
    animateSpeechBubble();
}

function showButterfly() {
    // show butterfly animation
    let butterflyX = 0;
    let butterflyY = canvas.height / 2;

    function animateButterfly() {
        drawPlant();
        ctx.save();
        ctx.translate(butterflyX, butterflyY);
        ctx.fillStyle = '#ff00ff'; // magenta color for butterfly
        // draw simple butterfly wings
        ctx.beginPath();
        ctx.ellipse(0, 0, 10, 5, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(15, 0, 10, 5, 0, 0, Math.PI * 2);
        ctx.fill();
        // draw body
        ctx.fillStyle = '#000000';
        ctx.fillRect(5, -5, 5, 10);
        ctx.restore();

        butterflyX += 5;
        butterflyY += Math.sin(butterflyX / 20) * 5;

        if (butterflyX < canvas.width) {
            requestAnimationFrame(animateButterfly);
        } else {
            drawPlant();
        }
    }
    animateButterfly();
}

function sleepingPlant() {
    // show animated Z's next to the plant
    let zY = canvas.height - 150;
    function animateZ() {
        drawPlant();
        ctx.save();
        ctx.fillStyle = '#0000ff';
        ctx.font = '30px Arial';
        ctx.fillText('Z', canvas.width / 2 + 20, zY);
        ctx.restore();
        zY -= 2;
        if (zY > 0) {
            requestAnimationFrame(animateZ);
        } else {
            drawPlant();
        }
    }
    animateZ();
}

function showNeedWater() {
    needsWater = true;
    drawPlant();
}

function showNeedSun() {
    needsSun = true;
    drawPlant();
}

function resetToIdeal() {
    // clear any messages or flags
    document.getElementById('message').innerText = '';
    document.getElementById('textDisplay').innerText = '';
    needsWater = false;
    needsSun = false;
    drawPlant();
}

function animate() {
    animationAngle += 0.02; // increase the angle
    drawPlant();
    requestAnimationFrame(animate);
}

// event listeners for buttons
document.getElementById('dayNightMode').addEventListener('click', toggleDayNightMode);
document.getElementById('growthStage').addEventListener('click', changeGrowthStage);
document.getElementById('waterPlant').addEventListener('click', waterPlant);
document.getElementById('giveSun').addEventListener('click', giveSun);
document.getElementById('fertilizePlant').addEventListener('click', fertilizePlant);
document.getElementById('playMusic').addEventListener('click', playMusic);
document.getElementById('talkPlant').addEventListener('click', talkToPlant);
document.getElementById('showText').addEventListener('click', showRandomText);
document.getElementById('cuteButton').addEventListener('click', showCuteReaction);
document.getElementById('showButterfly').addEventListener('click', showButterfly);
document.getElementById('sleeping').addEventListener('click', sleepingPlant);
document.getElementById('showNeedWater').addEventListener('click', showNeedWater);
document.getElementById('showNeedSun').addEventListener('click', showNeedSun);
document.getElementById('idealButton').addEventListener('click', resetToIdeal);

// initial draw and start animation
animate();
