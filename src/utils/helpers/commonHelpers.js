export const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};

export const scrollToElement = (elementId) => {
  const element = document.getElementById(elementId);

  if (element) {
    element.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }
};

export const isEmpty = (value) => {
  if (value === null || value === undefined) {
    return true;
  }

  if (typeof value === "string") {
    return value.trim() === "";
  }

  if (Array.isArray(value)) {
    return value.length === 0;
  }

  return false;
};

export const capitalizeFirstLetter = (value) => {
  if (!value) {
    return "";
  }

  return value.charAt(0).toUpperCase() + value.slice(1);
};

export const truncateText = (text, maxLength = 100) => {
  if (!text) {
    return "";
  }

  if (text.length <= maxLength) {
    return text;
  }

  return `${text.substring(0, maxLength).trim()}...`;
};

export const getCurrentYear = () => {
  return new Date().getFullYear();
};