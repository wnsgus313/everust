import * as vscode from 'vscode';
import { commands, ExtensionContext, window, workspace, Range, Position} from 'vscode';

export function activate(context: vscode.ExtensionContext) {
	let decorationType:vscode.TextEditorDecorationType = getDecorationTypeFromConfig();
	let activeEditor = window.activeTextEditor;
	let lastActivePosition:any;
	let errorLines: number[] = [6, 7, 2];

	




	updateDecorations(decorationType);
	function updateDecorations(decorationType: vscode.TextEditorDecorationType) {
		try {
			const decorationErrorLines: vscode.DecorationOptions[] = [];

			if(errorLines.length === 0){
				activeEditor?.setDecorations(decorationType, []);
			}
			else {
				for(let i=0; i<errorLines.length; i++){
					const newDecoration = { range: new Range(new Position(errorLines[i]-1, errorLines[i]-1), new Position(errorLines[i]-1, errorLines[i]-1)) };
					decorationErrorLines.push(newDecoration);
				}
				activeEditor?.setDecorations(decorationType, decorationErrorLines);
				errorLines = [];
			}
		}
		catch {

		}
	}

	vscode.window.onDidChangeActiveTextEditor(editor => {
		activeEditor = editor;
		if (editor) {
			updateDecorations(decorationType);
		}
	});
	vscode.workspace.onDidChangeTextDocument(event => {
		if (activeEditor && event.document === activeEditor.document) {
			updateDecorations(decorationType);
		}
	});

	workspace.onDidChangeConfiguration(() => {
        decorationType.dispose();
        decorationType = getDecorationTypeFromConfig();
        updateDecorations(decorationType);
    });

	function getDecorationTypeFromConfig() {
		const config = workspace.getConfiguration("highlightLine");
		const borderColor = config.get("borderColor");
		const borderWidth = config.get("borderWidth");
		const borderStyle = config.get("borderStyle");
		const decorationType = window.createTextEditorDecorationType({
			isWholeLine: true,
			borderWidth: `0 0 ${borderWidth} 0`,
			borderStyle: `${borderStyle}`,
			borderColor: `${borderColor}`
		});
		return decorationType;
	}
}

export function deactivate() {
	
}