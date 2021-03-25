import React from "react";
import { Game } from "game/game";
import { WHITE, PLAYER_NONE } from "game/constant";
import Board from "components/Game/board";
import { klona } from "klona";

type PositionProps = {
  game: Game;
  updateGame: (value: Game) => void;
};

type PositionState = {
  selectingCap: {
    koma: number;
    owner: number;
  } | null;
  selectingSquare: number | null;
  showPickupPieces: boolean;
};

export default class Position extends React.Component<
  PositionProps,
  PositionState
> {
  constructor(props: PositionProps) {
    super(props);
    this.state = {
      selectingCap: null,
      selectingSquare: null,
      showPickupPieces: false,
    };
    this.capClick = this.capClick.bind(this);
    this.boardClick = this.boardClick.bind(this);
    this.pickupPieceClick = this.pickupPieceClick.bind(this);
  }

  get selectingPiece(): number {
    return this.props.game.board[this.state.selectingSquare].koma;
  }

  capClick(koma: number, owner: number): void {
    const selectingCap = this.state.selectingCap;
    if (selectingCap === null) {
      if (koma === 0) {
        return;
      }
      this.setState({
        selectingCap: {
          koma,
          owner,
        },
      });
      return;
    }
    if (selectingCap.owner === owner) {
      if (selectingCap.koma === koma) {
        this.setState({
          selectingCap: null,
        });
      }
      if (selectingCap.koma === 0) {
        this.setState({
          selectingCap: null,
        });
      }
      this.setState({
        selectingCap: {
          koma,
          owner,
        },
      });
    }
  }

  boardClick(sq: number): void {
    if (this.state.selectingCap) {
      this.putCapToBoard(sq);
      return;
    }
    if (!this.state.showPickupPieces) {
      if (this.props.game.board[sq].owner !== PLAYER_NONE) {
        this.setState({
          selectingSquare: sq,
          showPickupPieces: true,
        });
      }
      return;
    } else {
      if (this.state.selectingSquare === sq) {
        this.setState({
          selectingSquare: null,
          showPickupPieces: false,
        });
      }
    }
  }

  putCapToBoard(sq: number): void {
    const game = klona(this.props.game);
    const koma = this.state.selectingCap.koma;
    const owner = this.state.selectingCap.owner;
    if (game.board[sq].koma) {
      game.cap[WHITE][game.board[sq].koma]++;
    }
    game.cap[owner][koma]--;
    game.board[sq] = {
      koma,
      owner,
    };
    this.props.updateGame(game);
    this.setState({
      selectingCap: null,
    });
  }

  pickupPieceClick(isPromote: boolean, owner: number): void {
    const game = klona(this.props.game);
    const piece = isPromote
      ? game.getPromotePiece(this.selectingPiece)
      : game.getUnPromotePiece(this.selectingPiece);
    game.board[this.state.selectingSquare].koma = piece;
    game.board[this.state.selectingSquare].owner = owner;
    this.props.updateGame(game);
    this.setState({
      selectingSquare: null,
      showPickupPieces: false,
    });
  }

  render(): JSX.Element {
    return (
      <Board
        game={this.props.game}
        selectingCap={this.state.selectingCap}
        showPickupPieces={this.state.showPickupPieces}
        selectingSquare={this.state.selectingSquare}
        capClick={this.capClick}
        boardClick={this.boardClick}
        pickupPieceClick={this.pickupPieceClick}
      />
    );
  }
}
