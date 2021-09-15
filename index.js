// Shorthand functions ==========================================
// Get Document by ID shorthand
function getEl(id) {return document.getElementById(id);}

// Localstorage function
function store(key, value) {
    if(value) {
        localStorage.setItem(key, value);
    } else {
        return localStorage.getItem(key);
    }
}

// THEME/UI ======================================================
const elBody = getEl("body");

const threedContainer = getEl("threed_container")
const overlay = getEl("game_overlay");
const game = getEl("game_board");
const elSettings = getEl("settings");

const animClasses = [
    "board_animate", "board_animate_r",       // Front
    "settings_animate", "settings_animate_r"  // Back
]

// Settings Panel
var spState = false;
function settingsPanel() {
    // If 3D CSS is on
    if(store("cssmode") == "on") {
        if(spState == false) {
            console.log("[Settings] Options panel opened");

            // Remove
            clearClasses();
            
            // Add
            elBody.classList.add("settings_open");

            game.classList.add("board_animate");
            overlay.classList.add("board_animate");
            elSettings.classList.add("settings_animate");

            spState = true;
        } else {
            console.log("[Settings] Options panel closed");
            
            // Remove
            clearClasses();

            // Reversed
            game.classList.add("board_animate_r");
            overlay.classList.add("board_animate_r");
            elSettings.classList.add("settings_animate_r");
            
            spState = false;
        }

    }
    // If 3D CSS is off
    else {
        if(spState == false) {
            console.log("[Settings] Options panel opened");
    
            // Remove
            clearClasses()
            
            // Add
            elBody.classList.add("settings_open");

            game.classList.add("board_animate_flat");
            overlay.classList.add("board_animate_flat");
            elSettings.classList.add("settings_animate_flat");
    
            spState = true;
        } else {
            console.log("[Settings] Options panel closed");
            
            // Remove
            clearClasses()
    
            // Reversed
            game.classList.add("board_animate_r_flat");
            overlay.classList.add("board_animate_r_flat");
            elSettings.classList.add("settings_animate_r_flat");
            
            spState = false;
        }
    }

}

// Set theme data if there is none
if(store("theme") == null) {
    console.log("[Settings] No settings stored, setting to default");
    // Initial theme value
    store("theme", "theme_light");
    // Initial color mode value
    store("colors", "on");
    // Initial animation mode value
    store("animations", "on");
    // Initial 3D CSS value
    store("cssmode", "on");
} else {
    // Switch to saved theme
    console.log("[Settings] Theme data found, switching to saved theme");
    changeTheme(store("theme"));
    colorMode(store("colors"));
    animationMode(store("animations"));
    cssMode(store("cssmode"));
}

// Change Theme
function changeTheme(theme) {
    // Theme button
    if(!theme) {
        if(store("theme") == "theme_light") {
            direct("theme_dark");
        } else {
            direct("theme_light");
        }
    } else {
        direct(theme);
    }
    // Direct
    function direct(theme) {
        console.log(`[Settings] Theme set to: ${theme}`);
        store("theme", theme);

        elBody.classList.remove("theme_light");
        elBody.classList.remove("theme_dark");

        elBody.classList.add(theme);
    }
}

// Change Color Mode
function colorMode(state) {
    // Toggle
    if(!state) {
        if(store("colors") == "on") {
            direct("off");
        } else if(store("colors") == "off") {
            direct("on");
        }
    } else {
        direct(state);
    }
    // Direct
    function direct(state) {
        console.log(`[Settings] Colors toggled ${state.toUpperCase()}`);
        store("colors", state);
        if(state == "on") {
            elBody.classList.add(`colors_on`);
        } else if (state == "off") {
            elBody.classList.remove(`colors_on`);
        }
    }
}

// Change Animation mode
function animationMode(state) {
    if(!state) {
        if(store("animations") == "on") {
            direct("off");
        } else {
            direct("on");
        }
    } else {
        direct(state);
    }

    function direct(state) {
        console.log(`[Settings] Animations toggled ${state.toUpperCase()}`);
        store("animations", state);
        if(state == "on") {
            elBody.classList.add("animations_on");
        } else if(state == "off") {
            elBody.classList.remove("animations_on");
        }
    }
}

// Change 3D CSS mode
function cssMode(state) {
    if(!state) {
        if(store("cssmode") == "on") {
            direct("off");
        } else {
            direct("on");
        }
    } else {
        direct(state);
    }

    function direct(state) {
        console.log(`[Settings] 3D CSS toggled ${state.toUpperCase()}`);
        store("cssmode", state);
        if(state == "on") {
            elBody.classList.add("threed_css");
        } else if(state == "off") {
            elBody.classList.remove("threed_css");
        }
    }


}

// Clear animation classes
function clearClasses() {
    for(i = 0; i < animClasses.length; i++) {
        // Remove body class
        elBody.classList.remove("settings_open");

        // Remove 3D animation classes
        game.classList.remove(animClasses[i])
        overlay.classList.remove(animClasses[i]);
        elSettings.classList.remove(animClasses[i]);

        // Remove 2D animation classes
        game.classList.remove(animClasses[i] + "_flat");
        overlay.classList.remove(animClasses[i] + "_flat");
        elSettings.classList.remove(animClasses[i] + "_flat");
    }
}


