namespace DOM {
    export class ShapeElement extends Element {
        color: number;

        constructor() {
            super();

            this.color = 0;
        }

        protected drawSelf(bounds: BoundingBox) {
            if (this.color) this.drawShape(bounds);
        }

        protected drawShape(bounds: BoundingBox) {
            screen.drawRect(bounds.left, bounds.top, bounds.height, bounds.width, this.color);
        }

        applyStyle(style: Style) {
            if (style.name === StyleName.color) {
                this.color = style.value
            }
            else {
                super.applyStyle(style);
            }
        }
    }

    export class BoxComponent extends ShapeElement {
        protected drawShape(bounds: BoundingBox) {
            screen.fillRect(bounds.left, bounds.top, bounds.height, bounds.width, this.color);
        }
    }
}