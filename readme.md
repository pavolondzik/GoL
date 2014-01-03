Conway's Game of Life and Rule 30
=================================

This project is an adaptation of Conway's Game of Life, in JavaScript and HTML5 Canvas. It adds many different game elements and features which don't exist in other implementations of the game. This project is a solution to the task given to me within module Artificial Intelligence.

Task
----
Emergence: Cellular Automata
Create an interactive implementation of the Game of Life grid, where a player can select starting points for a variety of blinkers. The system then sends gliders to destroy them, resulting in chaos. Alternatively, system randomly sets some blinkers and player sets starting point for gliders. Documentation should clearly explain algorithms used to generate the life-forms.

Demo
----
See a full demo at http://pavolondzik.github.io/GoL/

Usage
-----
Grid can be populated by clicking with mouse on canvas to revive/kill cells.
You can switch between "Conway's Game of Life" and "Rule 30" windows. Rule 30 is one dimensional cellular automaton, that means the first row of cells is first generation.

Local Development
-----------------
If you download the game locally and open the index.html file in browser, the pattern loading will not work. By default, browsers will not open the *.rle files due to Cross-origin resource sharing (CORS) issues. To fix this, you can execute the browser with the following argument:

chromium-browser index.html --disable-web-security

This should cause the browser to load the RLE file without any problems.

UI Elements
-----------
