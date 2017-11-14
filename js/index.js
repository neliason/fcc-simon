var count = 0;
var sequence = [];
var playerSequence = [];
var isStarted = false;
var soundUrl = "https://s3.amazonaws.com/freecodecamp/simonSound"; //insert 1-4
var timoutLength = 500;
var pressedColors = ["green", "red", "yellow", "blue"];
var restingColors = ["darkgreen", "darkred", "gold", "darkblue"];
var replayActive = false;
var strictMode = false;

$(document).ready(function() {
  var sequenceTimeout;
  var sequenceHelperDownTimeout;
  var sequenceHelperUpTimeout;
  disableColorButtons();
  disableControlButtons();
  
  $("#power-switch").on("change", function() {
    if($(this).prop("checked")) {
      enableControlButtons()
      
      $("#count-box").css({
        "color": "red"
      })
    } else {
      reset();
      turnOff();
    }
  });
  
  $("#start-btn").on("click", function() {
    if(!isStarted) {
      isStarted = true;
      addToSequence();
      playSequence();
    } else {
      reset();
      addToSequence();
      playSequence();
    }
  });
  
  $("#strict-btn").on("click", function() {
    strictMode = !strictMode;
    if(strictMode) {
      $("#strict-light").css({
        "background": "red"
      });
    } else {
      $("#strict-light").css({
        "background": "darkred"
      });
    }
  });
  
  $("#color-btn-0").mousedown(function() {
    colorButtonDown(0, "player");
  });
  
  $('#color-btn-0').click(function() {
    colorButtonUp(0, "player");
  });
  
  $("#color-btn-1").mousedown(function() {
    colorButtonDown(1, "player");
  });
  
  $('#color-btn-1').mouseup(function() {
    colorButtonUp(1, "player");
  });
  
  $("#color-btn-2").mousedown(function() {
    colorButtonDown(2, "player");
  });
  
  $('#color-btn-2').mouseup(function() {
    colorButtonUp(2, "player");
  });
  
  $("#color-btn-3").mousedown(function() {
    colorButtonDown(3, "player");
  });
  
  $('#color-btn-3').mouseup(function() {
    colorButtonUp(3, "player");
  });
});

function colorButtonDown(id, clicker) {
  if (sequenceHelperUpTimeout !== 0 && sequenceHelperDownTimeout !== 0 && sequenceTimeout !== 0) {
    console.log("here: " + id);
    var audio = new Audio(soundUrl + (id + 1) + ".mp3");
    audio.play();
    $("#color-btn-" + id).css({
      "background-color": pressedColors[id]
    });
    console.log("replayActive: " + replayActive);
    if(clicker === "player" && !replayActive) {
      playerSequence.push(id);
      console.log(playerSequence);
      
        verifySequence();
      
    }
  }
}

function verifySequence() {
  // improvement: only need to check pressed button
  //console.log("replayActive: " + replayActive);
  if(!replayActive) {
    for(var i = 0; i < playerSequence.length; i++) {
      if(playerSequence[i] !== sequence[i]) {
        replayActive = true;
        setTimeout(function() {
          disableColorButtons();
        }, 500);
        $("#count-box").text("!!");
        setTimeout(function() {
          replay();
          replayActive = false;
        }, 2000);
      } else if(i === sequence.length-1 && playerSequence.length === sequence.length) {
        replayActive = true;
        playerSequence = [];
        addToSequence();
        setTimeout(function() {
          playSequence();
          replayActive = false;
        }, 500);
      }
    }
  }
}

function colorButtonUp(id, clicker) {
  if (sequenceHelperUpTimeout !== 0 && sequenceHelperDownTimeout !== 0 && sequenceTimeout !== 0) {
    console.log(id + " was clicked");
    $("#color-btn-" + id).css({
      "background-color": restingColors[id]
    });
  }
}

function playSequence() {
  console.log(sequence);
  disableControlButtons();
  disableColorButtons();
  sequenceTimeout = setTimeout(function() {
    for(var i = 0; i < sequence.length; i++) {
      playSequenceHelper(i, sequence[i]);
    }
  }, 1000);
  
}

function playSequenceHelper(i, colorIndex) {
  sequenceHelperDownTimeout = setTimeout(function() {
    colorButtonDown(colorIndex, "bot");
  }, 1000 * i * 1.15);
  sequenceHelperUpTimeout = setTimeout(function() {
    colorButtonUp(colorIndex, "bot");
    if(i === sequence.length-1) {
      enableControlButtons();
      enableColorButtons();
    }
  }, 1000 * (i * 1.15 + 1));
}

function addToSequence() {
  var randomColorIndex = Math.floor(Math.random() * 4);
  sequence.push(randomColorIndex);
  count++;
  setCountDisplay();
}

function setCountDisplay() {
  var countDisplay = count;
  if(count < 10) {
    countDisplay = "0" + countDisplay;
  }
  $("#count-box").text(countDisplay);
}

function replay() {
  if(strictMode) {
    reset();
    addToSequence();
  } else {
    playerSequence = [];
    setCountDisplay();
  }
  playSequence();
}

function reset() {
  clearTimeout(sequenceTimeout);
  clearTimeout(sequenceHelperDownTimeout);
  clearTimeout(sequenceHelperUpTimeout);
  sequenceTimeout = 0;
  sequenceHelperDownTimeout = 0;
  sequenceHelperUpTimeout = 0;
  count = 0;
  sequence = [];
  playerSequence = [];
  $("#count-box").text("--");
}

function turnOff() {
  disableControlButtons();
  disableColorButtons();
  $("#count-box").css({
    "color": "darkred"
  });
  isStarted = false;
  for(var i = 0; i < 4; i++) {
    $("#color-btn-" + i).css({
      "background-color": restingColors[i]
    });
  }
}

function disableColorButtons() {
  $('.color-btn').prop('disabled', true);
  for(var i = 0; i < 4; i++) {
    $("#color-btn-" + i).css({
      "background-color": restingColors[i]
    });
  }
}

function enableColorButtons() {
  $('.color-btn').prop('disabled', false);
}

function disableControlButtons() {
  $('.simon-btn').prop('disabled', true);
}

function enableControlButtons() {
  $('.simon-btn').prop('disabled', false);
}