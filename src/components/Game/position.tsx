import React from "react";
import { Game } from "game/game";
import Board from "components/Game/board";

type PositionProps = {
  game: Game;
};

type PositionState = {};

export default class Position extends React.Component<
  PositionProps,
  PositionState
> {
  render(): JSX.Element {
    return <Board game={this.props.game} />;
  }
}
