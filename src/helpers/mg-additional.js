define(
    ['jquery', 'dat', 'mg-gui/utils/css', 'text!mg-gui/helpers/mg-additional.css', 'text!mg-gui/helpers/mg-additional-cross.svg'],
    function ($, GUI, css, style, cross) {
    var $body,
        click_point,
        isMove;

    click_point = {};
    isMove = false;

    css.inject(style);

    return {
        create: function (data) {
            var $move_panel,
                $gui_container,
                $additional,
                $close,
                gui;
            console.log(data);

            $additional = $('<div>')
                .addClass('mg-gui-additional')
                .css({position: 'absolute'})
                .append($move_panel = $('<div>')
                    .addClass('mg-gui-additional-move'))
                .append($gui_container = $('<div>')
                    .addClass('mg-gui-additional-container'));

            $close = $('<div>').addClass('mg-gui-additional-close').html(cross);
            $close.click(function () {
                $additional.remove();
            });
            $move_panel.append($close);

            if (!$body) {
                $body = $('body');
                $body.append($additional);
            }

            $additional.offset(
                {
                    left: data.start_position.x,
                    top: data.start_position.y
                }
            );


            $move_panel.mousedown(function (event) {
                isMove = true;
                click_point.x = event.pageX;
                click_point.y = event.pageY;
            });

            $move_panel.mouseup(function () {
                isMove = false;
            });

            $(document).mousemove(function (event) {
                if (isMove) {
                    $additional.offset(
                        {
                            left: $additional.offset().left + event.pageX - click_point.x,
                            top: $additional.offset().top + event.pageY - click_point.y
                        }
                    );
                    click_point.x = event.pageX;
                    click_point.y = event.pageY;
                }
            });


            gui = new GUI({autoPlace: false});
            $gui_container.append(gui.domElement);

            data.fields.forEach(function (i) {
                var field;

                switch (i.type) {
                    case 'text':
                        i.value += '';
                        field = gui.add(i, 'value');
                        break;

                    case 'slider':
                        field = gui.add(i, 'value', i.min_value, i.max_value);
                        if (typeof i.step != 'undefined') {
                            field.step(i.step)
                        }
                        break;

                    case 'checkbox':
                        field = gui.add(i, 'value');
                        break;

                    case 'select':
                        field = gui.add(i, 'value', i.content);
                        break;

                    case 'color':
                        field = gui.addColor(i, 'value');
                        break;
                }
                field.name(i.name).listen();
                field.onChange(function (value) {
                    i.change(value);
                    console.log("value", value)
                });
            });

            return {
                domElem: $additional,
                data: data,
                remove: function () {
                    this.domElem.remove();
                }
            }

        }
    };
});