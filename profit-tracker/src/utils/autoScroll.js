export const autoScrollToDetails = (elementRef) => {
  elementRef.current.scrollIntoView({ behavior: "smooth" });
};
