import React from "react";
import { Game } from "game/game";
import Board from "components/Game/board";

type PositionProps = {
  game: Game;
  updateGame: (value: Game) => void;
};

type PositionState = {
  selectingCap: {
    koma: number;
    owner: number;
  } | null;
};

export default class Position extends React.Component<
  PositionProps,
  PositionState
> {
  constructor(props: PositionProps) {
    super(props);
    this.state = { selectingCap: null };
    this.capClick = this.capClick.bind(this);
  }

  capClick(koma: number, owner: number): void {
    console.log(koma, owner);
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

  render(): JSX.Element {
    return (
      <Board
        game={this.props.game}
        selectingCap={this.state.selectingCap}
        capClick={this.capClick}
      />
    );
  }
}
