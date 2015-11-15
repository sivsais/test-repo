define(['mg-gui/helpers/mg-hint', 'mg-gui/helpers/mg-additional', 'mg-gui/helpers/mg-toolbar', 'mg-gui/helpers/mg-contextual', 'mg-gui/helpers/mg-popup'],
    function (hint, additional, toolbar, contextual, popup) {
        return {
            hint: hint,
            additional: additional,
            toolbar: toolbar,
            contextual: contextual,
            popup: popup
        }
    }
);