define(['jquery', 'mg-gui/utils/css', 'text!mg-gui/helpers/mg-toolbar.css'], function ($, css, style) {
    var exist,
        $body,
        $document,
        columns,
        box_columns,
        $container,
        $box,
        buttons,
        toolbar,
        all_fields,
        count;

    css.inject(style);

    exist = false;

    $box = $('<div>').attr({id: 'toolbar_box', class: 'hide'}).css({position: 'absolute'});

    function create_box(data) {
        var $tb = $('.enabled');
        $(".current_toolbar_menu").removeClass("current_toolbar_menu");
        $tb.addClass("current_toolbar_menu");
        $box.show();
        $box.empty();
        $box.offset({left: $tb.offset().left + $tb.width(), top: $tb.offset().top});
        $box.append(create_toolbar(data, box_columns, true))

    }
    function hide_box(button) {
        $box.hide();
        $(button.$button.find('img')).attr('src', button.icon);
        button.off = field_by_button(button).unselect;
        $box.find('.enabled').removeClass('enabled').addClass('disabled')
    }
    buttons = [];
    function field_by_button(button) {
        var i, j;
        for (i = 0; i < all_fields.length; i++) {
            if (button.$__toolbar_id == all_fields[i].$__toolbar_id) {
                return all_fields[i]
            }
            if (all_fields[i].fields) {
                for (j = 0; j < all_fields[i].fields.length; j++) {
                    if (button.$__toolbar_id == all_fields[i].fields[j].$__toolbar_id) {
                        return all_fields[i].fields[j]
                    }
                }
            }
        }
    }
    function button_by_field(field) {
        var i;
        for (i = 0; i < buttons.length; i++) {
            if (field.$__toolbar_id == buttons[i].$__toolbar_id) {
                return buttons[i]
            }
        }
    }
    function create_toolbar(data, columns, is_box) {
        var $div,
            $table,
            i, j, k,
            $tr,
            $td,
            button,
            fields;
        $div = $('<div>')
            .append('<table>');

        $table = $($div.children()[0]);
        if (!is_box) {
            all_fields = data.fields;
        }

        fields = data.fields;


        for (i = 0; i < fields.length; i += columns) {
            $tr = $('<tr>');
            for (j = i; j < columns + i; j++) {
                if (j < fields.length) {
                    button = {};
                    if (fields[j].$__toolbar_id) {
                        button.$__toolbar_id = fields[j].$__toolbar_id
                    }else {
                        fields[j].$__toolbar_id = count;
                        button.$__toolbar_id = count;
                        count++;
                    }

                    if (fields[j].fields != undefined) {

                        for (k = 0; k < fields[j].fields.length; k++) {
                            fields[j].fields[k].parent = fields[j].$__toolbar_id;
                        }
                    }

                    $td = $('<td>');
                    button.$button = $td;
                    button.type = fields[j].type;
                    button.icon = fields[j].icon;
                    button.parent = fields[j].parent;


                    $tr.append($td
                        .append($('<img>')
                            .attr('src', fields[j].icon)));
                    if (fields[j].type == 'button') {
                        button_click($td, fields, j);
                    }else {
                        if (fields[j].type == 'menu') {
                            fields[j].select = create_box;
                            fields[j].unselect = hide_box;
                        }
                        $td.addClass('disabled');
                        button.off = fields[j].unselect;
                        selectable_click($td, fields, j);
                    }
                    button.on = fields[j].select;
                    buttons.push(button);
                }
            }
            $table.append($tr);
        }
        return $div;
    }

    function button_click($td, fields, index) {
        (function () {
            var k,
                field,
                parent,
                idx = index;
            $td.click(function (event) {
                field = fields[idx];
                if (field.select) {
                    field.select();
                }
                for (k = 0; k < buttons.length; k++) {
                    if (buttons[k].off != undefined && buttons[k].$__toolbar_id != field.$__toolbar_id &&
                        buttons[k].$__toolbar_id != field.parent) {
                        if (buttons[k].$button.hasClass('enabled')) {
                            buttons[k].off(buttons[k]);
                            buttons[k].$button.removeClass('enabled').addClass('disabled');
                        }
                    }
                    if (buttons[k].$__toolbar_id == field.parent) {
                        parent = buttons[k];
                    }
                }
                if (field.type == "button" && parent) {
                    event.stopPropagation();
                }
            })
        })();
    }


    function selectable_click($td, fields, index) {
        (function () {
            var idx,
                field,
                k,
                parent,
                button,
                old;
            parent = undefined;
            idx = index;
            field = fields[idx];
            $td.click(function (event) {
                if ($(this).hasClass('disabled')) {

                    $(this).removeClass('disabled').addClass('enabled');

                    for (k = 0; k < buttons.length; k++) {
                        if (buttons[k].off != undefined && buttons[k].$__toolbar_id != field.$__toolbar_id &&
                            buttons[k].$__toolbar_id != field.parent) {
                            if (buttons[k].$button.hasClass('enabled')) {
                                buttons[k].off(buttons[k]);
                                buttons[k].$button.removeClass('enabled').addClass('disabled');
                            }
                        }
                        if (buttons[k].$__toolbar_id == field.parent) {
                            parent = buttons[k];
                        }
                    }
                    button = button_by_field(field);
                    if (button.on) {
                        button.on(fields[idx]);
                    }
                }else {
                    $(this).addClass('disabled').removeClass('enabled');
                    button = button_by_field(field);
                    if (button.off) {
                        button.off(button)
                    }
                }
                if (field.type == 'menu') {
                    event.stopPropagation();

                }
                if (parent && field.type != "button") {
                    $(parent.$button.find('img')).attr('src', field.icon);
                    old = parent.off;
                    parent.off = function () {
                        field.unselect();
                        old(parent)
                    };
                }
            })
        })();
    }

    toolbar = {
        refresh: function (data) {
            buttons = [];
            $container.append(create_toolbar(data, columns))
        },
        init: function ($toolbar_container, columns_count, box_columns_count) {
            $body = $('body');
            $document = $(document);
            exist = true;
            if ($toolbar_container) {
                $container = $($toolbar_container);
            }else {
                $container = $body;
            }
            if (columns_count) {
                columns = columns_count;
            }else {
                columns = 2;
            }
            if (box_columns_count) {
                box_columns = box_columns_count;
            }else {
                box_columns = 3;
            }
            $body.append($box);
            $box.hide();
            $body.click(function () {
                $box.hide();
                if ($box.find('.enabled').length == 0) {
                    $('.current_toolbar_menu').removeClass('enabled').addClass('disabled')
                }
            });
            count = 1;
        },
        on: function (data) {

            if (exist) {
                $container.empty();
                $container.append(create_toolbar(data, columns, false));

            }
        }
    };
    return toolbar;
});






