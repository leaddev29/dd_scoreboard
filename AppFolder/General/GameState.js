import { makeAutoObservable } from "mobx";
import { createContext } from "react";
import { asyncGetState, asyncSaveState } from "./AsyncStorage";

export const KEYS_GAME_STATE = Object.freeze({
  SwitchScoreMode: "SwitchScoreMode",
  TeamNameVisibility: "teamNameVisibility",
  TeamAName: "teamAName",
  TeamBName: "teamBName",
  TeamAColor: "teamAColor",
  TeamBColor: "teamBColor",
  TeamAScore: "teamAScore",
  TeamBScore: "teamBScore",
  SetsScore: "setsScore",
});

class GameState {
  teamAName = "Team A";
  teamBName = "Team B";
  teamAColor = "#3066ff"; //blue
  teamBColor = "#ff3636"; //red
  teamAScore = 0;
  teamBScore = 0;
  setsScore = 0;
  teamNameVisibility = false;
  SwitchScoreMode = false;

  constructor() {
    makeAutoObservable(this);
    this.getAsync();
  }

  setKey(key, value) {
    this[key] = value;
    if (
      key == "teamAScore" ||
      key == "teamBScore" ||
      key == "teamNameVisibility" ||
      key == "SwitchScoreMode"
    ) {
      setTimeout(() => {
        this.saveAsync();
      }, 100);
    }
  }
  getKey(key, value) {
    return this[key];
  }
  reset() {
    this.teamAColor = "#3066ff"; //blue
    this.teamBColor = "#ff3636"; //red
    this.teamAName = "Team A";
    this.teamBName = "Team B";
    this.teamNameVisibility = true;
    this.SwitchScoreMode = true;
    this.saveAsync();
  }
  async saveAsync() {
    let state = {
      teamAName: this.teamAName,
      teamBName: this.teamBName,
      teamAColor: this.teamAColor,
      teamBColor: this.teamBColor,
      teamAScore: this.teamAScore,
      teamBScore: this.teamBScore,
      setsScore: this.setsScore,
      teamNameVisibility: this.teamNameVisibility,
      SwitchScoreMode: this.SwitchScoreMode,
    };
    console.log("\n\n\n\n\n\n");
    console.log("fahad async state (SET): ", state);
    console.log("\n\n\n\n\n\n");
    asyncSaveState(state);
  }
  async getAsync() {
    let state = await asyncGetState();

    console.log("\n\n\n\n\n\n");
    console.log("fahad async state (GET): ", state);
    console.log("\n\n\n\n\n\n");
    if (state != null) {
      this.teamAName = state.teamAName;
      this.teamBName = state.teamBName;
      this.teamAColor = state.teamAColor;
      this.teamBColor = state.teamBColor;
      this.teamAScore = state.teamAScore;
      this.teamBScore = state.teamBScore;
      this.setsScore = state.setsScore;
      this.teamNameVisibility = state.teamNameVisibility;
      this.SwitchScoreMode = state.SwitchScoreMode;
    }
  }
}

const MobxGameState = new GameState();
export default MobxGameState;
export const ContextGameState = createContext(MobxGameState);
