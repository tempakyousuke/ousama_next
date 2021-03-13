import { Game } from "game/game";
import Board from "components/Game/board";

export default function CreateNew(): JSX.Element {
  const game = new Game();
  game.tsumeInitialize();
  return (
    <>
      <Board game={game} />
    </>
  );
}
