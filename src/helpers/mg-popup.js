define(['jquery', 'utils/css', 'text!helpers/mg-hint.css'], function ($, css, style) {
    var div = $('<div>')
        .attr('id', 'mg-gui-popup')
        .css({position: 'absolute',
            'z-index': 1000,
            'text-align': 'center',
            width: '100%',
            height:'100%'})
        .append('<table>');

    var $table = $(div.children()[0]);
    var exist = false;
    var $body;
    var $document;

    css.inject(style);

    var create_input_group = function(data, $box) {
        var i;
        for(i = 0; i < data.length; i++) {
            $box.append($('<label>').text(data[i].label).append(
                $('<input>')
                    .attr({type: 'text',
                        "data-popup-id": data[i].id})
                    .val(data[i].value)
                    .addClass('field')));
        }
    };
    var create_checkbox_group = function(data, $box) {
        var i, $input;
        for(i = 0; i < data.length; i++) {
            $box.append($('<label>').text(data[i].label).append($input =
                $('<input>')
                    .attr({type: 'checkbox',
                           "data-popup-id": data[i].id})
                    .addClass('field')
                    ));
            $input.prop("checked", data[i].value);
        }
        return $box;
    };
    var create_radio_group = function(data, $box, name) {
        var i, $input;
        for(i = 0; i < data.length; i++) {
            $box.append($('<label>').text(data[i].label).append($input =
                    $('<input>')
                        .attr({type: 'radio',
                               name: name,
                               "data-popup-id": data[i].id})
                        .addClass('field')
            ));
            $input.prop("checked", data[i].value);
        }
        return $box;
    };

    var create_select_group = function(data, $box) {
        var i, j, $select, $opt;
        for(i = 0; i < data.length; i++) {
            $box.append($('<label>').text(data[i].label).append($select = $('<select>')));
            for(j = 0; j < data[i].options.length; j++){
                $select.append($opt = $('<option>')
                        .text(data[i].options[j].name)
                        .val(data[i].options[j].value))
                    .addClass('field')
                    .attr({"data-popup-id": data[i].id});
                if(data[i].options[j].selected){
                    $opt.attr("selected", "selected")
                }
            }
        }
        return $box;
    };



    var popup = {

        on: function (data) {
            var i;
            if (!exist) {
                $body = $('body');
                $document = $(document);
                $body.append(div);
                exist = true;
            }

            div.show();
            $table.empty();
            var $td, $button;
            for(i = 0; i < data.fields.length; i++) {
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
                        create_radio_group(data.fields[i].group, $td, data.fields[i].name);
                        break;
                    case 'select':
                        create_select_group(data.fields[i].group, $td);
                        break;
                }
            }
            $('<tr>').append($td = $('<td>'));
            for(i = 0; i < data.buttons.length; i++){

                $table.append(
                    $td.append($button = $('<button>').attr({type: 'button'}).text(data.buttons[i].name))
                );
                (function(){
                    var index = i;
                    var j;
                    $button.click(function(){
                        var $fields = $('.field');
                        var results = {};
                        for(j = 0; j < $fields.length; j++){
                            if($($fields[j]).attr("type") == "checkbox" || $($fields[j]).attr("type") == "radio"){
                                results[$($fields[j]).attr("data-popup-id")] = $($fields[j]).prop("checked");
                            }else {
                                results[$($fields[j]).attr("data-popup-id")] = $($fields[j]).val();
                            }
                        }
                        data.buttons[index].callback(results);
                        popup.off();
                    });
                })();

            }
        },
        off: function () {
            div.hide();
        }
    };
    return popup;
});

