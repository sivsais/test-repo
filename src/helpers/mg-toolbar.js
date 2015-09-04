define(['jquery', 'utils/css', 'text!helpers/mg-toolbar.css'], function ($, css, style) {

    css.inject(style);



    var exist = false;
    var $body;
    var $document;
    var box_exist = false;

    var $box = $('<div>').attr({id:'toolbar_box', class: 'hide'}).css({position: 'absolute'});
    var data = {
    };
    var create_box = function(data, id) {
        if(!box_exist){
            $body.append($box)
        }
        $box.show();
        $box.addClass('show');
        $box.empty();
        var $tb = $('#' + id + data.id);
        $box.offset({left: $tb.offset().left + $tb.width(), top: $tb.offset().top});
        toolbar.on($box, 1, 'tb_box', data);

    };
    var hide_box = function() {
        $box.hide();
        $box.addClass('hide')
    };
    var buttons = [];

    var toolbar = {
        on: function ($position, width, id, input) {
            if($box.hasClass('hide')){
                data = input;
            }
            var $div = $('<div>')
                .append('<table>');

            var $table = $($div.children()[0]);
            if (!exist) {
                $body = $('body');
                $document = $(document);
                exist = true;
            }
            $position.append($div);
            $div.show();
            $table.empty();
            var i, j, k;
            var fields = data.fields;
            for(i = 0; i < fields.length; i += width){
                var $tr = $('<tr>');
                for(j = i; j < width + i; j++){
                    if(j < fields.length) {
                        var $td = $('<td>');
                        var button = {
                            button: $td,
                            type: fields[j].type
                        };
                        $tr.append($td
                            .attr('id', id + fields[j].id)
                            .append($('<img>')
                                .attr('src', fields[j].icon)));
                        button.id = id + fields[j].id;
                        if (fields[j].type == 'button') {
                            (function(){
                                var index = j;
                                $td.click(function () {
                                    fields[index].callback();
                                })
                            })();
                        }
                        else {
                            if(fields[j].type == 'menu'){
                                fields[j].callback = create_box;
                                fields[j].callback_disable = hide_box;
                            }
                            $td.addClass('disabled');
                            (function(){
                                var index = j;
                                var self = $td;
                                $td.click(function () {
                                    if(self.hasClass('disabled')) {

                                        self.removeClass('disabled').addClass('enabled');
                                        fields[index].callback(fields[index], id);
                                        for(k = 0; k < buttons.length; k++){

                                            if(buttons[k].off != undefined && buttons[k].id!= this.id){
                                                buttons[k].off();
                                                buttons[k].button.removeClass('enabled').addClass('disabled');
                                            }
                                        }
                                    }else{
                                        self.addClass('disabled').removeClass('enabled');

                                        fields[index].callback_disable();

                                    }
                                })
                            })();
                            button.off = fields[j].callback_disable;
                        }
                        button.on = fields[j].callback;
                        buttons.push(button);
                    }
                }
                $table.append($tr);
            }
        }
    };
    return toolbar;
});






