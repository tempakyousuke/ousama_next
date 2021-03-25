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
  TO,
  N_KYO,
  N_KEI,
  N_GIN,
  UMA,
  RYU,
  NONE,
  BLACK,
  WHITE,
  PLAYER_NONE,
  SQ11,
  SQ12,
  SQ18,
  SQ19,
  SQ21,
  SQ22,
  SQ28,
  SQ29,
  SQ31,
  SQ32,
  SQ38,
  SQ39,
  SQ41,
  SQ42,
  SQ48,
  SQ49,
  SQ51,
  SQ52,
  SQ58,
  SQ59,
  SQ61,
  SQ62,
  SQ68,
  SQ69,
  SQ71,
  SQ72,
  SQ78,
  SQ79,
  SQ81,
  SQ82,
  SQ88,
  SQ89,
  SQ91,
  SQ92,
  SQ98,
  SQ99,
  BLACK_AREA,
  WHITE_AREA,
  UP,
  UP_RI,
  RI,
  DO_RI,
  DO,
  DO_LE,
  LE,
  UP_LE,
  INF_UP,
  INF_UP_RI,
  INF_RI,
  INF_DO_RI,
  INF_DO,
  INF_DO_LE,
  INF_LE,
  INF_UP_LE,
  UP2_RI,
  UP2_LE,
  DO2_RI,
  DO2_LE,
} from "./constant";
import { GameInit } from "./gameInit";
const FIRST_ROW = [SQ11, SQ21, SQ31, SQ41, SQ51, SQ61, SQ71, SQ81, SQ91];
const SECOND_ROW = [SQ12, SQ22, SQ32, SQ42, SQ52, SQ62, SQ72, SQ82, SQ92];
const EIGHTH_ROW = [SQ18, SQ28, SQ38, SQ48, SQ58, SQ68, SQ78, SQ88, SQ98];
const FINAL_ROW = [SQ19, SQ29, SQ39, SQ49, SQ59, SQ69, SQ79, SQ89, SQ99];

export class GameAbility extends GameInit {
  get turnReverse(): number {
    return this.getReverseOwner(this.turn);
  }

  // 選択中のマスの駒を返す
  sqPiece(): number {
    if (this.selectingSq !== 81) {
      return this.board[this.selectingSq].koma;
    } else {
      return NONE;
    }
  }

  // 選択中のマスの所持者を返す
  sqOwner(): number {
    if (this.selectingSq !== 81) {
      return this.board[this.selectingSq].owner;
    } else {
      return PLAYER_NONE;
    }
  }

  // 反対の所持者を返す
  getReverseOwner(owner: number): number {
    if (owner === WHITE) {
      return BLACK;
    } else if (owner === BLACK) {
      return WHITE;
    }
    return PLAYER_NONE;
  }

  // 王様のいるマスを返す
  getKingSquare(owner: number): number | false {
    for (const key of Object.keys(this.board)) {
      const numKey = parseInt(key);
      if (
        this.board[numKey].owner === owner &&
        this.board[numKey].koma === OU
      ) {
        return numKey;
      }
    }
    return false;
  }

  // 王手をかけられているかのチェック
  getCheckingStatus(owner: number): boolean {
    const kSq = this.getKingSquare(owner);
    if (kSq === false) {
      // 王様がいなければfalse
      return false;
    }
    const rOwner = this.getReverseOwner(owner);
    const canMoved = this.getCanMovedList(kSq, rOwner);
    if (canMoved.length > 0) {
      return true;
    }
    return false;
  }

  // 成る前の駒を取得
  getUnPromotePiece(piece: number): number {
    switch (piece) {
      case TO:
        return HU;
      case N_KYO:
        return KYO;
      case N_KEI:
        return KEI;
      case N_GIN:
        return GIN;
      case UMA:
        return KAKU;
      case RYU:
        return HI;
    }
    return piece;
  }

