import * as fs from "fs";

const filePath = process.argv[2];
let s = fs.readFileSync(filePath, "utf8");

type MemorySpace = [number, number];

function draw(
  corruptedSpaces: MemorySpace[],
  width: number,
  height: number,
  path: MemorySpace[] = []
): string {
  const grid = Array.from({ length: height }, () =>
    Array.from({ length: width }, () => ".")
  );

  corruptedSpaces.forEach(([x, y]) => {
    grid[y][x] = "#";
  });

  path.forEach(([x, y]) => {
    grid[y][x] = "O";
  });

  return grid.map((row) => row.join("")).join("\n");
}

function parseData(data: string): MemorySpace[] {
  return data
    .split("\n")
    .map((line) => line.trim().split(",").map(Number))
    .filter((line) => line.length === 2)
    .map(([x, y]) => [x, y]);
}

let data = parseData(s);
const maxWidth = Math.max(...data.map(([x]) => x)) + 1;
const maxHeight = Math.max(...data.map(([_, y]) => y)) + 1;

const stepsCount = 1024;
const obstacles = data.splice(0, stepsCount);
const endGrid = draw(obstacles, maxWidth, maxHeight);
console.log(endGrid);

const entrance = [0, 0] as MemorySpace;
const exit = [maxWidth - 1, maxHeight - 1] as MemorySpace;

function manhattan(pos1: MemorySpace, pos2: MemorySpace): number {
  return Math.abs(pos1[0] - pos2[0]) + Math.abs(pos1[1] - pos2[1]);
}

function getNeighbors(
  pos: MemorySpace,
  width: number,
  height: number
): MemorySpace[] {
  const directions = [
    [0, 1],
    [1, 0],
    [0, -1],
    [-1, 0],
  ];
  return directions
    .map(([dx, dy]) => [pos[0] + dx, pos[1] + dy] as MemorySpace)
    .filter(([x, y]) => x >= 0 && x < width && y >= 0 && y < height);
}

type Node = {
  position: MemorySpace;
  g: number;
  h: number;
  f: number;
  parent: Node | null;
};

// I'll be honest, this A* function comes from copilot
function aStar(
  start: MemorySpace,
  goal: MemorySpace,
  obstacles: MemorySpace[],
  width: number,
  height: number
): MemorySpace[] | null {
  const openSet: Node[] = [];
  const closedSet = new Set<string>();

  const startNode: Node = {
    position: start,
    g: 0,
    h: manhattan(start, goal),
    f: 0,
    parent: null,
  };
  startNode.f = startNode.g + startNode.h;
  openSet.push(startNode);

  while (openSet.length > 0) {
    const current = openSet.reduce((min, node) =>
      node.f < min.f ? node : min
    );

    if (current.position[0] === goal[0] && current.position[1] === goal[1]) {
      const path: MemorySpace[] = [];
      let node: Node | null = current;
      while (node) {
        path.unshift(node.position);
        node = node.parent;
      }
      return path;
    }

    openSet.splice(openSet.indexOf(current), 1);
    closedSet.add(`${current.position[0]},${current.position[1]}`);

    for (const neighbor of getNeighbors(current.position, width, height)) {
      if (
        closedSet.has(`${neighbor[0]},${neighbor[1]}`) ||
        obstacles.some(([x, y]) => x === neighbor[0] && y === neighbor[1])
      ) {
        continue;
      }

      const g = current.g + 1;
      const h = manhattan(neighbor, goal);
      const f = g + h;

      const existingNode = openSet.find(
        (node) =>
          node.position[0] === neighbor[0] && node.position[1] === neighbor[1]
      );

      if (!existingNode || g < existingNode.g) {
        const neighborNode: Node = {
          position: neighbor,
          g,
          h,
          f,
          parent: current,
        };
        if (!existingNode) {
          openSet.push(neighborNode);
        } else {
          Object.assign(existingNode, neighborNode);
        }
      }
    }
  }

  return null;
}

const path = aStar(entrance, exit, obstacles, maxWidth, maxHeight);
if (path) {
  console.log("Path found:", path);
  console.log("Path length:", path.length - 1);
  const gridWithPath = draw(obstacles, maxWidth, maxHeight, path);
  console.log(gridWithPath);
} else {
  console.log("No path found");
}
