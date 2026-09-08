import nprogress from 'nprogress';

nprogress.configure({
  showSpinner: true,
  speed: 300,
});

export function useNprogress() {
  function startProgress() {
    nprogress.start();
  }

  function stopProgress() {
    nprogress.done();
  }
  return {
    startProgress,
    stopProgress,
  };
}
