$(function(){
  // Get URL-Parameter
  function getUrlParameter(sParam) {
    var sPageURL = decodeURIComponent(window.location.search.substring(1)),
      sURLVariables = sPageURL.split('&'),
      sParameterName,
      i;

    for (i = 0; i < sURLVariables.length; i++) {
      sParameterName = sURLVariables[i].split('=');

      if (sParameterName[0] === sParam) {
        return sParameterName[1] === undefined ? true : sParameterName[1];
      }
    }
  };

  // Delete empty Array-Elements
  Array.prototype.clean = function(deleteValue) {
    for (var i = 0; i < this.length; i++) {
      if (this[i] == deleteValue) {         
        this.splice(i, 1);
        i--;
      }
    }
    return this;
  };

  // Sort Array
  function sortByCategoryAsc(a, b){
    var a = a.count;
    var b = b.count; 
    return ((a < b) ? -1 : ((a > b) ? 1 : 0));
  }
  function sortByCategoryDesc(a, b){
    var a = a.count;
    var b = b.count; 
    return ((a > b) ? -1 : ((a < b) ? 1 : 0));
  }
  function sortByTitleAsc(a, b){
    var a = a.word;
    var b = b.word; 
    return ((a < b) ? -1 : ((a > b) ? 1 : 0));
  }
  function sortByTitleDesc(a, b){
    var a = a.word;
    var b = b.word; 
    return ((a > b) ? -1 : ((a < b) ? 1 : 0));
  }

  // Print toDos
  function printToDo(pos) {
    return '<tr><td>' + toDos[pos].title + '</td><td>' + toDos[pos].category + '</td><td><button class="btn btn-default btnDelete" id="' + toDos[pos].id + '" role="button">Delete</button></td></tr>';
  }

  function printToDos(searchTerm) {
    var code = "";
    var toDo;
    var searchRegex = new RegExp(searchTerm, "i");
    toDoStrings = localStorage.getItem('toDos');
    if (toDoStrings != null) {
      toDoStrings = toDoStrings.split('||');
      console.log(toDoStrings);
      toDos = [];
      for (var i = 0; i < toDoStrings.length; i++) {
        toDoParts = toDoStrings[i].split(';;');
        toDo = {
          'id': toDoParts[0],
          'title': toDoParts[1],
          'category': toDoParts[2]
        }
        toDos.push(toDo);
      }
      for (var i = 0; i < toDos.length; i++) {
        if (searchTerm == '' || searchTerm == null) {
          code += printToDo(i);
        } else if (searchRegex.test(toDos[j].title) || searchRegex.test(toDos[j].category)) {
          code += printToDo(i);
        }
      }
    }
    $('.todo-table > tbody').html(code);
  }

  // Count toDos
  var toDos = [];
  $('.btnSave').click(function(){
    if (toDos.length == 0) {
      console.log(1);
      var newId = 1;
    } else {
      console.log(2);
      var newId = toDos[toDos.length - 1].id + 1;
    }
    var toDo = {
      'id': newId,
      'title': $('#title').val(),
      'category': $('#category').val()
    }
    console.log(toDo);
    toDos.push(toDo);
    
    var toDoString;
    for (var i = 0; i < toDos.length; i++) {
      toDoString += i + ';;' + toDos[i].title + ';;' + toDos[i].category;
      if (i != toDos.length - 1) {
        toDoString += '||';
      }
    }
    localStorage.setItem('toDos', toDoString);

    $('#title').val('');
    $('#category').val('');
    console.log(toDos);
    printToDos();
    console.log(toDos);
  });

  function countToDos() {
    var text = $('#text').val();
    toDos = [];
    var toDosTemplate;
    text = text
      .toLowerCase()
      .replace(/[^\u00c4\u00e4\u00d6\u00f6\u00dc\u00fc\u00dfa-z0-9]/gi, ' ')
      .trim()
      .split(/[ \r?\n|\r]+/)
      .clean("");

    text.forEach(function(part) {
      var x = 0;
      toDosTemplate = {word: "", count: ""};
      var found = false;
      while (x < toDos.length) {
        if (part == toDos[x].word) {
          toDos[x].count++;
          found = true;
        }
        x++;
      }
      if (!found) {
        toDos[x] = toDosTemplate;
        toDos[x].word = part;
        toDos[x].count = 1;
      }
    }, this);
    
    if (sortBy == 'word' && sortOrder != 'desc') {
      toDos = toDos.sort(sortByTitleAsc);
    } else if (sortBy == 'word' && sortOrder == 'desc') {
      toDos = toDos.sort(sortByTitleDesc);
    } else if (sortBy == 'count' && sortOrder == 'asc') {
      toDos = toDos.sort(sortByCategoryAsc);
    } else {
      toDos = toDos.sort(sortByCategoryDesc);
    }
    printToDos(null);
    printStats();
  }

  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }








  // Last modified date in footer
  var last_mod = $.datepicker.formatDate('dd.mm.yy', new Date(document.lastModified));
  $('#last_mod').html(last_mod);

  // Generate Sort-By-Buttons
  var sortBy = 'count';
  var sortOrder = 'desc';
  $('#sort_btn_block').on('click', '.btn-sort', function(){
    var id = this.id;
    if (id == 'wordAsc') {
      sortBy = 'word';
      sortOrder = 'asc';
    } else if (id == 'wordDesc') {
      sortBy = 'word';
      sortOrder = 'desc';
    } else if (id == 'countAsc') {
      sortBy = 'count';
      sortOrder = 'asc';
    } else if (id == 'countDesc') {
      sortBy = 'count';
      sortOrder = 'desc';
    }
    countToDos();


    var message = '<h4><small>Sort by:</small> ';
    var code = '';
    if (sortBy == 'word') {
      if (sortOrder == 'asc') {
        code += '<button class="btn btn-default btn-sort" id="wordDesc" role="button">Word DESC</button>';
        code += '<button class="btn btn-default btn-sort" id="countDesc" role="button">Count DESC</button>';
      } else {
        code += '<button class="btn btn-default btn-sort" id="wordAsc" role="button">Word ASC</button>';
        code += '<button class="btn btn-default btn-sort" id="countDesc" role="button">Count DESC</button>';
      }
    } else if (sortBy == 'count') {
      if (sortOrder == 'desc') {
        code += '<button class="btn btn-default btn-sort" id="wordAsc" role="button">Word ASC</button>';
        code += '<button class="btn btn-default btn-sort" id="countAsc" role="button">Count ASC</button>';
      } else {
        code += '<button class="btn btn-default btn-sort" id="wordAsc" role="button">Word ASC</button>';
        code += '<button class="btn btn-default btn-sort" id="countDesc" role="button">Count DESC</button>';
      }
    }
    
    if (sortBy == 'word') {
      if (sortOrder == 'asc') {
        message += 'Word ascending';
      } else {
        message += 'Word descending';
      }
    } else if (sortBy == 'count') {
      if (sortOrder == 'desc') {
        message += 'Count descending';
      } else {
        message += 'Count ascending';
      }
    } else {
      message += 'Count descending';
    }

    message += '</h4>';
    $('#sort_btn_block').html(message + code);
  });
  
  // Print toDos
  printToDos();
  
  // Search
  $('#search').bind('input propertychange', function() {
    printToDos(this.value);
  });
});