  // 成った後の駒を取得
  getPromotePiece(piece: number): number {
    const unPromotePiece = this.getUnPromotePiece(piece);
    switch (unPromotePiece) {
      case HU:
        return TO;
      case KYO:
        return N_KYO;
      case KEI:
        return N_KEI;
      case GIN:
        return N_GIN;
      case KAKU:
        return UMA;
      case HI:
        return RYU;
    }
    return NONE;
  }

  // 成る事が可能かどうかの判定
  isPromotable(sq: number): boolean {
    const pieces = [HU, KYO, KEI, GIN, KAKU, HI];
    if (!pieces.includes(this.sqPiece())) {
      return false;
    }
    if (this.sqOwner() === BLACK) {
      return WHITE_AREA.includes(sq) || WHITE_AREA.includes(this.selectingSq);
    }
    if (this.sqOwner() === WHITE) {
      return BLACK_AREA.includes(sq) || BLACK_AREA.includes(this.selectingSq);
    }
    return false;
  }

  // 必ず成らなければいけないかの判定
  mustPromote(sq: number): boolean {
    switch (this.sqPiece()) {
      case HU:
      case KYO:
        if (this.turn === BLACK) {
          return FIRST_ROW.includes(sq);
        } else {
          return FINAL_ROW.includes(sq);
        }
      case KEI:
        if (this.turn === BLACK) {
          return FIRST_ROW.includes(sq) || SECOND_ROW.includes(sq);
        } else {
          return EIGHTH_ROW.includes(sq) || FINAL_ROW.includes(sq);
        }
    }
    return false;
  }

  // 駒の能力を取得
  getAbilityList(koma: number, owner: number): number[] {
    let ability: number[];
    switch (koma) {
      case HU:
        ability = [UP];
        break;
      case KYO:
        ability = [INF_UP];
        break;
      case KEI:
        ability = [UP2_RI, UP2_LE];
        break;
      case GIN:
        ability = [UP, UP_RI, DO_RI, DO_LE, UP_LE];
        break;
      case KIN:
      case TO:
      case N_KYO:
      case N_KEI:
      case N_GIN:
        ability = [UP, UP_RI, RI, DO, LE, UP_LE];
        break;
      case KAKU:
        ability = [INF_UP_RI, INF_DO_RI, INF_DO_LE, INF_UP_LE];
        break;
      case HI:
        ability = [INF_UP, INF_RI, INF_DO, INF_LE];
        break;
      case UMA:
        ability = [UP, RI, DO, LE, INF_UP_RI, INF_DO_RI, INF_DO_LE, INF_UP_LE];
        break;
      case RYU:
        ability = [UP_RI, DO_RI, DO_LE, UP_LE, INF_UP, INF_RI, INF_DO, INF_LE];
        break;
      case OU:
        ability = [UP, UP_RI, RI, DO_RI, DO, DO_LE, LE, UP_LE];
        break;
      default:
        ability = [];
    }
    if (owner === WHITE) {
      return ability.map(function (element) {
        return element * -1;
      });
    } else {
      return ability;
    }
  }

