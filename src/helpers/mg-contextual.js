/**
 * @namespace contextual
 */
define(['jquery', 'mg-gui/utils/css', 'text!mg-gui/helpers/mg-contextual.css'], function ($, css, style) {

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
    /**
     * Contextual is tool panel. It can contain two types of buttons. Simple button and selectable.
     * Singleton.
     * @example
     *     var example_contextual = {
     *     fields: [
     *      {   type: 'button',
     *          icon: './src/images/1.png',
     *          select: function(){console.log(1)}
     *      },
     *      {   type: 'selectable',
     *          icon: './src/images/2.png',
     *          select: function(){console.log(3)},
     *          unselect: function(){console.log(4)}
     *      }
     *     ]
     *     };
     *        helpers.contextual.init($('#contextual_place'), 2);
     *        helpers.contextual.on(example_contextual);
     *        helpers.contextual.off();
     * @typedef {Object} contextual
     */
    contextual = {
        /**
         * Save options of contextual.
         * @method contextual.init
         * @param {Object} $toolbar_container Set container of contextual. It can be jquery or DOM element.
         * @param {number} columns_count Column count in contextual.
         */
        init: function ($toolbar_container, columns_count) {
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
            buttons = [];
        },
        /**
         * Refresh contextual
         * @method contextual.refresh
         * @param {Object} data
         * @param {Array} data.fields List of buttons in contextual.
         * @param {string} data.fields.type Type of button. It can be 'button' or 'selectable'.
         * @param {string} data.fields.icon Source of image.
         * @param {function} [data.fields.select] Run on click or select.
         * @param {function} [data.fields.unselect] Run on deactivating.
         */
        refresh: function (data) {
            buttons = [];
            contextual.on(data)
        },
        /**
         * Clear contextual container
         * @method contextual.off
         */
        off: function () {
            $container.empty();
        },
        /**
         * Create contextual
         * @method contextual.refresh
         * @param {Object} data
         * @param {Array} data.fields List of buttons in contextual.
         * @param {string} data.fields.type Type of button. It can be 'button' or 'selectable'.
         * @param {string} data.fields.icon Source of image.
         * @param {function} [data.fields.select] Run on click or select.
         * @param {function} [data.fields.unselect] Run on deactivating.
         */
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






