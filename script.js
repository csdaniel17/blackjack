var deck = [
  { point: 9, suit: 'diamonds' },
  { point: 1, suit: 'spades' },
  { point: 5, suit: 'clubs' },
  { point: 10, suit: 'hearts' },
  { point: 2, suit: 'diamonds' },
  { point: 6, suit: 'clubs' },
  { point: 3, suit: 'hearts' },
  { point: 9, suit: 'spades' }
];

//arrays to deal hands to
var dealerHand = [];
var playerHand = [];

//function to reset game
function resetGame() {
  //reset deck
  deck = [
    { point: 9, suit: 'diamonds' },
    { point: 1, suit: 'spades' },
    { point: 5, suit: 'clubs' },
    { point: 10, suit: 'hearts' },
    { point: 2, suit: 'diamonds' },
    { point: 6, suit: 'clubs' },
    { point: 3, suit: 'hearts' },
    { point: 9, suit: 'spades' }
  ];
  //reset hands
  dealerHand = [];
  playerHand = [];
  //reset points
  $("#player-points").text("");
  $("#dealer-points").text("");
  $("#messages").text("");
  //reset board to empty
  $("#player-hand").html("");
  $("#dealer-hand").html("");

}

//function to deal cards
function dealCard(hand, element) {
  //take a card out of the deck - remove the last card from the deck array
  var card = deck.pop();
  //once you have the card, push it to hand
  hand.push(card);
  //take card & put visual representation on board
  var cardHTML = '<div class="card">' + card.point + ' of ' + card.suit + '</div>';
  $(element). append(cardHTML);
}

//function to get the sum of points - takes a hand (array of cards) and returns the point value of that hand
function calculatePoints(hand) {
  //return the number of points in a hand
  var sum = 0;
  //loop through cards to get sum
  for (var i = 0; i < hand.length; i++) {
    var card = hand[i];
    sum = sum + card.point;
  }
  return sum;
}

//function to display the points - calculate the points using calculatePoints function for both the dealer and the player - it will update the display with those points #dealer-points & #player-points
function displayPoints() {
  var dealerPoints = calculatePoints(dealerHand);
  //update elements with text method
  $("#dealer-points").text(dealerPoints);
  var playerPoints = calculatePoints(playerHand);
  //update elements with text method
  $("#player-points").text(playerPoints);
}

//function to check for busts - calculate points and see if it is above 21 - return true if there is a bust, false if no
function checkForBusts() {
  //first check for player bust
  var playerPoints = calculatePoints(playerHand);
  //if above 21
  if (playerPoints > 21) {
    //update messages to say bust
    $("#messages").text("you busted. better luck next time");
    return true;
  }
  //then check for dealer bust
  var dealerPoints = calculatePoints(dealerHand);
  //if above 21
  if (dealerPoints > 21) {
    //update messages to say bust
    $("#messages").text("dealer busted. you win!");
    return true;
  }
  return false;
}

$(function () {
  //when deal button is clicked
  $("#deal-button").click(function () {
    //reset to start game
    resetGame();
    //call dealCard function to deal cards
    dealCard(playerHand, "#player-hand");
    dealCard(dealerHand, "#dealer-hand");
    dealCard(playerHand, "#player-hand");
    dealCard(dealerHand, "#dealer-hand");
    //display the points
    displayPoints();
    //check for busts
    checkForBusts();
  });

  //when hit button is clicked
  $("#hit-button").click(function () {
    //deal a new card to player
    dealCard(playerHand, "#player-hand");
    //display points
    displayPoints();
    //check for busts
    checkForBusts();
  });

  //stand button - player stays and dealer's turn
  $("#stand-button").click(function () {
    //deal cards to dealer, until he has 17pts or more
    var dealerPoints = calculatePoints(dealerHand);
    while (dealerPoints < 17) {
      //keep dealing
      dealCard(dealerHand, "#dealer-hand");
      //recalculate points - to stop loop
      dealerPoints = calculatePoints(dealerHand);
    }
    //calculate points
    displayPoints();
    //check for bust
    if (!checkForBusts()) {
      //determine the winnner
      //get player points
      var playerPoints = calculatePoints(playerHand);
      var dealerPoints = calculatePoints(dealerHand);
      //announce winner
      if (playerPoints > dealerPoints) {
        $("#messages").text("you won!");
      } else if (playerPoints === dealerPoints) {
        $("#messages").text("push");
      } else {
        $("#messages").text("you lose!");
      }
    }
  });
});
