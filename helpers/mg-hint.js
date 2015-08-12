define(['jquery'], function ($) {
    var div = $('<div>')
        .attr('id', 'mg-hint')
        .css({position: 'absolute'})
        .append('<table>');

    var $table = $(div.children()[0]);
    var exist = false;
    var $body;
    var $document;

    var hint = {
        data: {},

        on: function (position) {
            if (!exist) {
                $body = $('body');
                $document = $(document);
                $body.append(div);
                exist = true;
            }
            div.show();
            $table.empty();
            Object.keys(hint.data).forEach(function (i) {
                $table.append(
                    $('<tr>').append($('<td>').text(i))
                        .append($('<td>').text(hint.data[i]))
                )
            });

            if (position) {
                div.offset(
                    {
                        left: Math.min(Math.max(position.x, 0), $document.width() - div.width()),
                        top: Math.min(Math.max(position.y, 0), $document.height() - div.height())
                    }
                );
            }
        },

        off: function () {
            div.hide();
        }
    };
    return hint;
});