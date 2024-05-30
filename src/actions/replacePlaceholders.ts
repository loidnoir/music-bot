export default function(template: string, ...variables: (string | undefined)[]): string {
	if (!variables.length) return template

	let index = 0

	return template.replace(/{}/g, () => {
		return index < variables.length ? variables[index++] ?? '' : '{}'
	})
}