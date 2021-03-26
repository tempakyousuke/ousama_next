import React from "react";
import { Game } from "game/game";
import { withRouter, NextRouter } from "next/router";
import Position from "components/Game/position";
import HiButton from "components/Button/hiButton";
import { AuthContext } from "context/auth";
import firebase, { firestore } from "utils/firebase";
import { BLACK, WHITE } from "game/constant";
interface WithRouterProps {
  router: NextRouter;
}

type CreateNewState = {
  game: Game;
};
class CreateNew extends React.Component<WithRouterProps, CreateNewState> {
  static contextType = AuthContext;

  constructor(props: WithRouterProps) {
    super(props);
    const game = new Game();
    game.tsumeInitialize();
    this.state = {
      game,
    };
    this.updateGame = this.updateGame.bind(this);
    this.registerBoard = this.registerBoard.bind(this);
  }

  updateGame(value: Game): void {
    this.setState(() => ({
      game: value,
    }));
  }

  async registerBoard() {
    const uid = this.context.currentUser.uid;
    const docRef = await firestore.collection("question_boards").add({
      black_cap: this.state.game.cap[BLACK],
      white_cap: this.state.game.cap[WHITE],
      board: this.state.game.board,
      uid,
    });
    const qRef = await firestore.collection("questions").add({
      uid,
      boardRef: docRef,
      modified: firebase.firestore.FieldValue.serverTimestamp(),
    });
    this.props.router.push(`/create/edit/${qRef.id}`);
  }

  render(): JSX.Element {
    return (
      <div className="mt-5">
        <Position game={this.state.game} updateGame={this.updateGame} />
        <div className="w-6/12 mx-auto mt-5">
          <HiButton color="lime" handleClick={this.registerBoard}>
            登録
          </HiButton>
        </div>
      </div>
    );
  }
}

export default withRouter(CreateNew);