  // 駒の特定のアビリティに対し動かせる場所を返す関数
  getMovableArea(ability: number, sq: number): number[] {
    const owner = this.board[sq].owner;
    const result = [];
    switch (ability) {
      case UP: {
        const a = sq - 1;
        if (sq % 9 === 0) {
          break;
        }
        if (this.board[a].owner !== owner) {
          result.push(a);
        }
        break;
      }
      case UP_RI: {
        const a = sq - 10;
        if (a < 0 || sq % 9 === 0) {
          break;
        }
        if (this.board[a].owner !== owner) {
          result.push(a);
        }
        break;
      }
      case RI: {
        const a = sq - 9;
        if (a < 0) {
          break;
        }
        if (this.board[a].owner !== owner) {
          result.push(a);
        }
        break;
      }
      case DO_RI: {
        const a = sq - 8;
        if (a < 0 || sq % 9 === 8) {
          break;
        }
        if (this.board[a].owner !== owner) {
          result.push(a);
        }
        break;
      }
      case DO: {
        const a = sq + 1;
        if (sq % 9 === 8) {
          break;
        }
        if (this.board[a].owner !== owner) {
          result.push(a);
        }
        break;
      }
      case DO_LE: {
        const a = sq + 10;
        if (a > 80 || sq % 9 === 8) {
          break;
        }
        if (this.board[a].owner !== owner) {
          result.push(a);
        }
        break;
      }
      case LE: {
        const a = sq + 9;
        if (a > 80) {
          break;
        }
        if (this.board[a].owner !== owner) {
          result.push(a);
        }
        break;
      }
      case UP_LE: {
        const a = sq + 8;
        if (a > 80 || sq % 9 === 0) {
          break;
        }
        if (this.board[a].owner !== owner) {
          result.push(a);
        }
        break;
      }
      case UP2_RI: {
        const a = sq - 11;
        if (a < 0 || sq % 9 === 0 || sq % 9 === 1) {
          break;
        }
        if (this.board[a].owner !== owner) {
          result.push(a);
        }
        break;
      }
      case DO2_RI: {
        const a = sq - 7;
        if (a < 0 || sq % 9 === 8 || sq % 9 === 7) {
          break;
        }
        if (this.board[a].owner !== owner) {
          result.push(a);
        }
        break;
      }
      case DO2_LE: {
        const a = sq + 11;
        if (a > 80 || sq % 9 === 8 || sq % 9 === 7) {
          break;
        }
        if (this.board[a].owner !== owner) {
          result.push(a);
        }
        break;
      }
      case UP2_LE: {
        const a = sq + 7;
        if (a > 80 || sq % 9 === 0 || sq % 9 === 1) {
          break;
        }
        if (this.board[a].owner !== owner) {
          result.push(a);
        }
        break;
      }
      case INF_UP: {
        let a = sq - 1;
        while (a >= 0 && a % 9 !== 8) {
          if (this.board[a].owner !== owner) {
            result.push(a);
          } else {
            break;
          }
          a = a - 1;
        }
        break;
      }
      case INF_UP_RI: {
        let a = sq - 10;
        while (a >= 0 && a % 9 !== 8) {
          if (this.board[a].owner !== owner) {
            result.push(a);
          } else {
            break;
          }
          a = a - 10;
        }
        break;
      }
      case INF_RI: {
        let a = sq - 9;
        while (a >= 0) {
          if (this.board[a].owner !== owner) {
            result.push(a);
          } else {
            break;
          }
          a = a - 9;
        }
        break;
      }
      case INF_DO_RI: {
        let a = sq - 8;
        while (a >= 0 && a % 9 !== 0) {
          if (this.board[a].owner !== owner) {
            result.push(a);
          } else {
            break;
          }
          a = a - 8;
        }
        break;
      }
      case INF_DO: {
        let a = sq + 1;
        while (a <= 80 && a % 9 !== 0) {
          if (this.board[a].owner !== owner) {
            result.push(a);
          } else {
            break;
          }
          a = a + 1;
        }
        break;
      }
      case INF_DO_LE: {
        let a = sq + 10;
        while (a <= 80 && a % 9 !== 0) {
          if (this.board[a].owner !== owner) {
            result.push(a);
          } else {
            break;
          }
          a = a + 10;
        }
        break;
      }
      case INF_LE: {
        let a = sq + 9;
        while (a <= 80) {
          if (this.board[a].owner !== owner) {
            result.push(a);
          } else {
            break;
          }
          a = a + 9;
        }
        break;
      }
      case INF_UP_LE: {
        let a = sq + 8;
        while (a <= 80 && a % 9 !== 8) {
          if (this.board[a].owner !== owner) {
            result.push(a);
          } else {
            break;
          }
          a = a + 8;
        }
        break;
      }
    }
    return result;
  }

