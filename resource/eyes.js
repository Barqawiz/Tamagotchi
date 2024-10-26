/**
 * MIT License
 * Copyright (c) 2024 github.com/Barqawiz/
 * **/

// get the canvas and context
const canvas = document.getElementById('eyesCanvas');
const ctx = canvas.getContext('2d');

// eye parameters
const eyeRadius = 80;
const irisRadiusDefault = 30;
const pupilRadiusDefault = 12;
const eyeOffsetX = 120; // distance from center for each eye
const eyeCenterY = canvas.height / 2;
const leftEyeCenterX = canvas.width / 2 - eyeOffsetX;
const rightEyeCenterX = canvas.width / 2 + eyeOffsetX;

// mouse position
let mouseX = canvas.width / 2;
let mouseY = canvas.height / 2;

// state variables
let isBlinking = false;
let blinkProgress = 0;
let isSurprised = false;
let isSleepy = false;
let isBored = false;
let isFollowingMouse = false;
let isIdle = true;
let isLookingAround = false;
let isWTF = false;

// idle blink timer
let idleBlinkInterval;

// look around variables
let lookPause = false;
let lookDirection = 1; // 1 for right, -1 for left
let lookAngle = 0;

// animation parameters
let lastTime = 0;

function draw(timestamp) {
    const deltaTime = timestamp - lastTime;
    lastTime = timestamp;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // update lookAngle globally
    if (isLookingAround && !lookPause) {
         // speed
        lookAngle += 0.01 * lookDirection;
        if (Math.abs(lookAngle) > Math.PI / 4) { 
            // limit angle to ±45 degrees
            lookPause = true;
            setTimeout(() => {
                lookPause = false;
                // change direction after pause
                lookDirection *= -1; 
            }, 500 /*shorter pause for smoother movement*/); 
        }
    }

    // draw left eye
    drawEye(leftEyeCenterX, eyeCenterY);

    // draw right eye
    drawEye(rightEyeCenterX, eyeCenterY);

    requestAnimationFrame(draw);
}

function drawEye(centerX, centerY) {
    ctx.save();

    let currentEyeRadius = eyeRadius;
    let currentIrisRadius = irisRadiusDefault;
    let currentPupilRadius = pupilRadiusDefault;

    // adjust eye size if surprised
    if (isSurprised) {
        currentEyeRadius = eyeRadius * 1.2;
        currentIrisRadius = irisRadiusDefault * 1.2;
        currentPupilRadius = pupilRadiusDefault * 1.2;
    }

    // draw eye outline
    ctx.beginPath();
    ctx.arc(centerX, centerY, currentEyeRadius, 0, Math.PI * 2);
    ctx.fillStyle = '#FFFFFF';
    ctx.fill();
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 5;
    ctx.stroke();

    // calculate iris position
    let irisX = centerX;
    let irisY = centerY;
    if (isFollowingMouse) {
        let dx = mouseX - centerX;
        let dy = mouseY - centerY;
        let distance = Math.sqrt(dx * dx + dy * dy);
        let maxDistance = currentEyeRadius - currentIrisRadius - 5;
        if (distance > maxDistance) {
            let ratio = maxDistance / distance;
            dx *= ratio;
            dy *= ratio;
        }
        irisX = centerX + dx;
        irisY = centerY + dy;
    } else if (isLookingAround) {
        let maxOffset = currentEyeRadius - currentIrisRadius - 10;
        irisX = centerX + Math.sin(lookAngle) * maxOffset;
    } else if (isIdle) {
        // slightly offset iris position for a natural gaze
        irisX = centerX + (currentEyeRadius - currentIrisRadius - 15) * 0.1;
    }

    // draw iris
    ctx.beginPath();
    ctx.arc(irisX, irisY, currentIrisRadius, 0, Math.PI * 2);
    ctx.fillStyle = '#1E90FF'; // blue iris
    ctx.fill();

    // draw pupil
    ctx.beginPath();
    ctx.arc(irisX, irisY, currentPupilRadius, 0, Math.PI * 2);
    ctx.fillStyle = '#000000';
    ctx.fill();

    // add light reflection
    ctx.beginPath();
    ctx.arc(irisX - currentPupilRadius / 2.5, irisY - currentPupilRadius / 2.5, currentPupilRadius / 3, 0, Math.PI * 2);
    ctx.fillStyle = '#FFFFFF';
    ctx.fill();

    // draw expressions
    if (isBlinking) {
        drawBlink(centerX, centerY, currentEyeRadius);
    } else if (isSleepy) {
        drawSleepyEyelid(centerX, centerY, currentEyeRadius);
    } else if (isBored) {
        drawBoredEyelid(centerX, centerY, currentEyeRadius);
    } else if (isWTF) {
        drawwtfEyebrows(centerX, centerY, currentEyeRadius);
    }

    ctx.restore();
}

