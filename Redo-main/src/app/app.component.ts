import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';

type Player = 'X' | 'O';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  setupForm = this.formBuilder.group({
    boardSize: 3,
    countToWin: 3
  });
  boardSetup = {
    boardSize: 3,
    countToWin: 3
  };
  board: Array<Array<string>> = [];
  player: Player = 'X';
  gameOver = false;
  winner: Player | undefined = undefined;

  constructor(
    private formBuilder: FormBuilder,
  ) {}

  ngOnInit(): void {
    this.newGame();
  }

  newGame(): void {
    this.player = 'X';
    this.gameOver = false;
    this.winner = undefined;
    this.valiadteForm();
    const { boardSize, countToWin } = this.setupForm.value;
    this.boardSetup = { boardSize, countToWin };
    if (boardSize < 2) {
      this.setupForm.setValue({ boardSize, countToWin: boardSize })
    }
    this.board = new Array(boardSize);
    for (let i = 0; i < boardSize; i++) {
      this.board[i] = new Array(boardSize).fill('');
    }
  }

  valiadteForm(): void {
    const { boardSize, countToWin } = this.setupForm.value;
    let validBoardSize = boardSize, validCountToWin = countToWin;
    if (boardSize < 2) {
      validBoardSize = 2;
    }
    if (countToWin < 2) {
      validCountToWin = 2;
    }
    if (validCountToWin > validBoardSize) {
      validCountToWin = validBoardSize;
    }
    if (validBoardSize !== boardSize || validCountToWin !== countToWin) {
      this.setupForm.setValue({ boardSize: validBoardSize, countToWin: validCountToWin })
    }
  }

  play(row: number, col: number): void {
    if (!this.gameOver && this.board[row][col] === '') {
      this.board[row][col] = this.player;
      this.checkGameOver(row, col);
      this.player = this.player === 'X' ? 'O' : 'X';
    }
  }

  checkGameOver(row: number, col: number): void {
    // consecutive in row
    let rowCount = 1, _col = col;
    while (_col + 1 < this.boardSetup.boardSize && this.board[row][_col] === this.board[row][_col + 1]) {
      rowCount++;
      _col++;
    }
    _col = col;
    while (_col - 1 >= 0 && this.board[row][_col] === this.board[row][_col - 1]) {
      rowCount++;
      _col--;
    }
    if (rowCount >= this.boardSetup.countToWin) {
      this.winner = this.player;
      this.gameOver = true;
      return;
    }

    // consecutive in col
    let colCount = 1, _row = row;
    while (_row + 1 < this.boardSetup.boardSize && this.board[_row][col] === this.board[_row + 1][col]) {
      colCount++;
      _row++;
    }
    _row = row;
    while (_row - 1 >= 0 && this.board[_row][col] === this.board[_row - 1][col]) {
      colCount++;
      _row--;
    }
    if (colCount >= this.boardSetup.countToWin) {
      this.winner = this.player;
      this.gameOver = true;
      return;
    }

    // consecutive in diagonal top-left -> bottom-right
    let diagCount = 1;
    _row = row; _col = col;
    while (_row + 1 < this.boardSetup.boardSize && _col + 1 < this.boardSetup.boardSize  && this.board[_row][_col] === this.board[_row + 1][_col + 1]) {
      diagCount++;
      _row++;
      _col++;
    }
    _row = row; _col = col;
    while (_row - 1 >= 0 && _col - 1 >= 0 && this.board[_row][_col] === this.board[_row - 1][_col - 1]) {
      diagCount++;
      _row--;
      _col--;
    }
    if (diagCount >= this.boardSetup.countToWin) {
      this.winner = this.player;
      this.gameOver = true;
      return;
    }

    // consecutive in diagonal top-right -> bottom-left
    diagCount = 1; _row = row; _col = col;
    while (_row - 1 >= 0 && _col + 1 < this.boardSetup.boardSize  && this.board[_row][_col] === this.board[_row - 1][_col + 1]) {
      diagCount++;
      _row--;
      _col++;
    }
    _row = row; _col = col;
    while (_row + 1 < this.boardSetup.boardSize && _col - 1 >= 0 && this.board[_row][_col] === this.board[_row + 1][_col - 1]) {
      diagCount++;
      _row++;
      _col--;
    }
    if (diagCount >= this.boardSetup.countToWin) {
      this.winner = this.player;
      this.gameOver = true;
      return;
    }

    // check game over - no winner
    for (let r = 0; r < this.boardSetup.boardSize; r++) {
      for (let c = 0; c < this.boardSetup.boardSize; c++) {
        if (this.board[r][c] === '') {
          // there is still at least one empty cell
          return;
        }
      }
    }
    // no empty cell is left
    this.gameOver = true;
  }
}
