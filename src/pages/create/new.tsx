import { Game } from "game/game";
import Position from "components/Game/position";

export default function CreateNew(): JSX.Element {
  const game = new Game();
  game.tsumeInitialize();
  return (
    <>
      <Position
        game={game}
        updateGame={(value: Game) => this.setState({ game: value })}
      />
    </>
  );
}
