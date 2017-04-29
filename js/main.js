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
      if (this[i] === deleteValue) {         
        this.splice(i, 1);
        i--;
      }
    }
    return this;
  };

  // Print toDos
  function printToDo(pos) {
    return '<tr><td>' + toDos[pos].title + '</td><td>' + toDos[pos].category + '</td><td><button class="btn btn-default btnDelete" id="' + toDos[pos].id + '" role="button">Delete</button></td></tr>';
  }

  function printToDos(searchTerm) {
    var code = "";
    var toDo;
    var searchRegex = new RegExp(searchTerm, "i");
    toDoStrings = localStorage.getItem('toDos');
    if (toDoStrings !== null) {
      toDoStrings = toDoStrings.split('||');
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
    sortArray();
      for (var i = 0; i < toDos.length; i++) {
        if (searchTerm === '' || searchTerm === null) {
          code += printToDo(i);
        } else if (searchRegex.test(toDos[i].title) || searchRegex.test(toDos[i].category)) {
          code += printToDo(i);
        }
      }
    }
    $('.todo-table > tbody').html(code);
  }

  // Generate localStorage toDoString
  function localStorageString() {
    var toDoString;
    for (var i = 0; i < toDos.length; i++) {
      toDoString += i + ';;' + toDos[i].title + ';;' + toDos[i].category;
      if (i !== toDos.length - 1) {
        toDoString += '||';
      }
    }
    localStorage.setItem('toDos', toDoString);
  }

  // Count toDos
  var toDos = [];
  function saveToDo(){
    if ($('#title').val().trim() !== '' && $('#title').val().trim() !== null) {
      if (toDos.length === 0) {
        var newId = 1;
      } else {
        var newId = toDos[toDos.length - 1].id + 1;
      }
      var toDo = {
        'id': newId,
        'title': $('#title').val().trim(),
        'category': $('#category').val().trim()
      }
      toDos.push(toDo);

      localStorageString();

      $('#title').val('');
      $('#title').focus();
      $('#category').val('');
      printToDos();
    }
  }
  
  function deleteToDo(id) {
    toDos.splice(toDos.findIndex(x => x.id == id));
    localStorageString();
    printToDos();
  }

  // Sort Array
  function sortByCategoryAsc(a, b){
    var a = a.category;
    var b = b.category;
    return ((a < b) ? -1 : ((a > b) ? 1 : 0));
  }
  function sortByCategoryDesc(a, b){
    var a = a.category;
    var b = b.category;
    return ((a > b) ? -1 : ((a < b) ? 1 : 0));
  }
  function sortByTitleAsc(a, b){
    var a = a.title;
    var b = b.title;
    return ((a < b) ? -1 : ((a > b) ? 1 : 0));
  }
  function sortByTitleDesc(a, b){
    var a = a.title;
    var b = b.title;
    return ((a > b) ? -1 : ((a < b) ? 1 : 0));
  }

  function sortArray() {
    if (sortBy === 'category' && sortOrder === 'asc') {
      toDos = toDos.sort(sortByCategoryAsc);
    } else if (sortBy === 'category' && sortOrder === 'desc') {
      toDos = toDos.sort(sortByCategoryDesc);
    } else if (sortBy === 'title' && sortOrder === 'desc') {
      toDos = toDos.sort(sortByTitleDesc);
    } else {
      toDos = toDos.sort(sortByTitleAsc);
    } 
  }

  function sortBtns(){
    var id = this.id;
    if (id === 'categoryAsc') {
      sortBy = 'category';
      sortOrder = 'asc';
    } else if (id === 'categoryDesc') {
      sortBy = 'category';
      sortOrder = 'desc';
    } else if (id === 'titleAsc') {
      sortBy = 'title';
      sortOrder = 'asc';
    } else if (id === 'titleDesc') {
      sortBy = 'title';
      sortOrder = 'desc';
    }
    printToDos();

    var message = '<h4><small>Sort by:</small> ';
    var code = '';
    if (sortBy === 'category') {
      if (sortOrder === 'asc') {
        code += '<button class="btn btn-default btn-sort" id="categoryDesc" role="button">Category DESC</button>';
        code += '<button class="btn btn-default btn-sort" id="titleAsc" role="button">Title ASC</button>';
      } else {
        code += '<button class="btn btn-default btn-sort" id="categoryAsc" role="button">Category ASC</button>';
        code += '<button class="btn btn-default btn-sort" id="titleAsc" role="button">Title ASC</button>';
      }
    } else if (sortBy === 'title') {
      if (sortOrder === 'asc') {
        code += '<button class="btn btn-default btn-sort" id="categoryAsc" role="button">Category ASC</button>';
        code += '<button class="btn btn-default btn-sort" id="titleDesc" role="button">Title DESC</button>';
      } else {
        code += '<button class="btn btn-default btn-sort" id="categoryAsc" role="button">Category ASC</button>';
        code += '<button class="btn btn-default btn-sort" id="titleAsc" role="button">Title ASC</button>';
      }
    }
    
    if (sortBy === 'category') {
      if (sortOrder === 'asc') {
        message += 'Category ascending';
      } else {
        message += 'Category descending';
      }
    } else if (sortBy === 'title') {
      if (sortOrder === 'asc') {
        message += 'Title ascending';
      } else {
        message += 'Title descending';
      }
    } else {
        message += 'Title ascending';
    }

    message += '</h4>';
    $('#sort_btn_block').html(message + code);
  }

  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }









  // Generate Sort-By-Buttons
  var sortBy = 'title';
  var sortOrder = 'asc';
  $('#sort_btn_block').on('click', '.btn-sort', sortBtns);
  
  // Print toDos
  printToDos();

  // Last modified date in footer
  var last_mod = $.datepicker.formatDate('dd.mm.yy', new Date(document.lastModified));
  $('#last_mod').html(last_mod);
  
  // Search
  $('#search').bind('input propertychange', function() {
    printToDos(this.value);
  });

  // Save ToDo
  $('.btnSave').click(saveToDo);
  $('#category').keyup(function(event){
    if(event.keyCode === 13) {
        $("#btnSave").click();
    }
  });

  // Delete ToDo
  $(document).delegate('.btnDelete', 'click', function(){
    deleteToDo(this.id);
  });
});