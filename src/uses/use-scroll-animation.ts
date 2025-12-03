import { onUnmounted, ref } from 'vue';
import anime from 'animejs';

/**
 * 滚动动画Hook
 */
export function useScrollAnimation() {
  const observer = ref<IntersectionObserver | null>(null);

  /**
   * 观察元素并触发动画
   *
   * @param el 要观察的元素
   * @param animationConfig anime.js动画配置
   * @param threshold 触发阈值
   */
  function observeElement(
    el: HTMLElement,
    animationConfig: anime.AnimeParams,
    threshold = 0.1,
  ) {
    observer.value = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            anime({
              targets: entry.target,
              ...animationConfig,
            });
            observer.value?.unobserve(entry.target);
          }
        });
      },
      { threshold },
    );

    observer.value.observe(el);
  }

  /**
   * 批量观察元素
   *
   * @param selector 元素选择器
   * @param animationConfig anime.js动画配置
   * @param threshold 触发阈值
   */
  function observeElements(
    selector: string,
    animationConfig: anime.AnimeParams,
    threshold = 0.1,
  ) {
    const elements = document.querySelectorAll(selector);
    elements.forEach(el => {
      // 确保元素是HTMLElement类型
      if (el instanceof HTMLElement) {
        observeElement(el, animationConfig, threshold);
      }
    });
  }

  /**
   * 淡入上移动画配置
   */
  const fadeInUpConfig: anime.AnimeParams = {
    opacity: [0, 1],
    translateY: [30, 0],
    duration: 800,
    easing: 'easeOutCubic',
  };

  /**
   * 淡入下移动画配置
   */
  const fadeInDownConfig: anime.AnimeParams = {
    opacity: [0, 1],
    translateY: [-30, 0],
    duration: 800,
    easing: 'easeOutCubic',
  };

  /**
   * 淡入左移动画配置
   */
  const fadeInLeftConfig: anime.AnimeParams = {
    opacity: [0, 1],
    translateX: [-30, 0],
    duration: 800,
    easing: 'easeOutCubic',
  };

  /**
   * 淡入右移动画配置
   */
  const fadeInRightConfig: anime.AnimeParams = {
    opacity: [0, 1],
    translateX: [30, 0],
    duration: 800,
    easing: 'easeOutCubic',
  };

  /**
   * 缩放淡入动画配置
   */
  const scaleInConfig: anime.AnimeParams = {
    opacity: [0, 1],
    scale: [0.8, 1],
    duration: 600,
    easing: 'easeOutBack',
  };

  /**
   * 清理观察器
   */
  function cleanup() {
    observer.value?.disconnect();
  }

  onUnmounted(() => {
    cleanup();
  });

  return {
    observeElement,
    observeElements,
    fadeInUpConfig,
    fadeInDownConfig,
    fadeInLeftConfig,
    fadeInRightConfig,
    scaleInConfig,
    cleanup,
  };
}
