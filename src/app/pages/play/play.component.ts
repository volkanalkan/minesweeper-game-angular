import { Component, OnInit } from '@angular/core';
import { NgIf, NgFor } from '@angular/common';

interface Cell {
  isRevealed: boolean;
  isMine: boolean;
  isFlagged: boolean;
  adjacentMines: number;
}

@Component({
  selector: 'app-play',
  standalone: true,
  imports: [NgIf, NgFor],
  templateUrl: './play.component.html',
  styleUrls: ['./play.component.css'],
})
export class PlayComponent implements OnInit {
  grid: Cell[][] | null = null;
  rows: number = 8;
  cols: number = 8;
  mines: number = 10;
  score: number = 0;
  time: number = 0;
  timer: any;
  gameOver: boolean = false;

  ngOnInit() {
    this.resetGame();
  }

  startGame(difficulty: string) {
    if (difficulty === 'easy') {
      this.rows = 8;
      this.cols = 8;
      this.mines = 10;
    } else if (difficulty === 'hard') {
      this.rows = 16;
      this.cols = 16;
      this.mines = 40;
    }
    this.resetGame();
  }

  resetGame() {
    this.grid = this.generateGrid();
    this.score = 0;
    this.time = 0;
    this.gameOver = false;
    if (this.timer) {
      clearInterval(this.timer);
    }
    this.timer = setInterval(() => {
      if (!this.gameOver) {
        this.time++;
      }
    }, 1000);
  }

  generateGrid(): Cell[][] {
    const grid: Cell[][] = Array.from({ length: this.rows }, () =>
      Array.from(
        { length: this.cols },
        (): Cell => ({
          isRevealed: false,
          isMine: false,
          isFlagged: false,
          adjacentMines: 0,
        })
      )
    );

    let minesPlaced = 0;
    while (minesPlaced < this.mines) {
      const row = Math.floor(Math.random() * this.rows);
      const col = Math.floor(Math.random() * this.cols);
      if (!grid[row][col].isMine) {
        grid[row][col].isMine = true;
        minesPlaced++;
      }
    }

    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        grid[i][j].adjacentMines = this.countAdjacentMines(grid, i, j);
      }
    }

    return grid;
  }

  countAdjacentMines(grid: Cell[][], row: number, col: number): number {
    let count = 0;
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        const r = row + i;
        const c = col + j;
        if (
          r >= 0 &&
          r < this.rows &&
          c >= 0 &&
          c < this.cols &&
          grid[r][c].isMine
        ) {
          count++;
        }
      }
    }
    return count;
  }

  revealCell(row: number, col: number) {
    if (
      this.gameOver ||
      this.grid![row][col].isRevealed ||
      this.grid![row][col].isFlagged
    ) {
      return;
    }

    const cell = this.grid![row][col];
    cell.isRevealed = true;

    if (cell.isMine) {
      this.gameOver = true;
      clearInterval(this.timer);
      this.revealAllMines();
      setTimeout(() => alert('Game Over'), 100);
    } else {
      this.score++;
      if (cell.adjacentMines === 0) {
        this.revealAdjacentCells(row, col);
      }
    }
  }

  revealAdjacentCells(row: number, col: number) {
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        const r = row + i;
        const c = col + j;
        if (
          r >= 0 &&
          r < this.rows &&
          c >= 0 &&
          c < this.cols &&
          !this.grid![r][c].isRevealed
        ) {
          this.revealCell(r, c);
        }
      }
    }
  }

  revealAllMines() {
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        if (this.grid![i][j].isMine) {
          this.grid![i][j].isRevealed = true;
        }
      }
    }
  }

  toggleFlag(event: MouseEvent, row: number, col: number) {
    event.preventDefault();
    if (this.gameOver || this.grid![row][col].isRevealed) {
      return;
    }
    this.grid![row][col].isFlagged = !this.grid![row][col].isFlagged;
  }
}
