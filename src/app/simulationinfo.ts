export interface SimulationInfo
{
    id: string
    isActive: boolean;
    simulationName: string;
    userName: string;
    worldSize: number[];
    timestep: number;
    description: string;
    numBlocks: number;
    numThreadsPerBlock: number;
    lastUpdate: Date;
  }

export interface ReducedSimulationInfo
{
    id: string
    timestep: number;
    lastUpdate: Date;
}