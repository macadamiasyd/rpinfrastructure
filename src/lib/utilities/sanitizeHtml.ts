import DOMPurify from "isomorphic-dompurify";

export const sanitizeHTML = (text: string) => {
  return DOMPurify.sanitize(text, {
    ADD_TAGS: ["iframe"],
    ADD_ATTR: ["allow", "allowfullscreen", "frameborder", "scrolling", "src", "width", "height"],
  });
};