  // 本将棋的に持ち駒をおけるかチェックする関数
  isPutable(sq: number, owner: number): boolean {
    switch (this.selectingPiece) {
      case HU:
        if (owner === BLACK) {
          if (FIRST_ROW.includes(sq)) {
            return false;
          }
        } else if (FINAL_ROW.includes(sq)) {
          return false;
        }
        if (this.alradyExistHu(sq)) {
          return false;
        }
        return true;
      case KYO:
        if (owner === BLACK) {
          return !FIRST_ROW.includes(sq);
        } else {
          return !FINAL_ROW.includes(sq);
        }
      case KEI:
        if (owner === BLACK) {
          return !FIRST_ROW.includes(sq) && !SECOND_ROW.includes(sq);
        } else {
          return !EIGHTH_ROW.includes(sq) && !FINAL_ROW.includes(sq);
        }
    }
    return true;
  }

  alradyExistHu(sq: number): boolean {
    const column = Math.floor(sq / 9);
    const sqs = Array(9)
      .fill(0)
      .map((v, i) => column * 9 + i);
    const check = sqs.find((v) => {
      return this.board[v].owner === this.turn && this.board[v].koma === HU;
    });
    if (check) {
      return true;
    }
    return false;
  }

  // 盤上の駒の配置は無視して動かせるかどうかチェック
  isMovable(sq: number): boolean {
    const movable = this.getPieceMovableArea(this.selectingSq);
    return movable.includes(sq);
  }

  // 反則かチェック 反則ならfalse
  checkMove(sq: number): boolean {
    const owner = this.board[this.selectingSq].owner;
    const rOwner = this.getReverseOwner(owner);
    // 駒の飛越チェック
    if (this.selectingSq - sq > 10) {
      // 右上に行く動き
      if ((this.selectingSq - sq) % 10 === 0) {
        let tmpSq = this.selectingSq - 10;
        while (tmpSq > sq) {
          if (this.board[tmpSq].owner === rOwner) {
            return false;
          }
          if (tmpSq % 9 === 0) {
            break;
          }
          tmpSq = tmpSq - 10;
        }
      } else if ((this.selectingSq - sq) % 8 === 0) {
        // 右下に行く動き
        let tmpSq = this.selectingSq - 8;
        while (tmpSq > sq) {
          if (this.board[tmpSq].owner === rOwner) {
            return false;
          }
          if (tmpSq % 9 === 8) {
            break;
          }
          tmpSq = tmpSq - 8;
        }
      }
    } else if (this.selectingSq - sq < -10) {
      if ((sq - this.selectingSq) % 10 === 0) {
        // 左下に行く動き
        let tmpSq = this.selectingSq + 10;
        while (tmpSq < sq) {
          if (this.board[tmpSq].owner === rOwner) {
            return false;
          }
          if (tmpSq % 9 === 8) {
            break;
          }
          tmpSq = tmpSq + 10;
        }
      } else if ((sq - this.selectingSq) % 8 === 0) {
        // 左上に行く動き
        let tmpSq = this.selectingSq + 8;
        while (tmpSq < sq) {
          if (this.board[tmpSq].owner === rOwner) {
            return false;
          }
          if (tmpSq % 9 === 0) {
            break;
          }
          tmpSq = tmpSq + 8;
        }
      }
    }
    // 飛車の飛越チェック
    if (this.selectingSq - sq > 0) {
      if (this.selectingSq - sq < 9 && this.selectingSq % 9 > sq % 9) {
        let tmpSq = this.selectingSq - 1;
        while (tmpSq > sq) {
          if (this.board[tmpSq].owner === rOwner) {
            return false;
          }
          tmpSq = tmpSq - 1;
        }
      } else if ((this.selectingSq - sq) % 9 === 0) {
        let tmpSq = this.selectingSq - 9;
        while (tmpSq > sq) {
          if (this.board[tmpSq].owner === rOwner) {
            return false;
          }
          tmpSq = tmpSq - 9;
        }
      }
    } else if (this.selectingSq - sq < 0) {
      if (sq - this.selectingSq < 9 && this.selectingSq % 9 < sq % 9) {
        let tmpSq = this.selectingSq + 1;
        while (tmpSq < sq) {
          if (this.board[tmpSq].owner === rOwner) {
            return false;
          }
          tmpSq = tmpSq + 1;
        }
      } else if ((sq - this.selectingSq) % 9 === 0) {
        let tmpSq = this.selectingSq + 9;
        while (tmpSq < sq) {
          if (this.board[tmpSq].owner === rOwner) {
            return false;
          }
          tmpSq = tmpSq + 9;
        }
      }
    }
    // 王手を無視していないかのチェック
    const kSq = this.getKingSquare(owner);
    if (!kSq) {
      return true;
    }

    const fromBefore = klona(this.board[this.selectingSq]);
    const toBefore = klona(this.board[sq]);
    this.board[sq] = {
      koma: fromBefore.koma,
      owner: fromBefore.owner,
    };
    this.board[this.selectingSq] = {
      koma: NONE,
      owner: PLAYER_NONE,
    };
    let result;
    if (this.getCheckingStatus(owner)) {
      result = false;
    } else {
      result = true;
    }
    this.board[this.selectingSq] = {
      koma: fromBefore.koma,
      owner: fromBefore.owner,
    };
    this.board[sq] = {
      koma: toBefore.koma,
      owner: toBefore.owner,
    };
    return result;
  }

