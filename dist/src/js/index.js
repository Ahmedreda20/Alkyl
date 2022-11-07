"use strict";
var Colors;
(function (Colors) {
    Colors["background"] = "#ffffff";
    // active = "#cbd5e1",
    Colors["active"] = "#ffffff";
    Colors["feed"] = "#f97316";
})(Colors || (Colors = {}));
let container, controls, elements, playground, ctx, width = 480, height = 480, horizontals = [], cubes = [], cubs_playground_height = height - 45, cube_width = 30 - 1, cube_height = 30 - 2, game_over = false, counter = 0, count, cub_count = 0, tracing = [], feed, feed_count = 0, player, creation_date = new Date();
container = document.querySelector('[data-type="container"]');
elements = document.querySelectorAll('[data-type="control-key"]');
var ArrowControls;
(function (ArrowControls) {
    ArrowControls[ArrowControls["UP"] = 38] = "UP";
    ArrowControls[ArrowControls["DOWN"] = 40] = "DOWN";
    ArrowControls[ArrowControls["LEFT"] = 37] = "LEFT";
    ArrowControls[ArrowControls["Right"] = 39] = "Right";
})(ArrowControls || (ArrowControls = {}));
var LetterControls;
(function (LetterControls) {
    LetterControls[LetterControls["UP"] = 87] = "UP";
    LetterControls[LetterControls["DOWN"] = 83] = "DOWN";
    LetterControls[LetterControls["LEFT"] = 68] = "LEFT";
    LetterControls[LetterControls["Right"] = 65] = "Right";
})(LetterControls || (LetterControls = {}));
var NumberControls;
(function (NumberControls) {
    NumberControls[NumberControls["UP"] = 104] = "UP";
    NumberControls[NumberControls["DOWN"] = 98] = "DOWN";
    NumberControls[NumberControls["LEFT"] = 102] = "LEFT";
    NumberControls[NumberControls["Right"] = 100] = "Right";
})(NumberControls || (NumberControls = {}));
const actions = {
    UP: MovePlayerToTop,
    DOWN: MovePlayerToDown,
    LEFT: MovePlayerToLeft,
    Right: MovePlayerToRight,
};
for (const element of elements) {
    const el = element;
    const key = el.dataset.key;
    const action = actions[key];
    controls = Object.assign(Object.assign({}, controls), { [key]: {
            action,
            el,
        } });
    el.addEventListener("click", () => action());
}
window.addEventListener("keydown", function (e) {
    e.preventDefault();
    let key = ArrowControls[e.keyCode] ||
        LetterControls[e.keyCode] ||
        NumberControls[e.keyCode], item;
    if (Object.prototype.hasOwnProperty.call(controls, key)) {
        if (controls[key]) {
            item = controls[key];
            item.action();
            //   console.log(`Current action moved to ${key} at ${creation_date}`);
        }
    }
});
CreateGame();
CreatePlayer();
CreateFeed();
function CreateGame() {
    let title, title_x, title_y, arr = [];
    playground = document.createElement("canvas");
    ctx = playground.getContext("2d");
    playground.width = width;
    playground.height = height;
    playground.id = `playground-${creation_date.getTime()}`;
    // Create background
    ctx.fillStyle = "#222222";
    ctx.fillRect(0, 0, width, height);
    // Create cubes playground
    ctx.fillStyle = "#444444";
    ctx.fillRect(0, cubs_playground_height, width, 50);
    count = Math.max(...Array(width / 10 - 30 - 2)
        .fill(0)
        .map((_, i) => i * 30 + 1)
        .filter((e) => e <= width));
    // Create Cubs count
    for (const index in [...Array(count)]) {
        const offset = +index * 30 + 1;
        if (offset <= width) {
            cub_count++;
        }
    }
    for (const index in [...Array(cub_count)]) {
        const x = +index * 30 + 1;
        horizontals.push([]);
        arr.push({
            x: x,
            y: 0,
            width: cube_width,
            height: cube_height,
            type: "ground",
            color: Colors.background,
        });
        horizontals[index] = arr;
    }
    cubes = []
        .concat(...horizontals)
        .map((e, i) => (Object.assign(Object.assign({}, e), { id: Math.ceil((i + 1) / 16), y: Math.ceil((i + 1) / 16) > 1
            ? Math.ceil((i + 1) / 16) * e.height -
                e.height +
                Math.ceil((i + 1) / 16) -
                1
            : 0 })))
        .filter((e) => e.y < cubs_playground_height);
    cubes.forEach((e) => {
        ctx.fillStyle = Colors.background;
        ctx.fillRect(e.x, e.y, e.width, e.height);
    });
    console.log(cubes);
    // Create footer
    ctx.fillStyle = "#444444";
    ctx.fillRect(0, cubs_playground_height, width, 50);
    // Create title
    ctx.fillStyle = "#999999";
    ctx.font = "bold 12px sans-serif";
    title = "Game started at: " + creation_date.toISOString();
    title_x = width / 2 - ctx.measureText(title).width / 2;
    title_y = height - 18;
    ctx.fillText(title, title_x, title_y);
    //   CreateModal();
    container.append(playground);
}
function CreatePlayer() {
    player = new Image();
    player.src = window.location.origin + "/src/images/player.png";
    player.addEventListener("load", function () {
        DisplayPlayer(this);
    });
}
function DisplayPlayer(player, x = 0, y = 0) {
    //   ctx.cleart;
    //   ctx.clearRect(x, y, cube_width, cube_height);
    ctx.drawImage(player, x, y, cube_width, cube_height);
}
function CreateModal() {
    let title, title_x, title_y;
    ctx.fillStyle = "#00000050";
    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = "#777777";
    ctx.font = "bold 36px sans-serif";
    title = "Game over";
    title_x = width / 2 - ctx.measureText(title).width / 2;
    title_y = height / 2;
    ctx.fillText(title, title_x, title_y);
    window.location.reload();
}
function MovePlayerToTop() {
    const current_cube = cubes[counter];
    const prev_cube = cubes.find((e) => e.id === (current_cube === null || current_cube === void 0 ? void 0 : current_cube.id) - 1 && e.x === (current_cube === null || current_cube === void 0 ? void 0 : current_cube.x));
    const index = cubes.findIndex((e) => e.id === (current_cube === null || current_cube === void 0 ? void 0 : current_cube.id) - 1 && e.x === (current_cube === null || current_cube === void 0 ? void 0 : current_cube.x));
    if (prev_cube) {
        counter = index;
        SelectActiveCube();
        console.log("lorem on up");
    }
}
function MovePlayerToDown() {
    const current_cube = cubes[counter];
    const next_cube = cubes.find((e) => e.id === current_cube.id + 1 && e.x === current_cube.x);
    const index = cubes.findIndex((e) => e.id === current_cube.id + 1 && e.x === current_cube.x);
    if (next_cube) {
        counter = index;
        SelectActiveCube();
        console.log("lorem on down");
    }
}
function MovePlayerToLeft() {
    if (counter <= 0)
        return;
    counter--;
    SelectActiveCube();
    console.log("lorem on left");
}
function MovePlayerToRight() {
    if (counter >= cubes.length)
        return;
    counter++;
    SelectActiveCube();
    console.log("lorem on right");
}
function SelectActiveCube() {
    for (const index in cubes) {
        const item = cubes[index];
        const prev = tracing[tracing.length - 1];
        if (+index === counter || +index === 0) {
            // display game over modal in case current player moved to the end of the cubes;
            if (item.id + 1 === cub_count) {
                CreateModal();
                return;
            }
            // Remove previous cube while moving
            if (prev) {
                ctx.clearRect(prev.x, prev.y, prev.width, prev.height);
                ctx.fillStyle = Colors.background;
                ctx.fillRect(prev.x, prev.y, prev.width, prev.height);
            }
            ctx.fillStyle = Colors.active;
            ctx.fillRect(item.x, item.y, item.width, item.height);
            item.color = Colors.active;
            DisplayPlayer(player, item.x, item.y);
            tracing.push(Object.assign(Object.assign({}, item), { type: "player" }));
            // Create new feed
            const feed_index = cubes.findIndex((e) => e.id === feed.id && e.x === feed.x);
            if (!feed) {
                CreateModal();
                return;
            }
            if (feed_index === counter) {
                feed_count++;
                CreateFeed();
                // console.log(feed_count);
            }
        }
    }
}
function CreateFeed() {
    const current_player_cube = cubes[counter];
    const find_CPCs = cubes.filter((e) => e.id !== current_player_cube.id && e.x !== current_player_cube.x);
    const index = Math.floor(Math.random() * find_CPCs.length);
    console.log(index);
    const selectedCube = cubes[index];
    feed = selectedCube;
    if (feed) {
        ctx.clearRect(feed.x, feed.y, feed.width, feed.height);
    }
    ctx.fillStyle = Colors.feed;
    ctx.fillRect(selectedCube.x, selectedCube.y, selectedCube.width, selectedCube.height);
}
