// Created by Taylor Najjar, November 2017. All rights reserved.

//get the current URL
function getCurrentTabUrl(callback) {
  var queryInfo = {
    active: true,
    currentWindow: true
  };

  chrome.tabs.query(queryInfo, (tabs) => {
    console.log('tabs',tabs);
    var tab = tabs[0];
    var url = tab.url;
    var title = tab.title;
    callback({url: url, title: title});
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

should also be a button to manage saved pages
when clicked it opens a page with all the saved pages and option to remove them
could use a specific html page that opens in a new tab, a foreach that displays
each array item as an openable link (in new tab) with a remove option next to it

add a checkbox under the 'display random page' button that when clicked makes the extension
choose randomly between a bookmark page and an app page. make sure the index for saved pages is non zero
could even make it so it checks how many items in bookmarks vs how many items in saved pages and
the probability of landing one or the other is proportional to the number of saved pages in each

fix UI
make icon
*/

document.addEventListener('DOMContentLoaded', () => {
  chrome.storage.sync.get({storedPages: []}, function (result) {

    var storedPages = result.storedPages;
    var saveOrRemove = document.getElementById('save-or-remove');
    var noDisplay = document.getElementById('no-display');
    var manage = document.getElementById('manage');

    getCurrentTabUrl((pageObject) => {

      var index = storedPages.findIndex(storedObjects => storedObjects.url === pageObject.url);

      if (index > -1) {
        saveOrRemove.innerText = "Remove from saved pages";
      }

      //if user clicks save or remove, it should save or remove page as appropriate
      saveOrRemove.addEventListener('click', function () {
        noDisplay.style.display = "none";
        if (index > -1) {
          //remove pageObject from array, update button & index
          storedPages.splice(index, 1);
          saveOrRemove.innerText = "Save current page";
          index = -1;
        } else {
          //add pageObject to array, update button & index
          storedPages.push(pageObject);
          saveOrRemove.innerText = "Remove from saved pages";
          index = storedPages.length - 1;
        }
        //then add it back to the stored array
        chrome.storage.sync.set({storedPages: storedPages});
      });

      //display random URL in new tab
      display.addEventListener('click', function () {
        if (storedPages.length > 0) {
          var randomPage = storedPages[Math.floor(Math.random() * storedPages.length)];
          chrome.tabs.create({ url: randomPage.url });
        } else {
          noDisplay.style.display = "block";
        }
      });

      //if user clicks Settings, open settings in new tab
      manage.addEventListener('click', function () {
        chrome.tabs.create({ url: 'manage.html' });
      });
    });
  });
});