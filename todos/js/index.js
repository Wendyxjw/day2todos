jQuery(function ($) {
    'use strict';
    var store = {
        saveLocal: function (nameLoaclstore, data) {
            var list = JSON.parse(localStorage.getItem("list")) || [];
            list.push(data);
            localStorage.setItem("list", JSON.stringify(list));
        },
        createLi: function (inputVal) {
            var d = new Date()
            var vYear = d.getFullYear()
            var vMon = d.getMonth() + 1
            var vDay = d.getDate()
            var h = d.getHours();
            var m = d.getMinutes();
            var se = d.getSeconds();
            var s = vYear + (vMon < 10 ? "0" + vMon : vMon) + (vDay < 10 ? "0" + vDay : vDay) + (h < 10 ? "0" + h : h) + (m < 10 ? "0" + m : m) + (se < 10 ? "0" + se : se);
            $("#inputList").append('<li id="' + s + '" class="active"><div><input type="checkbox"><lable>' + inputVal + '</lable><span>×</span></div><input type="text" class="display_none" value="'+inputVal+'" ></li>');
            $("#inputText").val('');
            var a = {id: s, state: 'active', val: inputVal};
            this.saveLocal('list', a);
            //console.log(localStorage.getItem("list"))
        }
    };
    var a = {
        start: function () {
            this.initialize();
        },
        initialize: function () {
            this.store = JSON.parse(localStorage.getItem("list")) || [];
            //console.log(this.store);
            if (this.store.length > 0) {
                for (var i = 0; i < this.store.length; i++) {
                    var check;
                    this.store[i].state == 'completed' ? check = '<input type="checkbox" checked>' : check = '<input type="checkbox">';
                    $("#inputList").append('<li id="' + this.store[i].id + '" class="' + this.store[i].state + '"><div>' + check + '<lable>' + this.store[i].val + '</lable><span>×</span></div><input type="text" class="display_none" value="'+this.store[i].val+'" ></li>');
                }
                this.displayFooter();
            }
            this.bindEvent();
        },
        bindEvent: function () {
            $("#inputText").on("keyup", this.createList.bind(this));
            $("#inputList li").on("mouseover", this.showDelete)
                .on("mouseleave", this.hideDelete)
                .on("dblclick", this.changeText);
            $('#inputList input[type="text"]').on("blur", this.saveText);
            $("#inputList span").on("click", this.deleteList.bind(this));
            $('#inputList li input[type="checkbox"]').on("click", this.completedList.bind(this));
            $('#all').on("click", this.schedule);
            $('#completed').on("click", this.schedule);
            $('#active').on("click", this.schedule);
            $('#clearCompleted').on("click", this.clearCompleted.bind(this));
        },
        createList: function (e) {
            var inputVal = $("#inputText").val().trim();
            if (e.keyCode == 13 && inputVal.length > 0) {
                store.createLi(inputVal);
                this.bindEvent();
                this.displayFooter();
            }
        },
        showDelete: function () {
            $(this).find("span").css("display", "block");
        },
        hideDelete: function () {
            $(this).find("span").css("display", "none");
        },
        changeText: function () {
            $(this).find("div").hide();
            $(this).find("input[type='text']").show().focus();
        },
        saveText: function () {
            var a=$(this).val();
            $(this).parent().find("div").show();
            $(this).parent().find("lable").text(a);
            $(this).hide();

            var json = JSON.parse(localStorage.getItem("list")) || [];
            for (var i = 0; i < json.length; i++) {
                if (json[i].id == $(this).parent().attr('id')) {
                    json[i].val = a;
                }
            }
            localStorage["list"] = JSON.stringify(json);

        },
        deleteList: function (e) {
            e.target.parentElement.remove();
            var json = JSON.parse(localStorage.getItem("list")) || [];
            for (var i = 0; i < json.length; i++) {
                if (json[i].id == e.target.parentElement.id) {
                    json.splice(i, 1);//splice（删除位置，删除个数，替换参数）从数组中删除数据
                }
            }
            localStorage["list"] = JSON.stringify(json);
            this.displayFooter();
            //console.log(localStorage["list"]);
        },
        completedList: function (e) {
            var a = e.target.parentElement.parentElement.className;
            a == "completed" ? a = "active" : a = "completed";
            e.target.parentElement.parentElement.className = a;
            var json = JSON.parse(localStorage.getItem("list")) || [];
            for (var i = 0; i < json.length; i++) {
                if (json[i].id == e.target.parentElement.parentElement.id) {
                    json[i].state = a;
                }
            }
            localStorage["list"] = JSON.stringify(json);
            this.displayFooter();
        },
        schedule: function () {
            var state = $(this).attr('id');
            if (state == 'completed') {
                $(".active").hide();
                $(".completed").show();
            }
            else if (state == 'active') {
                $(".active").show();
                $(".completed").hide();
            }
            else if (state == 'all') {
                $("#inputList li").show();
            }
        },
        clearCompleted: function () {
            $('.completed').remove();
            var json = JSON.parse(localStorage.getItem("list")) || [];
            for (var i = 0; i < json.length; i++) {
                if (json[i].state == 'completed') {
                    json.splice(i, 1);//splice（删除位置，删除个数，替换参数）从数组中删除数据
                }
            }
            localStorage["list"] = JSON.stringify(json);
            this.displayFooter();
        },
        displayFooter: function () {
            a = JSON.parse(localStorage.getItem("list")) || [];
            a.length == 0 ? $('#footer').hide() : $('#footer').show();
            this.listSum();
        },
        listSum: function () {
            var json = JSON.parse(localStorage.getItem("list")) || [];
            $("#footer span strong").text(json.length);
        }
    }

    //store.saveLocal();
    a.start();
})