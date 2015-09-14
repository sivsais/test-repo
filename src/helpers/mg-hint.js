define(['jquery', 'utils/css', 'text!helpers/mg-hint.css'], function ($, css, style) {
    var $div,
        $table,
        exist,
        $body,
        $document,
        hint;

    $div = $('<div>')
        .attr('id', 'mg-gui-hint')
        .css({position: 'absolute'})
        .append('<table>');

    $table = $($div.children()[0]);
    exist = false;

    css.inject(style);

    hint = {
        data: {},

        on: function (position) {
            if (!exist) {
                $body = $('body');
                $document = $(document);
                $body.append($div);
                exist = true;
            }
            $div.show();
            $table.empty();
            Object.keys(hint.data).forEach(function (i) {
                $table.append(
                    $('<tr>').append($('<td>').text(i))
                        .append($('<td>').text(hint.data[i]))
                )
            });

            if (position) {
                $div.offset(
                    {
                        left: Math.min(Math.max(position.x, 0), $document.width() - $div.width()),
                        top: Math.min(Math.max(position.y, 0), $document.height() - $div.height())
                    }
                );
            }
        },

        off: function () {
            $div.hide();
        }
    };
    return hint;
});