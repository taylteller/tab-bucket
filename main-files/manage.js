// Created by Taylor Najjar, November 2017. All rights reserved.

document.addEventListener('DOMContentLoaded', () => {
  chrome.storage.sync.get({storedPages: []}, function (result) {

    var storedPages = result.storedPages;
    var pagesList = document.getElementById('pages-list');

    var list = document.createElement('ul');

    //make sure there are saved pages and if so create the list, otherwise a default message is already showing
    if (storedPages.length > 0) {
      var removeHeader = document.createElement('li');
      removeHeader.innerText = "Remove?";
      list.appendChild(removeHeader);

      for (var i = 0; i < storedPages.length; i++) {
        var item = document.createElement('li');
        item.innerHTML = '&nbsp;&nbsp;<button type="button" class="button">x</button>&nbsp;&nbsp;' +
          storedPages[i].title + '  -  <a href="' + storedPages[i].url + '">' + storedPages[i].url + '</a>';
        list.appendChild(item);
      }

      pagesList.parentNode.replaceChild(list, pagesList);

      //listen for clicks on the remove buttons and delete the matching item from saved pages and from html list
      list.addEventListener('click', function(e) {
        if (e.target && e.target.matches(".button")) {
          var currentUrl = e.target.parentNode.getElementsByTagName('a')[0].href;
          var index = storedPages.findIndex(storedObjects => storedObjects.url === currentUrl);
          storedPages.splice(index, 1);
          chrome.storage.sync.set({storedPages: storedPages}, function() {
            var deleteMe = e.target.parentNode;
            e.target.parentNode.parentNode.removeChild(deleteMe);
          });
        }
      });
    }
  });
});