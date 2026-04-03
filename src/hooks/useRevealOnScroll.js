import { useEffect } from 'react';

function useRevealOnScroll(selector = '.reveal') {
  useEffect(() => {
    const markAsVisible = (item) => {
      item.classList.add('is-visible');
      item.setAttribute('data-revealed', 'true');
    };

    if (!('IntersectionObserver' in window)) {
      document.querySelectorAll(selector).forEach((item) => markAsVisible(item));
      return undefined;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          markAsVisible(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.14 });

    const observedItems = new WeakSet();

    const observePendingItems = (root = document) => {
      root.querySelectorAll(selector).forEach((item) => {
        if (item.dataset.revealed === 'true' || observedItems.has(item)) return;

        observedItems.add(item);
        observer.observe(item);
      });
    };

    observePendingItems();

    const mutationObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (!(node instanceof Element)) return;

          if (node.matches?.(selector)) {
            observePendingItems(node.parentElement || document);
            return;
          }

          observePendingItems(node);
        });
      });
    });

    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      mutationObserver.disconnect();
      observer.disconnect();
    };
  }, [selector]);
}

export default useRevealOnScroll;
