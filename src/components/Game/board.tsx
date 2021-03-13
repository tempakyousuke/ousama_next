import React from "react";
import { Game } from "game/game";
import { WHITE, BLACK, OU } from "game/constant";
import Image from "next/image";
import { getImage } from "game/image";

type BoardProps = {
  game: Game;
};

type BoardState = {
  boardWidth: number;
  boardHeight: number;
  squareWidth: number;
  squareHeight: number;
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
      squareWidth: 0,
      squareHeight: 0,
    };
  }

  componentDidMount(): void {
    this.handleResize();
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
      squareWidth: container.current.clientWidth / 9,
      squareHeight: container.current.clientHeight / 9,
    });
  }

  get whiteCaps(): JSX.Element {
    return (
      <div className="relative w-11/12 h-full mx-auto">
        {Object.keys(this.props.game.cap[WHITE]).map((koma) => {
          const count = this.props.game.cap[WHITE][koma];
          if (count === 0) {
            return;
          }
          return this.getCap(parseInt(koma), WHITE, count);
        })}
      </div>
    );
  }

  get blackCaps(): JSX.Element {
    return (
      <div className="relative w-11/12 h-full mx-auto">
        {Object.keys(this.props.game.cap[BLACK]).map((koma) => {
          if (parseInt(koma) === OU) {
            return "";
          }
          const count = this.props.game.cap[BLACK][koma];
          if (count === 0) {
            return;
          }
          return this.getCap(parseInt(koma), BLACK, count);
        })}
      </div>
    );
  }

  getCap(koma: number, owner: number, count: number): JSX.Element {
    const image = getImage(koma, owner);
    const style = {
      width: this.state.squareWidth,
      left: this.state.squareWidth * (koma - 1),
      padding: `0 ${this.state.squareHeight * 0.1}px`,
    };
    return (
      <div className="absolute" style={style} key={`${owner}-${koma}`}>
        <Image src={image} layout="intrinsic" width={100} height={100} />
        <span className="absolute text-xs cap-count sm:text-sm">{count}</span>
      </div>
    );
  }

  render(): JSX.Element {
    return (
      <div className="w-10/12 mx-auto lg:w-8/12">
        <div className="relative h-12 mx-auto sm:h-14 md:h-16 cap">
          <Image
            alt="cap"
            src="/img/board/japanese-chess-bg.jpg"
            layout="fill"
            objectFit="cover"
            quality={100}
          />
          {this.whiteCaps}
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
          {this.blackCaps}
        </div>
        <style jsx>{`
          :global(.cap-count) {
            bottom: 0;
            right: 0.5rem;
          }
        `}</style>
      </div>
    );
  }
}
