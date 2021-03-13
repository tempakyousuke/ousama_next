import React from "react";
import { Game } from "game/game";
import Image from "next/image";

type BoardProps = {
  game: Game;
};

type BoardState = {
  boardWidth: number;
  boardHeight: number;
};

export default class Board extends React.Component<BoardProps, BoardState> {
  boardRef: React.RefObject<HTMLDivElement>;
  boardWidth: number;
  boardHeight: number;

  constructor(props: BoardProps) {
    super(props);
    this.boardRef = React.createRef<HTMLDivElement>();
    this.handleResize = this.handleResize.bind(this);
    this.state = {
      boardWidth: 0,
      boardHeight: 0,
    };
  }

  componentDidMount(): void {
    window.addEventListener("resize", this.handleResize);
  }

  componentWillUnmount(): void {
    window.removeEventListener("resize", this.handleResize);
  }

  handleResize(): void {
    const container = this.boardRef;
    this.setState({
      boardWidth: container.current.clientWidth,
      boardHeight: container.current.clientHeight,
    });
  }

  render(): JSX.Element {
    return (
      <div className="w-10/12 mx-auto lg:w-8/12">
        <div className="relative h-10 mx-auto sm:h-14 cap">
          <Image
            alt="cap"
            src="/img/board/japanese-chess-bg.jpg"
            layout="fill"
            objectFit="cover"
            quality={100}
          />
        </div>
        <div ref={this.boardRef} className="relative mx-auto mt-5">
          <Image
            alt="board"
            src="/img/board/japanese-chess-b03.jpg"
            layout="intrinsic"
            quality={100}
            width={1000}
            height={1000}
          />
        </div>
        <div className="relative h-10 mx-auto mt-5 sm:h-14 cap">
          <Image
            alt="cap"
            src="/img/board/japanese-chess-bg.jpg"
            layout="fill"
            objectFit="cover"
            quality={100}
          />
        </div>
      </div>
    );
  }
}
