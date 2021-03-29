import React from "react";
import { Game } from "game/game";
import { WHITE, BLACK, OU } from "game/constant";
import { getImage } from "game/image";

type BoardProps = {
  game: Game;
  selectingCap: { koma: number; owner: number } | null;
  capClick: (koma: number, owner: number) => void;
  boardClick: (sq: number) => void;
  pickupPieceClick?: (isPromote: boolean, owner: number) => void;
  showPickupPieces?: boolean;
  selectingSquare: number;
};

type BoardState = {
  boardWidth: number;
  boardHeight: number;
  squareWidth: number;
  squareHeight: number;
  edgeWidth: number;
  edgeHeight: number;
  boardPositionX: number;
  boardPositionY: number;
  capPositionX: number;
};

export default class Board extends React.Component<BoardProps, BoardState> {
  static defaultProps = {
    boardClick: function (): void {
      return;
    },
    capClick: function (): void {
      return;
    },
    pickupPieceClick: function (): void {
      return;
    },
    showPickupPieces: false,
  };

  boardRef: React.RefObject<HTMLDivElement>;
  capAreaRef: React.RefObject<HTMLDivElement>;
  boardWidth: number;
  boardHeight: number;

  constructor(props: BoardProps) {
    super(props);
    this.boardRef = React.createRef<HTMLDivElement>();
    this.capAreaRef = React.createRef<HTMLDivElement>();
    this.handleResize = this.handleResize.bind(this);
    this.capClick = this.capClick.bind(this);
    this.boardClick = this.boardClick.bind(this);
    this.state = {
      boardWidth: 0,
      boardHeight: 0,
      squareWidth: 0,
      squareHeight: 0,
      edgeWidth: 0,
      edgeHeight: 0,
      boardPositionX: 0,
      boardPositionY: 0,
      capPositionX: 0,
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
    const board = this.boardRef;
    const boardWidth = board.current.clientWidth;
    const boardHeight = board.current.clientHeight;
    const edgeWidth = boardWidth * 0.01;
    const edgeHeight = boardHeight * 0.013;
    const rect = board.current.getBoundingClientRect();
    const boardPositionX = rect.left + window.pageXOffset;
    const boardPositionY = rect.top + window.pageYOffset;
    const capRect = this.capAreaRef.current.getBoundingClientRect();
    const capPositionX = capRect.left + window.pageXOffset;

    this.setState({
      boardWidth,
      boardHeight,
      squareWidth: (boardWidth - edgeWidth * 2) / 9,
      squareHeight: (boardHeight - edgeHeight * 2) / 9,
      edgeWidth,
      edgeHeight,
      boardPositionX,
      boardPositionY,
      capPositionX,
    });
  }

  capClick(
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    owner: number
  ): void {
    const offsetX = event.pageX - this.state.capPositionX;
    const squareWidth = this.state.squareWidth;
    let koma: number;

    for (let i = 0; i < 9; i++) {
      if (i * squareWidth <= offsetX && offsetX < (i + 1) * squareWidth) {
        koma = i + 1;
        break;
      }
    }
    if (koma === undefined) {
      this.props.capClick(0, owner);
    }
    if (this.props.game.cap[WHITE][koma] === 0) {
      this.props.capClick(0, owner);
    }
    this.props.capClick(koma, owner);
  }

  boardClick(event: React.MouseEvent<HTMLDivElement, MouseEvent>): void {
    const offsetX =
      event.pageX - this.state.boardPositionX - this.state.edgeWidth;
    const offsetY =
      event.pageY - this.state.boardPositionY - this.state.edgeHeight;
    const squareWidth = this.state.squareWidth;
    const squareHeight = this.state.squareHeight;

    let column: number;
    let row: number;

    for (let i = 0; i < 9; i++) {
      if (i * squareWidth <= offsetX && offsetX < (i + 1) * squareWidth) {
        column = 8 - i;
        break;
      }
    }
    for (let i = 0; i < 9; i++) {
      if (i * squareHeight <= offsetY && offsetY < (i + 1) * squareHeight) {
        row = i;
        break;
      }
    }
    const sq = column * 9 + row;
    if (isNaN(sq)) {
      return;
    }
    this.props.boardClick(sq);
  }

  get whiteCaps(): JSX.Element {
    return (
      <div
        className="relative h-6 mx-auto overflow-hidden sm:h-14 md:h-16 cap"
        onClick={(event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
          this.capClick(event, WHITE);
        }}
      >
        <img
          className="absolute"
          alt="cap"
          src="/img/board/japanese-chess-bg.jpg"
        />
        <div
          ref={this.capAreaRef}
          className="relative z-10 w-11/12 h-full mx-auto top-1 sm:top-2"
        >
          {Object.keys(this.props.game.cap[WHITE]).map((koma) => {
            const count = this.props.game.cap[WHITE][koma];
            if (count === 0) {
              return;
            }
            return this.getCap(parseInt(koma), WHITE, count);
          })}
        </div>
      </div>
    );
  }

  get blackCaps(): JSX.Element {
    return (
      <div
        className="relative h-6 mx-auto mt-5 overflow-hidden sm:h-14 md:h-16 cap"
        onClick={(event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
          this.capClick(event, BLACK);
        }}
      >
        <img alt="cap" src="/img/board/japanese-chess-bg.jpg" />
        <div className="absolute z-10 w-11/12 h-full mx-auto top-1 sm:top-2">
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
      </div>
    );
  }

  get boardPieces(): JSX.Element {
    return (
      <>
        {Object.keys(this.props.game.board).map((sq) => {
          const sqNum = parseInt(sq);
          const row = sqNum % 9;
          const column = Math.floor(sqNum / 9);
          const top = this.state.squareHeight * row + this.state.edgeHeight;
          const left =
            this.state.squareWidth * (8 - column) + this.state.edgeWidth;
          const style = {
            top,
            left,
            width: this.state.squareWidth,
            height: this.state.squareHeight,
            padding: `2px ${this.state.squareHeight * 0.05}px`,
          };
          const imgClass = "";
          const { koma, owner } = this.props.game.board[sq];
          const image = getImage(koma, owner);
          if (!koma) {
            return "";
          }
          return (
            <div className="absolute z-20" style={style} key={`square-${sq}`}>
              <img src={image} className={imgClass} width={100} height={100} />
            </div>
          );
        })}
      </>
    );
  }

  get selectingPiece(): number {
    return this.props.game.board[this.props.selectingSquare].koma;
  }

  get pickupPieces(): JSX.Element {
    if (this.selectingPiece === 0) {
      return <></>;
    }
    const style = {
      top: 3,
      left: 3,
      right: 3,
      width: this.state.squareWidth * 1.4,
    };
    if (this.props.selectingSquare < 45) {
      delete style.right;
    } else {
      delete style.left;
    }
    const piece = this.props.game.getUnPromotePiece(this.selectingPiece);
    const promotePiece = this.props.game.getPromotePiece(this.selectingPiece);

    const piece1 = getImage(piece, BLACK);
    const piece2 = getImage(piece, WHITE);
    const piece3 = getImage(promotePiece, BLACK);
    const piece4 = getImage(promotePiece, WHITE);

    return (
      <div className="absolute z-50 p-5 bg-white" style={style}>
        <img
          src={piece1}
          width={100}
          height={100}
          onClick={(event: React.MouseEvent<HTMLImageElement, MouseEvent>) => {
            event.stopPropagation();
            this.props.pickupPieceClick(false, BLACK);
          }}
        />
        <img
          src={piece2}
          width={100}
          height={100}
          onClick={(event: React.MouseEvent<HTMLImageElement, MouseEvent>) => {
            event.stopPropagation();
            this.props.pickupPieceClick(false, WHITE);
          }}
        />
        {piece3 ? (
          <img
            src={piece3}
            width={100}
            height={100}
            onClick={(
              event: React.MouseEvent<HTMLImageElement, MouseEvent>
            ) => {
              event.stopPropagation();
              this.props.pickupPieceClick(true, BLACK);
            }}
          />
        ) : (
          ""
        )}
        {piece4 ? (
          <img
            src={piece4}
            width={100}
            height={100}
            onClick={(
              event: React.MouseEvent<HTMLImageElement, MouseEvent>
            ) => {
              event.stopPropagation();
              this.props.pickupPieceClick(true, WHITE);
            }}
          />
        ) : (
          ""
        )}
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
    let imageClass = "";
    const selectingCap = this.props.selectingCap;
    if (selectingCap) {
      if (selectingCap.koma === koma && selectingCap.owner === owner) {
        imageClass = "opacity-50";
      }
    }
    return (
      <div className="absolute" style={style} key={`${owner}-${koma}`}>
        <img src={image} className={imageClass} />
        <span className="absolute text-xs cap-count sm:text-sm">{count}</span>
      </div>
    );
  }

  get selectingSquareFill(): JSX.Element {
    if (this.props.selectingSquare) {
      const sq = this.props.selectingSquare;
      const row = sq % 9;
      const column = Math.floor(sq / 9);
      const top = this.state.squareHeight * row + this.state.edgeHeight;
      const left = this.state.squareWidth * (8 - column) + this.state.edgeWidth;
      const style = {
        width: this.state.squareWidth,
        height: this.state.squareHeight,
        top,
        left,
      };
      return (
        <div
          className="absolute z-10 bg-lime-500 bg-opacity-50"
          style={style}
        />
      );
    } else {
      return <></>;
    }
  }

  render(): JSX.Element {
    return (
      <div className="w-10/12 max-w-xl mx-auto lg:w-8/12">
        {this.whiteCaps}
        <div
          ref={this.boardRef}
          className="relative mx-auto mt-5"
          onClick={this.boardClick}
        >
          <img
            alt="board"
            src="/img/board/japanese-chess-b03.jpg"
            width={1000}
            height={1000}
          />
          {this.boardPieces}
          {this.props.showPickupPieces ? this.pickupPieces : ""}
          {this.selectingSquareFill}
        </div>
        {this.blackCaps}
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