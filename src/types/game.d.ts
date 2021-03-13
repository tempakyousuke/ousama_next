declare namespace GAME {
  interface Square {
    koma: number;
    owner: number;
  }

  interface Board {
    [key: number]: Square;
  }

  interface Cap {
    [key: number]: number;
  }

  interface BoardCap {
    [key: number]: Cap;
  }

  interface His {
    koma?: number;
    before?: number;
    after?: number;
    is_promote?: boolean;
    is_faul: boolean;
    get: number;
    checking: boolean;
    turn: number;
  }

  interface BoardData {
    board: Board;
    black_cap: Cap;
    white_cap: Cap;
    his: His[];
    comment: string[];
    turn: number | undefined;
    whiteLife: number | undefined;
    blackLife: number | undefined;
  }

  const ALL_PIECE: Cap = {
    1: 18,
    2: 4,
    3: 4,
    4: 4,
    5: 4,
    6: 2,
    7: 2,
    8: 2,
  };

  const CAP_DEFAULT: Cap = {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
    6: 0,
    7: 0,
    8: 0,
  };
}