// GAME ==========================================================

var ply = "X";
var turn = "0";
var pause = false;
const info = getEl("info");
const innerInfo = getEl("inner_info");

// Slots
const [aa, ba, ca, ab, bb, cb, ac, bc, cc] = [
    getEl("1_1"),
    getEl("2_1"),
    getEl("3_1"),

    getEl("1_2"),
    getEl("2_2"),
    getEl("3_2"),

    getEl("1_3"),
    getEl("2_3"),
    getEl("3_3")
]

// Game Click
function gameClick(coords) {
    const elClicked = getEl(coords);
    
    // Update page / player turn
    if(elClicked.innerText.length == 0 && pause == false) {
        // Update based on whose turn it is
        if( ply == "X") {
            console.log(`[Player] Setting square ${coords} to ${ply}`);

            turn++;
            elClicked.innerHTML = `<span class="x_color">${ply}</span>`;
            info.innerHTML = `It's <b class="o_color">O</b>'s turn`;
            ply = "O";
        } else if ( elClicked.innerText.length == 0 ) {
            console.log(`[Player] Setting square ${coords} to ${ply}`);

            turn++;
            elClicked.innerHTML = `<span class="o_color">${ply}</span>`;
            info.innerHTML = `It's <b class="x_color">X</b>'s turn`;
            ply = "X";
        } else {
            console.warn(`[Player] ${ply}: Square ${coords} is not a valid position)`);
        }

        // Slots
        const aa = document.getElementById("1_1").innerText;
        const ba = document.getElementById("2_1").innerText;
        const ca = document.getElementById("3_1").innerText;

        const ab = document.getElementById("1_2").innerText;
        const bb = document.getElementById("2_2").innerText;
        const cb = document.getElementById("3_2").innerText;

        const ac = document.getElementById("1_3").innerText;
        const bc = document.getElementById("2_3").innerText;
        const cc = document.getElementById("3_3").innerText;

        // Test win conditions
        if(turn > 2) {
            if(
                // X
                // Horizontal
                aa == "X" && ba == "X" && ca == "X" ||
                ab == "X" && bb == "X" && cb == "X" ||
                ac == "X" && bc == "X" && cc == "X" ||
                
                // Vertical
                aa == "X" && ab == "X" && ac == "X" ||
                ba == "X" && bb == "X" && bc == "X" ||
                ca == "X" && cb == "X" && cc == "X" ||
    
                // Diagonal
                aa == "X" && bb == "X" && cc == "X" ||
                ca == "X" && bb == "X" && ac == "X"
            ) {
                console.log(`[Game] "X" has won!`);
                gameEnd("X");
            } else if(
                // O
                // Horizontal
                aa == "O" && ba == "O" && ca == "O" ||
                ab == "O" && bb == "O" && cb == "O" ||
                ac == "O" && bc == "O" && cc == "O" ||
                
                // Vertical
                aa == "O" && ab == "O" && ac == "O" ||
                ba == "O" && bb == "O" && bc == "O" ||
                ca == "O" && cb == "O" && cc == "O" ||
    
                // Diagonal
                aa == "O" && bb == "O" && cc == "O" ||
                ca == "O" && bb == "O" && ac == "O"
            ) {
                console.log(`[Game] "O" has won!`);
                gameEnd("O");
            } else if(turn == 9) {
                console.log("[Game] Tie");
                gameEnd("Tie");
            }
        }
    }

}

// Win screen
function gameEnd(winner) {
    console.log("[Game] Win state");

    turn = 0;
    pause = true;
    game.classList.remove("clickable");

    if(winner == "Tie") {
        info.innerHTML = `<b>Tie!</b>`;
        innerInfo.innerText = `Draw`;
    } else {
        info.innerHTML = `<b class="${winner.toLowerCase()}_color">${winner}</b> wins!`;
        innerInfo.innerText = `${winner} wins!`;
    }

    overlay.style.visibility = "visible";
    // overlay.style.animation = "overlayfade 0.5s forwards";
    // Needs to run when animation finishes
    // overlay.style.animation = "none";
}

// Reset Board
function resetGame() {
    console.log("[Game] Resetting");

    ply = "X";
    pause = false;
    game.classList.add("clickable");

    // overlay.style.animation = "overlayfade 0.5s reverse both"

    // Needs to run when animation finishes
    // overlay.style.animation = "none";
    overlay.style.visibility = "hidden";

    info.innerHTML = `It's <b class="${ply.toLowerCase()}_color">${ply}</b>'s turn`;
    
    aa.innerText = "";
    ba.innerText = "";
    ca.innerText = "";

    ab.innerText = "";
    bb.innerText = "";
    cb.innerText = "";

    ac.innerText = "";
    bc.innerText = "";
    cc.innerText = "";
}