  isCheckmate(kingOwner: number): boolean {
    // 詰んでるか判定したい王様のマスを取得
    const kSq = this.getKingSquare(kingOwner);
    const owner = this.getReverseOwner(kingOwner);

    // 王様がいなければ詰んでいない
    if (!kSq) {
      return false;
    }

    // 王手をかけている駒のマス一覧を取得
    const checkingPieceSquares = this.getCanMovedList(kSq, owner);

    if (checkingPieceSquares.length > 1) {
      // 両王手は逃げられるかどうかだけチェック
      if (this.isCanEscape(kSq, owner)) {
        return false;
      }
      return true;
    } else if (checkingPieceSquares.length === 1) {
      if (this.isCanEscape(kSq, owner)) {
        return false;
      }
      const checking = checkingPieceSquares[0];
      if (this.isCanMoveSquare(checking, kingOwner)) {
        return false;
      }

      // 合駒の対象のマスに移動できる駒があるかチェック
      const aigomaSquares = this.getNeedAigomaSquare(kSq, checking);
      for (const square of aigomaSquares) {
        if (this.isCanMoveSquare(square, kingOwner)) {
          return false;
        }
      }

      for (const square of aigomaSquares) {
        if (this.isCanPutSquare(square, kingOwner)) {
          return false;
        }
      }
      return true;
    }
    return false;
  }

  getNeedAigomaSquare(kSq: number, checking: number): number[] {
    const kingColumn = Math.floor(kSq / 9);
    const checkingColumn = Math.floor(checking / 9);

    // 縦の利き
    if (kingColumn === checkingColumn) {
      if (kSq > checking) {
        const squares = [];
        let i = kSq - 1;
        while (i !== checking) {
          squares.push(i);
          i--;
        }
        return squares;
      } else if (kSq < checking) {
        const squares = [];
        let i = kSq + 1;
        while (i !== checking) {
          squares.push(i);
          i++;
        }
        return squares;
      }
    }

    // 横の利き
    const kingRow = kSq % 9;
    const checkingRow = checking % 9;
    if (kingRow === checkingRow) {
      if (kSq > checking) {
        const squares = [];
        let i = kSq - 9;
        while (i !== checking) {
          squares.push(i);
          i = i - 9;
        }
        return squares;
      } else if (kSq < checking) {
        const squares = [];
        let i = kSq + 9;
        while (i !== checking) {
          squares.push(i);
          i = i + 9;
        }
        return squares;
      }
    }

    if (Math.abs(kSq - checking) % 10 === 0) {
      if (kSq > checking) {
        const squares = [];
        let i = kSq - 10;
        while (i !== checking) {
          squares.push(i);
          i = i - 10;
        }
        return squares;
      } else if (kSq < checking) {
        const squares = [];
        let i = kSq + 10;
        while (i !== checking) {
          squares.push(i);
          i = i + 10;
        }
        return squares;
      }
    }

    if (Math.abs(kSq - checking) % 8 === 0) {
      if (kSq > checking) {
        const squares = [];
        let i = kSq - 8;
        while (i !== checking) {
          squares.push(i);
          i = i - 8;
        }
        return squares;
      } else if (kSq < checking) {
        const squares = [];
        let i = kSq + 8;
        while (i !== checking) {
          squares.push(i);
          i = i + 8;
        }
        return squares;
      }
    }
    return [];
  }

