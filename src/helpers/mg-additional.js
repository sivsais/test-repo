/**
 * @namespace additional
 */
define(
    ['jquery', 'dat', 'mg-gui/utils/css', 'text!mg-gui/helpers/mg-additional.css', 'text!mg-gui/helpers/mg-additional-cross.svg'],
    function ($, GUI, css, style, cross) {
        var $body,
            click_point,
            isMove,
            default_start_position;

        default_start_position = {x: 0, y: 0};
        click_point = {};
        isMove = false;

        css.inject(style);

        function add_element(place, object) {
            var field;
            switch (object.type) {
                case 'text':
                    object.value += '';
                    field = place.add(object, 'value');
                    break;

                case 'slider':
                    field = place.add(object, 'value', object.min_value, object.max_value);
                    if (typeof object.step != 'undefined') {
                        field.step(object.step)
                    }
                    break;

                case 'checkbox':
                    field = place.add(object, 'value');
                    break;

                case 'select':
                    field = place.add(object, 'value', object.content);
                    break;

                case 'color':
                    field = place.addColor(object, 'value');
                    break;
            }
            if (object.init) {
                object.init();
            }
            field.name(object.name).listen();
            field.onChange(function (value) {
                object.change(value);
            });
        }

        /**
        * Additional is control panel. It can contain five types of fields: text input, checkbox,
         * slider, select menu and select color form.
        * @example
        *     var example_additional = {
        *    fields: [
        *        {folder_name:"folder",
        *            fields: [
        *                { name: 'txt',
        *                    type: 'text',
        *                    value: 1,
        *                    change: function (value) {console.log(value)},
        *                    init: function () {console.log(1)}
        *                },
        *                { name:'sld',
        *                    type:'slider',
        *                    value: 2,
        *                    min_value: 0,
        *                    max_value: 4,
        *                    step : 1,
        *                    change: function(value){console.log(value)}
        *                }]
        *        },
        *        { name:'sm',
        *            type:'select',
        *            value: 'ccc',
        *            content: ['aaa', 'bbb', 'ccc'],
        *            init: function () {console.log(2)},
        *            change: function(value){console.log(value)}
        *        },
        *        { name:'cb',
        *            type:'checkbox',
        *            value: true,
        *            change: function(value){console.log(value)}
        *        },
        *        { name:'col',
        *            type: 'color',
        *            value: "#ffae23",
        *            change: function(value){console.log(value)}
        *        }
        *    ]
        *};
        * additional.create(example_additional);
        * @typedef {Object} additional
        */
        return {
            /**
             * Create additional
             * @method additional.create
             * @param {Object} data
             * @param {Array} data.fields List of fields and folders of fields in additional.
             * @param {String} data.fields.name Field name.
             * @param {number||int||bool||string} data.fields.value Field value.
             * @param {function} [data.fields.init] Run after create field.
             * @param {function} [data.fields.change] Run when field value changed.
             * @param {String} data.fields.type Field type. It can be 'text', 'slider', 'select', 'checkbox' or 'color'
             * @param {String} [data.fields.folder_name] Folder name (if you want create folder).
             * @param {Array} [data.fields.fields] List of fields in folder (if you want create folder).
             * @returns {{domElem: (*|jQuery), data: Object, remove: Function}}
             */
            create: function (data) {
                var $move_panel,
                    $gui_container,
                    $additional,
                    $close,
                    gui;

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
                        left: default_start_position.x,
                        top: default_start_position.y
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
                    var place;
                    if (i.folder_name) {
                        place = gui.addFolder(i.folder_name);
                        i.fields.forEach(function (j) {
                            add_element(place, j);
                        })
                    } else {
                        place = gui;
                        add_element(place, i)
                    }
                });

                return {
                    domElem: $additional,
                    data: data,
                    remove: function () {
                        this.domElem.remove();
                    }
                }

            },
            /**
            * Change start position
            * @method additional.default_start_position
            * @param {Object} position
            * @param {number}  position.x
            * @param {number}  position.y
            */
            set default_start_position(position) {
                default_start_position.x = position.x;
                default_start_position.y = position.y;
            }
        };
    });