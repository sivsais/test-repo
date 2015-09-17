/**
 * @namespace popup
 */
define(['jquery', 'mg-gui/utils/css', 'text!mg-gui/helpers/mg-hint.css'], function ($, css, style) {
    var $div,
        $table,
        $body,
        $document,
        exist,
        popup,
        count,
        radio_count;

    $div = $('<div>')
        .attr('id', 'mg-gui-popup')
        .css({position: 'absolute',
            'z-index': 1000,
            'text-align': 'center',
            width: '100%',
            height: '100%'})
        .append('<table>');

    $table = $($div.children()[0]);
    exist = false;

    css.inject(style);

    function create_input_group(data, $box) {
        var i;
        for (i = 0; i < data.length; i++) {
            $box.append($('<label>').text(data[i].label).append(
                $('<input>')
                    .attr({type: 'text',
                        "data-popup-id": ++count})
                    .val(data[i].value)
                    .addClass('field')));
            data[i].id = count;
        }
    }
    function create_checkbox_group(data, $box) {
        var i, $input;
        for (i = 0; i < data.length; i++) {
            $box.append($('<label>').text(data[i].label).append($input =
                $('<input>')
                    .attr({type: 'checkbox',
                           "data-popup-id": ++count})
                    .addClass('field')
                    ));
            $input.prop("checked", data[i].value);
            data[i].id = count;
        }
        return $box;
    }
    function create_radio_group(data, $box) {
        var i, $input;
        for (i = 0; i < data.length; i++) {
            $box.append($('<label>').text(data[i].label).append($input =
                    $('<input>')
                        .attr({type: 'radio',
                               name: "radio_name+" + radio_count,
                               "data-popup-id": ++count})
                        .addClass('field')
            ));
            $input.prop("checked", data[i].value);
            data[i].id = count;
        }
        radio_count++;
        return $box;
    }

    function create_select_group(data, $box) {
        var i, j, $select, $opt;
        for (i = 0; i < data.length; i++) {
            $box.append($('<label>').text(data[i].label).append($select = $('<select>')));
            for (j = 0; j < data[i].options.length; j++) {
                $select.append($opt = $('<option>')
                        .text(data[i].options[j].name)
                        .val(data[i].options[j].value))
                    .addClass('field')
                    .attr({"data-popup-id": ++count});
                if (data[i].options[j].selected) {
                    $opt.attr("selected", "selected")
                }
                data[i].id = count;
            }
        }
        return $box;
    }

    /**
     * Popup is input panel. It can contain four types of input field: text input, checkbox, radio and select menu.
     * Also it has to contain at least one button.
     * Singleton.
     * @example
     *var example_popup = {
     *   fields: [
     *       {
     *           type: 'input',
     *           group: [{
     *               label: 'aaa',
     *               value: "bbb"
     *           },{
     *               label: 'ccc',
     *               value: "ddd"
     *           },{
     *               label: 'eee',
     *               value: "fff"
     *           }]
     *       },
     *       {
     *           type: 'checkbox',
     *           group: [{
     *               label: 'aaa',
     *               value: true
     *           },{
     *               label: 'ccc',
     *               value: true
     *           },{
     *               label: 'eee',
     *               value: false
     *           }]
     *       },
     *       {
     *           type: 'radio',
     *           group: [{
     *               label: 'aaa',
     *               value: true
     *           },{
     *               label: 'ccc',
     *               value: false
     *           },{
     *               label: 'eee',
     *               value: false
     *           }]
     *       },
     *       {
     *           type: 'select',
     *           group: [{
     *               label: 'aaa',
     *               options:[
     *                   {name:123,
     *                    value:1},
     *                   {name:1234,
     *                    value:2},
     *                   {name:12345,
     *                    value:3,
     *                    selected: true}
     *               ]
     *           },{
     *               label: 'aaa',
     *               options:[
     *                   {name:123,
     *                    value:1},
     *                   {name:1234,
     *                    value:2,
     *                    selected: true},
     *                   {name:12345,
     *                    value:3}
     *               ]
     *           }]
     *       }
     *   ],
     *   buttons: [
     *       { name:'button1',
     *         callback: function(data){console.log(data)}
     *       },
     *       { name:'button2',
     *           callback: function(data){console.log(data)}
     *       }
     *   ]
     *};
     * popup.on(example_popup)
     * @typedef {Object} popup
     */

    popup = {
        /**
         * Refresh and create popup
         * @method popup.on
         * @param {Object} data
         * @param {Array} data.fields List of groups in popup.
         * @param {string} data.fields.type Type of fields in group. It can be 'input', 'checkbox', 'radio' or 'select'.
         * @param {Array} data.fields.group List of fields.
         * @param {string} data.fields.group.label Label of field.
         * @param {number||int||bool||string} data.fields.group.value Value of field (if type isn't 'select').
         * @param {Array} [data.fields.group.options] List of options in select menu (if type is 'select').
         * @param {string} [data.fields.group.options.name] Option name (if type is 'select').
         * @param {number||int||bool||string} [data.fields.group.options.value] Option value (if type is 'select').
         * @param {bool} [data.fields.group.options.selected] True, if option selected (if type is 'select').
         * @param {Array} data.buttons List of buttons.
         * @param {String} data.buttons.name Button name.
         * @param {function} data.buttons.callback Run on button click.
         */
        on: function (data) {
            var i, k, $td, $button, j;
            if (!exist) {
                $body = $('body');
                $document = $(document);
                $body.append($div);
                exist = true;
            }
            count = 0;
            radio_count = 0;
            $div.show();
            $table.empty();
            for (i = 0; i < data.fields.length; i++) {
                $table.append(
                    $('<tr>').append($td = $('<td>'))
                );

                switch (data.fields[i].type){
                    case 'input':
                        create_input_group(data.fields[i].group, $td);
                        break;
                    case 'checkbox':
                        create_checkbox_group(data.fields[i].group, $td);
                        break;
                    case 'radio':
                        create_radio_group(data.fields[i].group, $td);
                        break;
                    case 'select':
                        create_select_group(data.fields[i].group, $td);
                        break;
                }
            }
            $('<tr>').append($td = $('<td>'));
            for (i = 0; i < data.buttons.length; i++) {

                $table.append(
                    $td.append($button = $('<button>').attr({type: 'button'}).text(data.buttons[i].name))
                );
                (function () {
                    var index = i;
                    $button.click(function () {
                        var $fields = $('.field'),
                            results = {};
                        for (j = 0; j < $fields.length; j++) {
                            if ($($fields[j]).attr("type") == "checkbox" || $($fields[j]).attr("type") == "radio") {
                                results[$($fields[j]).attr("data-popup-id")] = $($fields[j]).prop("checked");
                            }else {
                                results[$($fields[j]).attr("data-popup-id")] = $($fields[j]).val();
                            }
                        }
                        for (j = 0; j < data.fields.length; j++) {
                            for (k = 0; k < data.fields[j].group.length; k++) {
                                data.fields[j].group[k].value = results[data.fields[j].group[k].id]
                            }
                        }
                        data.buttons[index].callback(data);
                        popup.off();
                    });
                })();

            }
        },
        /**
         * Hide popup container
         * @method popup.off
         */
        off: function () {
            $div.hide();
        }
    };
    return popup;
});

