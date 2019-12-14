"use strict"

// language

var pageHtml = 'home.html';
var lang;
var butn = '.language_butn';
var select = '.language_select';
var country;

var changText;
var page;


function language() {
    //console.log(arguments)
    country = $(select + ' '+ 'option:selected').text();
    console.log(butn, country);
    lang = $(select).val();
    var clickCount = 0;
    $(butn).text(country).addClass(lang);
    $(butn).click(function() {
        console.log(lang, country);
        if (clickCount == 0) {
            $(select).css('display', "block");
            clickCount = 1;
        } else {
            $(select).css('display', "none");
            clickCount = 0;
        }    
    });
    $(select).click(function() {
        $(butn).removeClass(lang);
        country = $(select + ' '+ 'option:selected').text();
        lang = $(select).val();
        $(butn).text(country).addClass(lang);
        clickCount = 0;
        $(select).css('display', "none");
        changText = text[lang];
        page = changText['index'];
        for (var key in page) {
            $(key).text(page[key]);
        }
        page = changText[pageHtml.slice(0, -5)];
        for (var key in page) {
            $(key).text(page[key]);
        }
    });
}

// province
function province() {
    var butnPr = '.province_butn';
    var selectPr = '.province_select';
    var province = $(selectPr + ' '+ 'option:selected').text();
    var clickCountPr = 0;
    console.log(butnPr, selectPr, province, clickCountPr);
    $(butnPr).text('Tanda-tanda provinsi ' + province);
    $(butnPr).click(function() {
        if (clickCountPr == 0) {
            $(selectPr).css('display', "block");
            clickCountPr = 1;
        } else {
            $(selectPr).css('display', "none");
            clickCountPr = 0;
        }
    });
    $(selectPr).click(function() {
        province = $(selectPr + ' '+ 'option:selected').text();
        $(butnPr).text('Tanda-tanda provinsi ' + province);
        clickCountPr = 0;
        $(selectPr).css('display', "none");
        console.log(clickCountPr, province);
    });
}

// menu
function menu() {
    var butnMenu = '.menu_butn';
    var selectMenu = '.menu_nav';
        console.log(butnMenu, selectMenu);
    var clickCountM = 0;
    $(butnMenu).click(function() {
        if (clickCountM == 0) {
            $(selectMenu).css('display', "block");
            clickCountM = 1;
        } else {
            $(selectMenu).css('display', "none");
            clickCountM = 0;
        }
    });
    $(selectMenu).click(function() {
        clickCountM = 0;
        $(selectMenu).css('display', "none");
    });
}

// create Page
function createPage(){                    // подстановка html-файла в index-файл по клику в меню
    $('#nav li a').click(function() {
        pageHtml = $(this).attr('href');
        getPage(pageHtml);
        if (pageHtml=='home.html') {  //включение jquery-функций для вставленного блока
            setTimeout(function () {
                province();
            }, 500);
        };
        setTimeout(function () {
            changText = text[lang];
        page = changText[pageHtml.slice(0, -5)];
        console.log(page);
        for (var key in page) {
            $(key).text(page[key]);
        };
        }, 200);
        
        return false;   //обязательно false, чтобы браузер не совершил переход на другую страницу
    });
}


function getPage() {  //вставка из url в <div id="content"> (замещает содержимое)
        $.ajax({
        url: pageHtml,
        dataType: "html",
        success: function(response) {
        document.getElementById('content').innerHTML = response;
        }
    });
}
$(function() {      //формируем начальную index-страницу(подстановка home)
    pageHtml = 'home.html';
    language();
    menu();
    getPage();
    createPage();
    setTimeout(function () {
        province();
    }, 500);      // Задержка вфполнения функции, чтобы элементы html успели добавится на страницу
});
