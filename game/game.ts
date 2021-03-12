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
  Player,
  CapPiece,
  Piece,
  SQ,
  His,
  Board,
} from "./constant";
import { GameAbility } from "./gameAbility";

export class Game extends GameAbility {
  get blackBoard(): Board {
    const board: Board = {};
    for (const k in this.board) {
      if (this.board[k].owner === WHITE) {
        board[k] = {
          koma: NONE,
          owner: PLAYER_NONE,
        };
      } else {
        board[k] = this.board[k];
      }
    }
    return board;
  }

  get whiteBoard(): Board {
    const board: Board = {};
    for (const k in this.board) {
      if (this.board[k].owner === BLACK) {
        board[k] = {
          koma: NONE,
          owner: PLAYER_NONE,
        };
      } else {
        board[k] = this.board[k];
      }
    }
    return board;
  }

  get blackHistory(): His[] {
    return this.his.map((v) => {
      if (v.turn === WHITE) {
        const his: His = {
          get: v.get,
          checking: v.checking,
          turn: v.turn,
          is_faul: v.is_faul,
        };
        if (v.get !== NONE) {
          his.after = v.after;
        }
        return his;
      } else {
        return v;
      }
    });
  }

  get whiteHistory(): His[] {
    return this.his.map((v) => {
      if (v.turn === BLACK) {
        const his: His = {
          get: v.get,
          checking: v.checking,
          turn: v.turn,
          is_faul: v.is_faul,
        };
        if (v.get !== NONE) {
          his.after = v.after;
        }
        return his;
      } else {
        return v;
      }
    });
  }

  // 手番を変更する
  turnChange(): void {
    this.turn = this.turnReverse;
  }

  // 現在の指し手を取得
  getHistory(): His | {} {
    if (this.turn_number === 0) {
      return {};
    }
    if (this.turn_number - 1 in this.his) {
      return this.his[this.turn_number - 1];
    } else {
      return {};
    }
  }

  // 現在の指し手が反則かを取得 0の場合判定不可能
  isNowFaul(): boolean | 0 {
    if (this.turn_number - 1 in this.his) {
      return this.his[this.turn_number - 1].is_faul;
    } else {
      return 0;
    }
  }

  // 現在の指し手で動かそうとした駒のマスを取得
  get nowBeforeSquare(): SQ {
    if (this.turn_number - 1 in this.his) {
      return this.his[this.turn_number - 1].before;
    } else {
      return -1;
    }
  }

  // 現在の指し手のマスを取得
  get nowSquare(): SQ {
    if (this.turn_number - 1 in this.his) {
      return this.his[this.turn_number - 1].after;
    } else {
      return -1;
    }
  }

  // 持ち駒に追加
  addToCap(piece: Piece, owner: Player): void {
    if (piece === NONE) {
      return;
    }
    const unprom = this.getUnPromotePiece(piece);
    this.cap[owner][unprom] += 1;
  }

  // 持ち駒から削除
  remFromCap(owner: Player): void {
    const unprom = this.getUnPromotePiece(this.selectingPiece);
    this.cap[owner][unprom] -= 1;
  }

  // 指定した位置に持ち駒を置く
  putFromCap(sq: SQ): boolean {
    this.board[sq] = {
      koma: this.selectingPiece,
      owner: this.turn,
    };
    if (this.selectingPiece === HU) {
      if (this.isCheckmate(this.turnReverse)) {
        this.board[sq] = {
          koma: NONE,
          owner: PLAYER_NONE,
        };
        this.addHistory(this.selectingPiece, sq, false, true, NONE, false);
        return false;
      }
    }

    const checkingMe = this.getCheckingStatus(this.turn);
    if (checkingMe) {
      this.board[sq] = {
        koma: NONE,
        owner: PLAYER_NONE,
      };
      this.addHistory(this.selectingPiece, sq, false, true, NONE, false);
      return false;
    }

    this.remFromCap(this.turn);
    const checking = this.getCheckingStatus(this.turnReverse);
    this.addHistory(this.selectingPiece, sq, false, false, NONE, checking);
    this.turnChange();
    return true;
  }

  // 指定した位置に移動
  // 反則を指した場合trueを返す
  putFromBoard(sq: SQ, isPromote: boolean): boolean {
    const piece = this.board[this.selecting_sq].koma;
    if (this.checkMove(sq)) {
      // 反則でない場合
      let afterPiece = piece;
      if (isPromote) {
        afterPiece = this.getPromotePiece(piece);
      }
      // マスの書き換えの前にとった駒を持ち駒に追加
      const get = this.board[sq].koma;

      this.board[sq] = {
        koma: afterPiece,
        owner: this.turn,
      };

      this.board[this.selecting_sq] = {
        koma: NONE,
        owner: PLAYER_NONE,
      };
      this.addToCap(get, this.turn);
      const checking = this.getCheckingStatus(this.turnReverse);
      this.addHistory(piece, sq, isPromote, false, get, checking);
      this.turnChange();
      return false;
    } else {
      // 反則の場合
      this.addHistory(piece, sq, isPromote, true, NONE, false);
      return true;
    }
  }

