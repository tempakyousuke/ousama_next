import React from "react";
import { Game } from "game/game";
import Position from "components/Game/position";

type CreateNewState = {
  game: Game;
};
export default class CreateNew extends React.Component<{}, CreateNewState> {
  constructor(props: {}) {
    super(props);
    const game = new Game();
    game.tsumeInitialize();
    this.state = {
      game,
    };
    this.updateGame = this.updateGame.bind(this);
  }

  updateGame(value: Game): void {
    this.setState(() => ({
      game: value,
    }));
  }

  render(): JSX.Element {
    return (
      <>
        <Position game={this.state.game} updateGame={this.updateGame} />
      </>
    );
  }
}
