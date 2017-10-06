// if brokeaf does not exist create brokeaf
chrome.bookmarks.search('BrokeAF', function(array) {
  if (!array[0]) {
    let obj = {parentId: "1", //Bookmarks Bar
    title: "BrokeAF"};
    chrome.bookmarks.create(obj);
  }
});

function checkHttps(url) { // in check url
  const https = url.slice(0, 5);
  const http = url.slice(0, 4);
  let newURL;
  if (https !== 'https' && http === 'http') {
    newURL = http + 's' + url.slice(5);
  }

  return newURL || url;
}

function checkURL(url) { // true for broken, false for working
  //this function will be inside recursion hell
  const xhr = new XMLHttpRequest();
  const sanitized = checkHttps(url);
  xhr.onreadystatechange = function() {
    // console.log(xhr.readyState, xhr.status);
  }
  xhr.open('GET', sanitized, false);
  xhr.send();
  // console.log('this is: ' ,xhr.status);
  return (xhr.status >= 300 || xhr.status === 0);
}

// const something = 'https://httpstat.us/100';
// console.log(checkURL(something));




function appendTitle_Move(object) { // append 'broken' to title and move
  // .update title with 'broken'
  chrome.bookmarks.update(object.id, {title: 'Broken - ' + object.title})


  chrome.bookmarks.search('BrokeAF', function(array) {
    // then .move with (object.id,
    chrome.bookmarks.move(object.id, array[0]);
  })
}

function recursionHell(rootArray) {
  if (!Array.isArray(rootArray.children)) { // if not true - it's a page object
    if(checkURL(rootArray.url)) {
      appendTitle_Move(rootArray);
    }
    return
  } else {
    for(let i = 0; i < rootArray.children.length; i += 1) {
      recursionHell(rootArray.children[i]);
    }
  }

  // let ifBroken = checkURL(object.url); // if true
  // if (ifBroken) --> append

  // iterate through rootArray
  // when element is array -> folder -> recursion
  // when element is not an array -> page object -> checkURL(page object) -> if: true -> appendTitle_Move(page object)
}
chrome.bookmarks.getTree(function(bookmarks) {//calling recursionhell here on root
  const root = bookmarks[0];
  // root holds [0-bar, 1-other]
  // bar & other -> objects (folder)
  // .children -> array of objects -> which can be either page / folder(children)

  recursionHell(root);
  //
  // console.dir(root);


  // root -> array of 2 with [0] bar, [1] other
  // folder = .children exist/not undefined
});
