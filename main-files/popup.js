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
    var title = tab.title;
    callback({url: url, title: title});
  })
  ;
}

//extract all URLs from bookmarks tree
function extractUrlsFromTree(node, array) {
  if(node.children) {
    node.children.forEach(function(child) { extractUrlsFromTree(child, array); });
  }

  if(node.url) {
    array.push({url: node.url});
  }
}

document.addEventListener('DOMContentLoaded', () => {

  chrome.storage.sync.get({storedPages: []}, function (result) {

    var storedPages = result.storedPages;
    var saveOrRemove = document.getElementById('save-or-remove');
    var saveOrRemoveLabel = document.getElementById('save-or-remove-label');
    var noDisplay = document.getElementById('no-display');
    var manage = document.getElementById('manage');

    getCurrentTabUrl((pageObject) => {

      var index = storedPages.findIndex(storedObjects => storedObjects.url === pageObject.url);

      if (index > -1) {
        saveOrRemove.innerText = "Remove!";
        saveOrRemoveLabel.innerText = "Page is saved! Remove it from tab bucket?";
      }

      //if user clicks save or remove, it should save or remove page as appropriate
      saveOrRemove.addEventListener('click', function () {
        noDisplay.style.display = "none";
        if (index > -1) {
          //remove pageObject from array, update button & index
          storedPages.splice(index, 1);
          saveOrRemove.innerText = "Save!";
          saveOrRemoveLabel.innerText = "Save this page in tab bucket?";
          index = -1;
        } else {
          //add pageObject to array, update button & index
          storedPages.push(pageObject);
          saveOrRemove.innerText = "Remove!";
          saveOrRemoveLabel.innerText = "Page is saved! Remove it from tab bucket?";
          index = storedPages.length - 1;
        }
        //then add it back to the stored array
        chrome.storage.sync.set({storedPages: storedPages});
      });

      //display random URL in new tab
      display.addEventListener('click', function () {
        var bookmarks = document.getElementById('bookmarks').checked;
        var bookmarksArr = [];
        var pagesToChooseFrom = storedPages;

        //handle including bookmarks in bucket
        chrome.bookmarks.getTree(function (tree) {
          tree.forEach(function (item) {
            extractUrlsFromTree(item, bookmarksArr);
          });

          if (bookmarks) {
            pagesToChooseFrom = storedPages.concat(bookmarksArr);
          }

          if (pagesToChooseFrom.length > 0) {
            var randomPage = pagesToChooseFrom[Math.floor(Math.random() * pagesToChooseFrom.length)];
            chrome.tabs.create({ url: randomPage.url });
          } else {
            noDisplay.style.display = "flex";
          }
        });

      });

      //if user clicks Manage, open saved pages page in new tab
      manage.addEventListener('click', function () {
        chrome.tabs.create({ url: 'manage.html' });
      });
    });
  });
});