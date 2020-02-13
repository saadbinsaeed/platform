/* @flow */
import html2canvas from 'html2canvas';

export const domToImage = (domNode: Node, type: string, options: Object) => {
    const { maxWidth, ...rest } = options;
    return html2canvas(domNode, rest).then((canvas) => {
        // console.log('$$$ canvas', canvas.width, canvas.height);
        if (maxWidth && canvas.width > maxWidth) {
            const scale = canvas.width / maxWidth;
            const outerCanvas = document.createElement('canvas');
            outerCanvas.setAttribute('width', String(maxWidth));
            outerCanvas.setAttribute('height', String(canvas.height / scale));
            const context = outerCanvas.getContext('2d');
            context.drawImage(canvas, 0, 0, canvas.width, canvas.height, 0, 0, maxWidth, canvas.height / scale);
            return outerCanvas.toDataURL(type);
        }
        return canvas.toDataURL(type);
    });
};
