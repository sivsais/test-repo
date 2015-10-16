/**
 * @namespace additional
 */
define(
    ['jquery', 'dat', 'mg-gui/utils/css', 'dat/controllers/NumberControllerBox',
        'text!mg-gui/helpers/mg-additional.css', 'text!mg-gui/helpers/mg-additional-cross.svg'],
    function ($, GUI, css, NumberControllerBox, style, cross) {
        var $body,

        default_start_position;

        default_start_position = {x: 0, y: 0};


        css.inject(style);

        function add_element(place, object) {
            var field, old_value;
            switch (object.type) {
                case 'text':
                    object.value  = object.value || "";
                    object.value += '';
                    field = place.add(object, 'value');
                    break;

                case 'slider':
                    object.value = object.value || Math.min(Math.max(0, object.min_value || 0), object.max_value ||0 );
                    old_value = object.value;
                    if (!object.step) {
                        object.step = 0.01;
                    }
                    object.value = object.step;
                    field = place.add(object, 'value', object.min_value, object.max_value);
                    if (typeof object.step != 'undefined') {
                        field.step(object.step)
                    }
                    object.value = old_value;
                    break;

                case 'checkbox':
                    object.value = !!object.value;
                    field = place.add(object, 'value');
                    break;

                case 'select':
                    object.value  = object.value || object.content[0];
                    field = place.add(object, 'value', object.content);
                    break;

                case 'color':
                    object.value  = object.value || '#ffffff';
                    field = place.addColor(object, 'value');
                    break;

                case 'number':
                    object.value = object.value || 0;
                    field = place.add(object, 'value');
                    object.step && field.step(object.step);
                    break;
            }
            if (object.init) {
                object.init();
            }
            field.name(object.name).listen();
            field.onChange(function (value) {
                object.change && object.change(value);
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
                    gui,
                    click_point,
                    isMove;

                click_point = {};
                isMove = false;

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
                }
                $body.append($additional);


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

                $gui_container.find('.cr').addClass('mg-gui-additional-row');
                $gui_container.find('.title').addClass('mg-gui-additional-title');
                $gui_container.find('.close-button').addClass('mg-gui-additional-close-button');
                $gui_container.find('.dg').addClass('mg-gui-additional-dg');

                gui.__controllers.forEach(function (ctrl) {
                    if (ctrl instanceof NumberControllerBox) {
                        var flag = false;
                        ctrl.setValue = (function () {
                            var tmp = ctrl.setValue;
                            return function () {
                                flag = true;
                                return tmp.apply(this, arguments);
                            }
                        })();

                        ctrl.updateDisplay = (function () {
                            var tmp = ctrl.updateDisplay;
                            return function () {
                                if (flag || this.isModified()) {
                                    flag = false;
                                    return tmp.apply(this, arguments);
                                }
                                return null;
                            }
                        })();
                    }
                });
                Object.keys(gui.__folders).forEach(function (folder) {
                    if (gui.__folders[folder] instanceof GUI) {
                        gui.__folders[folder].__controllers.forEach(function (ctrl) {
                            if (ctrl instanceof NumberControllerBox) {
                                var flag = false;
                                ctrl.setValue = (function () {
                                    var tmp = ctrl.setValue;
                                    return function () {
                                        flag = true;
                                        return tmp.apply(this, arguments);
                                    }
                                })();

                                ctrl.updateDisplay = (function () {
                                    var tmp = ctrl.updateDisplay;
                                    return function () {
                                        if (flag || this.isModified()) {
                                            flag = false;
                                            return tmp.apply(this, arguments);
                                        }
                                        return null;
                                    }
                                })();
                            }
                        });
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