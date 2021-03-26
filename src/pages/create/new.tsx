import React from "react";
import { Game } from "game/game";
import Position from "components/Game/position";
import HiButton from "components/Button/hiButton";

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
      <div className="mt-5">
        <Position game={this.state.game} updateGame={this.updateGame} />
        <div className="w-6/12 mx-auto mt-5">
          <HiButton color="lime">登録</HiButton>
        </div>
      </div>
    );
  }
}
