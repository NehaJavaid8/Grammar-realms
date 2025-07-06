
function playSound(type) {
  const correctUrl = 'https://actions.google.com/sounds/v1/cartoon/clang_and_wobble.ogg';
  const wrongUrl = 'https://actions.google.com/sounds/v1/cartoon/wood_plank_flicks.ogg';
  const audio = new Audio(type === 'correct' ? correctUrl : wrongUrl);
  audio.play();
}

function showModal(nextLink) {
  const modal = document.getElementById('nextModal');
  modal.style.display = 'flex';
  document.getElementById('nextBtn').onclick = () => window.location.href = nextLink;
}
