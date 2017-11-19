// Created by Taylor Najjar, November 2017. All rights reserved.

//get the current URL
function getCurrentTabUrl(callback) {
  var queryInfo = {
    active: true,
    currentWindow: true
  };

  chrome.tabs.query(queryInfo, (tabs) => {
    var tab = tabs[0];
    var url = tab.url;
    console.assert(typeof url == 'string', 'tab.url should be a string');
    callback(url);
  })
  ;
}


/*
search array for url
store true/false url found
if true
show different message
else show default

on button press, if true
remove url from array
else add url to array

on other button press,
select random item from array
display it in new tab

fix UI

should also be a button to manage saved pages
when clicked it opens a page with all the saved pages and option to remove them
could use a specific html page that opens in a new tab, a foreach that displays
each array item as an openable link (in new tab) with a remove option next to it

^could also have an option to import all your bookmarks, if that's feasible
or if not, maybe just select randomly from bookmarks AND saved pages (as an option)
*/

document.addEventListener('DOMContentLoaded', () => {
  chrome.storage.sync.get({storedUrls: []}, function (result) {

    var storedUrls = result.storedUrls;
    var saveOrRemove = document.getElementById('save-or-remove');
    var noDisplay = document.getElementById('no-display');

    getCurrentTabUrl((url) => {
      var index = storedUrls.indexOf(url);
      if (index > -1) {
        saveOrRemove.innerText = "Remove from saved pages";
      }

      //if user clicks save or remove, it should save or remove page as appropriate
      saveOrRemove.addEventListener('click', function () {
        noDisplay.style.display = "none";
        if (index > -1) {
          //remove url from array, update button & index
          storedUrls.splice(index, 1);
          saveOrRemove.innerText = "Save current page";
          index = -1;
        } else {
          //add url to array, update button & index
          storedUrls.push(url);
          saveOrRemove.innerText = "Remove from saved pages";
          index = storedUrls.length - 1;
        }
        //then add it back to the stored array
        chrome.storage.sync.set({storedUrls: storedUrls});
      });

      display.addEventListener('click', function () {
        if (storedUrls.length > 0) {
          var randomUrl = storedUrls[Math.floor(Math.random() * storedUrls.length)];
          console.log('randomUrl',randomUrl);
          chrome.tabs.create({ url: randomUrl });
        } else {
          noDisplay.style.display = "block";
        }
      });
    });
  });
});