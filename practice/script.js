const container = document.querySelector('container')
const carousel = document.querySelector('carousel')



const divArr = document.querySelectorAll("carousel>*")
const indicators = document.querySelector("indicators")
const pi = Math.PI
const divSize = [60, 80]
const ellipse = [(100-divSize[0])/2, (120-divSize[0])/2, (90-divSize[1])/2, (95-divSize[1])/2]
let dotArr = []
let arrangedArr = []
divArr.forEach(ele => arrangedArr.push(ele))
const shiftAngle = 2*pi/arrangedArr.length

function select(ind) {
 dotArr.forEach(ele => ele.style.opacity = 0.5)
 dotArr[ind].style.opacity = 1
}

function update(ele, x, y, w=divSize[0], h=divSize[1]) {
      ele.style.marginLeft = `${x}vw`
      ele.style.marginTop = `${y}vh`
      ele.style.width = `${w}vw`
      ele.style.height = `${h}vh`
}




arrangedArr.forEach((ele,ind) => {
 let adjustedAngle = pi/2+ind*shiftAngle
   let sizeFactor = Math.sin(adjustedAngle)*0.30+0.70
   let x = -ellipse[1]*Math.cos(adjustedAngle)+ellipse[0]+ellipse[1]*(1-sizeFactor)
   let y = ellipse[3]*Math.sin(adjustedAngle)+ellipse[2]
   update(ele, x, y, sizeFactor*divSize[0], sizeFactor*divSize[1])
   ele.style.zIndex = Math.floor(Math.sin(adjustedAngle)*10)-10
   ele.style.opacity = Math.sin(adjustedAngle)*0.25+0.75
   let dot = document.createElement("dot")
   indicators.appendChild(dot)
   dotArr.push(dot)
   ele.style.setProperty('--size', sizeFactor)
   let footer = document.createElement("footer")
   footer.textContent = "Sample Footer"
   ele.appendChild(footer)
})

function rotate(amt) {
  ticker -= amt
  angle = ticker+pi/2
  arrangedArr.forEach((ele,ind) => {

    let adjustedAngle = angle+ind*shiftAngle
    let sizeFactor = Math.sin(adjustedAngle)*0.30+0.70
    let opacity = Math.sin(adjustedAngle)*0.25+0.75
    let x = -ellipse[1]*Math.cos(adjustedAngle)+ellipse[0]+ellipse[1]*(1-sizeFactor), y = ellipse[3]*Math.sin(adjustedAngle)+ellipse[2]
    update(ele, x, y, sizeFactor*divSize[0], sizeFactor*divSize[1])
    ele.style.zIndex = Math.floor(Math.sin(adjustedAngle)*10)-10
    ele.style.opacity = opacity
    if (opacity>0.963) select(ind)
    ele.style.setProperty('--size', sizeFactor)
  })
 }


select(0)
let ticker = 0
let autoscroll = false

if (autoscroll) {
  scrollTimeout = setTimeout(() => {
   passiveScroll = setInterval(() => {
     rotate(0.000628)
   }, 10)
  }, 100)
}


container.addEventListener("wheel", event => {
 rotate(event.deltaY/500)
 clearInterval(passiveScroll)
 clearTimeout(scrollTimeout)
 if (autoscroll) {
  scrollTimeout = setTimeout(() => {
    passiveScroll = setInterval(() => {
      rotate(0.000628)
    }, 10)
  }, 2000)
}
 })