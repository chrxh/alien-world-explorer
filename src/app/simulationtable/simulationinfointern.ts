export enum ActivityState {
    Inactive = "inactive",
    Active = "active",
    Streaming = "streaming ..."
}

export class SimulationInfoIntern {
    id: string
    activityState: ActivityState;
    simulationName: string;
    userName: string;
    worldSize: number[];
    timestep: number;
    description: string;
  }