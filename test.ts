namespace ui {
    export function test() {

        const el = verticalFlow([
            box(nameView(), [width(FILL), alignRight(), borderRight(2)]),
            horizontalFlow([
                box(statsView(), [border(2)]),
                box(detailView(), [borderBottom(2), borderTop(2), borderRight(2)])
            ])
        ]);

        game.onShade(function () {
            el.draw();
        });
    }

    function statsView() {
        const nameStyle = [alignLeft(), width(FILL)];
        const statStyle = [alignRight(), width(FILL)];
        return box(
            verticalFlow([
                box(text("ATTACK"), nameStyle),
                box(text("89", [smallFont()]), statStyle),
                box(text("DEFENSE"), nameStyle),
                box(text("86", [smallFont()]), statStyle),
                box(text("SPEED"), nameStyle),
                box(text("152", [smallFont()]), statStyle),
                box(text("SPECIAL"), nameStyle),
                box(text("132", [smallFont()]), statStyle)
            ], [width(FILL)]),
            [color(1), width(60), padding(2)]);
    }

    function detailView() {
        const nameStyle = [alignLeft(), width(FILL)];
        const detailStyle = [alignLeft(), width(FILL), paddingLeft(10)];

        return box(
            verticalFlow([
                box(text("TYPE1/"), nameStyle),
                box(text("ELECTRIC", [smallFont()]), detailStyle),
                box(text(""), nameStyle),
                box(text("", [smallFont()]), detailStyle),
                box(text("no/"), nameStyle),
                box(text("44196", [smallFont()]), detailStyle),
                box(text("OT/"), nameStyle),
                box(text("Richard", [smallFont()]), detailStyle),
            ], [width(FILL)]),
            [color(1), width(60), padding(2)]);
    }

    function nameView() {
        return box(
            verticalFlow([
                box(text("SPARKY"), [width(FILL), alignLeft()]),
                box(hpView(), [alignRight(), paddingTop(1), paddingBottom(1), width(FILL)]),
                box(text("STATUS/OK"), [width(FILL), alignLeft()]),
            ], [width(FILL)]),
            [color(1), padding(2), width(70)]);
    }


    function hpView() {
        return horizontalFlow([
            box(text("HP:", [smallFont()]), [paddingTop(3)]),
            verticalFlow([
                box(text("L48", [smallFont()]), [width(FILL), alignCenter()]),
                box(undefined, [width(FILL), height(4), color(3), border(1)]),
                box(text("95/138", [smallFont()]), [width(FILL), alignRight()])
            ], [width(30), paddingBottom(5)])
        ]);
    }
}

ui.test();