  // 履歴を登録
  addHistory(
    afterPiece: Piece,
    targetSq: SQ,
    isPromote: boolean,
    isFaul: boolean,
    get: CapPiece,
    cheking: boolean
  ): void {
    const history = {
      koma: afterPiece, // afterに置かれた駒（成っていても成る前の状態が書かれる）
      before: this.selecting_sq, // afterの駒がもともとあったマス持ち駒なら81
      after: targetSq, // 駒が置かれた場所
      is_promote: isPromote, // 駒が成ったかどうか
      is_faul: isFaul, // 反則かどうか
      get, // 取得した駒
      checking: cheking, // 王手をその手でかけたか
      turn: this.turn, // どちらがその手を指したか
    };
    this.his.push(history);
    this.turn_number++;
    if (isFaul) {
      if (this.turn === BLACK) {
        if (this.blackLife !== undefined) {
          this.blackLife--;
        }
      } else {
        if (this.whiteLife !== undefined) {
          this.whiteLife--;
        }
      }
    }
  }

  // 最終手が反則かを返す
  isLastHistoryFaul(): boolean {
    const his = this.his.slice(-1)[0];
    return his.is_faul;
  }

  // 解答用棋譜作成
  showAnswer = (history: His): string => {
    let historyText = "";
    if (history.turn === BLACK) {
      historyText = "▲";
    } else if (history.turn === WHITE) {
      historyText = "△";
    }
    if (history.turn === BLACK) {
      historyText +=
        this.getSquareString(history.after) + this.getPieceChar(history.koma);
      if (history.is_promote) {
        historyText += "成";
      }
    } else if (history.turn === WHITE) {
      if (history.get) {
        historyText += this.getSquareString(history.after);
      }
      historyText +=
        "？(" +
        this.getSquareString(history.after) +
        this.getPieceChar(history.koma);
      if (history.is_promote) {
        historyText += "成";
      }
      historyText += ")";
    }

    if (history.is_faul) {
      historyText = historyText + "(反則)";
    }
    if (history.turn === BLACK && history.get) {
      historyText =
        historyText +
        "(" +
        this.getPieceChar(this.getUnPromotePiece(history.get)) +
        "獲得)";
    }
    return historyText;
  };

  getSquareString(sq: SQ): string {
    const row = ["１", "２", "３", "４", "５", "６", "７", "８", "９"];
    const line = ["一", "二", "三", "四", "五", "六", "七", "八", "九"];
    const rowIndex = Math.floor(sq / 9);
    const lineIndex = sq % 9;
    return row[rowIndex] + line[lineIndex];
  }

  getPieceChar(koma: Piece): string | false {
    switch (koma) {
      case HU:
        return "歩";
      case KYO:
        return "香";
      case KEI:
        return "桂";
      case GIN:
        return "銀";
      case KIN:
        return "金";
      case KAKU:
        return "角";
      case HI:
        return "飛車";
      case TO:
        return "と金";
      case N_KYO:
        return "成香";
      case N_KEI:
        return "成桂";
      case N_GIN:
        return "成銀";
      case UMA:
        return "馬";
      case RYU:
        return "龍";
      case OU:
        return "玉";
      default:
        return false;
    }
  }

  historyGo(): string {
    if (!(this.turn_number in this.his)) {
      return;
    }
    const history = this.his[this.turn_number];
    this.turn_number++;
    if (!history.is_faul) {
      this.turn = this.getReverseOwner(history.turn);
      // 反則でない場合だけ盤面の変更が必要
      if (history.before === 81) {
        // 持ち駒をおいていた場合
        const koma = history.koma;
        this.cap[history.turn][koma]--;
        this.board[history.after] = {
          koma,
          owner: history.turn,
        };
      } else {
        let koma;
        // 盤上の駒を動かしていた場合
        if (history.is_promote) {
          koma = this.getPromotePiece(history.koma);
        } else {
          koma = history.koma;
        }
        this.board[history.before] = {
          koma: NONE,
          owner: PLAYER_NONE,
        };
        this.board[history.after] = {
          koma: koma,
          owner: history.turn,
        };
        if (history.get !== NONE) {
          this.addToCap(this.getUnPromotePiece(history.get), history.turn);
        }
      }
    } else if (history.turn === BLACK) {
      if (this.blackLife !== undefined) {
        this.blackLife -= 1;
      }
    } else if (this.whiteLife !== undefined) {
      this.whiteLife -= 1;
    }
  }

  historyBack(): string {
    if (this.turn_number === 0) {
      return;
    }
    this.turn_number--;
    const history = this.his[this.turn_number];
    if (!history.is_faul) {
      this.turn = this.turnReverse;
      // 反則でない場合だけ盤面の変更が必要
      if (history.before === 81) {
        // 持ち駒をおいていた場合
        this.addToCap(history.koma, this.turn);
        this.board[history.after] = {
          koma: NONE,
          owner: PLAYER_NONE,
        };
      } else {
        let koma;
        // 盤上の駒を動かしていた場合
        if (history.is_promote) {
          koma = this.getUnPromotePiece(history.koma);
        } else {
          koma = history.koma;
        }
        this.board[history.before] = {
          koma,
          owner: this.turn,
        };
        if (history.get === NONE) {
          this.board[history.after] = {
            koma: NONE,
            owner: PLAYER_NONE,
          };
        } else {
          this.board[history.after] = {
            koma: history.get,
            owner: this.turnReverse,
          };
          // 取った駒を持ち駒から削除
          this.cap[this.turn][this.getUnPromotePiece(history.get)] -= 1;
        }
      }
    } else if (history.turn === BLACK) {
      if (this.blackLife !== undefined) {
        this.blackLife += 1;
      }
    } else if (this.whiteLife !== undefined) {
      this.whiteLife += 1;
    }
  }
}