function drawBlink(centerX, centerY, radius) {
    let blinkAmount = blinkProgress / 100;

    ctx.save();

    // create clipping region within the eye circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();

    // eyelid color (light gray)
    ctx.fillStyle = '#cccccc';

    // upper eyelid moving down
    ctx.beginPath();
    ctx.rect(centerX - radius, centerY - radius, radius * 2, radius * blinkAmount * 2);
    ctx.fill();

    ctx.restore();
}

function drawSleepyEyelid(centerX, centerY, radius) {
    ctx.save();

    // create clipping region within the eye circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();

    // eyelid color (light gray)
    ctx.fillStyle = '#cccccc';

    // sleepy upper eyelid
    ctx.beginPath();
    ctx.moveTo(centerX - radius, centerY + radius / 3);
    ctx.quadraticCurveTo(centerX, centerY + radius / 2, centerX + radius, centerY + radius / 3);
    ctx.lineTo(centerX + radius, centerY + radius + 1);
    ctx.lineTo(centerX - radius, centerY + radius + 1);
    ctx.closePath();
    ctx.fill();

    ctx.restore();
}

function drawBoredEyelid(centerX, centerY, radius) {
    ctx.save();

    // create clipping region within the eye circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();

    // eyelid color (light gray)
    ctx.fillStyle = '#cccccc';

    // bored upper eyelid
    ctx.beginPath();
    ctx.moveTo(centerX - radius, centerY + radius / 5);
    ctx.quadraticCurveTo(centerX, centerY + radius / 4, centerX + radius, centerY + radius / 5);
    ctx.lineTo(centerX + radius, centerY + radius + 1);
    ctx.lineTo(centerX - radius, centerY + radius + 1);
    ctx.closePath();
    ctx.fill();

    ctx.restore();
}

function drawwtfEyebrows(centerX, centerY, radius) {
    ctx.save();

    // draw wtf eyebrow above the eye
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 5;

    ctx.beginPath();
    // eyebrow slanting down towards center for wtf expression
    ctx.moveTo(centerX - radius / 1.5, centerY - radius * 1.1);
    ctx.lineTo(centerX + radius / 1.5, centerY - radius * 0.9);
    ctx.stroke();

    ctx.restore();
}

function startBlink() {
    if (isBlinking) return;
    isBlinking = true;
    blinkProgress = 0;
    let closing = true;
    let blinkInterval = setInterval(() => {
        if (closing) {
            blinkProgress += 10;
            if (blinkProgress >= 100) {
                blinkProgress = 100;
                closing = false;
            }
        } else {
            blinkProgress -= 10;
            if (blinkProgress <= 0) {
                blinkProgress = 0;
                isBlinking = false;
                clearInterval(blinkInterval);
            }
        }
    }, 30); // adjusted speed for smoother blink
}

canvas.addEventListener('mousemove', function (event) {
    if (!isFollowingMouse) return;
    let rect = canvas.getBoundingClientRect();
    mouseX = event.clientX - rect.left;
    mouseY = event.clientY - rect.top;
});

function setMode(mode) {
    // reset all modes
    isFollowingMouse = false;
    isSurprised = false;
    isSleepy = false;
    isBored = false;
    isIdle = false;
    isLookingAround = false;
    isWTF = false;
    lookPause = false;

    clearInterval(idleBlinkInterval);

    switch (mode) {
        case 'idle':
            isIdle = true;
            idleBlink();
            idleBlinkInterval = setInterval(idleBlink, 4000 + Math.random() * 2000);
            break;
        case 'followMouse':
            isFollowingMouse = true;
            break;
        case 'surprised':
            isSurprised = true;
            break;
        case 'sleepy':
            isSleepy = true;
            break;
        case 'bored':
            isBored = true;
            break;
        case 'wtf':
            isWTF = true;
            break;
        case 'lookAround':
            isLookingAround = true;
            lookAngle = 0; // reset angle
            break;
        default:
            break;
    }
}

function idleBlink() {
    startBlink();
}

document.getElementById('idle').addEventListener('click', function () {
    setMode('idle');
});

document.getElementById('followMouse').addEventListener('click', function () {
    setMode('followMouse');
});

document.getElementById('blink').addEventListener('click', function () {
    startBlink();
});

document.getElementById('surprised').addEventListener('click', function () {
    setMode('surprised');
});

document.getElementById('sleepy').addEventListener('click', function () {
    setMode('sleepy');
});

document.getElementById('bored').addEventListener('click', function () {
    setMode('bored');
});

document.getElementById('wtf').addEventListener('click', function () {
    setMode('wtf');
});

document.getElementById('lookAround').addEventListener('click', function () {
    setMode('lookAround');
});

requestAnimationFrame(draw);
setMode('idle');
