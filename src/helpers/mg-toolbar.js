define(['jquery', 'utils/css', 'text!helpers/mg-toolbar.css'], function ($, css, style) {

    css.inject(style);



    var exist = false;
    var $body;
    var $document;
    var box_exist = false;
    var columns;
    var box_columns;
    var $container;

    var $box = $('<div>').attr({id:'toolbar_box', class: 'hide'}).css({position: 'absolute'});

    var create_box = function(data) {
        $box.show();
        $box.empty();
        var $tb = $('.enabled');
        $box.offset({left: $tb.offset().left + $tb.width(), top: $tb.offset().top});
        $box.append(create_toolbar(data, box_columns))

    };
    var hide_box = function() {
        $box.hide();
    };
    var buttons = [];

    var create_toolbar = function(data, columns) {
        var $div = $('<div>')
            .append('<table>');

        var $table = $($div.children()[0]);


        var i, j, k;
        var fields = data.fields;


        for (i = 0; i < fields.length; i += columns) {
            var $tr = $('<tr>');
            for (j = i; j < columns + i; j++) {
                if (j < fields.length) {

                    if (fields[j].fields != undefined) {

                        for (k = 0; k < fields[j].fields.length; k++) {
                            fields[j].fields[k].parent = fields[j].id;
                        }
                    }

                    var $td = $('<td>');
                    var button = {
                        button: $td,
                        type: fields[j].type,
                        parent: fields[j].parent
                    };
                    $tr.append($td
                        .append($('<img>')
                            .attr('src', fields[j].icon)));
                    button.id = fields[j].id;
                    if (fields[j].type == 'button') {
                        button_click($td, fields, j);
                    }
                    else {
                        if (fields[j].type == 'menu') {
                            fields[j].callback = create_box;
                            fields[j].callback_disable = hide_box;
                        }
                        $td.addClass('disabled');
                        button.off = fields[j].callback_disable;
                        selectable_click($td, fields, j);
                    }
                    button.on = fields[j].callback;
                    buttons.push(button);
                }
            }
            $table.append($tr);
        }
        return $div;
    };

    var button_click = function($td, fields, index){
        (function(){
            var idx = index;
            $td.click(function () {
                fields[idx].callback();
            })
        })();
    };


    var selectable_click = function($td, fields, index){
        (function(){
            var idx = index;
            var field = fields[idx];
            var k;

            $td.click(function () {
                if($(this).hasClass('disabled')) {

                    $(this).removeClass('disabled').addClass('enabled');

                    for(k = 0; k < buttons.length; k++){

                        if(buttons[k].off != undefined && buttons[k].id != field.id && buttons[k].id != field.parent){
                            buttons[k].off();
                            buttons[k].button.removeClass('enabled').addClass('disabled');
                        }
                    }
                    fields[idx].callback(fields[idx]);
                }else{
                    $(this).addClass('disabled').removeClass('enabled');

                    fields[idx].callback_disable();

                }
            })
        })();
    };

    var toolbar = {
        refresh: function(data){
            buttons = [];
            $container.append(create_toolbar(data, columns))
        },
        init: function($toolbar_container, columns_count, box_columns_count) {
            $body = $('body');
            $document = $(document);
            exist = true;
            if($toolbar_container) {
                $container = $toolbar_container;
            }else{
                $container = $body;
            }
            if(columns_count) {
                columns = columns_count;
            }else{
                columns = 2;
            }
            if(box_columns_count) {
                box_columns = box_columns_count;
            }else{
                box_columns = 3;
            }
            $body.append($box);
            $box.hide();
            buttons = [];
        },
        on: function (data) {

            if (exist) {
                $container.empty();
                $container.append(create_toolbar(data, columns));

            }
        }
    };
    return toolbar;
});






