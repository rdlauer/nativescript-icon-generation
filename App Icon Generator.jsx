// Photoshop Script to Create App Icons
//
// WARNING!!! In the rare case that there are name collisions, this script will
// overwrite (delete perminently) files in the same folder in which the selected
// master icon file is located. Therefore, to be safe, before running the
// script, it's best to make sure the selected master icon file is the only
// file in its containing folder.
//
// Copyright (c) 2010 Matt Di Pasquale
// Added tweaks Copyright (c) 2012 by Josh Jones http://www.appsbynight.com
// Updates, Android, and Windows support Copyright (c) 2016 by Rob Lauer
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.
//
// Prerequisite:
// 1) Create a (minimum) 1024x1024 px PNG file.
// 2) Specify the root directory you would like to save icons in below (default is desktop).
//
// Run:
// 1) With Photoshop open, navigate to File > Scripts > Browse and choose this file ("App Icon Generation.jsx").
// 2) When prompted, select the prepared master icon file for your app (minimum 1024x1024px).
// 3) When prompted, choose the folder in which you would like all of the icon files to be saved.
//
// NOTE: Windows icon generation does NOT generate wide tiles, since they are not square.
//
// Turn debugger on. 0 is off.
// $.level = 1;

try {
	// Prompt user to select master icon file. Clicking "Cancel" returns null.
	var masterIcon = File.openDialog("Select a sqaure PNG file that is at least 1024x1024.", "*.png", false);

	if (masterIcon !== null) {

		var doc = open(masterIcon, OpenDocumentType.PNG);

		if (doc == null) {
			throw "Something is wrong with the file.  Make sure it's a valid PNG file.";
		}

		var startState = doc.activeHistoryState;       // save for undo
		var initialPrefs = app.preferences.rulerUnits; // will restore at end
		app.preferences.rulerUnits = Units.PIXELS;     // use pixels

		if (doc.width != doc.height) {
			throw "Image is not square";
		} else if ((doc.width < 1024) && (doc.height < 1024)) {
			throw "Image is too small! Image must be at least 1024x1024 pixels.";
		} else if (doc.width < 1024) {
			throw "Image width is too small! Image width must be at least 1024 pixels.";
		} else if (doc.height < 1024) {
			throw "Image height is too small! Image height must be at least 1024 pixels.";
		}

		// Folder selection dialog
		var destFolder = Folder.selectDialog("Choose an output folder");

		if (destFolder == null) {
			// User canceled, just exit
			throw "";
		}

		// Save icons in PNG using Save for Web.
		var sfw = new ExportOptionsSaveForWeb();
		sfw.format = SaveDocumentType.PNG;
		sfw.PNG8 = false; // use PNG-24
		sfw.transparency = true;
		doc.info = null;  // delete metadata

		var icon;

		// ###############
		// ##### iOS #####
		// ###############
		var iosIcons = [
			{"name": "Icon-Small",  "size": 29},
			{"name": "Icon-Small-40",  "size": 40},
			{"name": "Icon-Watch-Not-38mm",  "size": 48},
			{"name": "Icon-Small-50",  "size": 50},
			{"name": "Icon-Watch-Not-42mm",  "size": 55},
			{"name": "Icon",  "size": 57},
			{"name": "Icon-Small@2x",  "size": 58},
			{"name": "Icon-72",  "size": 72},
			{"name": "Icon-76",  "size": 76},
			{"name": "Icon-Small-40@2x",  "size": 80},
			{"name": "Icon-Small@3x",  "size": 87},
			{"name": "Icon-Watch-Long-42mm",  "size": 88},
			{"name": "Icon-Small-50@2x",  "size": 100},
			{"name": "Icon@2x",  "size": 114},
			{"name": "Icon-60@2x",  "size": 120},
			{"name": "Icon-72@2x",  "size": 144},
			{"name": "Icon-76@2x",  "size": 152},
			{"name": "Icon-Watch-Short-38mm",  "size": 172},
			{"name": "Icon-60@3x",  "size": 180},
			{"name": "Icon-Watch-Short-42mm",  "size": 196},
			{"name": "iTunesArtwork",  "size": 512},
			{"name": "iTunesArtwork@2x",  "size": 1024}
		];

		// create directory
		var f = new Folder(destFolder + "/iOS");
		if (!f.exists) {
			f.create()
		}

		for (i = 0; i < iosIcons.length; i++) {
			icon = iosIcons[i];
			doc.resizeImage(icon.size, icon.size, // width, height
							null, ResampleMethod.BICUBICSHARPER);

			var destFileName = icon.name + ".png";

		//   if ((icon.name == "iTunesArtwork@2x") || (icon.name == "iTunesArtwork"))
		//   {
		//     // iTunesArtwork files don't have an extension
		//     destFileName = icon.name;
		//   }

			doc.exportDocument(new File(destFolder + "/iOS/" + destFileName), ExportType.SAVEFORWEB, sfw);
			doc.activeHistoryState = startState; // undo resize
		}

		//alert("iOS Icons created!");

		// ###################
		// ##### Android #####
		// ###################
		var androidIcons = [
			{"name": "icon",  "size": 36},
			{"name": "icon",  "size": 48},
			{"name": "icon",  "size": 72},
			{"name": "icon",  "size": 96},
			{"name": "icon",  "size": 144},
			{"name": "icon",  "size": 192},
			{"name": "icon",  "size": 512}
		];

		// create directory
		f = new Folder(destFolder + "/Android");
		if (!f.exists) {
			f.create()
		}

		for (i = 0; i < androidIcons.length; i++) {
			icon = androidIcons[i];
			doc.resizeImage(icon.size, icon.size, // width, height
							null, ResampleMethod.BICUBICSHARPER);

			var destFileName = icon.name + ".png";
			var destFolderAndroid;

			if (icon.size == 36) {
				destFolderAndroid = "drawable-ldpi";
			} else if (icon.size == 48) {
				destFolderAndroid = "drawable-mdpi";
			} else if (icon.size == 72) {
				destFolderAndroid = "drawable-hdpi";
			} else if (icon.size == 96) {
				destFolderAndroid = "drawable-xhdpi";
			} else if (icon.size == 144) {
				destFolderAndroid = "drawable-xxhdpi";
			} else if (icon.size == 192) {
				destFolderAndroid = "drawable-xxxhdpi";
			} else if (icon.size == 512) {
				destFolderAndroid = "google-play";
			}

			f = new Folder(destFolder + "/Android/" + destFolderAndroid);
			if (!f.exists) {
				f.create()
			}

			doc.exportDocument(new File(destFolder + "/Android/" + destFolderAndroid + "/" + destFileName), ExportType.SAVEFORWEB, sfw);
			doc.activeHistoryState = startState; // undo resize
		}

		// ###################
		// ##### Windows #####
		// ###################
		var winIcons = [
			{"name": "icon-100",  "size": 44},
			{"name": "icon-125",  "size": 55},
			{"name": "icon-150",  "size": 66},
			{"name": "icon-200",  "size": 88},
			{"name": "icon-400",  "size": 176},
			{"name": "small-tile-100",  "size": 71},
			{"name": "small-tile-125",  "size": 89},
			{"name": "small-tile-150",  "size": 107},
			{"name": "small-tile-200",  "size": 142},
			{"name": "small-tile-400",  "size": 284},
			{"name": "medium-tile-100",  "size": 150},
			{"name": "medium-tile-125",  "size": 188},
			{"name": "medium-tile-150",  "size": 225},
			{"name": "medium-tile-200",  "size": 300},
			{"name": "medium-tile-400",  "size": 600}
		];

		for (i = 0; i < winIcons.length; i++) {
			icon = winIcons[i];
			doc.resizeImage(icon.size, icon.size, // width, height
							null, ResampleMethod.BICUBICSHARPER);

			var destFileName = icon.name + ".png";

			f = new Folder(destFolder + "/Windows");
			if (!f.exists) {
				f.create()
			}

			doc.exportDocument(new File(destFolder + "/Windows/" + destFileName), ExportType.SAVEFORWEB, sfw);
			doc.activeHistoryState = startState; // undo resize
		}
	}
} catch (exception) {
	// Show debug message and then quit
	if (exception != null && exception != "") {
		alert(exception);
	}
} finally {
    if (doc != null) {
        doc.close(SaveOptions.DONOTSAVECHANGES);
	}
    app.preferences.rulerUnits = initialPrefs; // restore prefs
}