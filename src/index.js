// We don't need to use the DOMContentLoaded event listener because we placed the scrip tag at the end of the body in our html file. This means that everything would have already been set up prior to the execution of the script (this js file)

// BONUS FEATURE : Record & PlayBack

// Make a variable that's a boolean to tell us whether or not we are recording. And make an array which will hold the collection of events that we're recording.

let recording = false
let playBack = []
let flag = false
let recordingButton = document.getElementsByClassName('recordingButton')

function recordingButtonPressed() {
  recording = !recording
  if (recording === true) {
    playBack = []
    recordingButton[0].classList.add('stopButton')
    recordingButton[0].innerText = "Stop"
  }
  else {
    recordingButton[0].classList.remove('stopButton')
    recordingButton[0].innerText = "Record"
  }
  console.log("is recording", recording)

}

// add an event listener to each key so the key to keep track of css transitions
const keys = Array.from(document.querySelectorAll('.key'));
  keys.forEach(key => key.addEventListener('transitionend', removeTransition))

// The class "playing" has a property called "transform".. if the transition has not yet happened, the property "transform" will not be available. The availability of this property indicates that the transition has occurred. If the transition has occurred, we want it to go back to its default
function removeTransition(e) {
    if (e.propertyName !== 'transform') return;
    e.target.classList.remove('playing');
  }

// when a key is pressed, we want to target the "key" div whose "data-key" attribute has that key code. We want to distinguish between div and audio because they'll both have the same data-key
document.addEventListener('keydown', playSound)

function playSound(event) {
  if (recording === true) {
    playBack.push(event)
  }
  console.log("TIMESTAMP", event.timeStamp)
  let keyCode = event.keyCode
  let key = document.querySelector(`div[data-key= "${keyCode}"]`)
  let audio = document.querySelector(`audio[data-key= "${keyCode}"]`)
  changeKeyCSS(key)
  // setting the current time to 0 makes it so that every time the key is pressed, the sound restarts even if it was already playing
  audio.currentTime = 0;
  audio.play();
}

// Trigger the transition in the CSS by changing the key's className -- have the key get bigger & a yellow border around it --
function changeKeyCSS(key) {
  key.classList.add("playing")
}

// Every event is going through the "playSound" function
function playBackSounds () {
  for (let i = 0; i < playBack.length; i++) {
    if (flag === false) {
      let eventA = playBack[i]

      if (i === 0){
         playSound(eventA)

      }

      if  ((i > 0 ) && (i < playBack.length)) {
        let eventB = playBack[i-1]
        let timeBetweenEvents = (eventA.timeStamp - eventB.timeStamp)

        setTimeout(() => {
            flag = true
            playSound(eventA)
            }, timeBetweenEvents)
        }
    }

  // setTimeOut is probably being a little bword because probably while that execution is still pending, the for-loop continues to run. We might get around this problem by setting up a flag after each time-out that gets taken down at the end of the callback function. If the flag is down, the for loop can continue to run. If the flag is up, we're still in the timeOut function and SHOULD NOT be continuing in the for-loop. We can check for the flag status if we enclose everything in the for-loop inside an if-statement.
  }
}
