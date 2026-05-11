// 이미지를 리사이즈 래퍼 div로 감싸기
export function wrapImageForResize(img: HTMLImageElement): void {
  if (img.closest('.img-resize-wrapper')) return;

  const wrapper = document.createElement('div');
  wrapper.className = 'img-resize-wrapper';
  wrapper.style.cssText =
    'position:relative; display:inline-block; line-height:0; max-width:100%;';

  img.parentNode?.insertBefore(wrapper, img);
  wrapper.appendChild(img);
}

// 이미지 래퍼에 드래그 리사이즈 핸들 표시
export function showResizeHandle(
  img: HTMLImageElement,
  editorEl: HTMLDivElement
): void {
  const wrapper = img.closest('.img-resize-wrapper') as HTMLElement | null;
  if (!wrapper) return;

  // 기존 핸들 제거 후 새로 생성
  wrapper.querySelector('.resize-handle')?.remove();

  const handle = document.createElement('div');
  handle.className = 'resize-handle';
  handle.style.cssText =
    'position:absolute; bottom:-4px; right:-4px; width:8px; height:8px;' +
    'background:#6C3FC5; cursor:se-resize; border-radius:2px; z-index:10;';
  wrapper.appendChild(handle);

  handle.addEventListener('mousedown', (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const startX = e.clientX;
    const startWidth = img.offsetWidth || img.naturalWidth;
    const maxWidth = editorEl.clientWidth;

    document.body.style.userSelect = 'none';

    const onMove = (me: MouseEvent) => {
      const newWidth = Math.max(80, Math.min(maxWidth, startWidth + (me.clientX - startX)));
      img.style.width = `${newWidth}px`;
      img.style.height = 'auto';
    };

    const onUp = () => {
      document.body.style.userSelect = '';
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
    };

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  });
}

// 에디터 내 모든 리사이즈 핸들 제거
export function clearResizeHandles(editorEl: HTMLDivElement | null): void {
  editorEl?.querySelectorAll('.resize-handle').forEach((el) => el.remove());
}
