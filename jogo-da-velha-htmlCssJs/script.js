(function Game() {
  // Elementos
  var game = document.getElementById("game");
  var boxes = document.querySelectorAll("li");
  var resetGame = document.getElementById("reset-game");
  var turnDisplay = document.getElementById("whos-turn");
  var gameMessages = document.getElementById("game-messages");
  var playerOneScoreCard = document.getElementById("player-one-score");
  var playerTwoScoreCard = document.getElementById("player-two-score");

  // Vars
  var context = { player1: "x", player2: "o" };
  var board = [];

  var playerOneScore = 0;
  var playerTwoScore = 0;

  var turns;
  var currentContext;

  // Constructor
  var init = function () {
    turns = 0;

    // Obtenha o contexto atual
    currentContext = computeContext();

    // configurar 3 x 3 placa
    board[0] = new Array(3);
    board[1] = new Array(3);
    board[2] = new Array(3);

    // vincular eventos
    for (var i = 0; i < boxes.length; i++) {
      boxes[i].addEventListener("click", clickHandler, false);
    }

    resetGame.addEventListener("click", resetGameHandler, false);
  };

  //Acompanha a vez do jogador
  var computeContext = function () {
    return turns % 2 == 0 ? context.player1 : context.player2;
  };

  // Vincule o elemento dom ao retorno de chamada de clique
  var clickHandler = function () {
    this.removeEventListener("click", clickHandler);

    this.className = currentContext;
    this.innerHTML = currentContext;

    var pos = this.getAttribute("data-pos").split(",");
    board[pos[0]][pos[1]] = computeContext() == "x" ? 1 : 0;

    if (checkStatus()) {
      gameWon();
    }

    turns++;
    currentContext = computeContext();
    turnDisplay.className = currentContext;
  };

  // Verifique se o jogador ganhou
  var checkStatus = function () {
    var used_boxes = 0;

    for (var rows = 0; rows < board.length; rows++) {
      var row_total = 0;
      var column_total = 0;

      for (var columns = 0; columns < board[rows].length; columns++) {
        row_total += board[rows][columns];
        column_total += board[columns][rows];

        if (typeof board[rows][columns] !== "undefined") {
          used_boxes++;
        }
      }

      // Combinação vencedora para cenário diagonal [0,4,8], [2,4,6]
      var diagonal_tl_br = board[0][0] + board[1][1] + board[2][2]; // diagonal superior esquerda para inferior direita
      var diagonal_tr_bl = board[0][2] + board[1][1] + board[2][0]; //diagonal superior direita inferior esquerda

      if (
        diagonal_tl_br == 0 ||
        diagonal_tr_bl == 0 ||
        diagonal_tl_br == 3 ||
        diagonal_tr_bl == 3
      ) {
        return true;
      }

      // Combinação vencedora para linha [0,1,2], [3,4,5], [6,7,8]
      //Combinação vencedora para coluna [0,3,6], [1,4,7], [2,5,8]
      // A única maneira de ganhar é se o total for 0 ou se o total for 3. X vale 1 ponto e O vale 0 pontos
      if (
        row_total == 0 ||
        column_total == 0 ||
        row_total == 3 ||
        column_total == 3
      ) {
        return true;
      }

      // se todas as caixas estiverem cheias - Sorteio!!!
      if (used_boxes == 9) {
        gameDraw();
      }
    }
  };
  var gameWon = function () {
    clearEvents();

    // mostrar mensagem de jogo ganho
    gameMessages.className = "player-" + computeContext() + "-win";

    // atualizar a pontuação do jogador
    switch (computeContext()) {
      case "x":
        playerOneScoreCard.innerHTML = ++playerOneScore;
        break;
      case "o":
        playerTwoScoreCard.innerHTML = ++playerTwoScore;
    }
  };
  // Informa ao usuário quando o jogo está empatado.
  var gameDraw = function () {
    gameMessages.className = "draw";
    clearEvents();
  };

  // Impede que o usuário clique em células vazias após o jogo terminar
  var clearEvents = function () {
    for (var i = 0; i < boxes.length; i++) {
      boxes[i].removeEventListener("click", clickHandler);
    }
  };
  // Reinicie o jogo para jogar novamente
  var resetGameHandler = function () {
    clearEvents();
    init();

    // Examine todos os nós li e remova className de x, o
    // limpar o HTML interno
    for (var i = 0; i < boxes.length; i++) {
      boxes[i].className = "";
      boxes[i].innerHTML = "";
    }

    // Alterar quem volta a classe de volta para player1
    turnDisplay.className = currentContext;
    gameMessages.className = "";
  };

  game && init();
})();
