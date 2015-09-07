define(['jquery', 'utils/css', 'text!helpers/mg-contextual.css'], function ($, css, style) {

    css.inject(style);



    var exist = false;
    var $body;
    var $document;
    var columns;
    var $container;


    var buttons;

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

                        if(buttons[k].off != undefined && buttons[k].id != field.id){
                            buttons[k].off();
                            buttons[k].button.removeClass('enabled').addClass('disabled');
                        }
                    }
                    fields[idx].callback();
                }else{
                    $(this).addClass('disabled').removeClass('enabled');

                    fields[idx].callback_disable();

                }
            })
        })();
    };

    var contextual = {
        init: function($toolbar_container, columns_count){
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
            buttons = [];
        },

        refresh: function(data){
            buttons = [];
            contextual.on($container, columns, data)
        },
        off: function() {
            $container.empty();
        },
        on: function (data) {
            if (exist) {

                var $div = $('<div>')
                    .append('<table>');

                var $table = $($div.children()[0]);

                $container.empty();
                $container.append($div);
                $div.show();
                var i, j, k;
                var fields = data.fields;


                for (i = 0; i < fields.length; i += columns) {
                    var $tr = $('<tr>');
                    for (j = i; j < columns + i; j++) {
                        if (j < fields.length) {

                            var $td = $('<td>');
                            var button = {
                                button: $td,
                                type: fields[j].type
                            };
                            $tr.append($td
                                .append($('<img>')
                                    .attr('src', fields[j].icon)));
                            button.id = fields[j].id;
                            if (fields[j].type == 'button') {
                                button_click($td, fields, j);
                            }
                            else {
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
            }
        }
    };

    return contextual;
});






