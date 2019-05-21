namespace DOM {
    export function test() {
        // const el = verticalFlow([
        //     box(text("Party"), [borderBottom(1), padding(1), width(INHERIT), color(3)]),
        //     box(text("Save"), [borderBottom(1), padding(1), width(INHERIT), color(3)]),
        //     box(text("Close"), [borderBottom(1), padding(1), width(INHERIT), color(3)]),
        // ])

        const el = verticalFlow([
            box(nameView(), [width(INHERIT), alignRight(), borderRight(2)]),
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
        const nameStyle = [alignLeft(), width(INHERIT)];
        const statStyle = [alignRight(), width(INHERIT)];
        const el = box(
            verticalFlow([
                box(text("ATTACK"), nameStyle),
                box(text("89", [smallFont()]), statStyle),
                box(text("DEFENSE"), nameStyle),
                box(text("86", [smallFont()]), statStyle),
                box(text("SPEED"), nameStyle),
                box(text("152", [smallFont()]), statStyle),
                box(text("SPECIAL"), nameStyle),
                box(text("132", [smallFont()]), statStyle)
            ], [width(INHERIT)]),
            [color(1), width(60), padding(2)]);

        return el;
    }

    function detailView() {
        const nameStyle = [alignLeft(), width(INHERIT)];
        const detailStyle = [alignLeft(), width(INHERIT), paddingLeft(5)];

        const el = box(
            verticalFlow([
                box(text("TYPE1/"), nameStyle),
                box(text("ELECTRIC", [smallFont()]), detailStyle),
                box(text(""), nameStyle),
                box(text("", [smallFont()]), detailStyle),
                box(text("no/"), nameStyle),
                box(text("44196", [smallFont()]), detailStyle),
                box(text("OT/"), nameStyle),
                box(text("Richard", [smallFont()]), detailStyle),
            ], [width(INHERIT)]),
            [color(1), width(60), padding(2)]);

        return el;
    }

    function nameView() {
        const el = box(
            verticalFlow([
                box(text("SPARKY"), [width(INHERIT), alignLeft()]),
                box(hpView(), [alignRight(), paddingTop(1), paddingBottom(1), width(INHERIT)]),
                box(text("STATUS/OK"), [width(INHERIT), alignLeft()]),
            ], [width(INHERIT)]),
            [color(1), padding(2), width(70)]);

        return el;
    }


    function hpView() {
        const el =
            horizontalFlow([
                box(text("HP:", [smallFont()]), [paddingTop(3)]),
                verticalFlow([
                    box(text("L48", [smallFont()]), [width(INHERIT), alignCenter()]),
                    box(undefined, [width(INHERIT), height(4), color(3), border(1)]),
                    box(text("95/138", [smallFont()]), [width(INHERIT), alignRight()])
                ], [width(30)])
            ])

        return el;
    }
}

DOM.test();