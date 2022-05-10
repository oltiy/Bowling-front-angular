export interface Throw {
  frame: number;
  shot1: number;
  shot2: number;
  shot3: number;
  total: number;
}

export interface TopScoreTable {
  frame?: number;
  name: string;
  game: Array<Throw[]>;
  max: number;
}

export interface PostToTopScoreTable {
  frame?: number;
  name: string;
  game: Throw[];
  max: number;
}

export interface PatchSpareUpdate {
  frame?: number;
  shot1?: number;
  name?: string;
  total: number;
}

export interface BowlingGameTrowStatus {
  value?: Throw;
  optional?: boolean;
}

export interface DialogData {
  name: string;
  score: number;
}
