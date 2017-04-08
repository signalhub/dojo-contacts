/**
 * Created by Anton on 08.04.17.
 */

require([
		"dijit/layout/BorderContainer",
		"dijit/layout/ContentPane",
		"dojox/grid/DataGrid",
		"dojo/store/Memory",
		"dojo/data/ObjectStore",
		"dojo/request",
		"dijit/form/Button",
		"js/components/contact"],
	function (BorderContainer,
			  ContentPane,
			  DataGrid,
			  Memory,
			  ObjectStore,
			  request,
			  Button,
			  Contact) {

		document.getElementsByClassName("loader")[0].classList.add("hide");

		const bc = new BorderContainer({
			class: 'main-container',
			style: "height: 100%; width: 99%;"
		});
		const cpUp = new ContentPane({
			class: 'main-title',
			style: "width: 80%",
			content: "My Contacts",
			region: "top"
		});

		const cpCenter = new ContentPane({
			region: "center"
		});

		const cpAside = new ContentPane({
			style: "width: 19%",
			content: "notes",
			region: "right",
			splitter: "true"
		});

		const addButton = new Button({
			label: "add",
			class: 'i-add',
			onClick: () => Contact.edit(null, grid, dataStore.objectStore.data)
		});

		cpUp.addChild(addButton);


		bc.addChild(cpUp);
		bc.addChild(cpCenter);
		// bc.addChild(cpAside);

		let dataStore = null;

		const grid = new DataGrid({
			query: {id: "*"},
			structure: Contact.getLayout()
		}, "grid");


		request.get("src/moc-data/contacts.json", {
			handleAs: "json"
		}).then(function (data) {
			dataStore = new ObjectStore({objectStore: new Memory({data: data})});
			grid.store = dataStore;
			grid.on('click', (event) => {
				const target = event && event.cell && event.cell.field;
				if (!target) return;
				const role = event.cellNode && event.cellNode.getAttribute('role').indexOf('gridcell');
				if (role !== -1) {
					if (target === "remove") Contact.remove(grid.selection.getSelected(), grid, dataStore.objectStore.data);
					if (target === "edit") Contact.edit(grid.selection.getSelected(), grid, dataStore.objectStore.data);
				}
			});
			cpCenter.addChild(grid);
			grid.startup();
		});

		/* add to app */
		bc.placeAt(document.getElementById('app'));
		bc.startup();
});
