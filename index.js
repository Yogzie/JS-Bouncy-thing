const canvas = document.getElementById("canvasObject");
const view = canvas.getContext("2d")

const lineRange = 600
const particleCount = 20
const radius = 80


window.addEventListener("resize", resizeCanvas)


function resizeCanvas()
{
    canvas.height = innerHeight
    canvas.width = innerWidth
    applyLineStyle()
};

function applyLineStyle(){
    view.strokeStyle = "white"
    view.lineWidth = 2
    view.lineCap = "round"

    view.fillStyle = "white"

}

function between(x, min, max){
    return x >= min && x <= max
}


resizeCanvas()

class Mouse {
    x = 0
    y = 0

    update(x, y){
        this.x = x
    }
    
}

const mouse = new Mouse()
const array = new Array()

class Line {
    startX = 0
    startY = 0
    endX = 0
    endY = 0

    update(sX, sY, eX, eY){
        this.startX = sX
        this.startY = sY
        this.endX = eX
        this.endY = eY 
    }

    draw(startX, startY, endX, endY) {
        this.update(startX, startY, endX, endY)

        view.beginPath()
        view.moveTo(this.startX, this.startY)
        view.lineTo(this.endX, this.endY)
        view.strokeStyle = "rgba(255,255,255,0.2)"
         
        view.lineWidth = 10
        
        view.stroke()
    }
}


class Ball {
    radius = 0

    constructor() {
        this.x = canvas.width * Math.random()
        this.y = canvas.height * Math.random()

        this.dx = 2 * Math.random() - 1
        this.dy = 2 * Math.random() - 1
        
        this.radius = radius
        this.attachedLine = new Line

    }

    /**
     * 
     */
    update() {

        if (this.y > (canvas.height - this.radius)){
            this.dy = -this.dy
        }else if (this.y < (0 + this.radius)){
            this.dy = -this.dy
        }else if (this.x > (canvas.width - this.radius)){
            this.dx = -this.dx
        }else if (this.x < (0 + this.radius)){
            this.dx = -this.dx
        }

        this.x += this.dx
        this.y += this.dy


    }

    shrink(arrayRef){

        if (this.radius < 1){
            this.stopRendering(arrayRef)
        }
        this.radius = this.radius - 0.05
    }

    /**
     * 
     */
    draw() {
        this.update()

        view.beginPath()
        view.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        view.fill()
    }

    stopRendering(arrayRef){
        array.splice(arrayRef, 1)
    }
}





for (let index = 0; index < particleCount; index++) {
    const b = new Ball()
    array[index] = b
}

function bounce(){

}

function moveShape(){

    view.clearRect(0,0,canvas.width, canvas.height)    
    let elementCount = 0
    array.forEach(element => {
        element.draw(element)
        let currentElementX = element.x
        let currentElementY = element.y
        let otherElementCount = 0
        array.forEach(otherElement => {
            let tX = otherElement.x
            let tY = otherElement.y
            if (otherElement == element) {
                return
            }

            if (between(currentElementX, tX - (otherElement.radius + element.radius), tX + (otherElement.radius + element.radius))){
                if (between(currentElementY, tY - (otherElement.radius + element.radius), tY + (otherElement.radius + element.radius))){
                    // Draw a line between these elements
                    element.shrink(elementCount)
                    otherElement.shrink(otherElementCount)

                } 
            }

            if (between(currentElementX, tX - lineRange, tX + lineRange)){
                if (between(currentElementY, tY - lineRange, tY + lineRange)){
                    // Draw a line between these elements
                    element.attachedLine.draw(element.x, element.y, otherElement.x, otherElement.y)
                } 
            }
            otherElementCount++
        });
        elementCount++
        
    });

    requestAnimationFrame(moveShape)
}



moveShape()