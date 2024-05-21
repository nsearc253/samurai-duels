function rectangularCollision({ rectangle1, rectangle2 }) {
  return (
    rectangle1.attackBox.position.x + rectangle1.attackBox.width >=
      rectangle2.position.x &&
    rectangle1.attackBox.position.x <=
      rectangle2.position.x + rectangle2.width &&
    rectangle1.attackBox.position.y + rectangle1.attackBox.height >=
      rectangle2.position.y &&
    rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height
  )
}

function determineWinner({ player, enemy, timerId }) {
  let winner = '';
  
  clearTimeout(timerId)
  document.querySelector('#displayText').style.display = 'flex'
  if (player.health === enemy.health) {
    document.querySelector('#displayText').innerHTML = 'Tie'
  } else if (player.health > enemy.health) {
    document.querySelector('#displayText').innerHTML = 'Red wins🗿🍷'
  } else if (player.health < enemy.health) {
    document.querySelector('#displayText').innerHTML = 'Blue wins💀'
  }


    
    console.log(`Winner: ${winner}`);

    // Display the winner
    document.getElementById('game-over').innerText = `Winner: ${winner}`;
    
    // Display the restart button
    restartBtn.style.display = 'block';
    restartBtn.addEventListener('click', resetGame);
    
    // Refresh the page after 5 seconds
    setTimeout(() => {
      location.reload();
    }, 10000);
  }

  
let timer = 300
let timerId
function decreaseTimer() {
  if (timer > 0) {
    timerId = setTimeout(decreaseTimer, 1000)
    timer--
    document.querySelector('#timer').innerHTML = timer
  }

  if (timer === 0) {
    determineWinner({ player, enemy, timerId })
  }
}

