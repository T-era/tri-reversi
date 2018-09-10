(function() {
    let entryDialog = null;
    let view = null;
    window.onload = init;

    function init() {
		view = new CompeteView(startGame);


		let closeBtn = document.getElementById('btn_x');
		closeBtn.onclick = view.onCloseButtonClicked.bind(view);
		let entryBtn = document.getElementById('btn');
		entryBtn.onclick = view.onEntryButtonClicked.bind(view);
	}
	function startGame(nameA, nameB, nameC) {
		console.log(arguments);

		api.show();
	}
})();
