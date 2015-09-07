require.config({
    baseUrl: './src',
    paths: {
        'jquery': '../bower_components/jquery/dist/jquery',
        'text': '../bower_components/text/text'
    },
    packages: [
        {
            name: 'dat',
            location: '../bower_components/dat-gui/src/dat',
            main: 'gui/GUI'
        }
    ]
});

define(['jquery', 'mg-gui'], function ($, helpers) {
    var hint = helpers.hint;
//    $(function () {
//        $(document).click(function (event) {
//            hint.off();
//            var pos = {x: event.pageX, y: event.pageY};
//            hint.data = pos;
//            hint.on(pos);
//        });
//    });
    var additional = helpers.additional;
    var example = {
        start_position : {
            x: 0,
            y: 0
        },
        fields: [
            { name:'txt',
                type:'text',
                value: 1,
                change: function(){console.log(1)}
            },
            { name:'sld',
                type:'slider',
                value: 2,
                min_value: 0,
                max_value: 4,
                step : 1,
                change: function(){console.log(2)}
            },
            { name:'sm',
                type:'select',
                value: 'ccc',
                content: ['aaa', 'bbb', 'ccc'],
                change: function(){console.log(3)}
            },
            { name:'cb',
                type:'checkbox',
                value: true,
                change: function(){console.log(4)}
            },
            { name:'col',
                type:'color',
                value: "#ffae23",
                change: function(){console.log(5)}
            }
        ]
    };

    var example_tool = {
        fields: [
            {id: 1,
                type: 'button',
                icon: './src/images/1.png',
                callback: function(){console.log(1)}
            },
            {id: 2,
                type: 'button',
                icon: './src/images/2.png',
                callback: function(){console.log(2)}
            },
            {id: 3,
                type: 'selectable',
                icon: './src/images/3.png',
                callback: function(){console.log(3)},
                callback_disable: function(){console.log(4)}
            },
            {id: 4,
                type: 'menu',
                icon: './src/images/4.png',
                fields:[
                    {id: 5,
                        type: 'button',
                        icon: './src/images/5.png',
                        callback: function(){console.log(5)}
                    },
                    {id: 6,
                        type: 'button',
                        icon: './src/images/6.png',
                        callback: function(){console.log(6)}
                    },
                    {id: 7,
                        type: 'selectable',
                        icon: './src/images/7.png',
                        callback: function(){console.log(7)},
                        callback_disable: function(){console.log(8)}
                    }
                ]

            }
        ]
    };
    var  example_tool_2 = {
        fields: [
            {id: 1,
                type: 'button',
                icon: './src/images/1.png',
                callback: function(){console.log(1)}
            },
            {id: 2,
                type: 'button',
                icon: './src/images/2.png',
                callback: function(){console.log(2)}
            },
            {id: 3,
                type: 'selectable',
                icon: './src/images/3.png',
                callback: function(){console.log(3)},
                callback_disable: function(){console.log(4)}
            }
        ]
    };
    $(document).ready(function() {
//        var add = additional.create(example);
//        example.fields[0].value = 'aaaa';
//        console.log(add);
        helpers.toolbar.init($('#toolbar_place'), 2, 1);
        helpers.toolbar.on(example_tool);
//        helpers.toolbar.refresh(example_tool_2);
//        helpers.contextual.init($('#toolbar_place'), 2);
//        helpers.contextual.on(example_tool_2)
    });

});