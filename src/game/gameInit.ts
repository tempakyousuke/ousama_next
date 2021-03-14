import { klona } from "klona";
import {
  HU,
  KYO,
  KEI,
  GIN,
  HI,
  KAKU,
  KIN,
  OU,
  NONE,
  BLACK,
  WHITE,
  PLAYER_NONE,
  SQ11,
  SQ12,
  SQ13,
  SQ14,
  SQ15,
  SQ16,
  SQ17,
  SQ18,
  SQ19,
  SQ21,
  SQ22,
  SQ23,
  SQ24,
  SQ25,
  SQ26,
  SQ27,
  SQ28,
  SQ29,
  SQ31,
  SQ32,
  SQ33,
  SQ34,
  SQ35,
  SQ36,
  SQ37,
  SQ38,
  SQ39,
  SQ41,
  SQ42,
  SQ43,
  SQ44,
  SQ45,
  SQ46,
  SQ47,
  SQ48,
  SQ49,
  SQ51,
  SQ52,
  SQ53,
  SQ54,
  SQ55,
  SQ56,
  SQ57,
  SQ58,
  SQ59,
  SQ61,
  SQ62,
  SQ63,
  SQ64,
  SQ65,
  SQ66,
  SQ67,
  SQ68,
  SQ69,
  SQ71,
  SQ72,
  SQ73,
  SQ74,
  SQ75,
  SQ76,
  SQ77,
  SQ78,
  SQ79,
  SQ81,
  SQ82,
  SQ83,
  SQ84,
  SQ85,
  SQ86,
  SQ87,
  SQ88,
  SQ89,
  SQ91,
  SQ92,
  SQ93,
  SQ94,
  SQ95,
  SQ96,
  SQ97,
  SQ98,
  SQ99,
  ALL_PIECE,
  CAP_DEFAULT,
  Board,
  BoardCap,
} from "../game/constant";

export class GameInit {
  board: Board;
  cap: BoardCap;
  turn_number: number;
  turn: number;
  selectingSq: number;
  selectingPiece: number;
  his: GAME.His[];
  comment: string[];
  whiteLife: number | undefined;
  blackLife: number | undefined;

  constructor() {
    this.board = {};
    this.cap = {};
    this.turn_number = 0;
    this.turn = BLACK;
    this.selectingSq = 0;
    this.selectingPiece = 0;
    this.his = [];
    this.comment = [];
  }
  // 初期化
  initialize(): void {
    this.board = {};
    this.board[SQ11] = {
      koma: KYO,
      owner: WHITE,
    };
    this.board[SQ21] = {
      koma: KEI,
      owner: WHITE,
    };
    this.board[SQ22] = {
      koma: KAKU,
      owner: WHITE,
    };
    this.board[SQ31] = {
      koma: GIN,
      owner: WHITE,
    };
    this.board[SQ41] = {
      koma: KIN,
      owner: WHITE,
    };
    this.board[SQ51] = {
      koma: OU,
      owner: WHITE,
    };
    this.board[SQ61] = {
      koma: KIN,
      owner: WHITE,
    };
    this.board[SQ71] = {
      koma: GIN,
      owner: WHITE,
    };
    this.board[SQ81] = {
      koma: KEI,
      owner: WHITE,
    };
    this.board[SQ82] = {
      koma: HI,
      owner: WHITE,
    };
    this.board[SQ91] = {
      koma: KYO,
      owner: WHITE,
    };
    const WHITE_HU = [SQ13, SQ23, SQ33, SQ43, SQ53, SQ63, SQ73, SQ83, SQ93];
    for (const value of WHITE_HU) {
      this.board[value] = {
        koma: HU,
        owner: WHITE,
      };
    }

    this.board[SQ19] = {
      koma: KYO,
      owner: BLACK,
    };
    this.board[SQ29] = {
      koma: KEI,
      owner: BLACK,
    };
    this.board[SQ28] = {
      koma: HI,
      owner: BLACK,
    };
    this.board[SQ39] = {
      koma: GIN,
      owner: BLACK,
    };
    this.board[SQ49] = {
      koma: KIN,
      owner: BLACK,
    };
    this.board[SQ59] = {
      koma: OU,
      owner: BLACK,
    };
    this.board[SQ69] = {
      koma: KIN,
      owner: BLACK,
    };
    this.board[SQ79] = {
      koma: GIN,
      owner: BLACK,
    };
    this.board[SQ89] = {
      koma: KEI,
      owner: BLACK,
    };
    this.board[SQ88] = {
      koma: KAKU,
      owner: BLACK,
    };
    this.board[SQ99] = {
      koma: KYO,
      owner: BLACK,
    };
    const BLACK_HU = [SQ17, SQ27, SQ37, SQ47, SQ57, SQ67, SQ77, SQ87, SQ97];
    for (const value of BLACK_HU) {
      this.board[value] = {
        koma: HU,
        owner: BLACK,
      };
    }
    const emptys = [
      SQ12,
      SQ14,
      SQ15,
      SQ16,
      SQ18,
      SQ24,
      SQ25,
      SQ26,
      SQ32,
      SQ34,
      SQ35,
      SQ36,
      SQ38,
      SQ42,
      SQ44,
      SQ45,
      SQ46,
      SQ48,
      SQ52,
      SQ54,
      SQ55,
      SQ56,
      SQ58,
      SQ62,
      SQ64,
      SQ65,
      SQ66,
      SQ68,
      SQ72,
      SQ74,
      SQ75,
      SQ76,
      SQ78,
      SQ84,
      SQ85,
      SQ86,
      SQ92,
      SQ94,
      SQ95,
      SQ96,
      SQ98,
    ];
    for (const value of emptys) {
      this.board[value] = {
        koma: NONE,
        owner: PLAYER_NONE,
      };
    }
    this.cap = {};
    this.cap[WHITE] = klona(CAP_DEFAULT);
    this.cap[BLACK] = klona(CAP_DEFAULT);
    this.turn = BLACK;
    this.turn_number = 0;
    this.selectingSq = 81;
    this.selectingPiece = -1;
    this.his = [];
    this.comment = [];
    this.blackLife = 9;
    this.whiteLife = 9;
  }

  // 詰将棋用初期化
  tsumeInitialize(): void {
    this.board = {};
    this.cap = {};
    this.cap[WHITE] = klona(ALL_PIECE);
    this.cap[BLACK] = klona(CAP_DEFAULT);
    for (let i = SQ11; i <= SQ99; i++) {
      this.board[i] = {
        koma: NONE,
        owner: PLAYER_NONE,
      };
    }
    this.turn = PLAYER_NONE;
    this.turn_number = 0;
    this.selectingSq = 81;
    this.selectingPiece = -1;
    this.his = [];
    this.comment = [];
  }

  // firestoreから返ってきたobjectを入れる
  import(data: GAME.BoardData): void {
    this.board = klona(data.board);
    this.cap[BLACK] = klona(data.black_cap);
    this.cap[WHITE] = klona(data.white_cap);
    if (data.his) {
      this.his = klona(data.his);
    } else {
      this.his = [];
    }
    if (data.comment !== undefined && data.comment.length !== 0) {
      this.comment = klona(data.comment);
    } else {
      for (let i = 0; i <= this.his.length; i++) {
        this.comment.push("");
      }
    }

    if (data.turn === undefined) {
      this.turn = BLACK;
    } else {
      this.turn = data.turn;
    }
    if (data.whiteLife !== undefined) {
      this.whiteLife = data.whiteLife;
    }
    if (data.blackLife !== undefined) {
      this.blackLife = data.blackLife;
    }
  }
}
