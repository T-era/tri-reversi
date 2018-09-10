(function() {
	let entryDialog = null;
	let view = null;
	let whoView = null;
	let nameAView = null;
	let nameBView = null;
	let nameCView = null;
	window.onload = init;

	function init() {
		view = new CompeteView(startGame);
		whoView = document.getElementById('whoiam');
		nameAView = document.getElementById('name_a');
		nameBView = document.getElementById('name_b');
		nameCView = document.getElementById('name_c');

		let closeBtn = document.getElementById('btn_x');
		closeBtn.onclick = view.onCloseButtonClicked.bind(view);
		let entryBtn = document.getElementById('btn');
		entryBtn.onclick = view.onEntryButtonClicked.bind(view);

	}
	function startGame(assigned, nameA, nameB, nameC) {
		whoView.setAttribute('class', assigned.toLowerCase());
		nameAView.textContent = nameA;
		nameBView.textContent = nameB;
		nameCView.textContent = nameC;
		api.show();
	}
})();
