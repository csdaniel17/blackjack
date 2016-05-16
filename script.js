// var deck = [
//   { point: 12, suit: 'diamonds' },
//   { point: 1, suit: 'spades' },
//   { point: 5, suit: 'clubs' },
//   { point: 10, suit: 'hearts' },
//   { point: 2, suit: 'diamonds' },
//   { point: 6, suit: 'clubs' },
//   { point: 3, suit: 'hearts' },
//   { point: 10, suit: 'spades' }
// ];

//arrays to deal hands to
var deck = shuffle(newDeck());
var dealerHand = [];
var playerHand = [];

//function to reset game
function resetGame() {
  //reset deck
  deck = shuffle(newDeck());

  // = [
  //   { point: 12, suit: 'diamonds' },
  //   { point: 1, suit: 'spades' },
  //   { point: 5, suit: 'clubs' },
  //   { point: 10, suit: 'hearts' },
  //   { point: 2, suit: 'diamonds' },
  //   { point: 6, suit: 'clubs' },
  //   { point: 3, suit: 'hearts' },
  //   { point: 10, suit: 'spades' }
  // ];

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
function dealCard(deck, hand, element) {
  //take a card out of the deck - remove the last card from the deck array
  var card = deck.pop();
  //once you have the card, push it to hand
  hand.push(card);
  //take card & put visual representation on board
  var cardName = getCardName(card);
  var imageUrl = getCardImageUrl(card);
  var cardHTML = '<img class="card" src="' + imageUrl + '" alt="' + cardName + ' of ' + card.suit + '">';
  $(element).append(cardHTML);
}

//function to create a deck
function newDeck() {
  var deck = [];
  var suits = ['spades', 'hearts', 'clubs', 'diamonds'];
  for (var point = 1; point <= 13; point++) {
    for (var i = 0; i < suits.length; i++) {
      var suit = suits[i];
      deck.push({point: point, suit: suit});
    }
  }
  return deck;
}

//function to shuffle cards
function shuffle(cards) {
  var newCards = [];
  while (cards.length > 0) {
    var idx = Math.floor(Math.random() * cards.length);
    newCards.push(cards[idx]);
    cards.splice(idx, 1);
  }
  return newCards;
}


//function to get the sum of points - takes a hand (array of cards) and returns the point value of that hand
function calculatePoints(hand) {
  //return the number of points in a hand
  var points = 0;
  //loop through cards to get sum
  for (var i = 0; i < hand.length; i++) {
    var card = hand[i];
    //if you get an ace
    if (card.point === 1) {
      //if the sum + 11 is less than 21, use it as an 11
      if (points + 11 <= 21) {
        points = points + 11
        //otherwise make it a 1
      } else {
        points = points + 1;
      }
    } else if (card.point >= 10) {
      points = points + 10;
    } else {
      points = points + card.point;
    }
  }
  return points;
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

//function to get card name
function getCardName(card) {
  //if card point = 1 -> ace, 1-10 -> number value, 11 jack, 12 queen, 13 king
  if (card.point === 1) {
    return "ace";
  } else if (card.point <= 10) {
    return card.point;
  } else if (card.point === 11) {
    return "jack";
  } else if (card.point === 12) {
    return "queen";
  } else if (card.point === 13) {
    return "king";
  }
}

//function to display card images - takes card object as first argument and will return a string containing the correct image URL for that card
function getCardImageUrl(card) {
  return "images/" + getCardName(card) + "_of_" + card.suit + ".png";
}

$(function () {
  //when deal button is clicked
  $("#deal-button").click(function () {
    //reset to start game
    resetGame();
    var card;
    //call dealCard function to deal cards
    dealCard(deck, playerHand, "#player-hand");
    dealCard(deck, dealerHand, "#dealer-hand");
    dealCard(deck, playerHand, "#player-hand");
    dealCard(deck, dealerHand, "#dealer-hand");
    //display the points
    displayPoints();
    //check for busts
    checkForBusts();
  });

  //when hit button is clicked
  $("#hit-button").click(function () {
    //deal a new card to player
    dealCard(deck, playerHand, "#player-hand");
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
      dealCard(deck, dealerHand, "#dealer-hand");
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
