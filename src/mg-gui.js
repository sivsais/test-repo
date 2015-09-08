define(['helpers/mg-hint', 'helpers/mg-additional', 'helpers/mg-toolbar', 'helpers/mg-contextual', 'helpers/mg-popup'],
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