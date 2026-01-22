class Munkres {
  constructor() {
    this.C = null;
    this.row_covered = [];
    this.col_covered = [];
    this.n_rows = 0;
    this.n_cols = 0;
    this.path = [];
    this.marked = [];
  }

  compute(costMatrix) {
    const C = this.padMatrix(costMatrix);
    this.n_rows = C.length;
    this.n_cols = C[0].length;
    this.C = C;

    this.row_covered = new Array(this.n_rows).fill(false);
    this.col_covered = new Array(this.n_cols).fill(false);
    this.marked = Array.from({ length: this.n_rows }, () => new Array(this.n_cols).fill(0));
    this.path = Array.from({ length: this.n_rows * this.n_cols }, () => [0, 0]);

    let step = 1;
    while (true) {
      switch (step) {
        case 1: step = this.step1(); break;
        case 2: step = this.step2(); break;
        case 3: step = this.step3(); break;
        case 4: step = this.step4(); break;
        case 5: step = this.step5(); break;
        case 6: step = this.step6(); break;
        case 7: 
          const results = [];
          for (let r = 0; r < costMatrix.length; r++) {
            for (let c = 0; c < costMatrix[0].length; c++) {
              if (this.marked[r][c] === 1) {
                results.push([r, c]);
              }
            }
          }
          return results;
        default: return [];
      }
    }
  }
  padMatrix(matrix) {
    const rows = matrix.length;
    const cols = matrix[0].length;
    const size = Math.max(rows, cols);
    const newMatrix = Array.from({ length: size }, (_, r) => {
        if (r < rows) {
            return [...matrix[r], ...new Array(size - cols).fill(9999999)];
        } else {
            return new Array(size).fill(9999999);
        }
    });
    return newMatrix;
  }

  step1() {
    for (let r = 0; r < this.n_rows; r++) {
      let minVal = Math.min(...this.C[r]);
      for (let c = 0; c < this.n_cols; c++) {
        this.C[r][c] -= minVal;
      }
    }
    return 2;
  }

  step2() {
    for (let r = 0; r < this.n_rows; r++) {
      for (let c = 0; c < this.n_cols; c++) {
        if (this.C[r][c] === 0 && !this.row_covered[r] && !this.col_covered[c]) {
          this.marked[r][c] = 1;
          this.row_covered[r] = true;
          this.col_covered[c] = true;
          break;
        }
      }
    }
    this.row_covered.fill(false);
    this.col_covered.fill(false);
    return 3;
  }

  step3() {
    let count = 0;
    for (let r = 0; r < this.n_rows; r++) {
      for (let c = 0; c < this.n_cols; c++) {
        if (this.marked[r][c] === 1) {
          this.col_covered[c] = true;
          count++;
        }
      }
    }
    return count >= this.n_cols ? 7 : 4;
  }

  step4() {
    let row = -1, col = -1;
    while (true) {
      const pos = this.findZero();
      row = pos[0]; col = pos[1];
      if (row === -1) return 6;

      this.marked[row][col] = 2;
      const starCol = this.findStarInRow(row);
      if (starCol !== -1) {
        col = starCol;
        this.row_covered[row] = true;
        this.col_covered[col] = false;
      } else {
        this.path_row_0 = row;
        this.path_col_0 = col;
        return 5;
      }
    }
  }

  step5() {
    let r = -1, c = -1;
    let count = 0;
    this.path[count][0] = this.path_row_0;
    this.path[count][1] = this.path_col_0;
    
    while (true) {
      const row = this.findStarInCol(this.path[count][1]);
      if (row === -1) break;
      count++;
      this.path[count][0] = row;
      this.path[count][1] = this.path[count - 1][1];
      
      const col = this.findPrimeInRow(this.path[count][0]);
      count++;
      this.path[count][0] = this.path[count - 1][0];
      this.path[count][1] = col;
    }

    for (let i = 0; i <= count; i++) {
      const [pr, pc] = this.path[i];
      if (this.marked[pr][pc] === 1) this.marked[pr][pc] = 0;
      else this.marked[pr][pc] = 1;
    }

    this.row_covered.fill(false);
    this.col_covered.fill(false);
    for (let i = 0; i < this.n_rows; i++) {
        for(let j = 0; j < this.n_cols; j++) {
            if(this.marked[i][j] === 2) this.marked[i][j] = 0;
        }
    }
    return 3;
  }

  step6() {
    let minVal = Infinity;
    for (let r = 0; r < this.n_rows; r++) {
      if (!this.row_covered[r]) {
        for (let c = 0; c < this.n_cols; c++) {
          if (!this.col_covered[c]) {
            if (this.C[r][c] < minVal) minVal = this.C[r][c];
          }
        }
      }
    }
    for (let r = 0; r < this.n_rows; r++) {
      for (let c = 0; c < this.n_cols; c++) {
        if (this.row_covered[r]) this.C[r][c] += minVal;
        if (!this.col_covered[c]) this.C[r][c] -= minVal;
      }
    }
    return 4;
  }

  findZero() {
    for (let r = 0; r < this.n_rows; r++) {
      if (!this.row_covered[r]) {
        for (let c = 0; c < this.n_cols; c++) {
          if (!this.col_covered[c] && this.C[r][c] === 0) return [r, c];
        }
      }
    }
    return [-1, -1];
  }

  findStarInRow(row) {
    for (let c = 0; c < this.n_cols; c++) {
      if (this.marked[row][c] === 1) return c;
    }
    return -1;
  }

  findStarInCol(col) {
    for (let r = 0; r < this.n_rows; r++) {
      if (this.marked[r][col] === 1) return r;
    }
    return -1;
  }

  findPrimeInRow(row) {
    for (let c = 0; c < this.n_cols; c++) {
      if (this.marked[row][c] === 2) return c;
    }
    return -1;
  }
}

module.exports = new Munkres();