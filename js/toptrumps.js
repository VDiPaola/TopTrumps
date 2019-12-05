//stat template e.g. statTemplate.replace("STAT", "Health: 10")
let statTemplate = "<div class='flexBox'>STAT</div>"

//Topics / cards


//global variables
let cards = [];
let topics = ["dinosaurs", "animals"];
let topicChoice;
let topicArray = [dinosaurs, animals];
//arrays to put selected cards
let player = [];
let computer = [];

let foundTopic = false;
let playersTurn = true;

//stores cards that are tied
let pile = [];

//keep asking user for topic until they pick a valid one
while(!foundTopic){
  topicChoice = prompt("type a topic: " + topics.join(","));
  topicChoice = topicChoice.toLowerCase();
  if(topics.includes(topicChoice)){
    foundTopic = true;
  }
}
//set cards to the array of cards depending on topic player chose
cards = topicArray[topics.indexOf(topicChoice)]

//functions that return all the stat names of a card
function getStats(card){
    return Object.keys(card);
}

//functions that returns the object value depending on the key
function returnValue(key){
    return player[player.length-1][key]
}

//update stats function to change UI
function updateUI(){
    //promise as UI doesnt update between alerts unless it waits
    return new Promise((resolve, reject)=>{

        //gets an array of all the stats from current card
        let playersCurrentCard = getStats(player[player.length-1]);
        //clear card stats
        document.getElementById("cardStats").innerHTML = "";
        //loops through each stats
        for(i=0;i<playersCurrentCard.length;i++){
            if(i==0){
                //updates name
                document.getElementById("cardName").innerHTML = returnValue(playersCurrentCard[i]);
            }else{
                //adds stat to html
                let tempStat = playersCurrentCard[i] + ": " + returnValue(playersCurrentCard[i])
                let statString = statTemplate.replace("STAT", tempStat);
                document.getElementById("cardStats").innerHTML += statString;
            }
        }

        //add click event for each stat
        let buttons = document.getElementsByClassName("flexBox");

        for(i=0;i<buttons.length;i++){
            buttons[i].addEventListener("click", statClick );
        }

        //update image
        let image = document.getElementById("cardImage").style;

        image.backgroundImage = "URL(images/" + topicChoice + "/" + player[player.length-1]["name"] + ".jpg)" ;


        //update pile element
        let pileDiv = document.getElementById("pile").innerHTML = "Number of cards in pile: " + pile.length;

        //updates player and computer card amounts
        document.getElementById("playerCards").innerHTML = "your cards: " + player.length;
        document.getElementById("computerCards").innerHTML = "computers cards: " + computer.length;

        //sets delay to give time for the UI to update
        setTimeout(() => {
            resolve();
        }, 1000);
    
    });

}


//give player and computer cards
for(x=0;x<2;x++){
    //get copy of all cards
    let copyCards = cards.slice(0);
    let iterations = copyCards.length

    for(let i=0;i<iterations;i++){
        //picks random card index
        let rndNum = Math.floor(Math.random() * copyCards.length)
        //first loop it gives player the card every even number
        //and every odd number on the second loop so they have the same amount
        if(i % 2 == 0 && x == 0 || !(i % 2 == 0) && x == 1){
            player.unshift(copyCards[rndNum])
        }else{
            computer.unshift(copyCards[rndNum])
        }
        //remove card from array
        copyCards.splice(rndNum,1);

    }
}

updateUI();


//function for when user clicks a stat -USERS TURN
function statClick(){
    if(playersTurn){
        playersTurn = false;
        //get stat name
        let stats = this.innerHTML.split(": ");
        let statName = stats[0];

        //handles who wins
        whoWins(statName);

        //starts computers turn
        computerTurn();
    }
}

//function that returns whos card is higher
function whoWins(statName){

    //gets stats from statName
    let computerStat = computer[computer.length-1][statName];
    let statValue = player[player.length-1][statName];

    //takes comma out of string before converting to number
    statValue = String(statValue).replace(",", "");
    computerStat = String(computerStat).replace(",", "");

    //makes sure stats are numbers
    statValue = Number(statValue);
    computerStat = Number(computerStat);
    console.log("stat: " + statName + "\nplayers stat: " + statValue + "\ncomputers stat: " + computerStat);
    
    //compares computers and players stat
    if(statValue > computerStat){
        //player wins
        alert("your card was higher!");
        //gives player computers card
        player.unshift(computer[computer.length-1]);
        computer.pop();

        //puts players card to back
        let currCard = player[player.length-1];
        player.pop();
        player.unshift(currCard);

        //if theres cards in pile the player takes them
        pile.forEach((item,index)=>{
            player.unshift(item);
        })
        pile = [];
    }else if(computerStat > statValue){
        //computer wins
        alert("the computers card was higher");
        //gives computer players card
        computer.unshift(player[player.length-1]);
        player.pop();

        //puts computers card to back
        let currCard = computer[computer.length-1];
        computer.pop();
        computer.unshift(currCard);

        //if theres cards in pile computer takes them
        pile.forEach((item,index)=>{
            computer.unshift(item);
        })
        pile = [];
    }else{
        //tie
        alert("its a tie!");
        //puts both their cards into pile array
        pile.unshift(computer[computer.length-1]);
        pile.unshift(player[player.length-1]);
        computer.pop();
        player.pop();
    }

    //checks if someone wins
    win();
    
}


//function for computers turn -COMPUTERS TURN
async function computerTurn(){
    //picks random stat
    let stats = getStats(cards[0]);
    let rndNum = (Math.floor(Math.random() * (stats.length-1) ))+1;

    await updateUI();

    alert("computer picks the " + stats[rndNum] + " stat");
    whoWins(stats[rndNum]);

    await updateUI();

    playersTurn = true;
}

//checks win condition
function win(){
    if(player.length == 0){
        //player loses
        alert("You have lost :(\npress ok to restart");
        location.reload();
    }else if(computer.length == 0){
        //player wins
        alert("YOU WIN!\npress ok to restart");
        location.reload();
    }
}