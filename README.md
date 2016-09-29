#modV
modV is a modular audio visualisation environment written in JavaScript and runs in Google Chrome.

All documentation so far is available in [this repo's Wiki](https://github.com/2xAA/modV/wiki). There's more to come!

## Sample images
[![](https://github.com/2xAA/modV/raw/master/docs/example-images/1.jpg)](https://github.com/2xAA/modV/raw/master/docs/example-images/1.png)
[![](https://github.com/2xAA/modV/raw/master/docs/example-images/2.jpg)](https://github.com/2xAA/modV/raw/master/docs/example-images/2.png)
[![](https://github.com/2xAA/modV/raw/master/docs/example-images/3.jpg)](https://github.com/2xAA/modV/raw/master/docs/example-images/3.png)
[![](https://github.com/2xAA/modV/raw/master/docs/example-images/4.jpg)](https://github.com/2xAA/modV/raw/master/docs/example-images/4.png)
[![](https://github.com/2xAA/modV/raw/master/docs/example-images/5.jpg)](https://github.com/2xAA/modV/raw/master/docs/example-images/5.png)
[![](https://github.com/2xAA/modV/raw/master/docs/example-images/6.jpg)](https://github.com/2xAA/modV/raw/master/docs/example-images/6.png)
[![](https://github.com/2xAA/modV/raw/master/docs/example-images/7.jpg)](https://github.com/2xAA/modV/raw/master/docs/example-images/7.png)


## Contribution
modV is open to contribution. Currently the project needs (in order of priority):  
* a better UI
* work on the mediaManager and loading/saving Modules
* Module grouping (see [ModuleGroup (proposal)](https://github.com/2xAA/modV/wiki/ModuleGroup))
* layers (proposal to be written)
* full re-write for ES6
* more Modules

If you can help with any of these, please submit a PR and/or contact me at sam(at)wray.pro or on any of my socials.

## Acknowledgements
Thank you to:

* Hugh Rawlinson, Nevo Segal and Jakub Fiala for the incredible audio analysis engine, [meyda](https://github.com/hughrawlinson/meyda)
* [Dario Villanueva](http://alolo.co) for his advice and introduction to live visuals which inspired this whole project
* mrdoob for [THREE.js](https://threejs.org/)
* Lebedev Konstantin for [Sortable](https://github.com/RubaXa/Sortable)
* Charles J. Cliffe for [BeatDetktor](https://github.com/cjcliffe/beatdetektor)


## Requirements
- [node](https://nodejs.org/) (LTS is usually fine, this branch was built with 4.4.7 and has been confirmed to work with 4.5.0)
- [Google Chrome desktop](https://www.google.com/chrome/browser/desktop/) (not required for [standalone build](https://github.com/2xAA/modV#building-standalone-application))

## Installation
1. Download (clone or zip)
* Open a terminal, navigate to your downloaded folder (for example; ```cd ~/Downloads/modV/```)
* Run ```npm install```, this will install modV's required packages
* Once the installation has finished, run ```npm start```
* Open Chrome and go to ```http://localhost:3131```

## OS Specifics

### Windows
- You must run either Command Prompt or PowerShell with administrative privileges for the media folder to be symlinked.  
To do this, find either cmd or PowerShell in your start menu, right click and select 'Run as administrator.'.
- VB Cable is recommended to route audio to the browser, download that [here](http://vb-audio.pagesperso-orange.fr/Cable/)

### OS X/macOS
- SoundFlower is recommended to route audio to the browser, download that [here](https://github.com/mattingalls/Soundflower/releases/)

### Linux
- Jack may be the way to go for audio routing to the browser, but I have not tested this. Please submit a PR for this README if you have any information on this.

## Building standalone application
modV can also be built using [NWJS](http://nwjs.io/) as a standalone application.

To build modV make sure you have already run ```npm install``` and then run ```gulp build-nwjs```. After it has finished building your application should appear in ./nwjs/build/modV.

By default the build script will build for OS X 64-bit and Windows 64-bit. To change this, edit the ```build-nwjs``` task in ```gulpfile.js``` and modify the platform target array.  
For more information, please read [the nw-builder documentation](https://github.com/nwjs/nw-builder).