  isCanPutSquare(square: number, owner: number): boolean {
    const capPieces = this.getCapList(owner);
    for (const piece of capPieces) {
      this.selectingPiece = piece;
      if (this.isPutable(square, owner)) {
        this.selectingPiece = -1;
        return true;
      }
    }
    this.selectingPiece = -1;
    return false;
  }

  getCapList(owner: number): number[] {
    const cap = this.cap[owner];
    const pieces = [];
    for (const key in cap) {
      if (cap[key] > 0) {
        pieces.push(parseInt(key));
      }
    }
    return pieces;
  }

  // 王様を動かして王手回避できるか判定
  // ownerは王手をかけている側
  isCanEscape(kSq: number, owner: number): boolean {
    const movable = this.getPieceMovableArea(kSq);
    const kingOwner = this.getReverseOwner(owner);
    let result = false;
    for (const sq of movable) {
      const beforePiece = this.board[sq].koma;
      const beforeOwner = this.board[sq].owner;

      this.board[sq] = {
        koma: OU,
        owner: kingOwner,
      };
      this.board[kSq] = {
        koma: NONE,
        owner: PLAYER_NONE,
      };
      if (this.getCanMovedList(sq, owner).length === 0) {
        result = true;
      }
      this.board[sq] = {
        koma: beforePiece,
        owner: beforeOwner,
      };
      this.board[kSq] = {
        koma: OU,
        owner: kingOwner,
      };
    }
    return result;
  }

  isCanMoveSquare(checkingSq: number, kingOwner: number): boolean {
    const kSq = this.getKingSquare(kingOwner);
    const guardians = this.getCanMovedList(checkingSq, kingOwner);
    const owner = this.getReverseOwner(kingOwner);

    if (kSq === false) {
      return false;
    }
    let canGet = false;
    if (guardians.length > 0) {
      for (const guard of guardians) {
        const guardingPiece = this.board[guard].koma;
        const checkingPiece = this.board[checkingSq].koma;
        const beforeOwner = this.board[checkingSq].owner;

        this.board[guard] = {
          koma: NONE,
          owner: PLAYER_NONE,
        };
        this.board[checkingSq] = {
          koma: guardingPiece,
          owner: kingOwner,
        };

        if (guardingPiece !== OU) {
          if (this.getCanMovedList(kSq, owner).length === 0) {
            canGet = true;
          }
        } else {
          if (this.getCanMovedList(checkingSq, owner).length === 0) {
            canGet = true;
          }
        }

        this.board[guard] = {
          koma: guardingPiece,
          owner: kingOwner,
        };
        this.board[checkingSq] = {
          koma: checkingPiece,
          owner: beforeOwner,
        };
      }
    }
    return canGet;
  }

