/**
 * @namespace hint
 */
define(['jquery', 'mg-gui/utils/css', 'text!mg-gui/helpers/mg-hint.css'], function ($, css, style) {
    var $div,
        $table,
        exist,
        $body,
        $document,
        hint;

    $div = $('<div>')
        .addClass("mg-hint")
        .css({position: 'absolute'})
        .append('<table>');

    $table = $($div.children()[0]);
    exist = false;

    css.inject(style);


    /**
     * Hint is interface element, which show key-value table. You may use it for show prompt or title.
     * Singleton.
     * @typedef {Object} hint
     * @property {Object} data Input data like table which will be show
     */
    hint = {
        data: {},

        /**
         * Show hint in mentioned position
         * @method hint.on
         * @param {Object} [position] Set position of hint. If undefined used last point
         * @param {number} position.x
         * @param {number} position.y
         */
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

        /**
         * Hide hint
         * @method hint.off
         */
        off: function () {
            $div.hide();
        }
    };
    return hint;
});