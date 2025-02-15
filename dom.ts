/** Creates an HTML element */
export function el(
    /** The tag name (eg, div, button, etc) */
    tag: string,
    /** Other things you might want to specify about the element */
    options: {
        /** An array of classes to give the element */
        classList?: string[],
        /** Some text content to give the element */
        text?: string,
        /** More elements to put inside it (after the text) */
        children?: HTMLElement[],
        /** The parent element to append the new element to */
        parent?: HTMLElement,
        /** Attributes to give the element */
        attrs?: Record<string, string>,
        /** Event handlers to attach to the element */
        on?: Record<string, EventListenerOrEventListenerObject>
    } = {}
): HTMLElement {
    const { classList, text, children, parent, attrs, on } = options;
    const $ = document.createElement(tag);

    if (classList) for (const c of classList) $.classList.add(c);
    if (text) $.appendChild(document.createTextNode(text));
    if (children) for (const c of children) $.appendChild(c);
    if (parent) parent.appendChild($);
    if (attrs) for (const attr in attrs) $.setAttribute(attr, attrs[attr]);
    if (on) for (const event in on) $.addEventListener(event, on[event]);

    return $;
}
