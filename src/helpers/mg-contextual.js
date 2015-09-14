define(['jquery', 'utils/css', 'text!helpers/mg-contextual.css'], function ($, css, style) {

    var exist = false,
        $body,
        $document,
        columns,
        $container,
        buttons,
        contextual;

    css.inject(style);

    function button_click($td, fields, index) {
        (function () {
            var idx = index;
            $td.click(function () {
                fields[idx].callback();
            })
        })();
    }


    function selectable_click($td, fields, index) {
        (function () {
            var idx = index,
                field = fields[idx],
                k;

            $td.click(function () {
                if ($(this).hasClass('disabled')) {

                    $(this).removeClass('disabled').addClass('enabled');

                    for (k = 0; k < buttons.length; k++) {

                        if (buttons[k].off != undefined && buttons[k].id != field.id) {
                            buttons[k].off();
                            buttons[k].button.removeClass('enabled').addClass('disabled');
                        }
                    }
                    fields[idx].callback();
                }else {
                    $(this).addClass('disabled').removeClass('enabled');

                    fields[idx].callback_disable();

                }
            })
        })();
    }

    contextual = {
        init: function ($toolbar_container, columns_count) {
            $body = $('body');
            $document = $(document);
            exist = true;
            if ($toolbar_container) {
                $container = $toolbar_container;
            }else {
                $container = $body;
            }
            if (columns_count) {
                columns = columns_count;
            }else {
                columns = 2;
            }
            buttons = [];
        },

        refresh: function (data) {
            buttons = [];
            contextual.on($container, columns, data)
        },
        off: function () {
            $container.empty();
        },
        on: function (data) {
            var $div,
                $table,
                i, j,
                fields,
                $tr,
                $td,
                button;

            if (exist) {
                $div = $('<div>')
                    .append('<table>');

                $table = $($div.children()[0]);

                $container.empty();
                $container.append($div);
                $div.show();
                fields = data.fields;


                for (i = 0; i < fields.length; i += columns) {
                    $tr = $('<tr>');
                    for (j = i; j < columns + i; j++) {
                        if (j < fields.length) {

                            $td = $('<td>');
                            button = {
                                button: $td,
                                type: fields[j].type
                            };
                            $tr.append($td
                                .append($('<img>')
                                    .attr('src', fields[j].icon)));
                            button.id = fields[j].id;
                            if (fields[j].type == 'button') {
                                button_click($td, fields, j);
                            }else {
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






