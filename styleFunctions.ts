namespace DOM {
    export function width(val: number): Style {
        return new Style(StyleName.width, val);
    }

    export function height(val: number): Style {
        return new Style(StyleName.height, val);
    }

    export function paddingLeft(val: number): Style {
        return new Style(StyleName.paddingLeft, val);
    }

    export function paddingTop(val: number): Style {
        return new Style(StyleName.paddingTop, val);
    }

    export function paddingRight(val: number): Style {
        return new Style(StyleName.paddingRight, val);
    }

    export function paddingBottom(val: number): Style {
        return new Style(StyleName.paddingBottom, val);
    }

    export function borderColor(val: number): Style {
        return new Style(StyleName.borderColor, val);
    }

    export function borderLeft(val: number): Style {
        return new Style(StyleName.borderLeft, val);
    }

    export function borderTop(val: number): Style {
        return new Style(StyleName.borderTop, val);
    }

    export function borderRight(val: number): Style {
        return new Style(StyleName.borderRight, val);
    }

    export function borderBottom(val: number): Style {
        return new Style(StyleName.borderBottom, val);
    }

    export function color(val: number): Style {
        return new Style(StyleName.color, val);
    }

    export function padding(val: number): Style {
        return new Style(StyleName.padding, val);
    }

    export function border(val: number): Style {
        return new Style(StyleName.border, val);
    }
} 