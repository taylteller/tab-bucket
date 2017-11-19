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
when clicked it opens a page with all the bookmarks and option to remove them
could use a specific html page that opens in a new tab, a foreach that displays
each array item as an openable link (in new tab) with a remove option next to it
*/

document.addEventListener('DOMContentLoaded', () => {
  chrome.storage.sync.get({storedUrls: []}, function (result) {
    console.log('result.storedUrls', result.storedUrls);
    var storedUrls = result.storedUrls;
    var saveOrRemove = document.getElementById('save-or-remove');
    getCurrentTabUrl((url) => {
      var index = storedUrls.indexOf(url);
      if (index > -1) {
        saveOrRemove.innerText = "Remove from saved pages";
      }
      console.log('index', index);

      //if user clicks save or remove, it should save or remove page as appropriate
      saveOrRemove.addEventListener('click', function () {
        if (index > -1) {
          //remove url from array, update button & index
          storedUrls.splice(index, 1);
          saveOrRemove.innerText = "Save current page";
          index = -1;
          console.log('index2', index);
        } else {
          //add url to array, update button & index
          storedUrls.push(url);
          saveOrRemove.innerText = "Remove from saved pages";
          index = storedUrls.length - 1;
          console.log('index3', index);
        }
        //then add it back to the stored array
        chrome.storage.sync.set({storedUrls: storedUrls});
        chrome.storage.sync.get(null, function (result) {
          console.log('result after setting', result);
        });
      });
    });
  });
});