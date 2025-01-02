export function el(tag, options = {}) {
    const { classList, text, children, parent, attrs, on } = options;
    const $ = document.createElement(tag);
    if (classList) for (const c of classList) $.classList.add(c);
    if (text) $.appendChild(document.createTextNode(text));
    if (children) for (const c of children) $.appendChild(children);
    if (parent) parent.appendChild($);
    if (attrs) for (const attr in attrs) $.setAttribute(attr, attrs[attr]);
    if (on) for (const event in on) $.addEventListener(event, on[event]);
    return $;
}
