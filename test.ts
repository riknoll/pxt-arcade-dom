namespace DOM {
    export function test() {
        const el = verticalFlow([
            box(text("Party"), [borderBottom(1), padding(1), width(INHERIT), color(3)]),
            box(text("Save"), [borderBottom(1), padding(1), width(INHERIT), color(3)]),
            box(text("Close"), [borderBottom(1), padding(1), width(INHERIT), color(3)]),
        ])

        game.onShade(function () {
            el.draw();
        });
    }
}

DOM.test();