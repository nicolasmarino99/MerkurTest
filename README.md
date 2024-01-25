# Slot Machine Game Readme
## Introduction
This document provides an overview of the Slot Machine Game and highlights the new features added to the code. The game is implemented using the Phaser framework.

## Game Description
The Slot Machine Game simulates a classic slot machine with various symbols on the reels. Players can spin the reels, and the game calculates wins based on the combination of symbols.

## Features Added
### 1. Modular Code Structure
The code has been modularized into different components to improve maintainability and readability. Three main modules are introduced:

* StateMain: Handles the game logic, including spinning reels, calculating wins, and updating the UI.
* UIElementFactory: Contains methods for creating various UI elements, such as sprites, groups, graphics, text, and buttons.
* LayoutBuilder: Constructs the game layout, including the background, bars, and user interface.
### 2. UI Improvements
The user interface (UI) has been enhanced with the introduction of a UIElementFactory to create consistent UI elements. The layout is built using LayoutBuilder, providing a cleaner and more organized way to handle UI components.

### 3. Reusable UI Components
The UIElementFactory introduces methods for creating different UI elements, making it easy to reuse components throughout the game. For example, it provides methods to create sprites, groups, graphics, text, and buttons.

### 4. Tweens and Animations
The game now incorporates tweens for smoother animations. The tweenSpinStart method adds a subtle animation when the player initiates a spin.

### 5. Blur Effect
A blur effect has been added during the spinning animation to enhance the visual appeal of the game. The createBlurFilter method is used to apply blur filters to the reels.

### 6. Improved Win Calculation
The finalScore function now uses constants (SLOT_VALUES) for better code readability. Additionally, it has been modified to correctly assign win values based on the slot machine symbols.

### 6. A longer new stripe added
The stripe now follows a sequence of positions of fixed objects, this allows the game to have any kind of stripe if it is desired to be changed.