  /*
   * 指定された場所に動ける駒がある升の一覧を取得する
   * kSq = 指定されているマス
   * owner側の駒が動けるのかをチェック
   */
  getCanMovedList(kSq: number, owner: number): number[] {
    const result = [];
    const rOwner = this.getReverseOwner(owner);
    let cSq = kSq - 1;
    if (cSq > 0 && cSq % 9 !== 8) {
      if (
        this.checkHaving(DO, this.board[cSq].koma, this.board[cSq].owner) &&
        this.board[cSq].owner === owner
      ) {
        result.push(cSq);
      }
    }

    cSq = kSq - 10;
    if (cSq > 0 && cSq % 9 !== 8) {
      if (
        this.checkHaving(DO_LE, this.board[cSq].koma, this.board[cSq].owner) &&
        this.board[cSq].owner === owner
      ) {
        result.push(cSq);
      }
    }

    cSq = kSq - 9;
    if (cSq > 0) {
      if (
        this.checkHaving(LE, this.board[cSq].koma, this.board[cSq].owner) &&
        this.board[cSq].owner === owner
      ) {
        result.push(cSq);
      }
    }

    cSq = kSq - 8;
    if (cSq > 0 && cSq % 9 !== 0) {
      if (
        this.checkHaving(UP_LE, this.board[cSq].koma, this.board[cSq].owner) &&
        this.board[cSq].owner === owner
      ) {
        result.push(cSq);
      }
    }

    cSq = kSq + 1;
    if (cSq < 81 && cSq % 9 !== 0) {
      if (
        this.checkHaving(UP, this.board[cSq].koma, this.board[cSq].owner) &&
        this.board[cSq].owner === owner
      ) {
        result.push(cSq);
      }
    }

    cSq = kSq + 10;
    if (cSq < 81 && cSq % 9 !== 0) {
      if (
        this.checkHaving(UP_RI, this.board[cSq].koma, this.board[cSq].owner) &&
        this.board[cSq].owner === owner
      ) {
        result.push(cSq);
      }
    }

    cSq = kSq + 9;
    if (cSq < 81) {
      if (
        this.checkHaving(RI, this.board[cSq].koma, this.board[cSq].owner) &&
        this.board[cSq].owner === owner
      ) {
        result.push(cSq);
      }
    }

    cSq = kSq + 8;
    if (cSq < 81 && cSq % 9 !== 8) {
      if (
        this.checkHaving(DO_LE, this.board[cSq].koma, this.board[cSq].owner) &&
        this.board[cSq].owner === owner
      ) {
        result.push(cSq);
      }
    }

    cSq = kSq - 11;
    if (cSq > 0 && cSq % 9 !== 8 && cSq % 9 !== 7) {
      if (
        this.checkHaving(DO2_LE, this.board[cSq].koma, this.board[cSq].owner) &&
        this.board[cSq].owner === owner
      ) {
        result.push(cSq);
      }
    }
    cSq = kSq - 7;
    if (cSq > 0 && cSq % 9 !== 0 && cSq % 9 !== 1) {
      if (
        this.checkHaving(UP2_LE, this.board[cSq].koma, this.board[cSq].owner) &&
        this.board[cSq].owner === owner
      ) {
        result.push(cSq);
      }
    }

    cSq = kSq + 11;
    if (cSq < 81 && cSq % 9 !== 0 && cSq % 9 !== 1) {
      if (
        this.checkHaving(UP2_RI, this.board[cSq].koma, this.board[cSq].owner) &&
        this.board[cSq].owner === owner
      ) {
        result.push(cSq);
      }
    }

    cSq = kSq + 7;
    if (cSq < 81 && cSq % 9 !== 8 && cSq % 9 !== 7) {
      if (
        this.checkHaving(DO2_RI, this.board[cSq].koma, this.board[cSq].owner) &&
        this.board[cSq].owner === owner
      ) {
        result.push(cSq);
      }
    }

    cSq = kSq;
    while (cSq % 9 !== 0) {
      cSq = cSq - 1;
      if (this.board[cSq].owner === rOwner) {
        break;
      }
      if (this.board[cSq].owner === owner) {
        if (
          this.checkHaving(INF_DO, this.board[cSq].koma, this.board[cSq].owner)
        ) {
          result.push(cSq);
          break;
        }
        break;
      }
    }

    cSq = kSq;
    while (cSq % 9 !== 0 && cSq - 10 > 0) {
      cSq = cSq - 10;
      if (this.board[cSq].owner === rOwner) {
        break;
      }
      if (this.board[cSq].owner === owner) {
        if (
          this.checkHaving(
            INF_DO_LE,
            this.board[cSq].koma,
            this.board[cSq].owner
          )
        ) {
          result.push(cSq);
          break;
        }
        break;
      }
    }

    cSq = kSq;
    while (cSq - 9 > 0) {
      cSq = cSq - 9;
      if (this.board[cSq].owner === rOwner) {
        break;
      }
      if (this.board[cSq].owner === owner) {
        if (
          this.checkHaving(INF_LE, this.board[cSq].koma, this.board[cSq].owner)
        ) {
          result.push(cSq);
          break;
        }
        break;
      }
    }

    cSq = kSq;
    while (cSq % 9 !== 8 && cSq - 8 > 0) {
      cSq = cSq - 8;
      if (this.board[cSq].owner === rOwner) {
        break;
      }
      if (this.board[cSq].owner === owner) {
        if (
          this.checkHaving(
            INF_UP_LE,
            this.board[cSq].koma,
            this.board[cSq].owner
          )
        ) {
          result.push(cSq);
          break;
        }
        break;
      }
    }

    cSq = kSq;
    while (cSq % 9 !== 8) {
      cSq = cSq + 1;
      if (this.board[cSq].owner === rOwner) {
        break;
      }
      if (this.board[cSq].owner === owner) {
        if (
          this.checkHaving(INF_UP, this.board[cSq].koma, this.board[cSq].owner)
        ) {
          result.push(cSq);
          break;
        }
        break;
      }
    }

    cSq = kSq;
    while (cSq % 9 !== 8 && cSq + 10 < 81) {
      cSq = cSq + 10;
      if (this.board[cSq].owner === rOwner) {
        break;
      }
      if (this.board[cSq].owner === owner) {
        if (
          this.checkHaving(
            INF_UP_RI,
            this.board[cSq].koma,
            this.board[cSq].owner
          )
        ) {
          result.push(cSq);
          break;
        }
        break;
      }
    }

    cSq = kSq;
    while (cSq + 9 < 81) {
      cSq = cSq + 9;
      if (this.board[cSq].owner === rOwner) {
        break;
      }
      if (this.board[cSq].owner === owner) {
        if (
          this.checkHaving(INF_RI, this.board[cSq].koma, this.board[cSq].owner)
        ) {
          result.push(cSq);
          break;
        }
        break;
      }
    }

    cSq = kSq;
    while (cSq % 9 !== 0 && cSq + 8 < 81) {
      cSq = cSq + 8;
      if (this.board[cSq].owner === rOwner) {
        break;
      }
      if (this.board[cSq].owner === owner) {
        if (
          this.checkHaving(
            INF_DO_RI,
            this.board[cSq].koma,
            this.board[cSq].owner
          )
        ) {
          result.push(cSq);
          break;
        }
        break;
      }
    }
    return result;
  }

  // 本将棋的に駒を動かせる場所を取得
  getPieceMovableArea(sq: number): number[] {
    const abilityList = this.getAbilityList(
      this.board[sq].koma,
      this.board[sq].owner
    );
    let movable: number[] = [];
    for (const i in abilityList) {
      movable = movable.concat(this.getMovableArea(abilityList[i], sq));
    }
    return movable;
  }

  // 駒が指定されたアビリティを持っているかチェックする関数
  checkHaving(ability: number, koma: number, owner: number): boolean {
    if (owner === PLAYER_NONE) {
      return false;
    }
    const abilityList = this.getAbilityList(koma, owner);
    if (abilityList.includes(ability)) {
      return true;
    } else {
      return false;
    }
  }
}
