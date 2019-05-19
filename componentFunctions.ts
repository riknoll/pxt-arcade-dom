namespace DOM {
    export function box(child?: Element, styles?: Style[]) {
        const box = new BoxElement();

        if (child) {
            box.appendChild(child);
        }
        if (styles) {
            box.applyStyles(styles);
        }
        return box;
    }

    export function text(content: string, styles?: Style[]) {
        const text = new TextElement(content);
        if (styles) {
            text.applyStyles(styles);
        }
        return text;
    }

    export function verticalFlow(children: Element[], styles?: Style[]) {
        const container = new Element();
        if (styles) {
            container.applyStyles(styles);
        }

        for (const child of children) {
            container.appendChild(child)
        }

        return container;
    }

    export function horizontalFlow(children: Element[], styles?: Style[]) {
        const res = verticalFlow(children, styles);
        res.verticalFlow = false;
        return res;
    }
} 