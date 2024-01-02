const dropDownButton = document.getElementById('dropdown-btn');
const dropDownItem = document.querySelectorAll('.dropdown-item');
const roomInput = document.getElementById('read-room');

dropDownItem.forEach((item) => {
	item.addEventListener('click', (e) => {
		console.log(roomInput);
		dropDownButton.textContent = e.target.textContent;
		roomInput.value = e.target.textContent;
		roomInput.classList.remove('focus-ring-danger');
		roomInput.style.borderColor = null;
	});
});

document.addEventListener('DOMContentLoaded', () => {
	const name = new URLSearchParams(window.location.search).get('name');
	const room = new URLSearchParams(window.location.search).get('room');
	document.getElementById('name').value = name;
	if (room === 'null') {
		roomInput.classList.add('focus-ring', 'focus-ring-danger');
		roomInput.style.borderColor = 'red';
		roomInput.focus();
	}
});
