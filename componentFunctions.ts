namespace DOM {
    export function box(child?: Element, styles?: Style[]) {
        const box = new BoxComponent();
        box.appendChild(child);
        box.applyStyles(styles);
        return box;
    }
} 