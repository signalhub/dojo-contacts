/**
 * Created by Anton on 08.04.17.
 */

define("js/components/contact", [
	"exports",
	"dijit/Dialog",
	"dijit/form/Button",
	"dojo/parser",
	"dijit/registry",
	"dijit/form/TextBox"], function (exports, Dialog, Button, parser, registry) {
	exports.getLayout = () =>
	[
		{name: "Name", field: "firstName", width: "30%"},
		{name: "email address", field: "email", width: "30%"},
		{name: "number", field: "phone", width: "20%"},
		{
			name: "",
			field: "edit",
			width: "10%",
			formatter: () => '<span class="i-show"></span>'
},
	{
		name: "",
			field: "remove",
		width: "10%",
		formatter: () => '<span class="i-remove"></span>'
	}
	];

	exports.edit = (item, grid, items) => {
		let defaultItem = {
			id: items.length + 1,
			firstName: "Имя",
			email: "email@mail.com",
			phone: "- -",
			edit: "редактировать",
			remove: "удалить"
		};

		const action = item ? "edit" : "add";
		const title = item ? "Contact info" : "Add new contact";
		const label = item ? "ok" : "add";
		let updateItem = item ? item[0] : defaultItem;

		const template =
			'<div class="info-pane">' +
			'<div><span>Name: </span>' +
			'<input data-dojo-type="dijit.form.TextBox" id="name" value="' + updateItem.firstName + '"></div>' +
			'<div><span>address: </span>' +
			'<input data-dojo-type="dijit.form.TextBox" id="email" value="' + updateItem.email + '"></div>' +
			'<div><span>phone: </span>' +
			'<input data-dojo-type="dijit.form.TextBox" id="phone" value="' + updateItem.phone + '"></div>' +
			'</div>';

		const dialog = new Dialog({
			title: title
		});

		dialog.containerNode.innerHTML = template;

		parser.parse();
		const name = registry.byId("name");
		const email = registry.byId("email");
		const phone = registry.byId("phone");

		const buttonOk = new Button({
			label: label,
			onClick: () => {
			updateItem = {
			id: updateItem.id,
			firstName: name.value,
			email: email.value,
			phone: phone.value,
			edit: "редактировать",
			remove: "удалить"
		};

		if (action !== "edit") items.unshift(updateItem);
		else items.splice(items.findIndex((targetItem) => targetItem.id === updateItem.id), 1, updateItem);
		grid._refresh();
		dialog.destroy();
		removeRegistry();
	}
	}, 'buttonOk');

		dialog.onHide = () => {
			removeRegistry();
		};

		dialog.addChild(buttonOk);
		dialog.show();

		const removeRegistry = () => {
			registry.remove('name');
			registry.remove('email');
			registry.remove('phone');
		}
	};

	exports.remove = (item, grid, items) => {
		const template =
			'<div class="info-pane">' +
			'<div>Вы действительно хотите удалить контакт</div><div>' + item[0].firstName + ' ?</div><br>' +
			'</div>';

		const dialog = new Dialog({
			title: "Warning!"
		});

		dialog.containerNode.innerHTML = template;

		const buttonOk = new Button({
				label: "ok",
				onClick: () => {
				items.splice(items.findIndex((targetItem) => targetItem.id === item[0].id), 1);
		grid._refresh();
		dialog.destroy();
	}
	}, 'buttonOk');

		const buttonCancel = new Button({
				label: "cancel",
				onClick: () => dialog.destroy()
	}, 'buttonCancel');

		dialog.addChild(buttonOk);
		dialog.addChild(buttonCancel);
		dialog.show();
	};
});
