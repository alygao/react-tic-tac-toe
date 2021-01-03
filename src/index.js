import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

/*
class Square extends React.Component {
    // Square no loners keeps track of the game's state
    // constructor(props) {
    //     super(props); // always need to call in JS classes
    //     this.state = {
    //         value:null,
    //     };
    // }


    // Board now has full control over squares
    // Squares = CONTROLLED COMPONENTS
        // Square components receive values from the Board component and 
        // inform the Board component when they’re clicked

    render() {
      return (
        <button 
            className="square" 
             // tell React to re-render whenever button is clicked
            onClick={() => {           
            this.props.onClick();}}
        >
          {this.props.value}
        </button>
      );
    }
  }
*/

function Square(props) {
    console.log("SQUARE WINNER = " + props.winner);
    let winTile = props.winTile;
    if (winTile) {
        return (
            <button className="square" onClick={props.onClick} style={{ color: 'red' }}>
                    {props.value}
                </button>
        )
    } else {
        return (
            <button className="square" onClick={props.onClick}>
                {props.value}
            </button>
        )
    }
}

class Board extends React.Component {
    /* constructor(props) {
        super(props); // always need to call in JS classes
        this.state = {
            squares: Array(9).fill(null),
            xIsNext: true,
        };
    } */

    

    renderSquare(i) {
        //   return <Square value={i} />;
        console.log("BOARD WINNER = " + this.props.winner);
        let winner = this.props.winner;
        if (winner) {
            let winningCombo = this.props.winningCombo;
            if (winningCombo.includes(i)) {
                return (
                    <Square
                        value={this.props.squares[i]}
                        winTile={true}
                        // pass down a function from the Board to the Square, and 
                        // we’ll have Square call that function when a square is clicked
                        onClick={() => this.props.onClick(i)}
                    />
                )
            } else {
                <Square
                        value={this.props.squares[i]}
                        winTile={false}
                        // pass down a function from the Board to the Square, and 
                        // we’ll have Square call that function when a square is clicked
                        onClick={() => this.props.onClick(i)}
                    />
            }
        }
        return (

            <Square
                value={this.props.squares[i]}
                winTile={false}
                // pass down a function from the Board to the Square, and 
                // we’ll have Square call that function when a square is clicked
                onClick={() => this.props.onClick(i)}
            />
        );
    }

    renderSquares(n) {
            let squares = [];
            for (let i = 0; i < 3; i++) {
                squares.push(this.renderSquare(i + n))
            };
            return squares;
        }
        
    renderRows(i) {
        return  <div className="board-row">
                    {this.renderSquares(i)}
                </div>
    }

    render() {
        

        return (    
            <div>
                {this.renderRows(0)}
                {this.renderRows(3)}
                {this.renderRows(6)}
            </div>
        );
    }
}

class Game extends React.Component {
    // Now, give GAME control over board component

    constructor(props) {
        super(props); 
        this.state = {
            history: [{
                squares: Array(9).fill(null),
                positions: [0, 0],
            }],
            // rowMove: 0,
            // colMove: 0,
            stepNumber: 0,
            xIsNext: true,
            ascendingOrder: true,
        }
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        const rowNum = Math.floor (i / 3);
        const colNum = i % 3;
        
        if (calculateWinner(squares) || squares[i]) { // win or draw
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            history: history.concat([{ // concat() doesn't mutate original array
                squares: squares,
                positions:  [colNum, rowNum],
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
        });
    }
    
    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        })
    }

    toggleOrderOfMoves() {
        this.setState({
            ascendingOrder: !this.state.ascendingOrder,
        })
    }
    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];

        const squares = current.squares.slice();

        const winningCombo = calculateWinner(current.squares);
        let winner = null;
        if (winningCombo) {
            winner = squares[winningCombo[0]];
        }

        console.log("GAME WINNER = " + winner);


        let moves = history.map((step, move) => {
            const desc = move ? 
                "Go to move #" + move + ", Position: " + history[move].positions : 
                "Go to game start";
            return (
                <div key={move}>
                    <li >
                        <button onClick={() => this.jumpTo(move)}>
                            {this.state.stepNumber == move ?
                                <b>{desc}</b> :
                                desc
                            }
                           
                        </button>
                    </li>
                </div>
            )
        })
        if (!this.state.ascendingOrder) {
            moves = moves.reverse();
        }
        console.log(moves);
        let status;
        if (winningCombo){ 
            status = "Winner: " + winner;
        } else if (squares.every(element => element !== null)) { // or check if it doesn't include null
            status = "Draw!";
        } else {    
            status = "Next player: " + (this.state.xIsNext ? "X" : "O");
        }


        return (
            <div className="game">
                <div className="game-board">
                    <Board 
                        winningCombo={winningCombo}
                        winner={winner}
                        squares={current.squares}
                        onClick={(i) => this.handleClick(i)}
                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <button onClick={() => this.toggleOrderOfMoves()}>
                        {this.state.ascendingOrder ? "Descending Order" : "Ascending Order"}
                    </button>
                    <ol>{moves}</ol>
                </div>
            </div>
        );
    }
}

// ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);

function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return lines[i];
        }
    }
    return null;
}

