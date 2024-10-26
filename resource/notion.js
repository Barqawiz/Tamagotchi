/**
 * MIT License
 * Copyright (c) 2024 github.com/Barqawiz/
 * **/
let notionAI;
let sketchStarted = false;

// Whisper font
WebFont.load({
    google: {
        families: ['Whisper']
    },
    active: function() {
        if (!sketchStarted) {
            new p5(sketch);
            sketchStarted = true;
        }
    }
});

function sketch(p) {
    p.setup = function() {
        p.createCanvas(400, 400).parent(document.body);
        p.frameRate(24);
        notionAI = new NotionAI(p);
    };

    p.draw = function() {
        p.background(255);
        notionAI.update();
        notionAI.draw();
    };

    // expose setAction to the global scope
    window.setAction = function(action) {
        notionAI.setAction(action);
    };

    class NotionAI {
        constructor(p) {
            this.p = p;
            this.x = p.width / 2;
            this.y = p.height / 2;
            this.scaleFactor = 2;
            this.frameCount = 0;
            this.blinkTimer = 0;
            this.blinkInterval = p.random(100, 200);
            this.currentAction = 'idle';
            this.browWaveOffset = 0;
            this.browWaveDirection = 1;
            this.eyeBlink = false;
            this.typingText = '';
            this.typingIndex = 0;
            this.typingTimer = 0;
            this.faceTilt = 0;
            this.errorTranslateY = 0;
            this.errorRotation = 0;
        }

        setAction(action) {
            this.currentAction = action;
            this.frameCount = 0;
            this.browWaveOffset = 0;
            this.blinkTimer = 0;
            this.eyeBlink = false;
            this.typingText = '';
            this.typingIndex = 0;
            this.typingTimer = 0;
            this.faceTilt = 0;
            this.errorTranslateY = 0;
            this.errorRotation = 0;
        }

        update() {
            this.frameCount++;

            if (this.currentAction === 'idle') {
                this.blinkTimer++;
                if (this.blinkTimer > this.blinkInterval) {
                    this.eyeBlink = true;
                    if (this.blinkTimer > this.blinkInterval + 5) {
                        this.eyeBlink = false;
                        this.blinkTimer = 0;
                        this.blinkInterval = this.p.random(100, 200);
                    }
                }
            }

            if (this.currentAction === 'thinking') {
                this.browWaveOffset += 0.1 * this.browWaveDirection;
                if (this.browWaveOffset > this.p.PI / 4 || this.browWaveOffset < -this.p.PI / 4) {
                    this.browWaveDirection *= -1;
                }
            }

            if (this.currentAction === 'typing') {
                this.typingTimer++;
                if (this.typingTimer % 5 === 0 && this.typingIndex < 10) {
                    this.typingText += String.fromCharCode(97 + Math.floor(this.p.random(0, 26)));
                    this.typingIndex++;
                }
                if (this.typingIndex >= 10) {
                    this.typingText = '';
                    this.typingIndex = 0;
                }
            }

            if (this.currentAction === 'uncertain') {
                if (this.frameCount < 30) {
                    this.faceTilt = this.p.map(this.frameCount, 0, 30, 0, -0.2);
                } else {
                    this.faceTilt = -0.2;
                }
            } else {
                this.faceTilt = 0;
            }

            if (this.currentAction === 'error') {
                if (this.frameCount < 30) {
                    this.errorTranslateY = this.frameCount;
                    this.errorRotation = this.p.radians(this.frameCount * 5);
                } else if (this.frameCount < 60) {
                    this.errorTranslateY = 60 - this.frameCount;
                    this.errorRotation = this.p.radians((60 - this.frameCount) * 5);
                } else {
                    this.errorTranslateY = 0;
                    this.errorRotation = 0;
                    this.setAction('idle');
                }
            } else {
                this.errorTranslateY = 0;
                this.errorRotation = 0;
            }
        }

        draw() {
            this.p.push();
            this.p.translate(this.x, this.y);
            this.p.scale(this.scaleFactor);
            this.p.rotate(this.faceTilt);

            this.p.translate(0, this.errorTranslateY);
            this.p.rotate(this.errorRotation);

            this.p.stroke(0);
            this.p.strokeWeight(2);
            this.p.noFill();

            this.drawNose();
            this.drawEyes();
            this.drawEyebrows();
            this.drawMouth();

            if (this.currentAction === 'typing') {
                this.drawTypingAnimation();
            }

            this.p.pop();
        }

        drawNose() {
            this.p.push();
            this.p.strokeWeight(4);
            this.p.beginShape();
            this.p.vertex(0, -10);
            this.p.quadraticVertex(10, -5, 0, 10);
            this.p.endShape();
            this.p.pop();
        }

        drawEyes() {
            this.p.fill(0);
            this.p.noStroke();
            let eyeOffsetX = 20;
            let eyeOffsetY = -15;

            if (this.eyeBlink) {
                this.p.rect(-eyeOffsetX - 5, eyeOffsetY, 10, 2);
                this.p.rect(eyeOffsetX - 5, eyeOffsetY, 10, 2);
            } else {
                this.p.ellipse(-eyeOffsetX, eyeOffsetY, 5, 5);
                this.p.ellipse(eyeOffsetX, eyeOffsetY, 5, 5);
            }
        }

        drawEyebrows() {
            this.p.stroke(0);
            this.p.strokeWeight(2);
            let browOffsetX = 18;
            let browOffsetY = -25;

            if (this.currentAction === 'thinking') {
                let offset = this.p.sin(this.frameCount * 0.2) * 5;
                this.drawCurvedEyebrow(-browOffsetX, browOffsetY + offset, -10, -35 + offset);
                this.drawCurvedEyebrow(browOffsetX, browOffsetY - offset, 10, -35 - offset);
            } else if (this.currentAction === 'curious') {
                this.drawCurvedEyebrow(-browOffsetX, browOffsetY - 5, -10, browOffsetY - 15);
                this.drawCurvedEyebrow(browOffsetX, browOffsetY + 5, 10, browOffsetY + 5);
            } else if (this.currentAction === 'surprised') {
                this.drawCurvedEyebrow(-browOffsetX, browOffsetY - 10, -10, browOffsetY - 10);
                this.drawCurvedEyebrow(browOffsetX, browOffsetY - 10, 10, browOffsetY - 10);
            } else if (this.currentAction === 'uncertain') {
                this.drawCurvedEyebrow(-browOffsetX, browOffsetY + 5, -10, browOffsetY);
                this.drawCurvedEyebrow(browOffsetX, browOffsetY + 5, 10, browOffsetY);
            } else if (this.currentAction === 'confident') {
                this.drawCurvedEyebrow(-browOffsetX, browOffsetY - 5, -10, browOffsetY - 15);
                this.drawCurvedEyebrow(browOffsetX, browOffsetY - 5, 10, browOffsetY - 15);
            } else if (this.currentAction === 'excited') {
                this.drawCurvedEyebrow(-browOffsetX, browOffsetY - 15, -10, browOffsetY - 25);
                this.drawCurvedEyebrow(browOffsetX, browOffsetY - 15, 10, browOffsetY - 25);
            } else {
                this.drawCurvedEyebrow(-browOffsetX, browOffsetY, -10, browOffsetY);
                this.drawCurvedEyebrow(browOffsetX, browOffsetY, 10, browOffsetY);
            }
        }

        drawCurvedEyebrow(startX, startY, endX, endY) {
            this.p.beginShape();
            this.p.curveVertex(startX - 5, startY);
            this.p.curveVertex(startX, startY);
            this.p.curveVertex(endX, endY);
            this.p.curveVertex(endX + 5, endY);
            this.p.endShape();
        }

        drawMouth() {
            this.p.noFill();
            this.p.stroke(0);
            this.p.strokeWeight(2);

            if (this.currentAction === 'satisfaction') {
                this.p.arc(0, 20, 20, 10, 0, this.p.PI);
            } else if (this.currentAction === 'surprised') {
                this.p.ellipse(0, 20, 5, 5);
            } else if (this.currentAction === 'uncertain') {
                this.p.arc(0, 25, 20, 10, this.p.PI, this.p.TWO_PI);
            } else if (this.currentAction === 'confident') {
                // No mouth
            } else if (this.currentAction === 'excited') {
                this.p.arc(0, 20, 20, 15, 0, this.p.PI);
            } else {
                // No mouth for other states
            }
        }

        drawTypingAnimation() {
            this.p.push();
            this.p.translate(0, 30); // reduced vertical offset
            this.p.fill(0);
            this.p.noStroke();
            this.p.textSize(16); // increased font size
            this.p.textAlign(this.p.CENTER);

            this.p.textFont('Whisper');

            this.p.text(this.typingText + '_', 0, 0);
            this.p.pop();
        }
    }
}
