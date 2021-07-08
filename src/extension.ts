import * as vscode from 'vscode';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "extension" is now active!');

	//Define the command for bash.extractVariable
	let bashExtractVariableCommand = vscode.commands.registerCommand('bash.extractVariable', () => {

		// Get complete text document
		let editor = vscode.window.activeTextEditor;
		if (editor !== undefined) {
			// Get the text document's selection
			let selection = editor.selection;
			if (!selection.isEmpty) {

				// Get the text document's current line
				let line = editor.document.lineAt(selection.start.line);
				// Get text from the selection
				let text = editor.document.getText(selection);

				if(line.lineNumber > 0) {
					// Find previous line which does not end with a backslash
					line = editor.document.lineAt(line.lineNumber - 1);
					while (line.text.endsWith('\\')) {
						line = editor.document.lineAt(line.lineNumber - 1);
					}
					line  = editor.document.lineAt(line.lineNumber + 1);
				} 

				// Convert line number into postiion
				let position = new vscode.Position(line.lineNumber, 0);

				editor.edit(editBuilder => {
					// Generate a random variable name from the text
					let variableName = 'var_' + text.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
					
					//Add a line before the selection
					editBuilder.insert(position, `export ${variableName}='${text}'\n`);

					// Update the selection with $ infront of the word
					editBuilder.replace(selection, `$${variableName}`);
				});
			}
		}
	});
}

// this method is called when your extension is deactivated
export function deactivate() { }
