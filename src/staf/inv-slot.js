export function createInvSlotClass() {
    return class extends HTMLElement {
        constructor() {
            super();
            const canvas = document.createElement('canvas');
            canvas.width = 64;
            canvas.height = 64;
            const ctx = canvas.getContext("2d");
            ctx.imageSmoothingEnabled = false;
            ctx.font = "26px minecraft";
            ctx.fillStyle = "White";
            ctx.textAlign = "right"
            ctx.textBaseline = "bottom"
            for (let i = 0; i < this.attributes.length; i++) {
                const attr = this.attributes[i];
                canvas.setAttribute(attr.name, attr.value);
                this.removeAttribute(attr.name);
            }
            canvas.setAttribute("type", "cell")
            this.appendChild(canvas);
        }
    };
}