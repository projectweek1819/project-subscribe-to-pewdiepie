// Schrijf hier je code
function width(grid) {
    return grid[0].length;
}

function height(grid) {
    return grid.length;
}

function isInside(grid, position) {
    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[i].length; j++) {
            if (grid[i][j] === position) {
                return true;
            }
        }
    }
    return false;
}

function isInside(grid, position) {
    const { x, y } = position;
    return 0 <= x && x < width(grid) && 0 <= y && y < height(grid);
}
function swap(grid,p,q) {
    const temp = grid[p.y][p.x];
    grid[p.y][p.x] = grid[q.y][q.x];
    grid[q.y][q.x] = temp;

}



