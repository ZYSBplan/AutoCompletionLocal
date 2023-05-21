import * as path from 'path';
import * as Mocha from 'mocha';
import * as glob from 'glob';

export function run(): Promise<void> {
	// Create the mocha test
	const mocha = new Mocha({
		ui: 'tdd',
		color: true
	});

	const testsRoot = path.resolve(__dirname, '..');

	return new Promise((c, e) => {
		const testFiles = new glob.Glob("**/**.test.js", { cwd: testsRoot });
		const testFileStream = testFiles.stream();

		testFileStream.on("data", (file) => {
