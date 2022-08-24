# Webpack Minimal
A bare-bones webpack setup for creating a single-page application.
It is easily extensible and customizable.

![Capture](https://user-images.githubusercontent.com/37275728/186276468-2543c207-f235-43b9-b9d1-f3ad8d393ba6.PNG)

## Requirements

First things first, you need to install have [npm](https://www.npmjs.com/) installed.

Then proceed to install [webpack](https://webpack.js.org/):
    
    npm install --save-dev webpack webpack-cli
    npm install --save-dev webpack-dev-server -D
    
Lastly, verify that you have the TypeScript compiler installed by running:

    npm install --save-dev typescript ts-loader

## Installation

To install all dependencies, open the terminal in the project directory and run the following command:

    npm install

## Usage

To start the application, use:

    npm start

Then you can check the app in your browser by navigating to:

    http://localhost:3000

If everything is working well, you should see the message:

    "Everything works fine!"

Otherwise you will see:

    "The script hasn't been loaded yet!!!"

## What about package.json?

Npm uses these files to manage your application.
They are used to specify general information about the project as well as the dependencies needed to run it.
The script that is executed when you type *npm start* is added to the scripts property.
Do yourself a favor and run the following commands to update the dependencies: 

    npm i -g npm-check-updates
    ncu -u
    npm install

## What's the big deal about Webpack? 

Webpack is a "module bundler". It takes all your js and css files and writes them to one file. Why would it be helpful though? Well that way you don't need to include mustiple *<script>* tags in your html files. 
    
One instresting thing in webpack.config.js file is *devServer*.
    
Under the hood, Webpack dev server is a mini Node.js Express server. That server listens to when files were changed, and reloads the html files.

## What about the TypeScript itself?

TypeScript is configured using tsconfig.json where you can specify to which version of JavaScript should it be transpiled.
